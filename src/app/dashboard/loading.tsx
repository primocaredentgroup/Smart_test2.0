export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-64 mb-2 animate-pulse"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-48 animate-pulse"></div>
        </div>

        {/* Dashboard Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart/Table Skeleton */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 dark:bg-slate-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
