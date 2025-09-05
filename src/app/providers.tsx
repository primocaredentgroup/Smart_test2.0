"use client";
import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Toaster } from "sonner";
import { RoleProvider } from "@/contexts/RoleContext";
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    // ConvexProvider: Gestisce la connessione al database
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


