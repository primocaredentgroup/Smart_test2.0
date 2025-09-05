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
    
    // ⚠️ NESSUN UTENTE MOCK - Solo utenti reali da Auth0
    console.log("👥 Skipping user creation - only real Auth0 users allowed");
    
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
        createdBy: "s.petretto@primogroup.it", // Real Admin user
      });
      macroareaIds[macroareaData.name] = macroareaId;
    }
    
    // ⚠️ NESSUN TEST MOCK - Database pulito per test reali
    console.log("🧪 Skipping test creation - clean database for real tests");
    
    console.log("✅ Database seeded successfully!");
    
    return {
      message: "Database seeded - only real macroareas, no mock data",
      users: 0, // No mock users
      macroareas: macroareasData.length,
      tests: 0, // No mock tests
    };
  },
});

