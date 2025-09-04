"use client";
import { useState } from "react";
import { staticData } from "@/lib/dataClient";
import { useRole } from "@/contexts/RoleContext";
import { MacroareaManager } from "@/components/MacroareaManager";
import { PlusIcon, GearIcon, LayersIcon, CheckCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { redirect } from "next/navigation";

export default function AdminPage() {
  const { isAdmin } = useRole();
  const [macroareas, setMacroareas] = useState(staticData.macroareas);

  // Redirect if not admin (this will be handled by custom auth later)
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Accesso negato</h2>
          <p className="text-slate-600 dark:text-slate-400">Solo gli admin possono accedere a questa sezione</p>
        </div>
      </div>
    );
  }

  function handleMacroareasUpdate(updatedMacroareas: any[]) {
    setMacroareas(updatedMacroareas);
    // TODO: In futuro, questa sarà una chiamata API/Convex per salvare nel database
    console.log("Macroaree aggiornate:", updatedMacroareas);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Pannello Admin</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Gestisci macroaree e configura i test-task standard del sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Macroaree</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{macroareas.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
              <LayersIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Task Standard</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {macroareas.reduce((sum, m) => sum + m.standardTasks.length, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
              <CheckCircledIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Tests Attivi</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{staticData.tests.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <GearIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Macroarea Management */}
      <MacroareaManager 
        macroareas={macroareas as any[]}
        onUpdate={handleMacroareasUpdate}
      />

      {/* Future Features Preview */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Funzionalità Future</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <GearIcon className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Gestione Utenti</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Assegna ruoli e permessi agli utenti del sistema</p>
          </div>
          
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircledIcon className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-700 dark:text-slate-300">Template Test</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Crea template predefiniti per tipologie di test ricorrenti</p>
          </div>
        </div>
      </div>
    </div>
  );
}