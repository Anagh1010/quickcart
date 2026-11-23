import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk middleware attaches auth context to all requests (API routes enforce
// getAuth() + role checks server-side). Page routes render the in-app
// AuthGate sign-in modal instead of redirecting to Clerk's external domain.
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
