import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const action = pathname.split('/').pop();

  const baseUrl = process.env.AUTH0_BASE_URL || '';
  const domain = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  
  console.log('🔍 ENV DEBUG:', { baseUrl, domain, clientId });

  switch (action) {
    case 'login':
      const loginUrl = `${domain}/authorize?` +
        `response_type=code&` +
        `client_id=${clientId}&` +
        `redirect_uri=${encodeURIComponent(baseUrl + '/api/auth/callback')}&` +
        `scope=${encodeURIComponent('openid profile email')}`;
      return NextResponse.redirect(loginUrl);

    case 'logout':
      const logoutUrl = `${domain}/v2/logout?` +
        `client_id=${clientId}&` +
        `returnTo=${encodeURIComponent(baseUrl)}`;
      return NextResponse.redirect(logoutUrl);

    case 'callback':
      // Per ora un redirect semplice - implementeremo il token exchange dopo
      return NextResponse.redirect(baseUrl + '/dashboard');

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}