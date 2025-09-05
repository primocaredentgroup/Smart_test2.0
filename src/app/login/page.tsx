"use client";
import { useUser } from '@auth0/nextjs-auth0';
import { useEffect } from 'react';
import { PersonIcon } from "@radix-ui/react-icons";
import Link from 'next/link';

export default function LoginPage() {
  const { user, isLoading } = useUser();

  // Se già autenticato, reindirizza alla home
  useEffect(() => {
    if (user) {
      window.location.href = '/';
    }
  }, [user]);

  // Mostra loading se sta controllando l'autenticazione
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-400">Verifica autenticazione...</p>
        </div>
      </div>
    );
  }

  // Se già autenticato, non mostrare il form
  if (user) {
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
            <Link
              href="/api/auth/login"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <PersonIcon className="w-4 h-4" />
              <span>🔐 Login con Auth0</span>
            </Link>

            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Autenticazione sicura tramite Auth0
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