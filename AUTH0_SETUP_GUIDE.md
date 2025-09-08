# 🔐 Guida Setup Auth0 - Smart Test 2.0

**L'integrazione Auth0 è stata implementata secondo le best practice ufficiali. Ora serve completare la configurazione per il testing.**

---

## 🚀 **STEP 1: Configurazione Auth0 Dashboard**

### **1.1 Accedi al Dashboard**
1. Vai su [Auth0 Dashboard](https://manage.auth0.com/)
2. Seleziona il tuo account/tenant: `primogroup.eu.auth0.com`

### **1.2 Configura Applicazione**
1. **Applications** → Trova/Crea applicazione per Smart Test
2. **Settings** → Configura URLs:

```
Allowed Callback URLs:
http://localhost:3000/api/auth/callback

Allowed Logout URLs:
http://localhost:3000

Allowed Web Origins:
http://localhost:3000

Allowed Origins (CORS):
http://localhost:3000
```

### **1.3 Copia Credenziali**
Dalla sezione **Settings**, copia:
- **Domain**: `primogroup.eu.auth0.com` ✅ (già configurato)
- **Client ID**: `your_client_id_here`
- **Client Secret**: `your_client_secret_here`

---

## 🛠️ **STEP 2: Aggiorna Environment Variables**

### **2.1 Genera AUTH0_SECRET**
```bash
openssl rand -hex 32
```

### **2.2 Aggiorna .env.local**
Sostituisci i placeholder con i valori reali:

```env
# Auth0 Configuration 
AUTH0_CLIENT_ID=IL_TUO_CLIENT_ID_REALE
AUTH0_CLIENT_SECRET=IL_TUO_CLIENT_SECRET_REALE
AUTH0_ISSUER_BASE_URL=
https://primogroup.eu.auth0.com
AUTH0_BASE_URL=http://localhost:3000
AUTH0_SECRET=IL_SECRET_GENERATO_CON_OPENSSL
AUTH0_SCOPE=openid profile email

# Convex
NEXT_PUBLIC_CONVEX_URL=https://keen-shark-826.convex.cloud
NODE_ENV=development
```

---

## 🧪 **STEP 3: Test del Flusso**

### **3.1 Server Già Avviato**
✅ Il server è in funzione su `http://localhost:3000`

### **3.2 Test Flow Completo**
1. **Homepage**: `http://localhost:3000`
   - Dovrebbe mostrare pagina pubblica
   - Clicca "🔐 Accedi"

2. **Login Page**: `http://localhost:3000/login`
   - Clicca "🔐 Login con Auth0"
   - Dovrebbe redirectare ad Auth0

3. **Auth0 Login**: 
   - Inserisci credenziali
   - Completa autenticazione

4. **Callback**: `http://localhost:3000/api/auth/callback`
   - Gestito automaticamente
   - Redirect a `/dashboard`

5. **Dashboard**: `http://localhost:3000/dashboard`
   - Dovrebbe mostrare dati utente
   - Test connessione Convex

### **3.3 Verifica Console**
Nel terminale dovresti vedere:
```
🔐 Auth0 route: login
🔐 Auth0 route: callback
✅ Auth0 callback - redirecting to dashboard
```

---

## 🔧 **STEP 4: Test API Routes**

### **4.1 Test Login Route**
```bash
curl -I http://localhost:3000/api/auth/login
```
Dovrebbe restituire redirect 302 ad Auth0.

### **4.2 Test Logout Route** 
```bash
curl -I http://localhost:3000/api/auth/logout
```
Dovrebbe restituire redirect 302 ad Auth0 logout.

---

## 🐛 **TROUBLESHOOTING**

### **Errore: "Callback URL Mismatch"**
- Verifica che in Auth0 Dashboard sia configurato esattamente:
  `http://localhost:3000/api/auth/callback`

### **Errore: "Invalid Client"**
- Controlla che `AUTH0_CLIENT_ID` sia corretto
- Verifica che l'applicazione sia attiva in Auth0

### **Errore: "Access Denied"**
- Verifica `AUTH0_CLIENT_SECRET`
- Controlla che il domain sia corretto

### **Console Errors**
- Apri Developer Tools per errori JavaScript
- Controlla Network tab per failed requests

---

## 📋 **CHECKLIST COMPLETA**

- [ ] Auth0 Dashboard configurato
- [ ] Callback URLs impostati
- [ ] Environment variables aggiornati
- [ ] Server Next.js avviato
- [ ] Test login flow completo
- [ ] Dashboard accessibile dopo login
- [ ] Logout funzionante

---

## 🎯 **STATO ATTUALE**

✅ **Implementazione completa** secondo documentazione Auth0
✅ **Build successful** senza errori
✅ **Server running** su localhost:3000
⏳ **Environment variables** da aggiornare con valori reali
⏳ **Auth0 Dashboard** da configurare

**Una volta completati gli step sopra, il flusso Auth0 sarà completamente funzionante!** 🚀
