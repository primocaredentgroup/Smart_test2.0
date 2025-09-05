"use client";
import { ReactNode } from "react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { Toaster } from "sonner";
import { RoleProvider } from "@/contexts/RoleContext";

// Inizializza client Convex standard
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    // ConvexProvider: Connessione standard a Convex
    <ConvexProvider client={convex}>
      {/* RoleProvider: Gestisce i ruoli utente (admin/tester) */}
      <RoleProvider>
        {children}
        {/* Toaster: Notifiche toast per l'interfaccia */}
        <Toaster richColors position="top-right" />
      </RoleProvider>
    </ConvexProvider>
  );
}


