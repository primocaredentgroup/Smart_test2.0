"use client";

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/contexts/RoleContext";
import { toast } from "sonner";

// interface User {
//   _id: string;
//   _creationTime: number;
//   email: string;
//   name?: string;
//   role: 'admin' | 'tester';
//   createdAt: number;
//   lastLogin: number;
// }

// interface UserWithStats {
//   user: User;
//   totalTests: number;
//   completedTests: number;
//   activeTests: number;
//   completionRate: number;
// }

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const { isAdmin } = useRole();
  const [isLoading, setIsLoading] = useState(true);

  // Query per ottenere statistiche utenti
  const userStats = useQuery(api.users.getUserStats);
  const updateUserRole = useMutation(api.users.updateUserRole);

  useEffect(() => {
    if (userStats !== undefined) {
      setIsLoading(false);
    }
  }, [userStats]);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'tester', userName: string) => {
    if (!currentUser?.email) {
      toast.error("Errore: utente non autenticato");
      return;
    }

    try {
      await updateUserRole({
        userId: userId as import('../../../../convex/_generated/dataModel').Id<"users">,
        newRole,
        updatedBy: currentUser.email
      });
      
      toast.success(`Ruolo di ${userName} aggiornato a ${newRole === 'admin' ? 'Admin' : 'Tester'}`);
    } catch (error) {
      console.error('Errore aggiornamento ruolo:', error);
      toast.error("Errore durante l&apos;aggiornamento del ruolo");
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDaysAgo = (timestamp: number) => {
    const daysAgo = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60 * 24));
    if (daysAgo === 0) return 'Oggi';
    if (daysAgo === 1) return 'Ieri';
    return `${daysAgo} giorni fa`;
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">🚫 Accesso Negato</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Solo gli amministratori possono accedere alla gestione utenti.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            👥 Gestione Utenti
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestisci ruoli e autorizzazioni degli utenti registrati tramite Auth0
          </p>
        </div>

        {/* Statistiche Rapide */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {!isLoading && userStats && (
            <>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Totale Utenti
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userStats.length}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <span className="text-blue-600 dark:text-blue-400 text-xl">👥</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Amministratori
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userStats.filter(u => u.user.role === 'admin').length}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                    <span className="text-purple-600 dark:text-purple-400 text-xl">⚡</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Tester
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userStats.filter(u => u.user.role === 'tester').length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                    <span className="text-green-600 dark:text-green-400 text-xl">🧪</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Test Totali
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userStats.reduce((sum, u) => sum + u.totalTests, 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                    <span className="text-orange-600 dark:text-orange-400 text-xl">📋</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tabella Utenti */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Lista Utenti
            </h2>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Caricamento utenti...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Utente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ruolo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Attività
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Ultimo Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Azioni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {userStats && userStats.map((userStat) => (
                    <tr key={userStat.user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <span className="text-white font-medium text-sm">
                                {userStat.user.name?.charAt(0).toUpperCase() || userStat.user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {userStat.user.name || 'Nome non disponibile'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {userStat.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          userStat.user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {userStat.user.role === 'admin' ? '⚡ Admin' : '🧪 Tester'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="space-y-1">
                          <div>📋 {userStat.totalTests} test</div>
                          <div>✅ {userStat.completedTests} completati</div>
                          <div>🔄 {userStat.activeTests} attivi</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div>
                          <div>{userStat.user.lastLogin ? formatDaysAgo(userStat.user.lastLogin) : 'Mai'}</div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {userStat.user.lastLogin ? formatDate(userStat.user.lastLogin) : '-'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {userStat.user.email !== currentUser?.email ? (
                          <select
                            value={userStat.user.role}
                            onChange={(e) => handleRoleChange(
                              userStat.user._id, 
                              e.target.value as 'admin' | 'tester',
                              userStat.user.name || userStat.user.email
                            )}
                            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="admin">⚡ Admin</option>
                            <option value="tester">🧪 Tester</option>
                          </select>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500 text-xs">
                            (Tu stesso)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          🔐 Tutti gli utenti sono sincronizzati automaticamente da Auth0. 
          I cambi di ruolo vengono registrati nell&apos;audit log.
        </div>
      </div>
    </div>
  );
}
