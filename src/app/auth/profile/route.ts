import { NextResponse } from 'next/server';

export async function GET() {
  // Ritorna sempre null per ora, così non da più 401
  return NextResponse.json({ user: null });
}
