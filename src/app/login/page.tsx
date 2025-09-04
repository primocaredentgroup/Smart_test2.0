"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PersonIcon, EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { loginUser, isAuthenticated, isLoading: authLoading } = useAuth();

  // Se già autenticato, reindirizza alla home
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  // Mostra loading se sta controllando l'autenticazione
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-400">Verifica autenticazione...</p>
        </div>
      </div>
    );
  }

  // Se già autenticato, non mostrare il form (il redirect è in corso)
  if (isAuthenticated) {
    return null;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Inserisci email e password");
      return;
    }

    setIsLoading(true);
    try {
      // Simulazione login per ora - questo sarà sostituito con Auth0
      // Utenti di test
      const testUsers = [
        {
          email: "admin@smarttest.com",
          password: "admin123",
          userData: {
            id: "admin_001",
            email: "admin@smarttest.com",
            nome: "Admin",
            cognome: "SmartTest",
            ruolo: "admin"
          }
        },
        {
          email: "tester@smarttest.com", 
          password: "tester123",
          userData: {
            id: "tester_001",
            email: "tester@smarttest.com",
            nome: "Tester",
            cognome: "Demo",
            ruolo: "tester"
          }
        }
      ];

      // Simula un piccolo delay come se fosse una chiamata API
      await new Promise(resolve => setTimeout(resolve, 500));

      const user = testUsers.find(u => u.email === email && u.password === password);
      
      if (user) {
        loginUser(user.userData);
        toast.success("✅ Login effettuato con successo!");
        router.push("/");
      } else {
        toast.error("❌ Email o password non corretti");
      }
    } catch (error) {
      console.error("❌ Errore login:", error);
      toast.error("❌ Errore di connessione");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PersonIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Smart Test</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Accedi al tuo account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Inserisci la tua email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Inserisci la tua password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeClosedIcon className="w-5 h-5" />
                  ) : (
                    <EyeOpenIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Accesso in corso...</span>
                </>
              ) : (
                <>
                  <PersonIcon className="w-4 h-4" />
                  <span>Accedi</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Test Accounts Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Account di test:</h3>
          <div className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
            <div>👑 <strong>Admin:</strong> admin@smarttest.com / admin123</div>
            <div>🧪 <strong>Tester:</strong> tester@smarttest.com / tester123</div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Gradualmente integreremo Auth0 per il login
          </p>
        </div>
      </div>
    </div>
  );
}