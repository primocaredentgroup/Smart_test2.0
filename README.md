# 🧪 Smart Test 2.0

Sistema moderno per la gestione dei test funzionali del software interno con autenticazione Auth0 e database Convex in production.

## ✨ Features Implementate

### 🔐 Autenticazione Completa
- **OAuth Flow** con Auth0 custom implementation
- **Login/Logout** sicuro con session management
- **Role-based access** (Admin/Tester) 
- **Session persistence** con cookie httpOnly

### 🎯 Dashboard Role-Based
- **👑 Admin Dashboard**: Overview del team, gestione macroaree, analytics
- **👨‍💻 Tester Dashboard**: Statistiche personali, progress tracking
- **Sidebar intelligente** con logout e info utente

### 📋 Gestione Test Completa
- Creazione test con selezione macroaree
- Task checklist con stati (Da testare, Done, Failed, Rejected, Saltato)
- Task custom aggiuntivi per ogni test
- Link Jira integrati
- Storico completo delle attività

### 🗄️ Database Production
- **Convex Production** deployment con dati migrati
- **Real-time sync** tra client e database
- **61 documenti** migrati da dev a prod (macroaree, test, utenti, tasks, audit logs)

## 🚀 Tech Stack

### Frontend
- **Next.js 15.5.2** - App Router, TypeScript
- **Tailwind CSS** - Styling moderno e responsive  
- **Radix UI** - Componenti accessibili e icone
- **Custom Auth Context** - Gestione stato utente

### Backend & Auth
- **Auth0** - Autenticazione OAuth con implementation custom
- **Convex** - Database real-time in production
- **Secure Cookies** - Session management con httpOnly cookies

### Deployment
- **Vercel** - Hosting con environment variables configurate
- **Production Ready** - Build ottimizzato e sicuro

## 🏃‍♂️ Quick Start

### Prerequisiti
- Node.js 18+
- npm o yarn

### Installazione
```bash
# Clone repository
git clone https://github.com/primocaredentgroup/Smart_test2.0.git
cd Smart_test2.0

# Installa dipendenze
npm install

# Configura environment variables (vedi sotto)
# Avvia development server
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

### 🔧 Environment Variables

Crea `.env.local` con:

```bash
# Auth0 Configuration (COMPLETA - PRODUZIONE READY)
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret  
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_BASE_URL=http://localhost:3000  # Production: https://your-app.vercel.app
AUTH0_SECRET=your_generated_secret

# Client-side variables (CRITICHE per Vercel)
NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your_client_id

# Convex Production
NEXT_PUBLIC_CONVEX_URL=https://keen-shark-826.convex.cloud
CONVEX_DEPLOYMENT=dev:limitless-hare-84
```

### 🚀 Production Deployment

#### Vercel Environment Variables
Configura nel dashboard Vercel:
- Tutte le variabili `AUTH0_*` 
- `NEXT_PUBLIC_CONVEX_URL=https://keen-shark-826.convex.cloud`
- `AUTH0_BASE_URL=https://your-app.vercel.app`

#### Auth0 Dashboard
- **Callback URLs**: `https://your-app.vercel.app/api/auth/callback`
- **Logout URLs**: `https://your-app.vercel.app`
- **Web Origins**: `https://your-app.vercel.app`

## 📱 Utilizzo

### 🔐 Autenticazione
1. **Login**: Vai su `/login` e clicca "Login con Auth0"
2. **Dashboard**: Dopo login, accesso automatico al dashboard role-based
3. **Logout**: Clicca "Logout" nella sidebar o nell'header

### 👑 Gestione Ruoli
- **Admin**: Email configurate in `adminEmails` array (s.petretto@primogroup.it)
- **Tester**: Tutti gli altri utenti
- **Riconoscimento automatico** basato su email di login

### 🎯 Flusso Test
1. **Creazione**: Seleziona macroaree → task automatici + custom
2. **Esecuzione**: Completa checklist con stati e note
3. **Finalizzazione**: Tutti task "Done" = test approvato

### 🛠️ Gestione Admin
- **Macroaree**: CRUD completo con task standard
- **Analytics**: Performance team, alert test critici  
- **Utenti**: Gestione team e permessi
- **Overview**: Monitoring generale sistema

## 🏗️ Architettura

### Struttura Cartelle
```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Grouped route per dashboard
│   ├── tests/             # Gestione test
│   ├── admin/             # Pannello amministrazione
│   └── layout.tsx         # Layout globale
├── components/            # Componenti riutilizzabili
│   ├── *Dashboard.tsx     # Dashboard specifiche per ruolo
│   ├── *Form.tsx          # Form components
│   └── ui/                # UI components base
├── contexts/              # React Contexts
│   └── RoleContext.tsx    # Gestione ruoli development
├── lib/                   # Utilities e configurazioni
│   ├── dataClient.ts      # Mock data per development
│   ├── convexActions.ts   # Server actions (planned)
│   └── utils.ts           # Utility functions
└── styles/                # Global styles
```

### Componenti Chiave
- **Sidebar**: Navigazione principale role-based
- **RoleSwitcher**: Development tool per cambio ruoli
- **TestChecklist**: Gestione task con stati
- **MacroareaManager**: CRUD macroaree (admin only)
- **StatusBadge**: Visualizzazione stati test

## 🧪 Mock Data System

Per lo sviluppo frontend-only, il sistema utilizza dati statici in `src/lib/dataClient.ts`:

- **8 test di esempio** con vari stati
- **5 macroaree** con task standard
- **Simulazione utenti** multipli
- **Task mapping** completo

## 🎨 Design System

### Colori
- **Primary**: Blue (500-600)
- **Success**: Emerald (500-600)  
- **Warning**: Amber (500-600)
- **Error**: Red (500-600)
- **Purple**: Admin features
- **Gradienti**: Modern UI accents

### Componenti UI
- **Cards**: Rounded-2xl con shadow-lg
- **Buttons**: Gradient backgrounds con hover effects
- **Forms**: Modern inputs con focus states
- **Icons**: Radix UI icon system

## 🔄 Stato Progetto

### ✅ Completato
- [x] Frontend completo con UI moderna
- [x] Dashboard role-based funzionanti
- [x] Sistema gestione test end-to-end
- [x] Mock data system per development
- [x] Responsive design + dark mode
- [x] Navigazione e routing completi

### 🚧 In Pianificazione
- [ ] Integrazione Convex (database real-time)
- [ ] Integrazione Auth0 (autenticazione)
- [ ] Sistema notifiche email
- [ ] Advanced analytics e reporting
- [ ] Unit testing con Jest/RTL
- [ ] E2E testing con Playwright

## 🚀 Deployment

### Sviluppo
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint check
```

### Produzione (Planned)
- **Vercel**: Deployment automatico da GitHub
- **Environment**: Production variables setup
- **Monitoring**: Error tracking e analytics

## 👥 Team & Contributi

**PrimoCare Dental Group** - Sistema interno per quality assurance

### Ruoli Sistema
- **Admin**: Gestione completa sistema e team
- **Tester**: Creazione ed esecuzione test
- **Owner**: Supervisione e reporting (planned)

## 📞 Support

Per problemi o feature request:
1. Crea issue su GitHub
2. Contatta il team development
3. Consulta la documentazione Convex/Auth0

---

**🏥 Powered by PrimoCare Dental Group**  
*Ensuring software quality for better dental care*# Force redeploy Fri Sep  5 17:17:20 CEST 2025
