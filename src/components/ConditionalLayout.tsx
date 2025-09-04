"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/Sidebar";
import { RoleSwitcher } from "@/components/RoleSwitcher";
import { AuthButton } from "@/components/AuthButton";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Aspetta che il componente sia montato per evitare hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Durante il mounting o loading, mostra layout semplice senza sidebar
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <header className="flex justify-end items-center p-4 md:p-6">
          <AuthButton />
        </header>
        <main className="flex-1 px-4 md:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Se NON è autenticato, mostra layout semplice senza sidebar
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Header semplice solo con AuthButton per login */}
        <header className="flex justify-end items-center p-4 md:p-6">
          <AuthButton />
        </header>
        
        {/* Contenuto centrato per pagine di login/signup */}
        <main className="flex-1 px-4 md:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    );
  }

  // Se È autenticato, mostra layout completo con sidebar
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header con Auth e Role Switcher */}
        <header className="flex justify-between items-center p-4 md:p-6">
          <div className="flex items-center gap-4">
            <AuthButton />
          </div>
          <RoleSwitcher />
        </header>
        
        {/* Main Content */}
        <main className="flex-1 px-4 md:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
