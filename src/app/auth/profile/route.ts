import { NextResponse } from 'next/server';

/**
 * Endpoint per il profilo utente Auth0
 * Questo endpoint viene chiamato dall'SDK Auth0 per ottenere le informazioni dell'utente
 */
export async function GET() {
  // Per ora restituiamo un errore 401, l'SDK gestirà il caso
  // In una implementazione completa, qui verificheremmo il token di sessione
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

/**
 * 🤔 Spiegazione per principianti:
 * 
 * Questo endpoint viene chiamato automaticamente dall'SDK Auth0
 * quando l'hook useUser() cerca di ottenere le informazioni dell'utente.
 * 
 * Per ora restituisce 401 (Unauthorized) perché stiamo usando un approccio
 * semplificato con link diretti invece dell'SDK completo.
 * 
 * Il browser vedrà questo 404, ma è normale nel nostro setup attuale!
 */
