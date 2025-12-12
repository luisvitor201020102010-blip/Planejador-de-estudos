import React, { useState } from 'react';
import { AppStep, InterviewData, PlannerOutput } from './types';
import { Interview } from './components/Interview';
import { Dashboard } from './components/Dashboard';
import { generateStudyPlan } from './services/geminiService';
import { Loader2, AlertCircle, X, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.WELCOME);
  const [plannerData, setPlannerData] = useState<PlannerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInterviewComplete = async (data: InterviewData) => {
    setStep(AppStep.GENERATING);
    setError(null);
    try {
      const result = await generateStudyPlan(data);
      setPlannerData(result);
      setStep(AppStep.DASHBOARD);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Falha ao gerar o cronograma. Verifique sua chave de API ou tente novamente.");
      setStep(AppStep.INTERVIEW_LOGISTICS);
    }
  };

  const renderContent = () => {
    switch (step) {
      case AppStep.GENERATING:
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center animate-fade-in bg-slate-50">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 max-w-md w-full relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0e7490]"></div>
               
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mb-6">
                  <Loader2 className="w-8 h-8 text-[#0e7490] animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Criando seu Plano</h2>
                <p className="text-slate-500 leading-relaxed text-sm">
                  A IA está estruturando sua rotina com base em neurociência, recuperação ativa e revisão espaçada.
                </p>
                <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-[#0e7490] bg-cyan-50 px-3 py-1.5 rounded-md border border-cyan-100">
                  <Sparkles className="w-3 h-3" />
                  Calculando intervalos ótimos...
                </div>
              </div>
            </div>
          </div>
        );
      case AppStep.DASHBOARD:
        if (!plannerData) return null;
        return <Dashboard data={plannerData} onReset={() => setStep(AppStep.WELCOME)} />;
      default:
        return (
          <div className="min-h-screen bg-slate-50 selection:bg-cyan-100 selection:text-cyan-900 font-sans flex flex-col">
            {error && (
              <div className="max-w-7xl mx-auto w-full px-4 mt-4 animate-fade-in">
                <div className="bg-red-50 border-l-4 border-red-500 text-slate-700 px-4 py-4 rounded-r shadow-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-red-700 mb-1">Ops, algo deu errado</p>
                    <p className="text-sm text-slate-600">{error}</p>
                  </div>
                  <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
            
            <Interview 
              step={step} 
              setStep={setStep}
              onComplete={handleInterviewComplete} 
            />
          </div>
        );
    }
  };

  return renderContent();
};

export default App;