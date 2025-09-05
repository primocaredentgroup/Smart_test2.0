"use client";
import { useUser } from '@auth0/nextjs-auth0';
import { useEffect } from 'react';
import Link from "next/link";

// Client Component con auth check
export default function HomePage() {
  const { user, isLoading } = useUser();

  // Se autenticato, reindirizza al dashboard
  useEffect(() => {
    if (user && !isLoading) {
      window.location.href = '/dashboard';
    }
  }, [user, isLoading]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
            🧪 Smart Test 2.0
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Sistema di gestione test funzionali per il software dentale
          </p>
          
          <div className="space-y-4 max-w-md mx-auto">
            <button
              onClick={() => window.location.href = '/login'}
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              🔐 Accedi
            </button>
            
            <Link
              href="/signup"
              className="block w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-6 py-3 rounded-xl font-medium border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              📝 Registrati
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Test Organizzati
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Gestisci i test per macroaree con task predefiniti e personalizzabili
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <div className="text-3xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Collaborazione
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Ruoli admin e tester per una gestione efficace del team
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Reportistica
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Dashboard complete con statistiche e analisi dei test
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-sm text-slate-500 dark:text-slate-400">
            <p>🔗 Integrazione con Jira • 🔒 Autenticazione Auth0 • ⚡ Database Convex</p>
          </div>
        </div>
      </div>
    </div>
  );
}