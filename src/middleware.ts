import { NextRequest, NextResponse } from 'next/server';

// Protected routes che richiedono autenticazione (per implementazione futura)
// const protectedRoutes = ['/dashboard', '/admin', '/tests'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Permetti accesso alle API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Per ora, permetti accesso a tutte le route
  // In futuro qui verificheremo i token Auth0
  if (process.env.NODE_ENV === 'development') {
    console.log(`🛡️ Middleware: Allowing access to ${pathname}`);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match protected routes:
     * - /dashboard e sottopagine
     * - /admin e sottopagine  
     * - /tests e sottopagine
     * 
     * Esclude:
     * - API routes (/api/*)
     * - Static files (_next/static/*)
     * - Image optimization (_next/image/*)
     * - Favicon e file pubblici
     * - Auth pages (login, signup, auth callback)
     * - Homepage pubblica
     */
    '/dashboard/:path*',
    '/admin/:path*', 
    '/tests/:path*'
  ],
};