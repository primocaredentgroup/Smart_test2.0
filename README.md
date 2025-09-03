# 🧪 Smart Test 2.0

Sistema moderno per la gestione dei test funzionali del software interno, progettato per garantire qualità e prevenire regressioni.

## ✨ Features Principali

### 🎯 Dashboard Role-Based
- **👑 Admin Dashboard**: Overview del team, ranking tester, analytics, gestione macroaree
- **👨‍💻 Tester Dashboard**: Statistiche personali, progress tracking, quick actions

### 📋 Gestione Test Completa
- Creazione test con selezione macroaree
- Task checklist con stati (Da testare, Done, Failed, Rejected, Saltato)
- Task custom aggiuntivi per ogni test
- Link Jira integrati
- Storico completo delle attività

### 🏗️ Sistema Macroaree
- Gestione sezioni logiche del sistema (Preventivi, Calendario, Fatturazione, etc.)
- Task standard configurabili per ogni macroarea
- Sistema di ereditarietà task
- Log delle modifiche (planned)

### 🎨 UI/UX Moderna
- Design glassmorphism con gradienti
- Responsive design (mobile-first)
- Dark mode support
- Animazioni fluide e hover effects
- Iconografia professionale con Radix UI

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - App Router, TypeScript
- **Tailwind CSS** - Styling moderno e responsive
- **Radix UI** - Componenti accessibili e icone
- **React Hook Form** - Gestione form avanzata
- **Zod** - Validazione schema (planned)

### Backend (Planned)
- **Convex** - Database e API real-time
- **Auth0** - Autenticazione e gestione ruoli

### Development
- **Mock Data System** - Sviluppo frontend-only
- **Role Context** - Simulazione ruoli Admin/Tester
- **Hot Reload** - Development experience ottimizzata

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

# Copia configurazione
cp .env.local.example .env.local

# Avvia development server
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

### 🔧 Environment Variables

Crea `.env.local` con:

```bash
# Convex (quando integrato)
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud

# Auth0 (quando integrato)
AUTH0_SECRET=your-auth0-secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# Development flags
NEXT_PUBLIC_AUTH0_DISABLED=true
```

## 📱 Utilizzo

### Role Switching (Development)
- Usa il **Role Switcher** in alto a destra per cambiare tra Admin e Tester
- Ogni ruolo mostra dashboard e funzionalità diverse

### Flusso Test
1. **Creazione**: Seleziona macroaree → task automatici + custom
2. **Esecuzione**: Completa checklist con stati e note
3. **Finalizzazione**: Tutti task "Done" = test approvato

### Gestione Admin
- **Macroaree**: CRUD completo con task standard
- **Analytics**: Performance team, alert test critici
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
*Ensuring software quality for better dental care*