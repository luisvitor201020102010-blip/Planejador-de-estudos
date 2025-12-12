import React, { useState } from 'react';
import { AppStep, Difficulty, InterviewData, Subject } from '../types';
import { METHODOLOGIES } from '../constants';
import { Plus, Trash2, Clock, Brain, User, ListChecks, ChevronLeft, Lightbulb, BarChart3, BookOpen } from 'lucide-react';

interface InterviewProps {
  onComplete: (data: InterviewData) => void;
  setStep: (step: AppStep) => void;
  step: AppStep;
}

// Helper components defined outside to prevent recreation on each render
const TipBox = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-cyan-50/50 border border-cyan-100 rounded-lg p-4 mb-6 flex gap-3 text-sm text-slate-600">
    <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
    <div className="leading-relaxed">
      <span className="font-bold text-slate-700 block mb-1">Baseado em neurociência:</span>
      {children}
    </div>
  </div>
);

const ModernInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props}
    className={`
      w-full px-4 py-3 rounded-lg border border-slate-300 bg-white 
      text-slate-800 placeholder:text-slate-400 text-sm transition-all
      focus:border-[#0e7490] focus:ring-2 focus:ring-[#0e7490]/20 outline-none
      ${props.className}
    `}
  />
);

const ModernSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative">
    <select 
      {...props}
      className={`
        w-full px-4 py-3 rounded-lg border border-slate-300 bg-white 
        text-slate-800 text-sm transition-all appearance-none
        focus:border-[#0e7490] focus:ring-2 focus:ring-[#0e7490]/20 outline-none
        ${props.className}
      `}
    />
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
    </div>
  </div>
);

const PrimaryButton = ({ onClick, children, className = "" }: any) => (
  <button
    onClick={onClick}
    className={`
      w-full py-3.5 bg-[#155e75] text-white rounded-lg font-semibold text-sm
      hover:bg-[#0e7490] transition-colors shadow-sm active:translate-y-0.5
      flex items-center justify-center gap-2
      ${className}
    `}
  >
    {children}
  </button>
);


export const Interview: React.FC<InterviewProps> = ({ onComplete, step, setStep }) => {
  const [data, setData] = useState<InterviewData>({
    userName: '',
    subjectCount: 8,
    subjects: [{ id: '1', name: '', difficulty: Difficulty.MEDIO, priority: 1, goal: 'Revisar base' }],
    hoursPerDay: 4,
    daysPerWeek: 6,
    durationWeeks: 1,
    timeSlots: '08:00-12:00',
    activeMethodologyFocus: 80,
    methodologies: [...METHODOLOGIES],
  });

  const handleSubjectChange = (id: string, field: keyof Subject, value: any) => {
    setData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const addSubject = () => {
    setData(prev => ({
      ...prev,
      subjectCount: prev.subjectCount + 1,
      subjects: [
        ...prev.subjects,
        { 
          id: Date.now().toString(), 
          name: '', 
          difficulty: Difficulty.MEDIO, 
          priority: prev.subjects.length + 1, 
          goal: 'Revisar base' 
        }
      ]
    }));
  };

  const removeSubject = (id: string) => {
    if (data.subjects.length <= 1) return;
    setData(prev => ({
      ...prev,
      subjectCount: prev.subjectCount - 1,
      subjects: prev.subjects.filter(s => s.id !== id)
    }));
  };

  // --- UI Components ---

  const ProgressBar = () => {
    const steps = [AppStep.WELCOME, AppStep.INTERVIEW_QUANTITY, AppStep.INTERVIEW_SUBJECTS, AppStep.INTERVIEW_LOGISTICS];
    const currentIndex = steps.indexOf(step);
    const progress = Math.max(5, ((currentIndex + 1) / steps.length) * 100);

    return (
      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-[#0e7490] transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  
  
  // --- Render Steps (Left Panel of Split View) ---

  const renderQuantityForm = () => (
    <div className="animate-fade-in">
      <TipBox>
        Alternar entre matérias (prática intercalada) melhora a retenção mais do que estudar uma única coisa por horas.
      </TipBox>

      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-700">Quantas disciplinas deseja estudar? (1-15)</label>
        <ModernInput
          type="number"
          min="1"
          max="15"
          value={data.subjectCount}
          onChange={(e) => {
            const count = parseInt(e.target.value) || 1;
            const validCount = Math.max(1, Math.min(15, count));
            const newSubjects = [...data.subjects];
            if (validCount > newSubjects.length) {
              for (let i = newSubjects.length; i < validCount; i++) {
                newSubjects.push({ 
                  id: Date.now().toString() + i, 
                  name: '', 
                  difficulty: Difficulty.MEDIO, 
                  priority: i + 1, 
                  goal: 'Revisar base' 
                });
              }
            } else {
              newSubjects.length = validCount;
            }
            setData({ ...data, subjectCount: validCount, subjects: newSubjects });
          }}
          className="text-lg"
        />
        
        <PrimaryButton onClick={() => setStep(AppStep.INTERVIEW_SUBJECTS)}>
          Próximo: Informar Disciplinas
        </PrimaryButton>
      </div>
    </div>
  );

  const renderSubjectsForm = () => (
    <div className="animate-fade-in flex flex-col h-full">
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-slate-500">Preencha os detalhes para calibrar a dificuldade.</p>
        <button 
          onClick={addSubject}
          className="text-xs font-bold text-[#0e7490] hover:underline flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Adicionar
        </button>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar pr-2 mb-6">
        {data.subjects.map((subject, index) => (
          <div key={subject.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
             <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disciplina {index + 1}</span>
                <button 
                  onClick={() => removeSubject(subject.id)}
                  disabled={data.subjects.length === 1}
                  className="text-slate-400 hover:text-red-500 disabled:opacity-30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div className="md:col-span-2">
                 <ModernInput
                    placeholder="Nome da Matéria (Ex: Cardiologia)"
                    value={subject.name}
                    onChange={(e) => handleSubjectChange(subject.id, 'name', e.target.value)}
                 />
               </div>
               <ModernSelect
                  value={subject.difficulty}
                  onChange={(e) => handleSubjectChange(subject.id, 'difficulty', e.target.value)}
               >
                  <option value={Difficulty.FACIL}>🟢 Fácil</option>
                  <option value={Difficulty.MEDIO}>🟡 Médio</option>
                  <option value={Difficulty.DIFICIL}>🔴 Difícil</option>
               </ModernSelect>
               <ModernSelect
                  value={subject.goal}
                  onChange={(e) => handleSubjectChange(subject.id, 'goal', e.target.value)}
               >
                  <option>Revisar base</option>
                  <option>Aprofundar</option>
                  <option>Questões</option>
               </ModernSelect>
             </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-auto pt-4 border-t border-slate-100">
        <button 
           onClick={() => setStep(AppStep.INTERVIEW_QUANTITY)}
           className="px-4 py-3 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium text-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <PrimaryButton 
          onClick={() => {
            const hasEmpty = data.subjects.some(s => !s.name.trim());
            if (hasEmpty) {
              alert("Por favor, preencha o nome de todas as disciplinas.");
              return;
            }
            setStep(AppStep.INTERVIEW_LOGISTICS);
          }}
        >
          Próximo: Rotina
        </PrimaryButton>
      </div>
    </div>
  );

  const renderLogisticsForm = () => (
    <div className="animate-fade-in">
       <TipBox>
         O ideal para memória de longo prazo é espaçar as sessões ao longo da semana, em vez de um "intensivão" num dia só.
       </TipBox>

       <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Horas/Dia</label>
              <ModernInput
                type="number"
                min="1"
                max="16"
                value={data.hoursPerDay}
                onChange={(e) => setData({ ...data, hoursPerDay: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Dias/Semana</label>
              <ModernInput
                type="number"
                min="1"
                max="7"
                value={data.daysPerWeek}
                onChange={(e) => setData({ ...data, daysPerWeek: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div>
             <div className="flex justify-between mb-2">
               <label className="text-sm font-bold text-slate-700">Foco em Estudo Ativo</label>
               <span className="text-xs font-bold text-[#0e7490] bg-cyan-50 px-2 py-0.5 rounded">{data.activeMethodologyFocus}%</span>
             </div>
             <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={data.activeMethodologyFocus}
                onChange={(e) => setData({ ...data, activeMethodologyFocus: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0e7490]"
              />
              <p className="text-xs text-slate-400 mt-1">Quanto maior, mais questões e flashcards.</p>
          </div>

          <div className="flex gap-3 pt-6">
            <button 
              onClick={() => setStep(AppStep.INTERVIEW_SUBJECTS)}
              className="px-4 py-3 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium text-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <PrimaryButton onClick={() => onComplete(data)}>
               <Brain className="w-4 h-4 mr-1" /> Gerar Plano
            </PrimaryButton>
          </div>
       </div>
    </div>
  );

  // --- Right Panel Summary (Split View) ---
  
  const SummaryPanel = () => {
    const filledSubjects = data.subjects.filter(s => s.name.trim() !== "").length;
    
    return (
      <div className="h-full flex flex-col">
         {data.userName ? (
            <div className="space-y-6 animate-fade-in">
               <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-[#0e7490] font-bold text-lg">
                    {data.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{data.userName}</h3>
                    <p className="text-xs text-slate-500">Futuro(a) Aprovado(a)</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ListChecks className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Disciplinas</p>
                      <p className="text-xs text-slate-500">
                        {filledSubjects} de {data.subjectCount} definidas
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {data.subjects.filter(s => s.name).slice(0, 5).map(s => (
                          <span key={s.id} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full border border-slate-200">
                            {s.name}
                          </span>
                        ))}
                        {data.subjects.filter(s => s.name).length > 5 && (
                          <span className="text-[10px] text-slate-400 px-1 py-1">+{data.subjects.filter(s => s.name).length - 5}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Meta de Tempo</p>
                      <p className="text-xs text-slate-500">
                        {data.hoursPerDay}h por dia • {data.daysPerWeek} dias/sem
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Metodologia</p>
                      <div className="w-full bg-slate-100 rounded-full h-2 mt-2 mb-1 w-32">
                         <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${data.activeMethodologyFocus}%` }}></div>
                      </div>
                      <p className="text-[10px] text-slate-500">{data.activeMethodologyFocus}% Ativo</p>
                    </div>
                  </div>
               </div>
            </div>
         ) : (
           <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-4">
              <User className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">Configure o plano à esquerda para ver o resumo aqui...</p>
           </div>
         )}
      </div>
    );
  };

  // --- Render Landing Page (Welcome Step) ---

  const renderLandingPage = () => (
    <div className="flex-1 w-full flex flex-col items-center justify-center px-4 py-12 text-center animate-fade-in">
      {/* Brain Icon - Ocean Blue (~1 inch / w-24) */}
      <Brain className="w-24 h-24 text-[#155e75] mb-6" strokeWidth={1.5} />
      
      {/* Title - Black */}
      <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 tracking-tight">
        Planejador de Estudos
      </h1>
      
      {/* Subtitle - Black */}
      <p className="text-black text-lg max-w-3xl leading-relaxed mb-6">
        Cronograma inteligente com metodologias ativas baseadas em neurociência. 
        Este planejador integra recuperação ativa, revisão espaçada, prática intercalada, 
        autoexplicação e técnica de Feynman.
      </p>
      
      {/* Credits - Black */}
      <div className="space-y-1 mb-12">
        <p className="text-black font-medium">Desenvolvido por Luis Vitor Maciel Amorim</p>
        <p className="text-black text-sm">siga @luis_vitor_med para mais conteúdos assim</p>
      </div>

      {/* Start Section - Gear + Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">⚙️</span>
        <h2 className="text-2xl font-bold text-black">Comece a construir seu Plano</h2>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-sm space-y-4">
        <div className="text-left">
          <label className="block text-black mb-2 font-medium">Qual é o seu nome?</label>
          <input 
            type="text" 
            className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-black placeholder:text-slate-400 focus:border-[#155e75] focus:ring-2 focus:ring-[#155e75]/20 outline-none transition-all"
            value={data.userName}
            onChange={(e) => setData({...data, userName: e.target.value})}
            placeholder="Digite seu nome..."
          />
        </div>

        {/* Button - Ocean Blue Background, Black Text, White Border */}
        <button
          onClick={() => {
            if (data.userName.trim() === '') return;
            setStep(AppStep.INTERVIEW_QUANTITY);
          }}
          className="w-full py-4 bg-[#155e75] text-black border-2 border-white rounded-lg font-bold text-lg hover:opacity-90 transition-all shadow-lg active:translate-y-0.5"
        >
          Próximo
        </button>
      </div>
    </div>
  );

  // --- Main Layout Controller ---

  // If Welcome Step, use the specific landing page layout
  if (step === AppStep.WELCOME) {
    return renderLandingPage();
  }

  // For other steps, use the Split View layout with the Header
  return (
    <div>
      {/* Re-introduce the Header for the inner pages to maintain the "previous layout" request */}
      <header className="bg-[#155e75] text-white py-8 border-b-4 border-[#0e7490] shadow-md mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-cyan-300" />
            <h1 className="text-3xl font-bold tracking-tight">Planejador de Estudos para Medicina</h1>
          </div>
          <p className="text-cyan-100 text-sm font-medium">
            Cronograma inteligente com metodologias ativas baseadas em neurociência
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start max-w-7xl mx-auto">
        {/* Left Column: Form Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden min-h-[500px] flex flex-col">
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2">
              <div className="bg-cyan-50 p-1.5 rounded-md">
                <span className="animate-spin-slow">⚙️</span>
              </div>
              <h2 className="text-lg font-bold text-[#155e75]">Configurar seu Plano</h2>
          </div>
          
          {/* Card Content */}
          <div className="p-6 flex-1 flex flex-col">
              <ProgressBar />
              <div className="flex-1">
                {/* Note: Welcome form is handled by renderLandingPage now */}
                {step === AppStep.INTERVIEW_QUANTITY && renderQuantityForm()}
                {step === AppStep.INTERVIEW_SUBJECTS && renderSubjectsForm()}
                {step === AppStep.INTERVIEW_LOGISTICS && renderLogisticsForm()}
              </div>
          </div>
        </div>

        {/* Right Column: Summary Card */}
        <div className="hidden lg:block lg:col-span-1 bg-white rounded-xl shadow-md border border-slate-200 h-full min-h-[500px] flex flex-col">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2">
              <div className="bg-emerald-50 p-1.5 rounded-md">
                📊
              </div>
              <h2 className="text-lg font-bold text-[#155e75]">Resumo Atual</h2>
          </div>
          <div className="p-6 flex-1">
              <SummaryPanel />
          </div>
        </div>
      </div>
    </div>
};
