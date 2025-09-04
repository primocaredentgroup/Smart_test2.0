"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DashboardIcon, LayersIcon, GearIcon, CheckCircledIcon, PersonIcon } from "@radix-ui/react-icons";
import { useRole } from "@/contexts/RoleContext";

const allNavItems = [
  { href: "/", label: "Dashboard", icon: DashboardIcon, color: "text-blue-600", roles: ["admin", "tester"] },
  { href: "/tests", label: "Tests", icon: LayersIcon, color: "text-emerald-600", roles: ["admin", "tester"] },
  { href: "/admin", label: "Admin", icon: GearIcon, color: "text-purple-600", roles: ["admin"] },
  { href: "/admin/users", label: "Gestione Utenti", icon: PersonIcon, color: "text-orange-600", roles: ["admin"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useRole();
  
  // Filter navigation items based on user role
  const navItems = allNavItems.filter(item => item.roles.includes(role));
  return (
    <aside className="hidden md:flex w-72 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-r border-slate-200/50 dark:border-slate-700/50 shadow-xl flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <CheckCircledIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Smart Test</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Functional Testing</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon as any;
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                active 
                  ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 shadow-sm ring-1 ring-blue-200/50 dark:ring-blue-800/50" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-colors", active ? item.color : "")} />
              <span>{item.label}</span>
              {active && (
                <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="text-xs text-slate-400 dark:text-slate-500 text-center">
          © {new Date().getFullYear()} Smart Test
        </div>
      </div>
    </aside>
  );
}