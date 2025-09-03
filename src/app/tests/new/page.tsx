import { staticData } from "@/lib/dataClient";
import { NewTestForm } from "@/components/NewTestForm";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export default function NewTestPage() {
  const macroareas = staticData.macroareas;
  
  return (
    <div className="space-y-6">
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

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Nuovo test</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Crea un nuovo test funzionale selezionando le macroaree da verificare
        </p>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <NewTestForm macroareas={macroareas} />
      </div>
    </div>
  );
}