"use client";
import { useState, useEffect } from 'react';

interface ExtendedUser {
  nome: string;
  cognome: string;
  email: string;
  ruolo: string;
  id: string;
}

export function useAuth() {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula caricamento da localStorage - solo lato client
    try {
      if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
    } catch (error) {
      console.error('Errore nel caricamento user da localStorage:', error);
    }
    // Rimuovo artificialmente il loading state per il test
    setIsLoading(false);
  }, []);

  const loginUser = (userData: ExtendedUser) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  // Mock login semplice per il demo
  const login = () => {
    const mockUser: ExtendedUser = {
      id: "demo-123",
      nome: "Demo",
      cognome: "User", 
      email: "demo@example.com",
      ruolo: "admin"
    };
    loginUser(mockUser);
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginUser,
    logout,
  };
}