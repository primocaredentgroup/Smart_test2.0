"use client";
import { ReactNode } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Toaster } from "sonner";
import { RoleProvider } from "@/contexts/RoleContext";
import { Auth0Provider } from "@auth0/nextjs-auth0";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    // Auth0Provider: Fornisce le informazioni di autenticazione a tutta l'app
    // È il provider più esterno perché tutti gli altri potrebbero aver bisogno
    // di sapere se l'utente è loggato
    <Auth0Provider 
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN!}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!}
    >
      {/* ConvexProvider: Gestisce la connessione al database */}
      <ConvexProvider client={convex}>
        {/* RoleProvider: Gestisce i ruoli utente (admin/tester) */}
        <RoleProvider>
          {children}
          {/* Toaster: Notifiche toast per l'interfaccia */}
          <Toaster richColors position="top-right" />
        </RoleProvider>
      </ConvexProvider>
    </Auth0Provider>
  );
}


