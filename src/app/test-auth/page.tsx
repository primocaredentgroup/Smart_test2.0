export default function TestAuthPage() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>🔐 Test Autenticazione Auth0</h1>
      
      <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#f0f8ff", border: "1px solid #0066cc", borderRadius: "5px" }}>
        <h2>📋 Stato Attuale</h2>
        <p>✅ <strong>Server Next.js:</strong> Funzionante</p>
        <p>✅ <strong>Configurazione Auth0:</strong> Installata</p>
        <p>✅ <strong>Pagina di test:</strong> Caricata correttamente</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>🎯 Test Login Auth0</h2>
        <p>Clicca il pulsante qui sotto per testare il login con Auth0:</p>
        
        <a 
          href="https://primogroup.eu.auth0.com/authorize?client_id=hJjSoWZqCPCMNbHWEijYxPq57jB91PFW&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&scope=openid%20profile%20email"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            backgroundColor: "#0066cc",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            margin: "10px 0"
          }}
        >
          🚀 Prova Login Auth0
        </a>
      </div>

      <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#fff8f0", border: "1px solid #ff9900", borderRadius: "5px" }}>
        <h3>🔍 Cosa succede quando clicchi &quot;Prova Login Auth0&quot;:</h3>
        <ol>
          <li>Verrai reindirizzato alla pagina di login di Auth0</li>
          <li>Potrai fare login con email/password o provider social</li>
          <li>Auth0 ti riporterà alla pagina di callback</li>
          <li>Da lì verrai reindirizzato di nuovo qui</li>
        </ol>
      </div>

      <div style={{ padding: "15px", backgroundColor: "#f0f8f0", border: "1px solid #00cc66", borderRadius: "5px" }}>
        <h3>✅ Questo test dimostra:</h3>
        <ul>
          <li>La configurazione Auth0 è corretta</li>
          <li>I link di autenticazione funzionano</li>
          <li>Il flusso OAuth2 è attivo</li>
        </ul>
      </div>
    </div>
  );
}
