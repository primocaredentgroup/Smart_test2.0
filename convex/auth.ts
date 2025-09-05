import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query per ottenere utente per email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
    return user;
  },
});

// Mutation per creare nuovo utente
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.optional(v.union(v.literal("admin"), v.literal("tester"))),
    authProvider: v.optional(v.string()),
    authId: v.optional(v.string()),
  },
  handler: async (ctx, { email, name, role = "tester", authProvider = "custom", authId }) => {
    // Controlla se utente già exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingUser) {
      throw new Error("Utente con questa email già registrato");
    }

    // Crea nuovo utente
    const userId = await ctx.db.insert("users", {
      email,
      name,
      role,
      authProvider,
      authId,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    console.log(`✅ Nuovo utente creato: ${email} (${role})`);
    return userId;
  },
});

// Mutation per login (verifica credenziali)
export const loginUser = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, { email, password }) => {
    // Per ora usiamo utenti hardcoded
    // In futuro aggiungeremo hash delle password
    const VALID_USERS = [
      { email: "admin@smarttest.com", password: "admin123", role: "admin", name: "Admin" },
      { email: "simone@smarttest.com", password: "simone123", role: "tester", name: "Simone" },
      { email: "test@smarttest.com", password: "test123", role: "tester", name: "Tester" },
    ];

    const validUser = VALID_USERS.find(u => u.email === email && u.password === password);
    
    if (!validUser) {
      throw new Error("Credenziali non valide");
    }

    // Cerca o crea utente in database
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) {
      // Crea utente se non esiste
      const userId = await ctx.db.insert("users", {
        email: validUser.email,
        name: validUser.name,
        role: validUser.role as "admin" | "tester",
        authProvider: "custom",
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      user = await ctx.db.get(userId);
    }

    // Log login
    console.log(`🔐 Login: ${email} (${user?.role})`);

    return {
      id: user?._id,
      email: user?.email,
      name: user?.name,
      role: user?.role,
    };
  },
});

// Mutation per logout (log)
export const logoutUser = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    console.log(`🚪 Logout: ${email}`);
    return { success: true };
  },
});




