import { NextRequest, NextResponse } from 'next/server';

/**
 * API per ottenere informazioni utente da Auth0
 * Questo endpoint dovrebbe essere chiamato dal frontend per ottenere
 * i dati reali dell'utente loggato
 */
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json({ error: 'Authorization code required' }, { status: 400 });
    }

    // Scambia il code con un access token
    const tokenResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        code: code,
        redirect_uri: `${process.env.APP_BASE_URL}/auth/callback`,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokens = await tokenResponse.json();

    // Ottieni informazioni utente da Auth0
    const userResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userData = await userResponse.json();
    
    console.log('🔍 Dati REALI utente Auth0:', userData);

    return NextResponse.json({
      success: true,
      user: userData,
      tokens: {
        access_token: tokens.access_token,
        id_token: tokens.id_token,
      }
    });

  } catch (error) {
    console.error('❌ Errore nel recupero dati Auth0:', error);
    return NextResponse.json(
      { error: 'Errore nel recupero dati utente' }, 
      { status: 500 }
    );
  }
}

/**
 * 🤔 Spiegazione per principianti:
 * 
 * Questo endpoint fa il "vero" scambio Auth0:
 * 1. 📝 Riceve il CODE dal callback Auth0
 * 2. 🔄 Scambia il CODE con un ACCESS TOKEN
 * 3. 📞 Usa l'ACCESS TOKEN per chiamare /userinfo di Auth0
 * 4. 📋 Restituisce i VERI dati dell'utente loggato
 * 
 * È come presentare un biglietto (CODE) alla reception (Auth0)
 * per ottenere la chiave della stanza (ACCESS TOKEN) e poi
 * usare la chiave per accedere alle informazioni personali!
 */
