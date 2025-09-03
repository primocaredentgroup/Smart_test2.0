"use client";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { CheckCircledIcon, ClockIcon, PersonIcon, CalendarIcon, TrendingUpIcon } from "@radix-ui/react-icons";

type Props = {
  userEmail: string;
  tests: any[];
};

export function TesterDashboard({ userEmail, tests }: Props) {
  // Filtra solo i test dell'utente corrente
  const myTests = tests.filter(t => t.creatorEmail === userEmail);
  const myCompletedTests = myTests.filter(t => t.status === "completed");
  const myActiveTests = myTests.filter(t => t.status === "in_progress" || t.status === "open");
  const myFailedTests = myTests.filter(t => t.status === "failed");
  
  // Ultimi 3 test dell'utente
  const recentMyTests = myTests.slice(0, 3);

  // Calcolo produttività (test completati questa settimana - simulato)
  const weeklyCompleted = Math.floor(myCompletedTests.length * 0.6); // Simula completati questa settimana

  return (
    <div className="space-y-8">
      {/* Header personale */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Personale</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Benvenuto <span className="font-medium">{userEmail}</span> - Ecco il tuo overview dei test
        </p>
      </div>

      {/* Stats personali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Miei Test Totali */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">I miei test</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{myTests.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <PersonIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Completati */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completati</p>
              <p className="text-3xl font-bold text-emerald-600">{myCompletedTests.length}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
              <CheckCircledIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        {/* In corso */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">In corso</p>
              <p className="text-3xl font-bold text-blue-600">{myActiveTests.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Produttività settimanale */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Questa settimana</p>
              <p className="text-3xl font-bold text-purple-600">{weeklyCompleted}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
              <TrendingUpIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* I miei ultimi test */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">I miei ultimi test</h2>
            <Link 
              href="/tests" 
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Vedi tutti →
            </Link>
          </div>
        </div>
        <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
          {recentMyTests.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-slate-600 dark:text-slate-400">Non hai ancora creato test.</p>
              <Link 
                href="/tests/new"
                className="inline-flex items-center mt-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Crea il tuo primo test →
              </Link>
            </div>
          ) : (
            recentMyTests.map((test) => (
              <div key={test._id} className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Link 
                      href={`/tests/${test._id}`}
                      className="text-lg font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {test.name}
                    </Link>
                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{test.createdAt}</span>
                      </div>
                      {test.jiraLink && (
                        <>
                          <span>•</span>
                          <a href={test.jiraLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Jira
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={test.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick actions per tester */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/tests/new"
          className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircledIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Nuovo Test</h3>
              <p className="text-white/80 text-sm">Crea un nuovo test funzionale</p>
            </div>
          </div>
        </Link>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUpIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Il tuo progresso</h3>
              <p className="text-white/80 text-sm">
                {myCompletedTests.length > 0 
                  ? `${Math.round((myCompletedTests.length / myTests.length) * 100)}% test completati` 
                  : "Inizia il tuo primo test"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
