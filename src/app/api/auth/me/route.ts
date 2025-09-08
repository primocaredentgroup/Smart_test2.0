import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth0_session');
    
    if (!sessionCookie?.value) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const sessionData = JSON.parse(sessionCookie.value);
    
    // Check if session is expired
    if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
      console.log('🔍 Session expired, clearing cookie');
      const response = NextResponse.json({ user: null }, { status: 200 });
      response.cookies.set('auth0_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      });
      return response;
    }

    console.log('🔍 /api/auth/me - Session found:', { 
      email: sessionData.user?.email, 
      sub: sessionData.user?.sub 
    });

    return NextResponse.json({ 
      user: sessionData.user,
      accessToken: sessionData.accessToken // Optional: return for API calls
    });

  } catch (error) {
    console.log('❌ /api/auth/me error:', error);
    return NextResponse.json({ user: null, error: 'Invalid session' }, { status: 200 });
  }
}
