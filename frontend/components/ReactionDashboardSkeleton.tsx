export default function ReactionDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 pb-6 ">
      
      {/* Header */}
      <div className="h-12 bg-slate-200 rounded-lg mb-6" />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border">
            <div className="h-3 w-20 bg-slate-200 rounded mb-3" />
            <div className="h-6 w-16 bg-slate-300 rounded mb-2" />
            <div className="h-2 w-full bg-slate-200 rounded" />
          </div>
        ))}
      </div>

      {/* Chart + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border">
          <div className="h-4 w-40 bg-slate-300 rounded mb-4" />
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>

        {/* Side Panel */}
        <div className="bg-white rounded-2xl p-6 border">
          <div className="h-4 w-32 bg-slate-300 rounded mb-4" />
          
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-200 rounded-lg mb-2" />
          ))}
        </div>

      </div>
    </div>
  );
}