"use client";
import { PersonIcon, ExitIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function AuthButton() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-400">
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        {/* User Info */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <PersonIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {user.nome} {user.cognome}
          </span>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          title="Logout"
        >
          <ExitIcon className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
      >
        <PersonIcon className="w-4 h-4" />
        Login
      </Link>
    </div>
  );
}