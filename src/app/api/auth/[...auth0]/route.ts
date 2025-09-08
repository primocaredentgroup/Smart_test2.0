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
      
      const logoutResponse = NextResponse.redirect(logoutUrl);
      
      // Clear session cookie
      logoutResponse.cookies.set('auth0_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      });
      
      return logoutResponse;

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
        
        // Decode id_token to get user info
        let userInfo = null;
        if (tokens.id_token) {
          try {
            // Decode JWT payload (base64)
            const payload = tokens.id_token.split('.')[1];
            const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
            userInfo = decoded;
            console.log('✅ User info decoded:', { sub: decoded.sub, email: decoded.email });
          } catch (decodeError) {
            console.log('❌ Failed to decode id_token:', decodeError);
          }
        }
        
        const response = NextResponse.redirect(baseUrl + '/dashboard');
        
        // Create a session cookie that Auth0Provider can understand
        if (userInfo) {
          const sessionData = {
            user: {
              sub: userInfo.sub,
              email: userInfo.email,
              name: userInfo.name,
              nickname: userInfo.nickname,
              picture: userInfo.picture,
              updated_at: userInfo.updated_at
            },
            accessToken: tokens.access_token,
            idToken: tokens.id_token,
            expiresAt: Date.now() + (tokens.expires_in * 1000)
          };
          
          // Set a session cookie with JSON data
          response.cookies.set('auth0_session', JSON.stringify(sessionData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: tokens.expires_in || 3600,
            path: '/'
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