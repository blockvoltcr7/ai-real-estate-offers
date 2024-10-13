import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Middleware to protect routes using Clerk's authentication.
 * This middleware checks if the user is authenticated before allowing access to protected routes.
 * If the user is not authenticated, they will be redirected to the Clerk sign-in page.
 *
 * IMPORTANT: For simplicity, all routes are made private.
 * If you want to start with a public homepage, you can use the following code instead:
 *
 * const isPublicRoute = createRouteMatcher(["/"]);
 */

export default clerkMiddleware((auth) => {
  // Check if the user is authenticated
  if (!auth().userId) {
    // If not authenticated, protect the route
    auth().protect();
  }
});

// Configuration for the middleware matcher
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
