import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query per ottenere task di un test specifico
export const getTestTasks = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, { testId }) => {
    return await ctx.db
      .query("testTasks")
      .withIndex("by_test", (q) => q.eq("testId", testId))
      .order("asc")
      .collect();
  },
});

// Mutation per aggiornare status di un task
export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("testTasks"),
    status: v.union(
      v.literal("todo"),
      v.literal("done"),
      v.literal("rejected"),
      v.literal("failed"),
      v.literal("skipped")
    ),
    userEmail: v.string(),
  },
  handler: async (ctx, { taskId, status, userEmail }) => {
    const task = await ctx.db.get(taskId);
    if (!task) throw new Error("Task not found");
    
    const now = Date.now();
    const updates: any = {
      status,
      updatedAt: now,
    };
    
    if (status === "done") {
      updates.completedAt = now;
    }
    
    await ctx.db.patch(taskId, updates);
    
    // Log audit
    await ctx.db.insert("auditLogs", {
      entityType: "testTask",
      entityId: taskId,
      action: "status_changed",
      userEmail,
      oldValue: { status: task.status },
      newValue: { status },
      timestamp: now,
    });
    
    // Verifica se il test è completo (tutti i task done)
    const allTasks = await ctx.db
      .query("testTasks")
      .withIndex("by_test", (q) => q.eq("testId", task.testId))
      .collect();
    
    const allTasksDone = allTasks.every(t => 
      t._id === taskId ? status === "done" : t.status === "done"
    );
    
    if (allTasksDone) {
      // Aggiorna il test come completato
      await ctx.db.patch(task.testId, {
        status: "completed",
        completedAt: now,
        updatedAt: now,
      });
      
      // Log audit per il test
      await ctx.db.insert("auditLogs", {
        entityType: "test",
        entityId: task.testId,
        action: "status_changed",
        userEmail,
        oldValue: { status: "in_progress" },
        newValue: { status: "completed" },
        timestamp: now,
      });
    }
    
    return taskId;
  },
});

// Mutation per aggiornare note di un task
export const updateTaskNotes = mutation({
  args: {
    taskId: v.id("testTasks"),
    notes: v.string(),
    userEmail: v.string(),
  },
  handler: async (ctx, { taskId, notes, userEmail }) => {
    const task = await ctx.db.get(taskId);
    if (!task) throw new Error("Task not found");
    
    const now = Date.now();
    
    await ctx.db.patch(taskId, {
      notes,
      updatedAt: now,
    });
    
    // Log audit
    await ctx.db.insert("auditLogs", {
      entityType: "testTask",
      entityId: taskId,
      action: "updated",
      userEmail,
      oldValue: { notes: task.notes },
      newValue: { notes },
      timestamp: now,
    });
    
    return taskId;
  },
});

// Query per ottenere task per testId (alias per compatibilità)
export const getTasksByTestId = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, { testId }) => {
    return await ctx.db
      .query("testTasks")
      .withIndex("by_test", (q) => q.eq("testId", testId))
      .order("asc")
      .collect();
  },
});

// Mutation unificata per aggiornare task (status o notes)
export const updateTask = mutation({
  args: {
    taskId: v.id("testTasks"),
    status: v.optional(v.union(
      v.literal("todo"),
      v.literal("done"),
      v.literal("rejected"),
      v.literal("failed"),
      v.literal("skipped")
    )),
    notes: v.optional(v.string()),
    userEmail: v.optional(v.string()),
  },
  handler: async (ctx, { taskId, status, notes, userEmail }) => {
    const task = await ctx.db.get(taskId);
    if (!task) throw new Error("Task not found");
    
    const now = Date.now();
    const updates: any = { updatedAt: now };
    
    // Aggiorna status se fornito
    if (status !== undefined) {
      updates.status = status;
      if (status === "done") {
        updates.completedAt = now;
      }
    }
    
    // Aggiorna notes se fornite
    if (notes !== undefined) {
      updates.notes = notes;
    }
    
    await ctx.db.patch(taskId, updates);
    
    // Log audit se userEmail è fornita
    if (userEmail) {
      await ctx.db.insert("auditLogs", {
        entityType: "testTask",
        entityId: taskId,
        action: "updated",
        userEmail,
        oldValue: { status: task.status, notes: task.notes },
        newValue: { status, notes },
        timestamp: now,
      });
    }
    
    return taskId;
  },
});

// Mutation per aggiungere un task custom
export const addCustomTask = mutation({
  args: {
    testId: v.id("tests"),
    title: v.string(),
    description: v.optional(v.string()),
    userEmail: v.string(),
  },
  handler: async (ctx, { testId, title, description, userEmail }) => {
    const test = await ctx.db.get(testId);
    if (!test) throw new Error("Test not found");
    
    const now = Date.now();
    
    const taskId = await ctx.db.insert("testTasks", {
      testId,
      title,
      description,
      status: "todo",
      source: "custom",
      createdAt: now,
      updatedAt: now,
    });
    
    // Log audit
    await ctx.db.insert("auditLogs", {
      entityType: "testTask",
      entityId: taskId,
      action: "created",
      userEmail,
      newValue: { testId, title, description, source: "custom" },
      timestamp: now,
    });
    
    return taskId;
  },
});

// Mutation per eliminare un task custom
export const deleteCustomTask = mutation({
  args: {
    taskId: v.id("testTasks"),
    userEmail: v.string(),
  },
  handler: async (ctx, { taskId, userEmail }) => {
    const task = await ctx.db.get(taskId);
    if (!task) throw new Error("Task not found");
    
    // Solo i task custom possono essere eliminati
    if (task.source !== "custom") {
      throw new Error("Only custom tasks can be deleted");
    }
    
    await ctx.db.delete(taskId);
    
    // Log audit
    const now = Date.now();
    await ctx.db.insert("auditLogs", {
      entityType: "testTask",
      entityId: taskId,
      action: "deleted",
      userEmail,
      oldValue: task,
      timestamp: now,
    });
    
    return taskId;
  },
});

// Query per statistiche task
export const getTaskStats = query({
  args: {},
  handler: async (ctx) => {
    const allTasks = await ctx.db.query("testTasks").collect();
    
    const stats = {
      total: allTasks.length,
      byStatus: {
        todo: allTasks.filter(t => t.status === "todo").length,
        done: allTasks.filter(t => t.status === "done").length,
        rejected: allTasks.filter(t => t.status === "rejected").length,
        failed: allTasks.filter(t => t.status === "failed").length,
        skipped: allTasks.filter(t => t.status === "skipped").length,
      },
      bySource: {
        macroarea: allTasks.filter(t => t.source === "macroarea").length,
        custom: allTasks.filter(t => t.source === "custom").length,
      },
    };
    
    return stats;
  },
});
