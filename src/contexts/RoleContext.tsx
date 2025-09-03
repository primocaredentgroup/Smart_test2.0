"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Role = "admin" | "tester";

type RoleContextType = {
  role: Role;
  setRole: (role: Role) => void;
  isAdmin: boolean;
  isTester: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("tester"); // Default tester in sviluppo
  
  const value = {
    role,
    setRole,
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
