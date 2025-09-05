// Convex integration for real-time data operations
// These are utility functions that components can use
// The actual Convex hooks will be used directly in components

// Helper to get formatted date strings for display
export const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString("it-IT", {
    year: "numeric",
    month: "short", 
    day: "numeric"
  });
};

// Helper to calculate task completion percentage
export const getTaskCompletionPercentage = (tasks: Array<{status: string}>) => {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.status === "done").length;
  return Math.round((completed / tasks.length) * 100);
};

// Helper to determine test status from tasks
export const calculateTestStatus = (tasks: Array<{status: string}>) => {
  if (tasks.length === 0) return "open";
  
  const completedTasks = tasks.filter(t => t.status === "done");
  const failedTasks = tasks.filter(t => t.status === "failed");
  
  if (failedTasks.length > 0) return "failed";
  if (completedTasks.length === tasks.length) return "completed";
  if (completedTasks.length > 0) return "in_progress";
  
  return "open";
};

// Get current user email from Auth0/Convex auth
export const getCurrentUserEmail = () => {
  // ⚠️ This should be replaced by useAuth hook in components
  return "s.petretto@primogroup.it"; // Real user fallback
};

// Status display helpers
export const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    open: "Da iniziare",
    in_progress: "In corso", 
    completed: "Completato",
    failed: "Fallito",
    todo: "Da testare",
    done: "Fatto",
    rejected: "Rifiutato",
    skipped: "Saltato"
  };
  return labels[status] || status;
};

export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    open: "bg-slate-100 text-slate-800",
    in_progress: "bg-blue-100 text-blue-800", 
    completed: "bg-emerald-100 text-emerald-800",
    failed: "bg-red-100 text-red-800",
    todo: "bg-slate-100 text-slate-800",
    done: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
    skipped: "bg-amber-100 text-amber-800"
  };
  return colors[status] || "bg-slate-100 text-slate-800";
};