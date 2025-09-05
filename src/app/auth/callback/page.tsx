"use client";
import { useEffect, useState } from 'react';

export default function CallbackPage() {
  const [status, setStatus] = useState('🔄 Processando...');
  const [userInfo, setUserInfo] = useState<{ email?: string; name?: string; picture?: string; sub?: string; } | null>(null);

  useEffect(() => {
    const processAuth0Callback = async () => {
      try {
        // Estrai il code dall'URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          setStatus('❌ Errore: Nessun authorization code trovato');
          return;
        }

        console.log('✅ Callback Auth0 ricevuto! Code:', code);
        setStatus('🔍 Ottenendo dati utente da Auth0...');

        // Chiama la nostra API per ottenere i dati VERI dall'utente
        const response = await fetch('/api/auth0/user-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('🎉 Dati utente REALI ricevuti:', data.user);
          setUserInfo(data.user);
          setStatus(`✅ Login completato! Ciao ${data.user.name || data.user.email}!`);
          
          // Salva i dati utente nel localStorage per il nostro hook
          localStorage.setItem('auth0_user_data', JSON.stringify(data.user));
          
          // Redirect alla homepage
          setTimeout(() => {
            window.location.href = '/?logged_in=true';
          }, 2000);
        } else {
          console.error('❌ Errore nella chiamata API');
          setStatus('❌ Errore nel processamento dati utente');
        }
        
      } catch (error) {
        console.error('❌ Errore nel callback:', error);
        setStatus('❌ Errore nel processamento login');
      }
    };

    processAuth0Callback();
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h1>🔐 Processamento Login Auth0</h1>
      <p style={{ fontSize: "18px", margin: "20px 0" }}>{status}</p>
      
      {userInfo && (
        <div style={{ 
          background: "#f0f8ff", 
          padding: "15px", 
          borderRadius: "8px", 
          margin: "20px 0",
          textAlign: "left"
        }}>
          <h3>👤 Dati Utente Ricevuti:</h3>
          <p><strong>📧 Email:</strong> {userInfo.email}</p>
          <p><strong>👤 Nome:</strong> {userInfo.name}</p>
          <p><strong>🖼️ Foto:</strong> {userInfo.picture ? '✅' : '❌'}</p>
          <p><strong>🆔 Auth0 ID:</strong> {userInfo.sub}</p>
        </div>
      )}
      
      <div style={{ margin: "20px 0" }}>
        <div style={{ 
          width: "50px", 
          height: "50px", 
          border: "5px solid #f3f3f3",
          borderTop: "5px solid #3498db",
          borderRadius: "50%",
          animation: "spin 2s linear infinite",
          margin: "0 auto"
        }}></div>
      </div>
      
      <div style={{ 
        fontSize: "14px", 
        color: "#666", 
        marginTop: "20px" 
      }}>
        Verrai reindirizzato alla dashboard tra poco...
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
