import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Script per popolare il database con dati di test
export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Prima cancella eventuali dati esistenti (solo in development)
    console.log("🗑️ Cleaning existing data...");
    
    // Cancella in ordine per rispettare le foreign keys
    const existingTasks = await ctx.db.query("testTasks").collect();
    for (const task of existingTasks) {
      await ctx.db.delete(task._id);
    }
    
    const existingTests = await ctx.db.query("tests").collect();
    for (const test of existingTests) {
      await ctx.db.delete(test._id);
    }
    
    const existingMacroareas = await ctx.db.query("macroareas").collect();
    for (const macroarea of existingMacroareas) {
      await ctx.db.delete(macroarea._id);
    }
    
    const existingUsers = await ctx.db.query("users").collect();
    for (const user of existingUsers) {
      await ctx.db.delete(user._id);
    }
    
    const existingLogs = await ctx.db.query("auditLogs").collect();
    for (const log of existingLogs) {
      await ctx.db.delete(log._id);
    }
    
    console.log("✅ Existing data cleaned");
    
    // Crea utenti
    console.log("👥 Creating users...");
    const users = [
      { email: "simone@example.com", name: "Simone Petretto", role: "tester" as const },
      { email: "marco@example.com", name: "Marco Rossi", role: "tester" as const },
      { email: "anna@example.com", name: "Anna Bianchi", role: "admin" as const },
      { email: "giulia@example.com", name: "Giulia Verdi", role: "tester" as const },
    ];
    
    const userIds: Record<string, any> = {};
    for (const user of users) {
      const userId = await ctx.db.insert("users", {
        ...user,
        createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000, // Random last 30 days
        lastLogin: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000, // Random last 7 days
      });
      userIds[user.email] = userId;
    }
    
    // Crea macroaree
    console.log("🏗️ Creating macroareas...");
    const macroareasData = [
      {
        name: "Preventivi",
        description: "Gestione preventivi e offerte per i pazienti",
        standardTasks: [
          { id: "prev-1", title: "Creazione nuovo preventivo", description: "Verifica processo creazione preventivo completo" },
          { id: "prev-2", title: "Modifica preventivo esistente", description: "Test modifica dati preventivo" },
          { id: "prev-3", title: "Approvazione preventivo", description: "Workflow approvazione preventivo" },
          { id: "prev-4", title: "Invio preventivo al cliente", description: "Test invio email/PDF al cliente" }
        ]
      },
      {
        name: "Fatturazione",
        description: "Sistema di fatturazione elettronica e gestione pagamenti",
        standardTasks: [
          { id: "fatt-1", title: "Emissione fattura", description: "Creazione fattura da preventivo approvato" },
          { id: "fatt-2", title: "Verifica dati fiscali", description: "Controllo P.IVA e dati cliente" },
          { id: "fatt-3", title: "Invio fattura elettronica", description: "Test SDI e sistema fatturazione elettronica" }
        ]
      },
      {
        name: "Calendario",
        description: "Gestione appuntamenti e calendario studio",
        standardTasks: [
          { id: "cal-1", title: "Prenotazione appuntamento", description: "Test booking nuovo appuntamento" },
          { id: "cal-2", title: "Modifica appuntamento", description: "Spostamento orario/data esistente" },
          { id: "cal-3", title: "Cancellazione appuntamento", description: "Rimozione appuntamento e notifiche" },
          { id: "cal-4", title: "Visualizzazione calendario", description: "Test viste giorno/settimana/mese" }
        ]
      },
      {
        name: "Piani di Cura",
        description: "Gestione piani terapeutici per i pazienti",
        standardTasks: [
          { id: "pc-1", title: "Creazione piano di cura", description: "Nuovo piano terapeutico paziente" },
          { id: "pc-2", title: "Modifica piano esistente", description: "Update trattamenti e tempistiche" }
        ]
      },
      {
        name: "Consensi",
        description: "Gestione consensi informati digitali",
        standardTasks: [
          { id: "cons-1", title: "Firma consenso informato", description: "Test processo firma digitale" },
          { id: "cons-2", title: "Archiviazione consensi", description: "Salvataggio e recupero documenti" }
        ]
      }
    ];
    
    const macroareaIds: Record<string, any> = {};
    for (const macroareaData of macroareasData) {
      const macroareaId = await ctx.db.insert("macroareas", {
        ...macroareaData,
        createdAt: Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000, // Random last 60 days
        updatedAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000, // Random last 30 days
        createdBy: "anna@example.com", // Admin
      });
      macroareaIds[macroareaData.name] = macroareaId;
    }
    
    // Crea test
    console.log("🧪 Creating tests...");
    const testsData = [
      {
        name: "Test Sistema Login",
        jiraLink: "https://jira.example.com/TEST-1",
        status: "open" as const,
        creatorEmail: "simone@example.com",
        macroareaNames: ["Preventivi", "Calendario"]
      },
      {
        name: "Test Creazione Preventivi",
        jiraLink: "https://jira.example.com/TEST-2",
        status: "in_progress" as const,
        creatorEmail: "marco@example.com",
        macroareaNames: ["Preventivi"]
      },
      {
        name: "Test Fatturazione Completa",
        jiraLink: "https://jira.example.com/TEST-3",
        status: "completed" as const,
        creatorEmail: "anna@example.com",
        macroareaNames: ["Fatturazione"]
      },
      {
        name: "Test Calendario Appuntamenti",
        jiraLink: "",
        status: "failed" as const,
        creatorEmail: "simone@example.com",
        macroareaNames: ["Calendario"]
      },
      {
        name: "Test Piano di Cura Nuovo",
        jiraLink: "https://jira.example.com/TEST-5",
        status: "completed" as const,
        creatorEmail: "simone@example.com",
        macroareaNames: ["Piani di Cura"]
      },
      {
        name: "Test Consensi Digitali",
        jiraLink: "https://jira.example.com/TEST-6",
        status: "in_progress" as const,
        creatorEmail: "giulia@example.com",
        macroareaNames: ["Consensi"]
      },
      {
        name: "Test Integrazione Pagamenti",
        jiraLink: "https://jira.example.com/TEST-7",
        status: "failed" as const,
        creatorEmail: "marco@example.com",
        macroareaNames: ["Fatturazione"]
      },
      {
        name: "Test Backup Automatico",
        jiraLink: "",
        status: "completed" as const,
        creatorEmail: "giulia@example.com",
        macroareaNames: ["Preventivi", "Fatturazione"]
      }
    ];
    
    for (const testData of testsData) {
      const selectedMacroareaIds = testData.macroareaNames.map(name => macroareaIds[name]);
      const createdAt = Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000; // Random last 14 days
      
      const testId = await ctx.db.insert("tests", {
        name: testData.name,
        jiraLink: testData.jiraLink || undefined,
        status: testData.status,
        creatorEmail: testData.creatorEmail,
        macroareaIds: selectedMacroareaIds,
        createdAt,
        updatedAt: createdAt + Math.random() * 24 * 60 * 60 * 1000, // Updated within 24h after creation
        completedAt: testData.status === "completed" 
          ? createdAt + Math.random() * 7 * 24 * 60 * 60 * 1000 
          : undefined,
      });
      
      // Crea task per il test
      const macroareas = await Promise.all(selectedMacroareaIds.map(id => ctx.db.get(id)));
      
      for (const macroarea of macroareas) {
        if (!macroarea) continue;
        
        for (const standardTask of macroarea.standardTasks) {
          const taskStatus = testData.status === "completed" ? "done" :
                           testData.status === "failed" ? "failed" :
                           testData.status === "in_progress" ? 
                             (Math.random() > 0.5 ? "done" : "todo") : "todo";
          
          await ctx.db.insert("testTasks", {
            testId,
            title: standardTask.title,
            description: standardTask.description,
            status: taskStatus,
            notes: taskStatus === "done" ? "Completato con successo" : 
                   taskStatus === "failed" ? "Errore durante il test" : "",
            source: "macroarea",
            sourceId: standardTask.id,
            createdAt,
            updatedAt: createdAt + Math.random() * 24 * 60 * 60 * 1000,
            completedAt: taskStatus === "done" 
              ? createdAt + Math.random() * 7 * 24 * 60 * 60 * 1000 
              : undefined,
          });
        }
      }
      
      // Aggiungi alcuni task custom casuali
      if (Math.random() > 0.6) {
        await ctx.db.insert("testTasks", {
          testId,
          title: "Test configurazione speciale",
          description: "Verifica configurazione custom per questo test",
          status: Math.random() > 0.5 ? "done" : "todo",
          notes: "Task custom aggiunto dal tester",
          source: "custom",
          createdAt: createdAt + 60 * 60 * 1000, // 1 hour after test creation
          updatedAt: createdAt + 2 * 60 * 60 * 1000,
        });
      }
    }
    
    console.log("✅ Database seeded successfully!");
    
    return {
      message: "Database seeded successfully",
      users: users.length,
      macroareas: macroareasData.length,
      tests: testsData.length,
    };
  },
});

