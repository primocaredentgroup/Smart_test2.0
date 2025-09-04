import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Utenti del sistema
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("tester")),
    createdAt: v.number(),
    lastLogin: v.optional(v.number()),
  }).index("by_email", ["email"]),

  // Macroaree del sistema (sezioni logiche)
  macroareas: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    standardTasks: v.array(v.object({
      id: v.string(),
      title: v.string(),
      description: v.string(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.string(), // email dell'admin che l'ha creata
  }).index("by_name", ["name"]),

  // Test funzionali
  tests: defineTable({
    name: v.string(),
    jiraLink: v.optional(v.string()),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"), 
      v.literal("completed"),
      v.literal("failed")
    ),
    creatorEmail: v.string(),
    macroareaIds: v.array(v.id("macroareas")),
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_creator", ["creatorEmail"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),

  // Task specifici per ogni test
  testTasks: defineTable({
    testId: v.id("tests"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("done"),
      v.literal("rejected"),
      v.literal("failed"),
      v.literal("skipped")
    ),
    notes: v.optional(v.string()),
    source: v.union(
      v.literal("macroarea"), // Task ereditato da macroarea
      v.literal("custom")     // Task custom aggiunto dal tester
    ),
    sourceId: v.optional(v.string()), // ID del task nella macroarea (se source=macroarea)
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_test", ["testId"])
    .index("by_status", ["status"])
    .index("by_source", ["source"]),

  // Log delle modifiche (per audit trail)
  auditLogs: defineTable({
    entityType: v.union(
      v.literal("test"),
      v.literal("macroarea"), 
      v.literal("testTask")
    ),
    entityId: v.string(),
    action: v.union(
      v.literal("created"),
      v.literal("updated"),
      v.literal("deleted"),
      v.literal("status_changed")
    ),
    userEmail: v.string(),
    oldValue: v.optional(v.any()),
    newValue: v.optional(v.any()),
    timestamp: v.number(),
  })
    .index("by_entity", ["entityType", "entityId"])
    .index("by_user", ["userEmail"])
    .index("by_timestamp", ["timestamp"]),
});

