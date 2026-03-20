export default function UnderConstruction() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center p-8">
      <div className="max-w-3xl space-y-8">
        
        {/* Logo / Brand Mockup */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.3)]">
            <span className="text-white text-5xl font-black tracking-tighter">D</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
          Dinevra <span className="text-indigo-500">Platform</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
          The AI-Native Operating System for modern organizations is currently under construction.
        </p>

        <div className="pt-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900 border border-gray-800 rounded-full text-indigo-400 font-semibold shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
            System Deployment in Progress
          </div>
        </div>
      </div>

      {/* Admin Quick-link (Intended for internal use) */}
      <div className="fixed bottom-8 text-gray-600 text-sm">
        <a href="/admin" className="hover:text-indigo-400 transition-colors">Admin Login</a>
      </div>
    </div>
  );
}
