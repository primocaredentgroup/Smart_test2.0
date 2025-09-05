import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login/signup (auth pages)
     * - auth (auth callback)
     * - homepage (allow public access)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|signup|auth|sitemap.xml|robots.txt|$).*)',
  ],
};