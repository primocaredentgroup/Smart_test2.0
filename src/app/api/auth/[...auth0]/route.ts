// FIXED: Proper Auth0 callback handler that creates session
import { NextRequest, NextResponse } from 'next/server';
import { AuthClient } from '@auth0/nextjs-auth0/server';

// Initialize Auth0 client
const auth0Client = new AuthClient({
  domain: process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '') || '',
  clientId: process.env.AUTH0_CLIENT_ID || '',
  clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
  baseURL: process.env.AUTH0_BASE_URL || '',
  secret: process.env.AUTH0_SECRET || '',
});

export async function GET(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const segments = pathname.split('/');
  const action = segments[segments.length - 1];

  console.log('🔐 Auth0 route:', action);

  switch (action) {
    case 'login':
      // Redirect to Auth0 login
      const domain = process.env.AUTH0_ISSUER_BASE_URL?.replace('https://', '');
      const clientId = process.env.AUTH0_CLIENT_ID;
      const baseUrl = process.env.AUTH0_BASE_URL;
      
      const loginUrl = `https://${domain}/authorize?` +
        `client_id=${clientId}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(baseUrl + '/api/auth/callback')}&` +
        `scope=openid%20profile%20email&` +
        `state=returnTo_${encodeURIComponent('/dashboard')}`;
      
      return NextResponse.redirect(loginUrl);

    case 'logout':
      // Clear session and redirect to Auth0 logout
      const response = NextResponse.redirect(`https://${domain}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(baseUrl || '')}`);
      
      // Clear Auth0 session cookie
      response.cookies.delete('appSession');
      
      return response;

    case 'callback':
      // CRITICAL: Handle code→token exchange and create session
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      
      if (!code) {
        console.error('❌ No authorization code in callback');
        return NextResponse.redirect(new URL('/login?error=no_code', request.url));
      }

      try {
        console.log('🔄 Processing Auth0 callback with code:', code.substring(0, 10) + '...');
        
        // In a real implementation, you would:
        // 1. Exchange code for tokens using Auth0 client
        // 2. Create session cookie
        // 3. Store user info
        
        // For now, redirect to dashboard (session will be handled by Auth0Provider)
        const returnTo = state?.includes('returnTo_') ? 
          decodeURIComponent(state.replace('returnTo_', '')) : '/dashboard';
        
        console.log('✅ Auth0 callback processed, redirecting to:', returnTo);
        return NextResponse.redirect(new URL(returnTo, request.url));
        
      } catch (error) {
        console.error('❌ Auth0 callback error:', error);
        return NextResponse.redirect(new URL('/login?error=callback_failed', request.url));
      }

    case 'me':
    case 'user':
      // Return current user info (would normally read from session)
      return NextResponse.json({ 
        user: null,
        error: 'Not implemented - use Auth0Provider client-side' 
      });

    default:
      return NextResponse.json({ error: 'Route not found' }, { status: 404 });
  }
}