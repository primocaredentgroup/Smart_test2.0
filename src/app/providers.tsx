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
    <ConvexProvider client={convex}>
      <RoleProvider>
        {children}
        <Toaster richColors position="top-right" />
      </RoleProvider>
    </ConvexProvider>
  );
}


