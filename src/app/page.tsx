"use client";
import Link from "next/link";
import { useRole } from "@/contexts/RoleContext";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatDate } from "@/lib/convexActions";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  CheckCircledIcon, 
  ClockIcon, 
  PersonIcon, 
  ExclamationTriangleIcon, 
  BarChartIcon,
  ActivityLogIcon,
  GearIcon,
  CrossCircledIcon,
  CalendarIcon,
  ArrowUpIcon,
  ExternalLinkIcon,
  PlusIcon
} from "@radix-ui/react-icons";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomePageContent />
    </ProtectedRoute>
  );
}

function HomePageContent() {
  const { isAdmin } = useRole();
  const { user } = useAuth();
  const tests = useQuery(api.tests.listTests);
  
  // Get user email from Auth0 user
  const userEmail = user?.email || '';

  // Loading state
  if (tests === undefined) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Caricamento dashboard...</p>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return <AdminDashboard tests={tests} />;
  } else {
    return <TesterDashboard userEmail={userEmail} tests={tests} />;
  }
}

// Dashboard Admin Component
function AdminDashboard({ tests }: { tests: any[] }) {
  // Calcoli generali
  const totalTests = tests.length;
  const completedTests = tests.filter(t => t.status === "completed").length;
  const failedTests = tests.filter(t => t.status === "failed").length;
  const inProgressTests = tests.filter(t => t.status === "in_progress").length;
  const pendingTests = tests.filter(t => t.status === "open").length;

  // Analisi per tester
  const testerStats = tests.reduce((acc, test) => {
    const email = test.creatorEmail;
    if (!acc[email]) {
      acc[email] = { total: 0, completed: 0, inProgress: 0, failed: 0 };
    }
    acc[email].total++;
    if (test.status === "completed") acc[email].completed++;
    if (test.status === "in_progress") acc[email].inProgress++;
    if (test.status === "failed") acc[email].failed++;
    return acc;
  }, {} as Record<string, any>);

  const topTesters = Object.entries(testerStats)
    .sort(([,a], [,b]) => b.completed - a.completed)
    .slice(0, 3);

  // Test che necessitano attenzione
  const testsNeedingAttention = tests.filter(t => 
    t.status === "failed" || 
    (t.status === "in_progress" && new Date(t.createdAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  );

  const recentAllTests = tests.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header admin */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">👑 Dashboard Admin</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Overview completo dei test del team e metriche di produttività
        </p>
      </div>

      {/* Stats generali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Totali</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{totalTests}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <BarChartIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completati</p>
              <p className="text-3xl font-bold text-emerald-600">{completedTests}</p>
              <p className="text-xs text-slate-500">{Math.round((completedTests/totalTests)*100)}% del totale</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center">
              <CheckCircledIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Da iniziare</p>
              <p className="text-3xl font-bold text-amber-600">{pendingTests}</p>
              <p className="text-xs text-slate-500">In attesa</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-xl flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">In corso</p>
              <p className="text-3xl font-bold text-blue-600">{inProgressTests}</p>
              <p className="text-xs text-slate-500">Attivi</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <ActivityLogIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Falliti</p>
              <p className="text-3xl font-bold text-red-600">{failedTests}</p>
              <p className="text-xs text-slate-500">Richiedono fix</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
              <CrossCircledIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Sezione reportistica */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Produttività tester */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Tester per Completamenti</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Performance del team</p>
          </div>
          <div className="p-6 space-y-4">
            {topTesters.map(([email, stats], index) => (
              <div key={email} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-slate-400' : 'bg-amber-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">{email}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {stats.total} test totali • {stats.inProgress} in corso
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-emerald-600">{stats.completed}</div>
                  <div className="text-xs text-slate-500">completati</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test che richiedono attenzione */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Richiedono Attenzione</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Test falliti o bloccati</p>
          </div>
          <div className="p-6">
            {testsNeedingAttention.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircledIcon className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-400">Tutto ok! Nessun test richiede attenzione.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {testsNeedingAttention.map((test) => (
                  <div key={test._id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-lg">
                    <div>
                      <Link 
                        href={`/tests/${test._id}`}
                        className="font-medium text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {test.name}
                      </Link>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{test.creatorEmail}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      test.status === "failed" ? "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200" :
                      "bg-amber-200 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                    }`}>
                      {test.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ultimi test di tutti */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Attività Recente del Team</h2>
            <Link 
              href="/tests" 
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Vedi tutti →
            </Link>
          </div>
        </div>
        <div className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
          {recentAllTests.map((test) => (
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
                      <PersonIcon className="w-4 h-4" />
                      <span>{test.creatorEmail}</span>
                    </div>
                    <span>•</span>
                    <span>{formatDate(test.createdAt)}</span>
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
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  test.status === "completed" ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" :
                  test.status === "in_progress" ? "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                  test.status === "failed" ? "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200" :
                  "bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-200"
                }`}>
                  {test.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions admin */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/admin"
          className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <GearIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Gestione Admin</h3>
              <p className="text-white/80 text-sm">Configura macroaree e sistema</p>
            </div>
          </div>
        </Link>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <BarChartIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Successo Rate</h3>
              <p className="text-white/80 text-sm">
                {Math.round((completedTests / totalTests) * 100)}% test completati con successo
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <ActivityLogIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Team Attivo</h3>
              <p className="text-white/80 text-sm">
                {Object.keys(testerStats).length} tester • {inProgressTests + pendingTests} test attivi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Tester Component
function TesterDashboard({ userEmail, tests }: { userEmail: string; tests: any[] }) {
  // Filtra solo i test dell'utente corrente
  const myTests = tests.filter(t => t.creatorEmail === userEmail);
  const myCompletedTests = myTests.filter(t => t.status === "completed");
  const myActiveTests = myTests.filter(t => t.status === "in_progress" || t.status === "open");
  
  // Ultimi 3 test dell'utente
  const recentMyTests = myTests.slice(0, 3);

  // Calcolo produttività (test completati questa settimana - simulato)
  const weeklyCompleted = Math.floor(myCompletedTests.length * 0.6);

  return (
    <div className="space-y-8">
      {/* Header personale */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">👨‍💻 Dashboard Personale</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Benvenuto <span className="font-medium">{userEmail}</span> - Ecco il tuo overview dei test
        </p>
      </div>

      {/* Stats personali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Questa settimana</p>
              <p className="text-3xl font-bold text-purple-600">{weeklyCompleted}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
              <ArrowUpIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                        <span>{formatDate(test.createdAt)}</span>
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
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    test.status === "completed" ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" :
                    test.status === "in_progress" ? "bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                    test.status === "failed" ? "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200" :
                    "bg-slate-200 text-slate-800 dark:bg-slate-600 dark:text-slate-200"
                  }`}>
                    {test.status}
                  </span>
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
              <PlusIcon className="w-6 h-6" />
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
              <ArrowUpIcon className="w-6 h-6" />
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
