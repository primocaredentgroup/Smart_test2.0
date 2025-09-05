"use client";

import { useUser } from '@auth0/nextjs-auth0';
import { AdminDashboard } from '@/components/AdminDashboard';
import { TesterDashboard } from '@/components/TesterDashboard';

export default function DashboardPage() {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-400">Caricamento dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Errore di autenticazione</h1>
          <p className="text-slate-600 mb-4">{error.message}</p>
          <a 
            href="/api/auth/login" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Riprova il login
          </a>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Accesso richiesto</h1>
          <a 
            href="/api/auth/login" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Effettua il login
          </a>
        </div>
      </div>
    );
  }

  // Determina il ruolo dall'utente Auth0 (per ora default a tester)
  // In futuro questo verrà dal database Convex collegato all'ID Auth0
  const userRole = user['https://smarttest.app/role'] || 'tester';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Benvenuto, {user.name || user.email}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Ruolo: {userRole === 'admin' ? '👑 Administrator' : '🧪 Tester'}
          </p>
        </div>

        {userRole === 'admin' ? (
          <AdminDashboard />
        ) : (
          <TesterDashboard />
        )}
      </div>
    </div>
  );
}
