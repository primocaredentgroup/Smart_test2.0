import { CheckCircledIcon, ClockIcon, CrossCircledIcon, CircleIcon } from "@radix-ui/react-icons";

type Props = { status?: string };

const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
  open: { 
    label: "Da testare", 
    className: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700", 
    icon: CircleIcon 
  },
  in_progress: { 
    label: "In corso", 
    className: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-800", 
    icon: ClockIcon 
  },
  completed: { 
    label: "Completato", 
    className: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-200 dark:ring-emerald-800", 
    icon: CheckCircledIcon 
  },
  failed: { 
    label: "Fallito", 
    className: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-800", 
    icon: CrossCircledIcon 
  },
};

export function StatusBadge({ status = "open" }: Props) {
  const config = statusConfig[status] ?? statusConfig.open;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${config.className}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}