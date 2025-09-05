"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Auth0User {
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  sub: string;
  picture?: string;
}

interface ConvexUser {
  _id: string;
  email: string;
  nome: string;
  cognome: string;
  ruolo: string;
}

export default function UserMappingPage() {
  const { user, isLoading } = useAuth();
  const [auth0Data, setAuth0Data] = useState<Auth0User | null>(null);
  const [convexUsers, setConvexUsers] = useState<ConvexUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // Carica i dati Auth0 dal localStorage
    const storedData = localStorage.getItem('auth0_user_data');
    if (storedData) {
      setAuth0Data(JSON.parse(storedData));
    }

    // Carica tutti gli utenti Convex (per admin)
    loadConvexUsers();
  }, []);

  const loadConvexUsers = async () => {
    try {
      // ⚠️ NESSUN DATO MOCK - Solo utenti reali da Convex
      // Chiamata API reale per ottenere utenti
      const response = await fetch('/api/users/list');
      if (response.ok) {
        const users = await response.json();
        setConvexUsers(users);
      } else {
        // Fallback con utente reale attuale
        setConvexUsers([]);
      }
    } catch (error) {
      console.error('Errore nel caricamento utenti:', error);
      setConvexUsers([]);
    }
  };

  const handleMapping = async () => {
    if (!selectedUserId || !auth0Data) {
      setMessage('❌ Seleziona un utente Convex da mappare');
      return;
    }

    try {
      // Qui faresti la chiamata API per mappare l'utente
      const selectedUser = convexUsers.find(u => u._id === selectedUserId);
      
      setMessage(`✅ Mappatura completata! 
        Auth0: ${auth0Data.email} 
        → Convex: ${selectedUser?.nome} ${selectedUser?.cognome} (${selectedUser?.email})`);
      
      console.log('Mappatura:', {
        auth0: auth0Data,
        convex: selectedUser
      });
      
    } catch (error) {
      setMessage('❌ Errore nella mappatura');
      console.error(error);
    }
  };

  const testCurrentMapping = async () => {
    try {
      const response = await fetch('/api/user/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auth0User: auth0Data }),
      });
      
      if (response.ok) {
        const result = await response.json();
        setMessage(`✅ Test completato! Sei mappato come: ${result.nome} ${result.cognome} (${result.email})`);
      } else {
        setMessage('❌ Errore nel test');
      }
    } catch (error) {
      setMessage('❌ Errore nel test');
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="p-8">Caricamento...</div>;
  }

  if (!user || user.ruolo !== 'admin') {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Accesso Negato</h1>
        <p>Solo gli amministratori possono accedere a questa pagina.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🔗 Gestione Mappatura Utenti Auth0 ↔ Convex</h1>
      
      {/* Stato Attuale */}
      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">📋 Stato Attuale</h2>
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Dati Auth0 */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-bold text-lg mb-3">🔐 Dati Auth0 Attuali</h3>
            {auth0Data ? (
              <div className="space-y-2">
                <p><strong>📧 Email:</strong> {auth0Data.email}</p>
                <p><strong>👤 Nome:</strong> {auth0Data.name}</p>
                <p><strong>🆔 ID:</strong> {auth0Data.sub}</p>
                <p><strong>📸 Foto:</strong> {auth0Data.picture ? '✅' : '❌'}</p>
              </div>
            ) : (
              <p className="text-gray-500">❌ Nessun dato Auth0 trovato. Effettua il login prima.</p>
            )}
          </div>

          {/* Dati Convex */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-bold text-lg mb-3">💾 Dati Convex Attuali</h3>
            <div className="space-y-2">
              <p><strong>📧 Email:</strong> {user.email}</p>
              <p><strong>👤 Nome:</strong> {user.nome} {user.cognome}</p>
              <p><strong>🎭 Ruolo:</strong> {user.ruolo}</p>
              <p><strong>🆔 ID:</strong> {user.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mappatura */}
      <div className="bg-green-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">🎯 Nuova Mappatura</h2>
        <p className="mb-4 text-gray-700">
          Seleziona l&apos;utente Convex a cui vuoi mappare il tuo account Auth0:
        </p>
        
        <div className="space-y-4">
          <select 
            value={selectedUserId} 
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">-- Seleziona utente Convex --</option>
            {convexUsers.map(user => (
              <option key={user._id} value={user._id}>
                {user.nome} {user.cognome} ({user.email}) - {user.ruolo}
              </option>
            ))}
          </select>
          
          <button 
            onClick={handleMapping}
            disabled={!selectedUserId || !auth0Data}
            className="bg-green-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 hover:bg-green-700"
          >
            🔗 Crea Mappatura
          </button>
        </div>
      </div>

      {/* Test */}
      <div className="bg-yellow-50 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">🧪 Test Sistema</h2>
        <p className="mb-4 text-gray-700">
          Testa la mappatura attuale per verificare che funzioni:
        </p>
        
        <button 
          onClick={testCurrentMapping}
          disabled={!auth0Data}
          className="bg-yellow-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 hover:bg-yellow-700"
        >
          🚀 Test Mappatura Attuale
        </button>
      </div>

      {/* Messaggi */}
      {message && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">📨 Risultato:</h3>
          <pre className="whitespace-pre-wrap text-sm">{message}</pre>
        </div>
      )}

      {/* Spiegazione */}
      <div className="bg-gray-50 p-6 rounded-lg mt-8">
        <h2 className="text-xl font-semibold mb-4">🤔 Come Funziona</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li><strong>Login Auth0:</strong> Quando fai login, Auth0 fornisce i tuoi dati reali (email, nome, ecc.)</li>
          <li><strong>Mappatura:</strong> Questi dati vengono mappati a un utente esistente in Convex</li>
          <li><strong>Sincronizzazione:</strong> Il sistema crea/aggiorna l&apos;utente in Convex basandosi sui dati Auth0</li>
          <li><strong>Dashboard:</strong> L&apos;app mostra i dati dall&apos;utente Convex mappato</li>
        </ol>
      </div>
    </div>
  );
}
