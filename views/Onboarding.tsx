import React, { useState } from 'react';
import { UserConfig } from '../types';
import { ArrowRight, Target } from 'lucide-react';

interface OnboardingProps {
  onComplete: (config: UserConfig) => void;
  initialConfig: UserConfig;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialConfig }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<UserConfig>(initialConfig);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({ ...config, isOnboarded: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between max-w-md mx-auto p-8">
      <div className="flex-1 flex flex-col justify-center">
        
        {/* Progress Dots */}
        <div className="flex gap-2 justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={`h-2 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
              <Target size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Definição de Ritmo</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Vendas não é sobre dias perfeitos. É sobre dias consistentes. Vamos definir um ritmo viável para você.
            </p>
            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Quantos dias por semana você vende?</span>
                <select 
                  className="mt-2 block w-full rounded-xl border-slate-200 bg-white p-4 text-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-900"
                  value={config.daysPerWeek}
                  onChange={(e) => setConfig({ ...config, daysPerWeek: Number(e.target.value) })}
                >
                  <option value="3">3 dias</option>
                  <option value="4">4 dias</option>
                  <option value="5">5 dias</option>
                  <option value="6">6 dias</option>
                </select>
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
             <h2 className="text-2xl font-bold text-slate-900 mb-2">Meta Diária</h2>
             <p className="text-slate-500 text-sm mb-6">O que você consegue fazer repetidamente sem falhar?</p>
             
             <div className="space-y-6">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Contatos realizados</label>
                  <input 
                    type="number" 
                    className="block w-full rounded-xl border-slate-200 bg-white p-4 text-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-900"
                    value={config.dailyTargets.contacts}
                    onChange={(e) => setConfig({ 
                      ...config, 
                      dailyTargets: { ...config.dailyTargets, contacts: Number(e.target.value) } 
                    })}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Conversas iniciadas</label>
                  <input 
                    type="number" 
                    className="block w-full rounded-xl border-slate-200 bg-white p-4 text-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-900"
                    value={config.dailyTargets.conversations}
                    onChange={(e) => setConfig({ 
                      ...config, 
                      dailyTargets: { ...config.dailyTargets, conversations: Number(e.target.value) } 
                    })}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Reuniões agendadas</label>
                  <input 
                    type="number" 
                    className="block w-full rounded-xl border-slate-200 bg-white p-4 text-xl shadow-sm focus:border-blue-500 focus:ring-blue-500 text-slate-900"
                    value={config.dailyTargets.meetings}
                    onChange={(e) => setConfig({ 
                      ...config, 
                      dailyTargets: { ...config.dailyTargets, meetings: Number(e.target.value) } 
                    })}
                  />
               </div>
             </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Foco Inicial</h2>
            <p className="text-slate-500 mb-8">O sistema ajustará as sugestões com base nisso.</p>

            <div className="space-y-3">
              {[
                { id: 'prospecting', label: 'Prospecção', desc: 'Preciso encher o funil' },
                { id: 'meetings', label: 'Reuniões', desc: 'Preciso agendar mais' },
                { id: 'conversion', label: 'Conversão', desc: 'Preciso fechar mais' }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setConfig({ ...config, focus: option.id as any })}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    config.focus === option.id 
                      ? 'border-blue-600 bg-blue-50' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className={`font-semibold ${config.focus === option.id ? 'text-blue-900' : 'text-slate-900'}`}>
                    {option.label}
                  </div>
                  <div className="text-sm text-slate-500">{option.desc}</div>
                </button>
              ))}
            </div>
            
            <div className="mt-8 bg-slate-100 p-4 rounded-lg text-xs text-slate-500">
              Nota: O RITMO não promete vendas. Ele garante que o processo continue acontecendo.
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={handleNext}
        className="w-full bg-slate-900 text-white p-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
      >
        {step === 3 ? 'Começar RITMO' : 'Próximo'}
        <ArrowRight size={20} />
      </button>
    </div>
  );
};