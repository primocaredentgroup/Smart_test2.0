import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const action = pathname.split('/').pop();

  const baseUrl = process.env.AUTH0_BASE_URL || '';
  const domain = process.env.AUTH0_ISSUER_BASE_URL;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  
  console.log('🔍 ENV DEBUG:', { baseUrl, domain, clientId: clientId?.substring(0, 8) + '...' });

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
      const { searchParams } = new URL(request.url);
      const code = searchParams.get('code');
      
      if (!code) {
        console.log('❌ No authorization code found');
        return NextResponse.redirect(baseUrl + '/login?error=no_code');
      }

      try {
        // Exchange code for tokens
        const tokenResponse = await fetch(`${domain}/oauth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: baseUrl + '/api/auth/callback'
          })
        });

        const tokens = await tokenResponse.json();
        
        if (!tokenResponse.ok) {
          console.log('❌ Token exchange failed:', tokens);
          return NextResponse.redirect(baseUrl + '/login?error=token_exchange');
        }

        console.log('✅ Token exchange successful');
        
        // Qui dovremmo impostare i cookie di sessione, per ora redirect
        const response = NextResponse.redirect(baseUrl + '/dashboard');
        
        // Set httpOnly cookies for tokens
        response.cookies.set('auth0_access_token', tokens.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: tokens.expires_in || 3600
        });
        
        if (tokens.id_token) {
          response.cookies.set('auth0_id_token', tokens.id_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: tokens.expires_in || 3600
          });
        }

        return response;
        
      } catch (error) {
        console.log('❌ Callback error:', error);
        return NextResponse.redirect(baseUrl + '/login?error=callback_failed');
      }

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}