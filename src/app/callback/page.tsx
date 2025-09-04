export default function CallbackPage() {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>🔄 Processing...</h1>
      <p>Ti stiamo reindirizzando dopo il login...</p>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Semplice redirect alla home dopo il callback
            setTimeout(() => {
              window.location.href = '/test-auth';
            }, 2000);
          `
        }}
      />
    </div>
  );
}
