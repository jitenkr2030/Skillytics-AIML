// ============================================
// Skillytics Subscription API Routes
// Handles subscription management, checkout, and billing
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { 
  createCheckoutSession, 
  createBillingPortalSession, 
  cancelSubscription,
  resumeSubscription,
  getSubscriptionPlans 
} from '@/lib/stripe';
import { SubscriptionTier } from '@prisma/client';

// GET /api/subscriptions - Get current subscription and plans
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        subscriptionTier: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
        totalPoints: true,
        credits: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get available plans
    const plans = await getSubscriptionPlans();

    // Get billing history
    const billingHistory = await db.paymentTransaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    return NextResponse.json({
      currentSubscription: {
        tier: user.subscriptionTier,
        stripeSubscriptionId: user.stripeSubscriptionId,
        startDate: user.subscriptionStartDate,
        endDate: user.subscriptionEndDate,
        isActive: user.subscriptionTier !== SubscriptionTier.FREE,
        daysRemaining: user.subscriptionEndDate 
          ? Math.ceil((new Date(user.subscriptionEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          : null
      },
      plans,
      billingHistory,
      credits: user.credits,
      totalPoints: user.totalPoints
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}

// POST /api/subscriptions - Create checkout session or manage subscription
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, planId, isAnnual } = body;

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { 
        email: true, 
        name: true,
        stripeCustomerId: true,
        subscriptionTier: true 
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    switch (action) {
      case 'create_checkout': {
        // Validate plan
        const plan = await db.subscriptionPlan.findUnique({ where: { id: planId } });
        if (!plan || !plan.isActive) {
          return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        // Check if already subscribed to this tier
        const targetTier = plan.tier;
        if (user.subscriptionTier === targetTier && targetTier !== SubscriptionTier.FREE) {
          return NextResponse.json({ 
            error: 'Already subscribed to this plan',
            message: 'You are already subscribed to this plan. Visit your billing portal to manage your subscription.'
          }, { status: 400 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const checkoutSession = await createCheckoutSession({
          userId: session.user.id,
          email: user.email,
          name: user.name || undefined,
          planId,
          isAnnual: isAnnual || false,
          successUrl: `${baseUrl}/dashboard/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${baseUrl}/pricing`
        });

        return NextResponse.json({ 
          sessionId: checkoutSession.id,
          url: checkoutSession.url 
        });
      }

      case 'cancel': {
        if (!user.stripeSubscriptionId) {
          return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
        }

        await cancelSubscription(user.stripeSubscriptionId, false);
        
        return NextResponse.json({ 
          message: 'Subscription will be cancelled at end of billing period',
          effectiveDate: 'end_of_period'
        });
      }

      case 'resume': {
        if (!user.stripeSubscriptionId) {
          return NextResponse.json({ error: 'No subscription to resume' }, { status: 400 });
        }

        await resumeSubscription(user.stripeSubscriptionId);
        
        return NextResponse.json({ 
          message: 'Subscription resumed successfully'
        });
      }

      case 'billing_portal': {
        if (!user.stripeCustomerId) {
          return NextResponse.json({ error: 'No billing account found' }, { status: 400 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const portalSession = await createBillingPortalSession(
          user.stripeCustomerId,
          `${baseUrl}/dashboard/subscription`
        );

        return NextResponse.json({ url: portalSession.url });
      }

      case 'add_credits': {
        const { amount } = body;
        if (!amount || amount < 1 || amount > 1000) {
          return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const checkoutSession = await createCheckoutSession({
          userId: session.user.id,
          email: user.email,
          name: user.name || undefined,
          planId: 'credits',
          successUrl: `${baseUrl}/dashboard/credits/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${baseUrl}/dashboard/credits`
        });

        // Store credit amount in metadata
        await db.paymentTransaction.create({
          data: {
            userId: session.user.id,
            amount,
            currency: 'USD',
            type: 'ONE_TIME',
            status: 'PENDING',
            description: `Add ${amount} credits`,
            metadata: JSON.stringify({ credits: amount })
          }
        });

        return NextResponse.json({ 
          sessionId: checkoutSession.id,
          url: checkoutSession.url,
          creditsAmount: amount
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Subscription API error:', error);
    return NextResponse.json({ error: 'Subscription operation failed' }, { status: 500 });
  }
}
