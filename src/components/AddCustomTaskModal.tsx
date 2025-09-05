"use client";
import { useState } from "react";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (taskTitle: string) => void;
};

export function AddCustomTaskModal({ isOpen, onClose, onAdd }: Props) {
  const [taskTitle, setTaskTitle] = useState("");

  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (taskTitle.trim()) {
      onAdd(taskTitle.trim());
      setTaskTitle("");
      onClose();
    }
  }

  function handleClose() {
    setTaskTitle("");
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Aggiungi Task Custom
            </h3>
            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <Cross2Icon className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nome del task *
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="es. Verifica integrazione API"
                  autoFocus
                />
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Info:</strong> Il task verrà creato con stato &quot;Da testare&quot; e potrà essere modificato o eliminato fino al salvataggio del test.
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={!taskTitle.trim()}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Aggiungi Task
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
