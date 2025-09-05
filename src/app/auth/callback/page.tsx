"use client";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';

export default function CallbackPage() {
  const { user, error, isLoading } = useUser();

  useEffect(() => {
    if (user) {
      console.log('✅ Login completato con Auth0 SDK!', user);
      // Redirect alla homepage dopo login riuscito
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    }
    if (error) {
      console.error('❌ Errore Auth0:', error);
    }
  }, [user, error]);

  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
        <h1>🔐 Processamento Login Auth0</h1>
        <p>🔄 Caricamento...</p>
        <div style={{ 
          width: "50px", 
          height: "50px", 
          border: "5px solid #f3f3f3",
          borderTop: "5px solid #3498db",
          borderRadius: "50%",
          animation: "spin 2s linear infinite",
          margin: "20px auto"
        }}></div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
        <h1>❌ Errore Login</h1>
        <p>Si è verificato un errore durante il login: {error.message}</p>
      </div>
    );
  }

  if (user) {
    return (
      <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
        <h1>✅ Login Completato!</h1>
        <p>Ciao {user.name || user.email}!</p>
        <p>Reindirizzamento in corso...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1>🔐 Auth0 Callback</h1>
      <p>Processamento in corso...</p>
    </div>
  );
}
