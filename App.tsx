import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Onboarding } from './views/Onboarding';
import { Dashboard } from './views/Dashboard';
import { DailyLogView } from './views/DailyLog';
import { Guidance } from './views/Guidance';
import { StorageService } from './services/storage';
import { UserConfig, DailyLog, ViewState, RhythmStatus } from './types';
import { INITIAL_CONFIG } from './constants';
import { calculateRhythmStatus, getWeeklyLogs } from './services/ritmoLogic';

// Tailwind custom animation class extension via style tag injection for smoother UX
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }
`;
document.head.appendChild(style);

const App: React.FC = () => {
  const [config, setConfig] = useState<UserConfig>(INITIAL_CONFIG);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [view, setView] = useState<ViewState>('dashboard');
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const storedConfig = StorageService.getConfig();
    const storedLogs = StorageService.getLogs();
    
    setConfig(storedConfig);
    setLogs(storedLogs);
    setLoading(false);
  }, []);

  const handleOnboardingComplete = (newConfig: UserConfig) => {
    StorageService.saveConfig(newConfig);
    setConfig(newConfig);
    setView('dashboard');
  };

  const handleSaveLog = (log: DailyLog) => {
    StorageService.saveLog(log);
    setLogs(StorageService.getLogs()); // Refresh logs
    // We stay on the log view for the success message, 
    // user manually navigates back or we could auto-navigate. 
    // The Log view handles the "Success" UI state.
    setTimeout(() => {
        setView('dashboard');
    }, 1500);
  };

  const handleReset = () => {
      // For demo/debug purposes mainly, or 'settings' feature
      if(window.confirm("Deseja reiniciar as configurações?")) {
          const resetConfig = { ...INITIAL_CONFIG, isOnboarded: false };
          StorageService.saveConfig(resetConfig);
          setConfig(resetConfig);
      }
  };

  if (loading) return null;

  if (!config.isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} initialConfig={config} />;
  }

  // Calculate status for passing down if needed
  const weeklyLogs = getWeeklyLogs(logs);
  const { status } = calculateRhythmStatus(weeklyLogs, config);

  return (
    <Layout currentView={view} setView={setView}>
      {view === 'dashboard' && (
        <Dashboard 
          logs={logs} 
          config={config} 
          onLogClick={() => setView('log')} 
        />
      )}
      
      {view === 'log' && (
        <DailyLogView 
          onSave={handleSaveLog} 
        />
      )}
      
      {view === 'guidance' && (
        <Guidance status={status} config={config} />
      )}

      {view === 'settings' && (
         <div className="animate-fade-in">
             <h2 className="text-2xl font-bold mb-4">Configurações</h2>
             <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4">
                 <p className="text-sm text-slate-500 mb-2">Meta Diária</p>
                 <div className="flex justify-between py-2 border-b border-slate-100">
                     <span>Contatos</span>
                     <span className="font-bold">{config.dailyTargets.contacts}</span>
                 </div>
                 <div className="flex justify-between py-2 border-b border-slate-100">
                     <span>Conversas</span>
                     <span className="font-bold">{config.dailyTargets.conversations}</span>
                 </div>
                 <div className="flex justify-between py-2">
                     <span>Reuniões</span>
                     <span className="font-bold">{config.dailyTargets.meetings}</span>
                 </div>
             </div>
             <button 
                onClick={handleReset}
                className="w-full p-4 border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
             >
                 Reiniciar Onboarding
             </button>
         </div>
      )}
    </Layout>
  );
};

export default App;
