"use client";
import { useState } from "react";
import { PlusIcon, Pencil1Icon, TrashIcon, Cross2Icon, CheckIcon } from "@radix-ui/react-icons";

type Task = {
  id: string;
  title: string;
  description?: string;
};

type Macroarea = {
  _id: string;
  name: string;
  standardTasks: Task[];
  changeLog?: Array<{ timestamp: number; userEmail: string; action: string }>;
};

type Props = {
  macroareas: Macroarea[];
  onUpdate: (macroareas: Macroarea[]) => void;
};

export function MacroareaManager({ macroareas, onUpdate }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  // Form state for new/edit macroarea
  const [formData, setFormData] = useState({
    name: "",
    tasks: [{ id: "", title: "", description: "" }]
  });

  function startEdit(macroarea: Macroarea) {
    setEditingId(macroarea._id);
    setFormData({
      name: macroarea.name,
      tasks: macroarea.standardTasks.map(t => ({ ...t, description: t.description || '' }))
    });
    setShowNewForm(false);
  }

  function startNew() {
    setShowNewForm(true);
    setEditingId(null);
    setFormData({
      name: "",
      tasks: [{ id: "", title: "", description: "" }]
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setShowNewForm(false);
    setFormData({ name: "", tasks: [{ id: "", title: "", description: "" }] });
  }

  function addTask() {
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, { id: `task-${Date.now()}`, title: "", description: "" }]
    }));
  }

  function removeTask(index: number) {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter((_, i) => i !== index)
    }));
  }

  function updateTask(index: number, field: keyof Task, value: string) {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.map((task, i) => 
        i === index ? { ...task, [field]: value } : task
      )
    }));
  }

  function saveChanges() {
    const updatedMacroareas = [...macroareas];
    const validTasks = formData.tasks.filter(t => t.title.trim());
    
    if (editingId) {
      // Edit existing
      const index = updatedMacroareas.findIndex(m => m._id === editingId);
      if (index !== -1) {
        updatedMacroareas[index] = {
          ...updatedMacroareas[index],
          name: formData.name,
          standardTasks: validTasks.map(t => ({ ...t, id: t.id || `task-${Date.now()}-${Math.random()}` }))
        };
      }
    } else {
      // Add new
      const newMacroarea: Macroarea = {
        _id: `macro-${Date.now()}`,
        name: formData.name,
        standardTasks: validTasks.map(t => ({ ...t, id: t.id || `task-${Date.now()}-${Math.random()}` })),
        changeLog: [{ timestamp: Date.now(), userEmail: "s.petretto@primogroup.it", action: "create" }]
      };
      updatedMacroareas.push(newMacroarea);
    }
    
    onUpdate(updatedMacroareas);
    cancelEdit();
  }

  function deleteMacroarea(id: string) {
    if (confirm("Sei sicuro di voler eliminare questa macroarea?")) {
      const updatedMacroareas = macroareas.filter(m => m._id !== id);
      onUpdate(updatedMacroareas);
    }
  }

  const isFormValid = formData.name.trim() && formData.tasks.some(t => t.title.trim());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gestione Macroaree</h2>
          <p className="text-slate-600 dark:text-slate-400">Configura le aree di test e i loro task standard</p>
        </div>
        <button
          onClick={startNew}
          disabled={showNewForm || !!editingId}
          className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Nuova Macroarea
        </button>
      </div>

      {/* New/Edit Form */}
      {(showNewForm || editingId) && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {editingId ? "Modifica Macroarea" : "Nuova Macroarea"}
            </h3>
            <button onClick={cancelEdit} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <Cross2Icon className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Nome Macroarea *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="es. Fatturazione"
              />
            </div>

            {/* Tasks */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Task Standard
                </label>
                <button
                  onClick={addTask}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  + Aggiungi Task
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.tasks.map((task, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div>
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => updateTask(index, "title", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                        placeholder="Nome del task"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={task.description || ""}
                        onChange={(e) => updateTask(index, "description", e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                        placeholder="Descrizione (opzionale)"
                      />
                      {formData.tasks.length > 1 && (
                        <button
                          onClick={() => removeTask(index)}
                          className="p-2 text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={saveChanges}
              disabled={!isFormValid}
              className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CheckIcon className="w-4 h-4" />
              {editingId ? "Salva Modifiche" : "Crea Macroarea"}
            </button>
            <button
              onClick={cancelEdit}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Annulla
            </button>
          </div>
        </div>
      )}

      {/* Macroaree List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {macroareas.map((macroarea) => (
          <div 
            key={macroarea._id} 
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {macroarea.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {macroarea.standardTasks.length} task standard
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(macroarea)}
                  disabled={editingId === macroarea._id || showNewForm}
                  className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50"
                >
                  <Pencil1Icon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteMacroarea(macroarea._id)}
                  disabled={editingId === macroarea._id || showNewForm}
                  className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tasks Preview */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Task:</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {macroarea.standardTasks.map((task, index) => (
                  <div key={task.id || index} className="text-sm text-slate-600 dark:text-slate-400">
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-xs text-slate-500 dark:text-slate-500">{task.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
