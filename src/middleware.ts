// ============================================
// Skillytics Content Gating Middleware
// Controls access to content based on subscription tier
// ============================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { SubscriptionTier } from '@prisma/client';

// Premium routes that require Pro or Enterprise subscription
const premiumRoutes = [
  '/mission/[4-9]|/mission/1[0-6]', // Missions 4-16
  '/module/[4-9]|/module/1[0-6]',   // Modules 4-16
  '/analytics',
  '/certifications',
  '/certifications/download',
  '/marketplace'
];

// Enterprise-only routes
const enterpriseRoutes = [
  '/enterprise',
  '/team',
  '/admin/analytics'
];

// Mission IDs that require premium (starting from mission 41)
const PREMIUM_MISSION_START = 41;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for non-gated routes
  if (
    pathname.startsWith('/api/webhook') ||
    pathname.startsWith('/verify') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') // Skip files
  ) {
    return NextResponse.next();
  }

  // Get current session
  const session = await getServerSession(authOptions);

  // If no session, allow access to public routes, redirect to login for protected
  if (!session?.user?.id) {
    // Allow access to landing page, pricing, and auth routes
    if (
      pathname === '/' ||
      pathname === '/pricing' ||
      pathname.startsWith('/auth')
    ) {
      return NextResponse.next();
    }

    // For protected routes, redirect to login
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Get user subscription status
  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        subscriptionTier: true,
        credits: true
      }
    });

    if (!user) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    const userTier = user.subscriptionTier;

    // Check if route is enterprise-only
    if (isEnterpriseRoute(pathname)) {
      if (userTier !== SubscriptionTier.ENTERPRISE) {
        // Redirect to upgrade page
        return NextResponse.redirect(new URL('/pricing?upgrade=enterprise', request.url));
      }
      return NextResponse.next();
    }

    // Check if route is premium (Pro or Enterprise)
    if (isPremiumRoute(pathname)) {
      if (
        userTier === SubscriptionTier.FREE ||
        !user.subscriptionTier
      ) {
        // Redirect to pricing page with upgrade prompt
        return NextResponse.redirect(new URL('/pricing?upgrade=pro', request.url));
      }
      return NextResponse.next();
    }

    // Check mission access by ID
    const missionMatch = pathname.match(/\/mission\/(\d+)/);
    if (missionMatch) {
      const missionId = parseInt(missionMatch[1]);
      if (missionId >= PREMIUM_MISSION_START) {
        if (
          userTier === SubscriptionTier.FREE ||
          !user.subscriptionTier
        ) {
          return NextResponse.redirect(new URL('/pricing?upgrade=pro', request.url));
        }
      }
    }

    // Check module access
    const moduleMatch = pathname.match(/\/module\/(\d+)/);
    if (moduleMatch) {
      const moduleId = parseInt(moduleMatch[1]);
      if (moduleId >= 4) {
        if (
          userTier === SubscriptionTier.FREE ||
          !user.subscriptionTier
        ) {
          return NextResponse.redirect(new URL('/pricing?upgrade=pro', request.url));
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, allow access (fail open) to prevent blocking users
    return NextResponse.next();
  }
}

// Helper function to check if route is premium
function isPremiumRoute(pathname: string): boolean {
  const premiumPatterns = [
    /^\/analytics$/,
    /^\/certifications?$/,
    /^\/certifications\//,
    /^\/marketplace$/,
    /^\/mission-map\/?$/,
    /^\/dashboard\/?$/,
  ];

  return premiumPatterns.some(pattern => pattern.test(pathname));
}

// Helper function to check if route is enterprise-only
function isEnterpriseRoute(pathname: string): boolean {
  const enterprisePatterns = [
    /^\/enterprise/,
    /^\/team/,
    /^\/admin\/analytics/,
  ];

  return enterprisePatterns.some(pattern => pattern.test(pathname));
}

// Configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't need auth
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth|api/webhook).*)',
  ],
};
