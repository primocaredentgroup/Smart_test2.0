import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query per ottenere tutte le macroaree
export const listMacroareas = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("macroareas")
      .order("asc")
      .collect();
  },
});

// Query per ottenere una macroarea specifica
export const getMacroarea = query({
  args: { macroareaId: v.id("macroareas") },
  handler: async (ctx, { macroareaId }) => {
    return await ctx.db.get(macroareaId);
  },
});

// Mutation per creare una nuova macroarea
export const createMacroarea = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    standardTasks: v.array(v.object({
      id: v.string(),
      title: v.string(),
      description: v.string(),
    })),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Verifica che non esista già una macroarea con lo stesso nome
    const existing = await ctx.db
      .query("macroareas")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
    
    if (existing) {
      throw new Error(`Macroarea with name "${args.name}" already exists`);
    }
    
    const macroareaId = await ctx.db.insert("macroareas", {
      name: args.name,
      description: args.description,
      standardTasks: args.standardTasks,
      createdAt: now,
      updatedAt: now,
      createdBy: args.createdBy,
    });
    
    // Log audit
    await ctx.db.insert("auditLogs", {
      entityType: "macroarea",
      entityId: macroareaId,
      action: "created",
      userEmail: args.createdBy,
      newValue: args,
      timestamp: now,
    });
    
    return macroareaId;
  },
});

// Mutation per aggiornare una macroarea
export const updateMacroarea = mutation({
  args: {
    macroareaId: v.id("macroareas"),
    name: v.string(),
    description: v.optional(v.string()),
    standardTasks: v.array(v.object({
      id: v.string(),
      title: v.string(),
      description: v.string(),
    })),
    updatedBy: v.string(),
  },
  handler: async (ctx, { macroareaId, updatedBy, ...updates }) => {
    const existing = await ctx.db.get(macroareaId);
    if (!existing) {
      throw new Error("Macroarea not found");
    }
    
    const now = Date.now();
    
    await ctx.db.patch(macroareaId, {
      ...updates,
      updatedAt: now,
    });
    
    // Log audit
    await ctx.db.insert("auditLogs", {
      entityType: "macroarea",
      entityId: macroareaId,
      action: "updated",
      userEmail: updatedBy,
      oldValue: existing,
      newValue: { ...existing, ...updates },
      timestamp: now,
    });
    
    return macroareaId;
  },
});

// Mutation per eliminare una macroarea
export const deleteMacroarea = mutation({
  args: {
    macroareaId: v.id("macroareas"),
    deletedBy: v.string(),
  },
  handler: async (ctx, { macroareaId, deletedBy }) => {
    const existing = await ctx.db.get(macroareaId);
    if (!existing) {
      throw new Error("Macroarea not found");
    }
    
    // Verifica che non ci siano test che usano questa macroarea
    const testsUsingMacroarea = await ctx.db
      .query("tests")
      .filter((q) => q.field("macroareaIds").contains(macroareaId))
      .collect();
    
    if (testsUsingMacroarea.length > 0) {
      throw new Error(`Cannot delete macroarea: ${testsUsingMacroarea.length} tests are using it`);
    }
    
    await ctx.db.delete(macroareaId);
    
    // Log audit
    const now = Date.now();
    await ctx.db.insert("auditLogs", {
      entityType: "macroarea",
      entityId: macroareaId,
      action: "deleted",
      userEmail: deletedBy,
      oldValue: existing,
      timestamp: now,
    });
    
    return macroareaId;
  },
});

// Query per ottenere statistiche macroaree
export const getMacroareaStats = query({
  args: {},
  handler: async (ctx) => {
    const macroareas = await ctx.db.query("macroareas").collect();
    
    const stats = await Promise.all(
      macroareas.map(async (macroarea) => {
        // Conta i test che usano questa macroarea
        const testsCount = await ctx.db
          .query("tests")
          .filter((q) => q.field("macroareaIds").contains(macroarea._id))
          .collect();
        
        return {
          macroarea,
          testsCount: testsCount.length,
          tasksCount: macroarea.standardTasks.length,
        };
      })
    );
    
    return stats;
  },
});

