import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query per ottenere tutti gli utenti
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users")
      .order("asc")
      .collect();
  },
});

// Query per ottenere un utente per email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});

// Mutation per creare o aggiornare un utente
export const upsertUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("tester")),
  },
  handler: async (ctx, { email, name, role }) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    
    const now = Date.now();
    
    if (existing) {
      // Aggiorna utente esistente
      await ctx.db.patch(existing._id, {
        name,
        role,
        lastLogin: now,
      });
      return existing._id;
    } else {
      // Crea nuovo utente
      const userId = await ctx.db.insert("users", {
        email,
        name,
        role,
        createdAt: now,
        lastLogin: now,
      });
      return userId;
    }
  },
});

// Query per statistiche utenti
export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const tests = await ctx.db.query("tests").collect();
    
    const userStats = users.map(user => {
      const userTests = tests.filter(t => t.creatorEmail === user.email);
      const completedTests = userTests.filter(t => t.status === "completed");
      const activeTests = userTests.filter(t => 
        t.status === "open" || t.status === "in_progress"
      );
      
      return {
        user,
        totalTests: userTests.length,
        completedTests: completedTests.length,
        activeTests: activeTests.length,
        completionRate: userTests.length > 0 
          ? Math.round((completedTests.length / userTests.length) * 100) 
          : 0,
      };
    });
    
    return userStats.sort((a, b) => b.completedTests - a.completedTests);
  },
});

// Mutation per aggiornare ruolo utente (solo admin)
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    newRole: v.union(v.literal("admin"), v.literal("tester")),
    updatedBy: v.string(),
  },
  handler: async (ctx, { userId, newRole, updatedBy }) => {
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    
    const updater = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", updatedBy))
      .first();
    
    if (!updater || updater.role !== "admin") {
      throw new Error("Only admins can update user roles");
    }
    
    await ctx.db.patch(userId, { role: newRole });
    
    // Log audit
    const now = Date.now();
    await ctx.db.insert("auditLogs", {
      entityType: "test", // Non abbiamo entityType per users, usiamo test
      entityId: userId,
      action: "updated",
      userEmail: updatedBy,
      oldValue: { role: user.role },
      newValue: { role: newRole },
      timestamp: now,
    });
    
    return userId;
  },
});


