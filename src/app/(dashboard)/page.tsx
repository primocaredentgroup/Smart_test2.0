"use client";

export default function DashboardPage() {
  console.log("🎯 Dashboard rendering...");

  return (
    <div className="space-y-8">
      {/* Test basico senza import */}
      <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
        <p className="text-sm font-mono">
          🔧 <strong>Test rendering basico:</strong> Se vedi questo, il routing funziona!
        </p>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h1 className="text-2xl font-bold">Test Dashboard Semplice</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          Se vedi questo messaggio, il rendering della dashboard funziona!
        </p>
      </div>
    </div>
  );
}