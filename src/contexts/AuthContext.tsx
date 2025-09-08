"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  sub: string;
  email?: string;
  name?: string;
  nickname?: string;
  picture?: string;
  updated_at?: string;
  // Auth0 custom claims and metadata
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Try to get user from session cookie
    const getSessionFromCookie = () => {
      try {
        // Read from cookie via API call (since httpOnly cookies can't be read by client JS)
        fetch('/api/auth/me')
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            return null;
          })
          .then(userData => {
            console.log('🔍 Custom Auth Debug:', { userData, hasUser: !!userData?.user });
            if (userData?.user) {
              setUser(userData.user);
            } else {
              setUser(null);
            }
            setIsLoading(false);
          })
          .catch(err => {
            console.log('❌ Auth fetch error:', err);
            setError(err);
            setUser(null);
            setIsLoading(false);
          });
      } catch (err) {
        console.log('❌ Auth session error:', err);
        setError(err as Error);
        setUser(null);
        setIsLoading(false);
      }
    };

    getSessionFromCookie();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUser() {
  return useContext(AuthContext);
}
