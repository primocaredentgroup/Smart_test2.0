"use client";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { RoleProvider } from "@/contexts/RoleContext";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <RoleProvider>
      {children}
      <Toaster richColors position="top-right" />
    </RoleProvider>
  );
}


