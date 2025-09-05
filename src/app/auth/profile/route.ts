import { getSession } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getSession();
    
    if (session?.user) {
      return NextResponse.json({
        user: {
          sub: session.user.sub,
          name: session.user.name,
          email: session.user.email,
          picture: session.user.picture
        }
      });
    } else {
      return NextResponse.json({ user: null });
    }
  } catch (error) {
    console.error('Profile endpoint error:', error);
    return NextResponse.json({ user: null });
  }
}
