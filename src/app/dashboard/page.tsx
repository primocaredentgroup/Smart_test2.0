"use client";

import { useUser } from '@/contexts/AuthContext';
import { useQuery } from 'convex/react';
import { AdminDashboard } from '@/components/AdminDashboard';
import { TesterDashboard } from '@/components/TesterDashboard';
import { Suspense } from 'react';
import { api } from '../../../convex/_generated/api';
// Rimosso Link per evitare prefetch CORS

function DashboardContent() {
  const { user, error, isLoading } = useUser();
  
  // DEBUG: Log Custom Auth state
  console.log('🔍 Custom Auth Debug (Dashboard):', { user, error, isLoading, hasEmail: !!user?.email });
  
  // Fetch tests data from Convex
  const tests = useQuery(api.tests.listTests) || [];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Caricamento...
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Verifica autenticazione in corso
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Errore di Autenticazione
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {error.message}
          </p>
          <button 
            onClick={() => window.location.href = '/api/auth/login'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block text-center border-none cursor-pointer"
          >
            Riprova il Login
          </button>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Accesso Richiesto
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Devi effettuare il login per accedere alla dashboard
          </p>
          <button 
            onClick={() => window.location.href = '/api/auth/login'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block text-center border-none cursor-pointer"
          >
            Login con Auth0
          </button>
        </div>
      </div>
    );
  }

  // Determina il ruolo dall'utente Auth0 
  // Con custom claims o dal database Convex in futuro
  const customRole = user['https://smarttest.app/role'] as string | undefined;
  const appMetadata = user['https://app_metadata'] as { role?: string } | undefined;
  const userRole = customRole || 
                   appMetadata?.role || 
                   'tester';
  
  const userEmail = user.email || '';

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
          <p className="text-xs text-slate-500 mt-1">
            ID: {user.sub} | Tests caricati: {tests.length}
          </p>
        </div>

        <Suspense fallback={<DashboardSkeleton />}>
          {userRole === 'admin' ? (
            <AdminDashboard tests={tests} />
          ) : (
            <TesterDashboard userEmail={userEmail} tests={tests} />
          )}
        </Suspense>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
