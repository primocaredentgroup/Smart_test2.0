/**
 * Middleware di Autenticazione Auth0 per Next.js
 * 
 * Questo file è il "guardiano" della tua app.
 * Controlla ogni richiesta e gestisce l'autenticazione automaticamente.
 */

import { NextResponse } from "next/server";

/**
 * Per ora, lasciamo passare tutto e lasciamo che Auth0 
 * gestisca l'autenticazione a livello di componente
 */
export function middleware() {
  return NextResponse.next();
}

/**
 * Configurazione: su quali percorsi deve girare il middleware
 * 
 * 🤔 Cosa significa questo "matcher"?
 * Il matcher è come dire al buttafuori: "controlla tutte le porte ECCETTO queste"
 * 
 * Esclusiamo:
 * - _next/static: file CSS, JS, immagini (non servono autenticazione)
 * - _next/image: immagini ottimizzate di Next.js
 * - favicon.ico: l'iconcina del browser
 * - sitemap.xml e robots.txt: file per i motori di ricerca
 * 
 * Tutto il resto verrà controllato dal middleware!
 */
export const config = {
  matcher: [
    /*
     * Controlla tutte le richieste ECCETTO:
     * - file statici (_next/static/)
     * - immagini ottimizzate (_next/image/)
     * - favicon, sitemap, robots
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

/**
 * 🎯 Come funziona questo middleware:
 * 
 * 1. Un utente va su qualsiasi pagina della tua app
 * 2. Next.js PRIMA chiama questo middleware
 * 3. Il middleware di Auth0 controlla se l'utente è loggato
 * 4. Se è tutto ok, l'utente vede la pagina
 * 5. Se non è loggato e la pagina è protetta, viene mandato al login
 * 
 * ✨ La magia è che tutto questo succede automaticamente!
 * Non devi scrivere controlli in ogni singola pagina.
 */
