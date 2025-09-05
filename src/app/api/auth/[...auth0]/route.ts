import { NextRequest, NextResponse } from 'next/server';

// Fallback route handler for older Auth0 SDK version
// Based on Auth0 documentation but adapted for available API

export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/');
  const action = segments[segments.length - 1];

  console.log('🔐 Auth0 route:', action);

  switch (action) {
    case 'login':
      // Direct Auth0 authorization URL
      const domain = process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');
      const clientId = process.env.AUTH0_CLIENT_ID;
      const baseUrl = process.env.AUTH0_BASE_URL;
      
      const loginUrl = `https://${domain}/authorize?` +
        `client_id=${clientId}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(baseUrl + '/api/auth/callback')}&` +
        `scope=openid%20profile%20email`;
      
      return NextResponse.redirect(loginUrl);

    case 'logout':
      // Direct Auth0 logout URL
      const logoutUrl = `https://${domain}/v2/logout?` +
        `client_id=${clientId}&` +
        `returnTo=${encodeURIComponent(baseUrl || '')}`;
      
      return NextResponse.redirect(logoutUrl);

    case 'callback':
      // Simple callback redirect
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      console.log('✅ Auth0 callback - redirecting to dashboard');
      return NextResponse.redirect(url);

    default:
      return NextResponse.json({ error: 'Route not found' }, { status: 404 });
  }
}