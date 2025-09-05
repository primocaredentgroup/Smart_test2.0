"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { formatDate, calculateTestStatus } from "@/lib/convexActions";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { StatusBadge } from "@/components/StatusBadge";
import { TestChecklist } from "@/components/TestChecklist";
import { AddCustomTaskModal } from "@/components/AddCustomTaskModal";
import { ArrowLeftIcon, ExternalLinkIcon, PersonIcon, CalendarIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { params: Promise<{ id: string }> };

export default function TestDetailPage({ params }: Params) {
  // Extract ID from params
  const [testId, setTestId] = useState<string | null>(null);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [customTasks, setCustomTasks] = useState<Array<{ _id: string; title: string; description: string; status: string; }>>([]);
  const [saving, setSaving] = useState(false);
  
  // Convex mutations and Auth
  const updateTestStatus = useMutation(api.tests.updateTestStatus);
  const { getUserEmail } = useAuth();

  // Setup params extraction
  React.useEffect(() => {
    params.then(({ id }) => setTestId(id));
  }, [params]);

  // Convex queries
  const test = useQuery(api.tests.getTestById, testId ? { testId: testId as import('../../../../convex/_generated/dataModel').Id<"tests"> } : "skip");
  const tasks = useQuery(api.testTasks.getTasksByTestId, testId ? { testId: testId as import('../../../../convex/_generated/dataModel').Id<"tests"> } : "skip");

  function addCustomTask(taskTitle: string) {
    const newTask = {
      _id: `custom-${Date.now()}`,
      title: taskTitle,
      description: `Task personalizzato: ${taskTitle}`,
      status: "todo",
      notes: "",
      source: "custom"
    };
    
    setCustomTasks(prev => [...prev, newTask]);
    console.log("Task custom aggiunto:", newTask);
  }

  function deleteCustomTask(taskId: string) {
    setCustomTasks(prev => prev.filter(t => t._id !== taskId));
    console.log("Task custom eliminato:", taskId);
  }

  async function saveChanges() {
    if (!testId || !test || !tasks) return;

    setSaving(true);
    try {
      // Combina tutti i task (DB + custom)
      const allTasks = [...tasks, ...customTasks];
      
      // Calcola nuovo status del test basato sui task
      const currentTestStatus = calculateTestStatus(allTasks);
      
      // Se il status è cambiato, aggiorna nel database
      if (currentTestStatus !== test.status) {
        await updateTestStatus({
          testId: testId as import('../../../../convex/_generated/dataModel').Id<"tests">,
          status: currentTestStatus as "open" | "in_progress" | "completed" | "failed",
          userEmail: getUserEmail(),
        });
        
        toast.success(`🎉 Test aggiornato a "${getStatusLabel(currentTestStatus)}"`);
      } else {
        toast.success("✅ Modifiche salvate correttamente");
      }
      
      console.log("✅ Modifiche salvate:", { 
        testId, 
        oldStatus: test.status, 
        newStatus: currentTestStatus,
        totalTasks: allTasks.length,
        completedTasks: allTasks.filter(t => t.status === "done").length
      });
      
    } catch (error) {
      console.error("❌ Errore nel salvare:", error);
      toast.error("❌ Errore nel salvare le modifiche");
    } finally {
      setSaving(false);
    }
  }

  // Helper per ottenere label dello status
  function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
      open: "Da iniziare",
      in_progress: "In corso",
      completed: "Completato", 
      failed: "Fallito"
    };
    return labels[status] || status;
  }

  // Loading state
  if (!testId || test === undefined || tasks === undefined) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Caricamento test...</p>
        </div>
      </div>
    );
  }

  // Test not found
  if (!test) {
    notFound();
  }

  // Combina task standard e custom
  const allTasks = [...(tasks || []), ...customTasks];
  
  // Controlla se ci sono modifiche non salvate
  const currentTestStatus = calculateTestStatus(allTasks);
  const hasUnsavedChanges = test && currentTestStatus !== test.status;

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link 
          href="/tests"
          className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Torna ai tests
        </Link>
      </div>

      {/* Test Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {test.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <PersonIcon className="w-4 h-4" />
                    <span>{test.creatorEmail}</span>
                  </div>
                  {test.createdAt && (
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Creato il {formatDate(test.createdAt)}</span>
                    </div>
                  )}
                </div>
              </div>
              <StatusBadge status={test.status} />
            </div>

            {/* Test Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {test.jiraLink && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Ticket Jira
                  </label>
                  <a 
                    href={test.jiraLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <ExternalLinkIcon className="w-4 h-4" />
                    <span className="truncate">Apri ticket</span>
                  </a>
                </div>
              )}

              {test.macroareaIds && test.macroareaIds.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Macroaree coinvolte
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {test.macroareaIds.map((id: string) => (
                      <span 
                        key={id}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                      >
                        {id}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Test Checklist */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Checklist Test</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Completa tutti i task per finalizzare il test
          </p>
        </div>
        
        <TestChecklist 
          tasks={allTasks} 
          onDeleteCustomTask={deleteCustomTask}
        />
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        {hasUnsavedChanges && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                Status del test cambierà da &quot;{getStatusLabel(test?.status || '')}&quot; a &quot;{getStatusLabel(currentTestStatus)}&quot;
              </span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={saveChanges}
            disabled={saving}
            className={`px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 ${
              hasUnsavedChanges 
                ? "bg-amber-500 text-white hover:bg-amber-600 disabled:bg-amber-300" 
                : "bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-emerald-300"
            } disabled:cursor-not-allowed`}
          >
            {saving && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {saving ? "Salvando..." : hasUnsavedChanges ? "💾 Salva modifiche" : "✅ Salvato"}
          </button>
          <button 
            onClick={() => setShowAddTaskModal(true)}
            className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Aggiungi task custom
          </button>
          {customTasks.length > 0 && (
            <div className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
              {customTasks.length} task custom aggiunti
            </div>
          )}
        </div>
      </div>

      {/* Add Custom Task Modal */}
      <AddCustomTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onAdd={addCustomTask}
      />
    </div>
  );
}