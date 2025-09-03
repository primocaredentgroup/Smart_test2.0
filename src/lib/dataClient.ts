// Dati statici per UI frontend-only
export const staticData = {
  tests: [
    { 
      _id: "test-1", 
      name: "Test Sistema Login", 
      jiraLink: "https://jira.example.com/TEST-1", 
      status: "open", 
      creatorEmail: "simone@example.com",
      createdAt: "2024-01-15",
      macroareaIds: ["preventivi", "calendario"]
    },
    { 
      _id: "test-2", 
      name: "Test Creazione Preventivi", 
      jiraLink: "https://jira.example.com/TEST-2", 
      status: "in_progress", 
      creatorEmail: "marco@example.com",
      createdAt: "2024-01-14",
      macroareaIds: ["preventivi"]
    },
    { 
      _id: "test-3", 
      name: "Test Fatturazione Completa", 
      jiraLink: "https://jira.example.com/TEST-3", 
      status: "completed", 
      creatorEmail: "anna@example.com",
      createdAt: "2024-01-10",
      macroareaIds: ["fatturazione"]
    },
    { 
      _id: "test-4", 
      name: "Test Calendario Appuntamenti", 
      jiraLink: "", 
      status: "failed", 
      creatorEmail: "simone@example.com",
      createdAt: "2024-01-08",
      macroareaIds: ["calendario"]
    },
    { 
      _id: "test-5", 
      name: "Test Piano di Cura Nuovo", 
      jiraLink: "https://jira.example.com/TEST-5", 
      status: "completed", 
      creatorEmail: "simone@example.com",
      createdAt: "2024-01-12",
      macroareaIds: ["piani-cura"]
    },
    { 
      _id: "test-6", 
      name: "Test Consensi Digitali", 
      jiraLink: "https://jira.example.com/TEST-6", 
      status: "in_progress", 
      creatorEmail: "giulia@example.com",
      createdAt: "2024-01-13",
      macroareaIds: ["consensi"]
    },
    { 
      _id: "test-7", 
      name: "Test Integrazione Pagamenti", 
      jiraLink: "https://jira.example.com/TEST-7", 
      status: "failed", 
      creatorEmail: "marco@example.com",
      createdAt: "2024-01-11",
      macroareaIds: ["fatturazione"]
    },
    { 
      _id: "test-8", 
      name: "Test Backup Automatico", 
      jiraLink: "", 
      status: "completed", 
      creatorEmail: "giulia@example.com",
      createdAt: "2024-01-09",
      macroareaIds: ["sistema"]
    }
  ],
  
  macroareas: [
    { 
      _id: "preventivi", 
      name: "Preventivi", 
      standardTasks: [
        { id: "prev-1", title: "Creazione nuovo preventivo", description: "Verifica processo creazione preventivo completo" },
        { id: "prev-2", title: "Modifica preventivo esistente", description: "Test modifica dati preventivo" },
        { id: "prev-3", title: "Approvazione preventivo", description: "Workflow approvazione preventivo" },
        { id: "prev-4", title: "Invio preventivo al cliente", description: "Test invio email/PDF al cliente" }
      ]
    },
    { 
      _id: "fatturazione", 
      name: "Fatturazione", 
      standardTasks: [
        { id: "fatt-1", title: "Emissione fattura", description: "Creazione fattura da preventivo approvato" },
        { id: "fatt-2", title: "Verifica dati fiscali", description: "Controllo P.IVA e dati cliente" },
        { id: "fatt-3", title: "Invio fattura elettronica", description: "Test SDI e sistema fatturazione elettronica" }
      ]
    },
    { 
      _id: "calendario", 
      name: "Calendario", 
      standardTasks: [
        { id: "cal-1", title: "Prenotazione appuntamento", description: "Test booking nuovo appuntamento" },
        { id: "cal-2", title: "Modifica appuntamento", description: "Spostamento orario/data esistente" },
        { id: "cal-3", title: "Cancellazione appuntamento", description: "Rimozione appuntamento e notifiche" },
        { id: "cal-4", title: "Visualizzazione calendario", description: "Test viste giorno/settimana/mese" }
      ]
    },
    { 
      _id: "piani-cura", 
      name: "Piani di Cura", 
      standardTasks: [
        { id: "pc-1", title: "Creazione piano di cura", description: "Nuovo piano terapeutico paziente" },
        { id: "pc-2", title: "Modifica piano esistente", description: "Update trattamenti e tempistiche" }
      ]
    },
    { 
      _id: "consensi", 
      name: "Consensi", 
      standardTasks: [
        { id: "cons-1", title: "Firma consenso informato", description: "Test processo firma digitale" },
        { id: "cons-2", title: "Archiviazione consensi", description: "Salvataggio e recupero documenti" }
      ]
    }
  ],

  // Task specifici per ogni test
  testTasks: {
    "test-1": [
      { _id: "task-1-1", title: "Creazione nuovo preventivo", status: "done", notes: "Completato con successo", source: "macroarea" },
      { _id: "task-1-2", title: "Prenotazione appuntamento", status: "done", notes: "", source: "macroarea" },
      { _id: "task-1-3", title: "Test login utente", status: "todo", notes: "", source: "custom" },
      { _id: "task-1-4", title: "Verifica permessi", status: "todo", notes: "", source: "custom" }
    ],
    "test-2": [
      { _id: "task-2-1", title: "Creazione nuovo preventivo", status: "done", notes: "OK", source: "macroarea" },
      { _id: "task-2-2", title: "Modifica preventivo esistente", status: "in_progress", notes: "In corso di verifica", source: "macroarea" },
      { _id: "task-2-3", title: "Approvazione preventivo", status: "todo", notes: "", source: "macroarea" },
      { _id: "task-2-4", title: "Invio preventivo al cliente", status: "todo", notes: "", source: "macroarea" }
    ],
    "test-3": [
      { _id: "task-3-1", title: "Emissione fattura", status: "done", notes: "Fattura emessa correttamente", source: "macroarea" },
      { _id: "task-3-2", title: "Verifica dati fiscali", status: "done", notes: "Dati verificati", source: "macroarea" },
      { _id: "task-3-3", title: "Invio fattura elettronica", status: "done", notes: "SDI OK", source: "macroarea" }
    ],
    "test-4": [
      { _id: "task-4-1", title: "Prenotazione appuntamento", status: "failed", notes: "Errore nel salvataggio", source: "macroarea" },
      { _id: "task-4-2", title: "Visualizzazione calendario", status: "done", notes: "Vista funziona", source: "macroarea" },
      { _id: "task-4-3", title: "Test notifiche email", status: "skipped", notes: "Non implementato", source: "custom" }
    ]
  }
};


