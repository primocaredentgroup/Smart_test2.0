"use client";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/convexActions";
import { PlusIcon, ExternalLinkIcon, PersonIcon } from "@radix-ui/react-icons";

export default function TestsPage() {
  const tests = useQuery(api.tests.listTests);

  // Loading state
  if (tests === undefined) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Caricamento test...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tests</h1>
          <p className="text-slate-600 dark:text-slate-400">Gestisci e monitora i test funzionali</p>
        </div>
        <Link 
          href="/tests/new" 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <PlusIcon className="w-5 h-5" />
          Nuovo test
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
            Tutti ({tests.length})
          </button>
          <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            Da testare ({tests.filter(t => t.status === "open").length})
          </button>
          <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            In corso ({tests.filter(t => t.status === "in_progress").length})
          </button>
          <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            Completati ({tests.filter(t => t.status === "completed").length})
          </button>
        </div>
      </div>

      {/* Tests Grid */}
      {tests.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-lg border border-slate-200/50 dark:border-slate-700/50 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <PlusIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Nessun test creato</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Inizia creando il tuo primo test funzionale</p>
          <Link 
            href="/tests/new"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Crea primo test
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div 
              key={String(test._id)} 
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-200 group"
            >
              {/* Test Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Link 
                    href={`/tests/${String(test._id)}`}
                    className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2"
                  >
                    {test.name}
                  </Link>
                </div>
                <StatusBadge status={test.status} />
              </div>

              {/* Test Info */}
              <div className="space-y-3 mb-4">
                {test.jiraLink && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <ExternalLinkIcon className="w-4 h-4" />
                    <a 
                      href={test.jiraLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                    >
                      Ticket Jira
                    </a>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <PersonIcon className="w-4 h-4" />
                  <span>{test.creatorEmail}</span>
                </div>

                <div className="text-sm text-slate-500 dark:text-slate-500">
                  Creato il {formatDate(test.createdAt)}
                </div>
              </div>

              {/* Macroaree Tags */}
              {test.macroareaIds && test.macroareaIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {test.macroareaIds.slice(0, 3).map((id: string) => (
                    <span 
                      key={id}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-md text-xs"
                    >
                      {id}
                    </span>
                  ))}
                  {test.macroareaIds.length > 3 && (
                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-md text-xs">
                      +{test.macroareaIds.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                <Link 
                  href={`/tests/${String(test._id)}`}
                  className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Visualizza dettagli →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}