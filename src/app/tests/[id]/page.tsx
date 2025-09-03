"use client";
import { useState, useEffect } from "react";
import { getTestDetail } from "@/lib/convexActions";
import { StatusBadge } from "@/components/StatusBadge";
import { TestChecklist } from "@/components/TestChecklist";
import { AddCustomTaskModal } from "@/components/AddCustomTaskModal";
import { ArrowLeftIcon, ExternalLinkIcon, PersonIcon, CalendarIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = { params: Promise<{ id: string }> };

export default function TestDetailPage({ params }: Params) {
  const [test, setTest] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [customTasks, setCustomTasks] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const { id } = await params;
      const { test: testData, tasks: tasksData } = await getTestDetail(id);
      
      if (!testData) {
        notFound();
        return;
      }
      
      setTest(testData);
      setTasks(tasksData);
      setLoading(false);
    }
    
    loadData();
  }, [params]);

  function addCustomTask(taskTitle: string) {
    const newTask = {
      _id: `custom-${Date.now()}`,
      title: taskTitle,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Caricamento test...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    notFound();
  }

  // Combina task standard e custom
  const allTasks = [...tasks, ...customTasks];

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
                      <span>Creato il {test.createdAt}</span>
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
          tasks={allTasks as any} 
          onAddCustomTask={addCustomTask}
          onDeleteCustomTask={deleteCustomTask}
        />
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors">
            Salva modifiche
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