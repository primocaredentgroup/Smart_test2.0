import { NextRequest, NextResponse } from 'next/server';

// Route semplice che reindirizza alle URL Auth0 dirette
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.split('/').pop();
  
  switch (path) {
    case 'login':
      return NextResponse.redirect(`https://${process.env.AUTH0_DOMAIN}/authorize?client_id=${process.env.AUTH0_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.APP_BASE_URL + '/auth/callback')}&scope=openid profile email`);
    
    case 'logout':
      return NextResponse.redirect(`https://${process.env.AUTH0_DOMAIN}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${encodeURIComponent(process.env.APP_BASE_URL || 'http://localhost:3000')}`);
    
    case 'me':
      // Endpoint per ottenere il profilo utente
      // Per ora restituiamo 404 - verrà gestito dall'hook useUser
      return NextResponse.json({ error: 'User profile endpoint - use useUser hook instead' }, { status: 404 });
    
    default:
      return NextResponse.json({ error: 'Route not found' }, { status: 404 });
  }
}

export const POST = GET;

/**
 * 🤔 Spiegazione per principianti:
 * 
 * Questa è una "route dinamica" di Next.js:
 * - [...auth0] significa "cattura tutto dopo /api/auth/"
 * - Auth0 userà queste route per gestire il flusso di login
 * - Non devi scrivere logica: Auth0 fa tutto automaticamente!
 * 
 * Esempi di URL che questa route gestirà:
 * - /api/auth/login → porta alla pagina di login Auth0
 * - /api/auth/logout → fa logout e torna alla home
 * - /api/auth/callback → riceve l'utente da Auth0 dopo il login
 * - /api/auth/me → restituisce info sull'utente loggato
 */
