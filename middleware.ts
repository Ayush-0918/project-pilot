import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Protect all cockpit dashboard routes and post-login auth callback handlers
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/auth-callback'
]);

export const proxy = clerkMiddleware(async (auth, req) => {
  // In development, we allow the hardcoded mock login to bypass Clerk protection
  if (process.env.NODE_ENV !== 'development' && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && isProtectedRoute(req)) {
    await auth.protect();
  }
});

export default proxy;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.[^?]*$).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
