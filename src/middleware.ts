// ============================================
// Skillytics Content Gating Middleware (Edge-Compatible)
// Controls access to content based on subscription tier
// ============================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

// Premium mission start ID
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

  // Check for auth token in cookies
  const authToken = request.cookies.get('next-auth.session-token')?.value ||
                    request.cookies.get('__Secure-next-auth.session-token')?.value ||
                    request.cookies.get('next-auth.callback-url')?.value;

  // If no session token, allow access to public routes, redirect to login for protected
  if (!authToken) {
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

  // For routes that need subscription checks, we'll do a lightweight check
  // by examining the path patterns. Full subscription tier checks are done
  // in server components for proper database access.

  // Check if route is enterprise-only
  if (isEnterpriseRoute(pathname)) {
    // Redirect to pricing with enterprise upgrade prompt
    // Note: Actual tier verification happens in server components
    return NextResponse.redirect(new URL('/pricing?upgrade=enterprise', request.url));
  }

  // Check if route is premium (Pro or Enterprise)
  if (isPremiumRoute(pathname)) {
    // Redirect to pricing with pro upgrade prompt
    // Note: Actual tier verification happens in server components
    return NextResponse.redirect(new URL('/pricing?upgrade=pro', request.url));
  }

  // Check mission access by ID
  const missionMatch = pathname.match(/\/mission\/(\d+)/);
  if (missionMatch) {
    const missionId = parseInt(missionMatch[1]);
    if (missionId >= PREMIUM_MISSION_START) {
      return NextResponse.redirect(new URL('/pricing?upgrade=pro', request.url));
    }
  }

  // Check module access
  const moduleMatch = pathname.match(/\/module\/(\d+)/);
  if (moduleMatch) {
    const moduleId = parseInt(moduleMatch[1]);
    if (moduleId >= 4) {
      return NextResponse.redirect(new URL('/pricing?upgrade=pro', request.url));
    }
  }

  return NextResponse.next();
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
