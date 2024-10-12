import { clerkMiddleware } from "@clerk/nextjs/server";

// IMPORTANT: For simplicity, I made everything private.
// If you do want to start with a public homepage, you can use the following code instead.

// const isPublicRoute = createRouteMatcher(["/"]);

export default clerkMiddleware((auth) => {
  if (!auth().userId) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
