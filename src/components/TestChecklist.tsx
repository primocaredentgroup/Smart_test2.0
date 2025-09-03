"use client";
import React, { useState } from "react";
import { updateTask } from "@/lib/convexActions";
import { CheckCircledIcon, ClockIcon, CrossCircledIcon, StopwatchIcon, MinusCircledIcon, TrashIcon } from "@radix-ui/react-icons";

type Task = { _id: string; title: string; status: string; notes?: string; source?: string };
type Props = { 
  tasks: Task[];
  onAddCustomTask?: (taskTitle: string) => void;
  onDeleteCustomTask?: (taskId: string) => void;
};

const statuses = [
  { value: "todo", label: "Da testare", icon: ClockIcon, className: "text-slate-600" },
  { value: "done", label: "Done", icon: CheckCircledIcon, className: "text-emerald-600" },
  { value: "rejected", label: "Rejected", icon: CrossCircledIcon, className: "text-red-600" },
  { value: "failed", label: "Failed", icon: CrossCircledIcon, className: "text-red-600" },
  { value: "skipped", label: "Saltato", icon: MinusCircledIcon, className: "text-amber-600" },
];

export function TestChecklist({ tasks, onAddCustomTask, onDeleteCustomTask }: Props) {
  const [localTasks, setLocalTasks] = useState(tasks);

  // Aggiorna i task locali quando cambiano i task dalle props
  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  async function setStatus(taskId: string, status: string) {
    setLocalTasks((prev) => prev.map((t) => (String(t._id) === taskId ? { ...t, status } : t)));
    await updateTask({ taskId, status });
  }

  async function setNotes(taskId: string, notes: string) {
    setLocalTasks((prev) => prev.map((t) => (String(t._id) === taskId ? { ...t, notes } : t)));
    await updateTask({ taskId, notes });
  }

  function deleteCustomTask(taskId: string) {
    if (confirm("Sei sicuro di voler eliminare questo task custom?")) {
      setLocalTasks((prev) => prev.filter((t) => String(t._id) !== taskId));
      onDeleteCustomTask?.(taskId);
    }
  }

  const getStatusConfig = (status: string) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  const completedTasks = localTasks.filter(t => t.status === "done").length;
  const totalTasks = localTasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Progresso test</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {completedTasks} di {totalTasks} task completati
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(progressPercentage)}%
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {localTasks.map((task) => {
          const statusConfig = getStatusConfig(task.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div 
              key={String(task._id)} 
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-200"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Task Info */}
                <div className="lg:col-span-1">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${statusConfig.className}`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        {task.source && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                            task.source === "custom" 
                              ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300" 
                              : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400"
                          }`}>
                            {task.source === "macroarea" ? "Standard" : "Custom"}
                          </span>
                        )}
                        {task.source === "custom" && onDeleteCustomTask && (
                          <button
                            onClick={() => deleteCustomTask(String(task._id))}
                            className="p-1 text-red-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Elimina task custom"
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Selector */}
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Stato
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={task.status}
                    onChange={(e) => setStatus(String(task._id), e.target.value)}
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Note
                  </label>
                  <textarea
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Aggiungi note o osservazioni..."
                    value={task.notes ?? ""}
                    onChange={(e) => setNotes(String(task._id), e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {localTasks.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-lg border border-slate-200/50 dark:border-slate-700/50 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <StopwatchIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Nessun task presente</h3>
          <p className="text-slate-600 dark:text-slate-400">Questo test non ha ancora task associati</p>
        </div>
      )}
    </div>
  );
}