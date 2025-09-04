"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { NewTestForm } from "@/components/NewTestForm";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function NewTestPage() {
  const macroareas = useQuery(api.macroareas.listMacroareas);

  // Loading state
  if (macroareas === undefined) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Caricamento macroaree...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link 
          href="/tests"
          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Torna ai tests
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Nuovo test</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Crea un nuovo test funzionale selezionando le macroaree da verificare
        </p>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <NewTestForm macroareas={macroareas} />
      </div>
    </div>
  );
}