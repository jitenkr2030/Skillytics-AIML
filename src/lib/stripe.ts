// ============================================
// Skillytics Stripe Integration Service
// Handles all payment processing, subscriptions, and webhooks
// ============================================

import Stripe from 'stripe';
import { SubscriptionTier } from '@prisma/client';
import { db } from '@/lib/db';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

// Configuration
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const PLATFORM_FEE_PERCENTAGE = 0.4; // 40% platform fee, 60% to creators

// ============================================
// STRIPE CUSTOMER MANAGEMENT
// ============================================

export async function getOrCreateStripeCustomer(userId: string, email: string, name?: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true }
  });

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: { userId }
  });

  // Update user with Stripe customer ID
  await db.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id }
  });

  return customer.id;
}

export async function getStripeCustomerEmail(customerId: string) {
  const customer = await stripe.customers.retrieve(customerId);
  if (customer.deleted) return null;
  return (customer as Stripe.Customer).email;
}

// ============================================
// CHECKOUT SESSIONS
// ============================================

export interface CreateCheckoutParams {
  userId: string;
  email: string;
  name?: string;
  planId: string;
  isAnnual?: boolean;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(params: CreateCheckoutParams) {
  const { userId, email, name, planId, isAnnual = false, successUrl, cancelUrl } = params;

  // Get customer ID
  const customerId = await getOrCreateStripeCustomer(userId, email, name);

  // Determine price ID based on plan and billing period
  const priceId = isAnnual 
    ? `${planId}-annual` 
    : `${planId}-monthly`;

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      planId,
      isAnnual: String(isAnnual)
    },
    subscription_data: {
      metadata: {
        userId,
        planId
      }
    },
    // Collect billing address for enterprise
    billing_address_collection: planId.includes('enterprise') ? 'required' : 'auto',
    allow_promotion_codes: true
  });

  // Log the event
  await logMonetizationEvent(userId, 'checkout_session_created', { sessionId: session.id, planId, isAnnual });

  return session;
}

export async function createOneTimePaymentSession(
  userId: string,
  email: string,
  name: string | undefined,
  amount: number,
  description: string,
  metadata: Record<string, string>,
  successUrl: string,
  cancelUrl: string
) {
  const customerId = await getOrCreateStripeCustomer(userId, email, name);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: description,
            metadata
          },
          unit_amount: Math.round(amount * 100) // Convert to cents
        },
        quantity: 1
      }
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      type: 'one_time',
      ...metadata
    }
  });

  return session;
}

// ============================================
// SUBSCRIPTION MANAGEMENT
// ============================================

export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

export async function cancelSubscription(subscriptionId: string, immediate = false) {
  if (immediate) {
    return await stripe.subscriptions.cancel(subscriptionId);
  }
  
  // Cancel at period end
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true
  });
}

export async function resumeSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false
  });
}

export async function changeSubscription(subscriptionId: string, newPriceId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId
      }
    ],
    proration_behavior: 'create_prorations'
  });
}

export async function getSubscriptionPlans() {
  return await db.subscriptionPlan.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  });
}

// ============================================
// BILLING PORTAL
// ============================================

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl
  });
}

// ============================================
// PAYMENT INTENTS (For Marketplace)
// ============================================

export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata: Record<string, string> = {}
) {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata,
    automatic_payment_methods: { enabled: true }
  });
}

// ============================================
// CREATOR PAYOUTS
// ============================================

export async function createCreatorTransfer(
  amount: number,
  destinationAccountId: string,
  metadata: Record<string, string> = {}
) {
  return await stripe.transfers.create({
    amount: Math.round(amount * 100),
    currency: 'usd',
    destination: destinationAccountId,
    metadata
  });
}

export async function createConnectedAccount(
  email: string,
  country: string = 'US'
) {
  return await stripe.accounts.create({
    type: 'express',
    country,
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true }
    }
  });
}

export async function createAccountLink(
  accountId: string,
  refreshUrl: string,
  returnUrl: string
) {
  return await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding'
  });
}

export async function getAccountBalance(accountId: string) {
  return await stripe.balance.retrieve({
    stripeAccount: accountId
  });
}

// ============================================
// WEBHOOK HANDLING
// ============================================

export async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;

    case 'invoice.paid':
      await handleInvoicePaid(event.data.object as Stripe.Invoice);
      break;

    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
      break;

    case 'payment_intent.succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;

    default:
      console.log(`Unhandled webhook event type: ${event.type}`);
  }
}

// ============================================
// WEBHOOK HANDLERS
// ============================================

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const planId = session.metadata?.planId;
  
  if (!userId || !planId) {
    console.error('Missing metadata in checkout session');
    return;
  }

  // Get subscription if this was a subscription purchase
  if (session.mode === 'subscription' && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const tier = planId.includes('enterprise') 
      ? SubscriptionTier.ENTERPRISE 
      : SubscriptionTier.PRO;

    await db.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: tier,
        stripeSubscriptionId: subscription.id,
        subscriptionStartDate: new Date(subscription.current_period_start * 1000),
        subscriptionEndDate: new Date(subscription.current_period_end * 1000)
      }
    });

    await logMonetizationEvent(userId, 'subscription_started', {
      subscriptionId: subscription.id,
      tier,
      amount: (subscription.items.data[0].price.unit_amount || 0) / 100
    });
  }

  // Handle one-time payments
  if (session.mode === 'payment') {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent as string
    );

    await db.paymentTransaction.create({
      data: {
        userId,
        amount: (paymentIntent.amount / 100),
        currency: paymentIntent.currency,
        type: 'ONE_TIME',
        status: 'SUCCEEDED',
        stripePaymentIntentId: paymentIntent.id,
        description: session.metadata?.description,
        processedAt: new Date()
      }
    });

    // Handle marketplace purchases
    if (session.metadata?.marketplaceItemId) {
      await handleMarketplacePurchase(
        userId,
        session.metadata.marketplaceItemId,
        paymentIntent.id,
        paymentIntent.amount / 100
      );
    }

    await logMonetizationEvent(userId, 'payment_completed', {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100
    });
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string
  );

  const user = await db.user.findFirst({
    where: { stripeSubscriptionId: subscription.id }
  });

  if (!user) {
    console.error('User not found for subscription:', subscription.id);
    return;
  }

  // Record transaction
  await db.paymentTransaction.create({
    data: {
      userId: user.id,
      amount: (invoice.amount_paid / 100),
      currency: invoice.currency,
      type: 'SUBSCRIPTION',
      status: 'SUCCEEDED',
      stripeInvoiceId: invoice.id,
      description: `Subscription renewal - ${invoice.id}`,
      processedAt: new Date()
    }
  });

  // Update subscription dates
  await db.user.update({
    where: { id: user.id },
    data: {
      subscriptionStartDate: new Date(subscription.current_period_start * 1000),
      subscriptionEndDate: new Date(subscription.current_period_end * 1000)
    }
  });

  await logMonetizationEvent(user.id, 'subscription_renewed', {
    subscriptionId: subscription.id,
    amount: invoice.amount_paid / 100
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string
  );

  const user = await db.user.findFirst({
    where: { stripeSubscriptionId: subscription.id }
  });

  if (user) {
    await logMonetizationEvent(user.id, 'payment_failed', {
      subscriptionId: subscription.id,
      invoiceId: invoice.id
    });
    
    // TODO: Send email notification about failed payment
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const user = await db.user.findFirst({
    where: { stripeSubscriptionId: subscription.id }
  });

  if (!user) return;

  const tier = subscription.status === 'active' 
    ? (subscription.items.data[0].price.id.includes('enterprise') 
        ? SubscriptionTier.ENTERPRISE 
        : SubscriptionTier.PRO)
    : SubscriptionTier.FREE;

  await db.user.update({
    where: { id: user.id },
    data: {
      subscriptionTier: tier,
      subscriptionStartDate: new Date(subscription.current_period_start * 1000),
      subscriptionEndDate: new Date(subscription.current_period_end * 1000)
    }
  });

  await logMonetizationEvent(user.id, 'subscription_updated', {
    subscriptionId: subscription.id,
    newTier: tier,
    status: subscription.status
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const user = await db.user.findFirst({
    where: { stripeSubscriptionId: subscription.id }
  });

  if (!user) return;

  // Downgrade to free at end of period
  await db.user.update({
    where: { id: user.id },
    data: {
      subscriptionTier: SubscriptionTier.FREE,
      stripeSubscriptionId: null
    }
  });

  await logMonetizationEvent(user.id, 'subscription_cancelled', {
    subscriptionId: subscription.id
  });
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const userId = paymentIntent.metadata?.userId;
  const type = paymentIntent.metadata?.type;

  if (type === 'marketplace_purchase') {
    const itemId = paymentIntent.metadata?.itemId;
    if (userId && itemId) {
      await handleMarketplacePurchase(userId, itemId, paymentIntent.id, paymentIntent.amount / 100);
    }
  }
}

// ============================================
// MARKETPLACE PURCHASES
// ============================================

async function handleMarketplacePurchase(
  userId: string,
  itemId: string,
  paymentIntentId: string,
  amount: number
) {
  // Create purchase record
  const purchase = await db.marketplacePurchase.create({
    data: {
      userId,
      itemId,
      amount,
      currency: 'USD',
      paymentMethod: 'stripe',
      stripePaymentId: paymentIntentId,
      accessExpires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    }
  });

  // Update item sales count
  await db.marketplaceItem.update({
    where: { id: itemId },
    data: { totalSales: { increment: 1 } }
  });

  // Calculate creator earnings and platform fee
  const item = await db.marketplaceItem.findUnique({
    where: { id: itemId },
    include: { creator: true }
  });

  if (item?.creator) {
    const creatorEarnings = amount * item.revenueShare;
    const platformFee = amount - creatorEarnings;

    // Update creator earnings
    await db.marketplaceCreator.update({
      where: { id: item.creator.id },
      data: {
        pendingPayout: { increment: creatorEarnings },
        totalEarnings: { increment: creatorEarnings }
      }
    });

    // Log revenue event
    await logMonetizationEvent(userId, 'marketplace_purchase', {
      itemId,
      amount,
      creatorEarnings,
      platformFee
    });
  }

  return purchase;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

async function logMonetizationEvent(
  userId: string | null,
  eventType: string,
  eventData: Record<string, unknown> = {},
  amount?: number
) {
  try {
    await db.monetizationEvent.create({
      data: {
        userId,
        eventType,
        eventData: JSON.stringify(eventData),
        amount
      }
    });
  } catch (error) {
    console.error('Failed to log monetization event:', error);
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function mapTierToStripePriceIds(tier: SubscriptionTier): {
  monthly: string;
  annual: string;
} {
  switch (tier) {
    case SubscriptionTier.PRO:
      return {
        monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_pro_monthly',
        annual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID || 'price_pro_annual'
      };
    case SubscriptionTier.ENTERPRISE:
      return {
        monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || 'price_enterprise_monthly',
        annual: process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID || 'price_enterprise_annual'
      };
    default:
      throw new Error('Free tier does not have Stripe price IDs');
  }
}

export async function getCustomerInvoices(customerId: string, limit = 10) {
  return await stripe.invoices.list({
    customer: customerId,
    limit
  });
}

export async function getUpcomingInvoice(customerId: string) {
  return await stripe.invoices.retrieveUpcoming({
    customer: customerId
  });
}

export { stripe };
