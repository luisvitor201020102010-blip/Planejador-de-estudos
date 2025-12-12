import React, { useState } from 'react';
import { AppStep, InterviewData, PlannerOutput } from './types';
import { Interview } from './components/Interview';
import { Dashboard } from './components/Dashboard';
import { generateStudyPlan } from './services/geminiService';
import { Loader2, AlertCircle } from 'lucide-react';

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
    } catch (err) {
      console.error(err);
      setError("Falha ao gerar o cronograma. Verifique sua chave de API ou tente novamente.");
      setStep(AppStep.INTERVIEW_LOGISTICS);
    }
  };

  const renderContent = () => {
    switch (step) {
      case AppStep.GENERATING:
        return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-4 text-center">
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
          <div className="min-h-screen bg-slate-50">
            {error && (
              <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2 z-50 shadow-lg">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
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