import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Sidebar } from "@/components/Sidebar";
import { RoleSwitcher } from "@/components/RoleSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Test - Functional Testing",
  description: "Gestione test funzionali per il software interno",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}> 
        <Providers>
          <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-auto">
              {/* Header with Role Switcher */}
              <header className="flex justify-end p-4 md:p-6">
                <RoleSwitcher />
              </header>
              
              {/* Main Content */}
              <main className="flex-1 px-4 md:px-6 lg:px-8 pb-8">
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
