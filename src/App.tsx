import { Dashboard } from './views/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-lg font-black tracking-tighter text-slate-900 pr-4 mr-4">BCS MONITOR</span>
            </div>
            <div className="flex items-center space-x-4">
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Dashboard />
      </main>

      <footer className="mt-auto py-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        </div>
      </footer>
    </div>
  );
}

export default App;
