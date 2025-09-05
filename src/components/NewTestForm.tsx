"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { CheckIcon, Link2Icon } from "@radix-ui/react-icons";

type Props = { macroareas: Array<{ _id?: string; id?: string; name: string; standardTasks: Array<{ id: string; title: string; description: string; }> }> };

type FormValues = {
  name: string;
  jiraLink: string;
  macroareas: string[];
};

export function NewTestForm({ macroareas }: Props) {
  const router = useRouter();
  const createTest = useMutation(api.tests.createTest);
  const { getUserEmail } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: { name: "", jiraLink: "", macroareas: [] },
  });
  const [submitting, setSubmitting] = useState(false);
  
  const selectedMacroareas = watch("macroareas") || [];
  const totalTasks = macroareas
    .filter(m => selectedMacroareas.includes(m.name))
    .reduce((sum, m) => sum + m.standardTasks.length, 0);

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const selectedIds = macroareas
        .filter((m) => values.macroareas.includes(m.name))
        .map((m) => m._id!); // Convex IDs
      
      // Crea il test usando Convex
      const testId = await createTest({
        name: values.name,
        jiraLink: values.jiraLink || undefined,
        creatorEmail: getUserEmail(),
        macroareaIds: selectedIds as import('../../convex/_generated/dataModel').Id<"macroareas">[],
      });
      
      console.log("✅ Test creato con successo:", testId);
      router.push("/tests");
    } catch (error) {
      console.error("❌ Errore nella creazione del test:", error);
      // In produzione, mostrare un toast di errore
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Form Header */}
        <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Dettagli del test</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Compila i campi per creare un nuovo test funzionale</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Nome Test */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Nome del test *
            </label>
            <input 
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="es. Test Creazione Preventivo Paziente"
              {...register("name", { required: "Il nome del test è obbligatorio" })} 
            />
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          {/* Link Jira */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Link Jira (opzionale)
            </label>
            <div className="relative">
              <Link2Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://jira.primogroup.it/..."
                {...register("jiraLink")} 
              />
            </div>
          </div>

          {/* Macroaree */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Seleziona macroaree *
              </label>
              {totalTasks > 0 && (
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {totalTasks} task totali
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {macroareas.map((macroarea) => (
                <label 
                  key={String(macroarea._id ?? macroarea.id)} 
                  className="relative flex items-start p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group"
                >
                  <input 
                    type="checkbox" 
                    value={macroarea.name} 
                    {...register("macroareas", { required: "Seleziona almeno una macroarea" })}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-center w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-md group-hover:border-blue-500 transition-colors peer-checked:bg-blue-500 peer-checked:border-blue-500">
                    {selectedMacroareas.includes(macroarea.name) && (
                      <CheckIcon className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {macroarea.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {macroarea.standardTasks.length} task standard
                    </div>
                  </div>
                  {selectedMacroareas.includes(macroarea.name) && (
                    <div className="absolute inset-0 border-2 border-blue-500 rounded-xl bg-blue-50/20 dark:bg-blue-900/20"></div>
                  )}
                </label>
              ))}
            </div>
            {errors.macroareas && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.macroareas.message}</p>
            )}
          </div>

          {/* Preview Task */}
          {selectedMacroareas.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Anteprima task che verranno creati:
              </h3>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 max-h-48 overflow-y-auto">
                {macroareas
                  .filter(m => selectedMacroareas.includes(m.name))
                  .map(macroarea => (
                    <div key={String(macroarea._id)} className="mb-3 last:mb-0">
                      <div className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                        {macroarea.name}
                      </div>
                      <ul className="space-y-1">
                        {macroarea.standardTasks.map((task, index) => (
                          <li key={task.id || index} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            {task.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Form Footer */}
        <div className="p-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 flex gap-3">
          <button 
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Annulla
          </button>
          <button 
            type="submit"
            disabled={submitting || selectedMacroareas.length === 0}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
          >
            {submitting ? "Creazione in corso..." : "Crea test"}
          </button>
        </div>
      </form>
    </div>
  );
}