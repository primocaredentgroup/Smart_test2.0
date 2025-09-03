"use client";
import { useRole } from "@/contexts/RoleContext";
import { PersonIcon, GearIcon, CheckIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export function RoleSwitcher() {
  const { role, setRole, isAdmin } = useRole();
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { 
      value: "admin" as const, 
      label: "Admin", 
      icon: GearIcon, 
      description: "Gestione completa del sistema",
      color: "text-purple-600 dark:text-purple-400"
    },
    { 
      value: "tester" as const, 
      label: "Tester", 
      icon: PersonIcon, 
      description: "Creazione e gestione test",
      color: "text-blue-600 dark:text-blue-400"
    },
  ];

  const currentRole = roles.find(r => r.value === role)!;
  const CurrentIcon = currentRole.icon;

  return (
    <div className="relative">
      {/* Dev Mode Badge */}
      <div className="absolute -top-2 -right-2 z-10">
        <span className="px-1.5 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded uppercase">
          DEV
        </span>
      </div>

      {/* Current Role Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 ${currentRole.color}`}
      >
        <CurrentIcon className="w-4 h-4" />
        <span className="text-sm font-medium">{currentRole.label}</span>
        <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 z-50 overflow-hidden">
            <div className="p-3 border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="text-sm font-medium text-slate-900 dark:text-white">Modalità Sviluppo</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Cambia ruolo per testare le funzionalità</div>
            </div>
            
            <div className="p-2">
              {roles.map((roleOption) => {
                const Icon = roleOption.icon;
                const isSelected = role === roleOption.value;
                
                return (
                  <button
                    key={roleOption.value}
                    onClick={() => {
                      setRole(roleOption.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? roleOption.color : 'text-slate-400'}`} />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{roleOption.label}</div>
                      <div className="text-xs opacity-75">{roleOption.description}</div>
                    </div>
                    {isSelected && (
                      <CheckIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
