import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

/**
 * Endpoint per ottenere le informazioni dell'utente corrente
 * Gestisce sia GET (fallback) che POST (con dati Auth0 reali)
 */

// GET non più supportato - solo autenticazione con Auth0 reale
export async function GET() {
  return NextResponse.json({ 
    error: 'Accesso non autorizzato. Login richiesto tramite Auth0.' 
  }, { status: 401 });
}

// POST con dati Auth0 reali
export async function POST(request: NextRequest) {
  try {
    const { auth0User } = await request.json();
    return await handleUserSync(auth0User);
  } catch (error) {
    console.error('❌ Errore nel parsing dati POST:', error);
    return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });
  }
}

async function handleUserSync(auth0User: { email?: string; given_name?: string; family_name?: string; name?: string; sub?: string; }) {
  try {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    
    if (!auth0User || !auth0User.email) {
      throw new Error('Dati Auth0 non forniti. Login richiesto.');
    }

    // Usa SOLO i dati REALI da Auth0
    const userEmail = auth0User.email;
    const userName = auth0User.given_name || auth0User.name?.split(' ')[0] || 'Utente';
    const userSurname = auth0User.family_name || auth0User.name?.split(' ').slice(1).join(' ') || '';
    
    console.log('🔍 Sincronizzazione con dati Auth0 REALI:', {
      email: userEmail,
      nome: userName,
      cognome: userSurname,
      auth0_id: auth0User.sub
    });

    // Usa upsertUser che gestisce sia creazione che aggiornamento
    console.log('🔄 Sincronizzando utente con Convex:', userEmail);
    
    await convex.mutation(api.users.upsertUser, {
      email: userEmail,
      name: `${userName} ${userSurname}`.trim(),
      role: 'admin' as const // Puoi personalizzare questa logica
    });

    // Ottieni l'utente sincronizzato
    const user = await convex.query(api.users.getUserByEmail, { 
      email: userEmail 
    });

    if (!user) {
      throw new Error('Errore nella sincronizzazione utente');
    }

    console.log('✅ Utente sincronizzato con Convex:', user);

    return NextResponse.json(user);
    
  } catch (error) {
    console.error('❌ Errore nel processamento utente:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' }, 
      { status: 500 }
    );
  }
}

/**
 * 🤔 Spiegazione per principianti:
 * 
 * Questo endpoint fa la MAGIA della sincronizzazione Auth0 + Convex:
 * 
 * 1. 🔐 Auth0 → Autentica l'utente (già fatto!)
 * 2. 📞 API → Riceve dati REALI dell'utente via POST
 * 3. 🔍 Convex → Controlla se l'utente esiste nel database
 * 4. 🆕 Se non esiste → Lo crea automaticamente con dati VERI!
 * 5. ✅ Se esiste → Aggiorna ultimo accesso
 * 6. 📋 Risposta → Dati utente da Convex
 * 
 * È come avere un "ponte intelligente" che collega Auth0 (autenticazione) 
 * con Convex (database utenti) usando i tuoi dati REALI! 🌉
 */