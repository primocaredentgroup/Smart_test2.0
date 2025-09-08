"use client";
import { useUser } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { PersonIcon } from "@radix-ui/react-icons";
// Rimosso Link per evitare prefetch CORS
// Build errors fixed - deploy trigger

// Client Component con check auth
export default function LoginPage() {
  const { user, isLoading } = useUser();

  // Se già autenticato, reindirizza al dashboard
  useEffect(() => {
    console.log('🔍 Login Auth Debug:', { user, isLoading, hasActualUser: !!user?.email });
    if (user?.email && !isLoading) {
      window.location.href = '/dashboard';
    }
  }, [user, isLoading]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Se già autenticato, non mostrare form
  if (user?.email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PersonIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Smart Test</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Accedi al tuo account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-8">
          <div className="space-y-6">
            {/* Auth0 Login Button */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/api/auth/login"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 no-underline"
              style={{ textDecoration: 'none' }}
            >
              <PersonIcon className="w-4 h-4" />
              <span>🔐 Login con Auth0</span>
            </a>

            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                ✅ Autenticazione sicura tramite Auth0 SDK ufficiale
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Sistema di autenticazione enterprise
          </p>
        </div>
      </div>
    </div>
  );
}