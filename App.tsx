import React, { useState } from 'react';
import { AppStep, InterviewData, PlannerOutput } from './types';
import { Interview } from './components/Interview';
import { Dashboard } from './components/Dashboard';
import { generateStudyPlan } from './services/geminiService';
import { Loader2, AlertCircle, X } from 'lucide-react';

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
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4 text-center animate-fade-in">
            <Loader2 className="w-16 h-16 text-teal-600 animate-spin mb-6" />
            <h2 className="text-2xl font-bold mb-2">Gerando seu Planejamento...</h2>
            <p className="text-slate-600 max-w-md">
              A IA está organizando suas disciplinas usando recuperação ativa e revisão espaçada. Isso pode levar alguns segundos.
            </p>
          </div>
        );
      case AppStep.DASHBOARD:
        if (!plannerData) return null;
        return <Dashboard data={plannerData} onReset={() => setStep(AppStep.WELCOME)} />;
      default:
        return (
          <div className="min-h-screen bg-slate-50 relative">
            {error && (
              <div className="fixed top-0 left-0 right-0 p-4 z-50 flex justify-center animate-fade-in">
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg flex items-start gap-3 max-w-lg w-full">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Erro</p>
                    <p className="text-sm">{error}</p>
                  </div>
                  <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Interview 
                step={step} 
                setStep={setStep}
                onComplete={handleInterviewComplete} 
              />
            </div>
          </div>
        );
    }
  };

  return <>{renderContent()}</>;
};

export default App;