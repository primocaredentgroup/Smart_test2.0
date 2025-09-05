import { NextRequest, NextResponse } from 'next/server';

// Implementazione semplificata Auth0 routes
export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/');
  const action = segments[segments.length - 1];

  switch (action) {
    case 'login':
      // Redirect a Auth0 login
      const loginUrl = `https://${process.env.AUTH0_ISSUER_BASE_URL}/authorize?` +
        `client_id=${process.env.AUTH0_CLIENT_ID}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent((process.env.AUTH0_BASE_URL || '') + '/api/auth/callback')}&` +
        `scope=openid%20profile%20email`;
      
      return NextResponse.redirect(loginUrl);

    case 'logout':
      // Redirect a Auth0 logout
      const logoutUrl = `https://${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout?` +
        `client_id=${process.env.AUTH0_CLIENT_ID}&` +
        `returnTo=${encodeURIComponent(process.env.AUTH0_BASE_URL || '')}`;
      
      return NextResponse.redirect(logoutUrl);

    case 'callback':
      // Gestisce il callback da Auth0
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);

    default:
      return new NextResponse('Not Found', { status: 404 });
  }
}