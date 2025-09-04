import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query per ottenere tutti i test
export const listTests = query({
  args: {},
  handler: async (ctx) => {
    const tests = await ctx.db.query("tests")
      .order("desc")
      .collect();
    
    // Per ogni test, ottieni anche le macroaree associate
    const testsWithDetails = await Promise.all(
      tests.map(async (test) => {
        const macroareas = await Promise.all(
          test.macroareaIds.map(id => ctx.db.get(id))
        );
        
        return {
          ...test,
          macroareas: macroareas.filter(Boolean), // Rimuovi null/undefined
        };
      })
    );
    
    return testsWithDetails;
  },
});

// Query per ottenere un test specifico con i suoi task
export const getTestWithTasks = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, { testId }) => {
    const test = await ctx.db.get(testId);
    if (!test) return null;
    
    const tasks = await ctx.db
      .query("testTasks")
      .withIndex("by_test", (q) => q.eq("testId", testId))
      .order("asc")
      .collect();
    
    const macroareas = await Promise.all(
      test.macroareaIds.map(id => ctx.db.get(id))
    );
    
    return {
      test: {
        ...test,
        macroareas: macroareas.filter(Boolean),
      },
      tasks,
    };
  },
});

// Query per ottenere un singolo test
export const getTestById = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, { testId }) => {
    const test = await ctx.db.get(testId);
    return test;
  },
});

// Query per ottenere test per utente
export const getTestsByUser = query({
  args: { userEmail: v.string() },
  handler: async (ctx, { userEmail }) => {
    const tests = await ctx.db
      .query("tests")
      .withIndex("by_creator", (q) => q.eq("creatorEmail", userEmail))
      .order("desc")
      .collect();
    
    return tests;
  },
});

// Mutation per creare un nuovo test
export const createTest = mutation({
  args: {
    name: v.string(),
    jiraLink: v.optional(v.string()),
    creatorEmail: v.string(),
    macroareaIds: v.array(v.id("macroareas")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Crea il test
    const testId = await ctx.db.insert("tests", {
      name: args.name,
      jiraLink: args.jiraLink,
      status: "open",
      creatorEmail: args.creatorEmail,
      macroareaIds: args.macroareaIds,
      createdAt: now,
      updatedAt: now,
    });
    
    // Ottieni i task standard dalle macroaree selezionate
    const macroareas = await Promise.all(
      args.macroareaIds.map(id => ctx.db.get(id))
    );
    
    // Crea i task standard per il test
    const taskPromises = macroareas.map(async (macroarea) => {
      if (!macroarea) return;
      
      const taskInserts = macroarea.standardTasks.map(standardTask => 
        ctx.db.insert("testTasks", {
          testId,
          title: standardTask.title,
          description: standardTask.description,
          status: "todo",
          source: "macroarea",
          sourceId: standardTask.id,
          createdAt: now,
          updatedAt: now,
        })
      );
      
      return Promise.all(taskInserts);
    });
    
    await Promise.all(taskPromises);
    
    // Log audit
    await ctx.db.insert("auditLogs", {
      entityType: "test",
      entityId: testId,
      action: "created",
      userEmail: args.creatorEmail,
      newValue: args,
      timestamp: now,
    });
    
    return testId;
  },
});

// Mutation per aggiornare status test
export const updateTestStatus = mutation({
  args: {
    testId: v.id("tests"),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("failed")
    ),
    userEmail: v.string(),
  },
  handler: async (ctx, { testId, status, userEmail }) => {
    const test = await ctx.db.get(testId);
    if (!test) throw new Error("Test not found");
    
    const now = Date.now();
    const updates: any = {
      status,
      updatedAt: now,
    };
    
    if (status === "completed") {
      updates.completedAt = now;
    }
    
    await ctx.db.patch(testId, updates);
    
    // Log audit
    await ctx.db.insert("auditLogs", {
      entityType: "test",
      entityId: testId,
      action: "status_changed",
      userEmail,
      oldValue: { status: test.status },
      newValue: { status },
      timestamp: now,
    });
    
    return testId;
  },
});
