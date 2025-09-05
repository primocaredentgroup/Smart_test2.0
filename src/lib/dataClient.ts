// ⚠️ NESSUN DATO MOCK - Solo dati reali da Convex
export const staticData = {
  tests: [],
  
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

  // ⚠️ NESSUN TASK MOCK - Solo task reali da Convex
  testTasks: {}
};


