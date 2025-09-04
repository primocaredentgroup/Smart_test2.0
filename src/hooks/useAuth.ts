"use client";
import { useState, useEffect } from 'react';

// Interface estesa per compatibilità con il vecchio sistema
interface ExtendedUser {
  nome: string;
  cognome: string;
  email: string;
  ruolo: string;
  id: string;
}

export function useAuth() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Controlla se c'è un utente nella sessione
  useEffect(() => {
    const checkSession = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('logged_in') === 'true') {
        
        // Ottieni i dati utente reali dal localStorage e sincronizza con Convex
        try {
          setIsLoading(true);
          
          // Prima prova a ottenere i dati dal localStorage (più veloce)
          const storedUserData = localStorage.getItem('auth0_user_data');
          
          if (storedUserData) {
            const auth0User = JSON.parse(storedUserData);
            console.log('🔍 Dati Auth0 dal localStorage:', auth0User);
            
            // Chiama l'API per sincronizzare con Convex usando i dati VERI
            const response = await fetch('/api/user/me', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ auth0User }),
            });
            
            if (response.ok) {
              const convexUser = await response.json();
              console.log('✅ Utente sincronizzato con Convex:', convexUser);
              
              // Trasforma i dati di Convex nel formato dell'app
              setUser({
                id: convexUser._id,
                nome: convexUser.name?.split(' ')[0] || 'Utente',
                cognome: convexUser.name?.split(' ').slice(1).join(' ') || '',
                email: convexUser.email,
                ruolo: convexUser.role
              });
            } else {
              throw new Error('Errore nella sincronizzazione con Convex');
            }
          } else {
            // Nessun dato Auth0 nel localStorage, utente non autenticato
            console.log('⚠️ Nessun dato Auth0 nel localStorage, utente non autenticato');
            setUser(null);
          }
          
        } catch (error) {
          console.error('❌ Errore nel caricamento profilo:', error);
          setError('Errore nel caricamento del profilo utente');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    checkSession();
  }, []);

  // Funzioni per compatibilità
  const login = () => {
    // Redirect alla pagina di login Auth0
    window.location.href = '/api/auth/login';
  };

  const logout = () => {
    // Redirect alla pagina di logout Auth0
    setUser(null);
    window.location.href = '/api/auth/logout';
  };

  const loginUser = (userData: ExtendedUser) => {
    setUser(userData);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginUser,
    logout,
    error,
  };
}