"use client";
import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

type Role = "admin" | "tester";

type RoleContextType = {
  role: Role;
  isAdmin: boolean;
  isTester: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  
  // Usa il ruolo REALE dall'utente autenticato, fallback a "tester"
  const role: Role = (user?.ruolo as Role) || "tester";
  
  const value = {
    role,
    isAdmin: role === "admin",
    isTester: role === "tester",
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
