import React, { useState } from 'react';
import { AppStep, Difficulty, InterviewData, Subject } from '../types';
import { METHODOLOGIES } from '../constants';
import { Plus, Trash2, ArrowRight, BookOpen, Clock, Brain, User } from 'lucide-react';

interface InterviewProps {
  onComplete: (data: InterviewData) => void;
  setStep: (step: AppStep) => void;
  step: AppStep;
}

export const Interview: React.FC<InterviewProps> = ({ onComplete, step, setStep }) => {
  const [data, setData] = useState<InterviewData>({
    userName: '',
    subjectCount: 1,
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

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center space-y-8 py-10 animate-fade-in">
      <div className="p-4 bg-teal-50 rounded-full">
        <Brain className="w-16 h-16 text-teal-600" />
      </div>
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-slate-800">Planejador de Estudos</h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Crie um plano de estudos personalizado para medicina baseado em neurociência.
          Utilizamos algoritmos de recuperação ativa, revisão espaçada e prática intercalada 
          para maximizar sua retenção.
        </p>
        <div className="pt-4 text-slate-500 font-medium">
          <p>Criado por: Luís Vitor Maciel Amorim</p>
          <p className="text-teal-600">Siga no Instagram @luis_vitor_med</p>
        </div>
      </div>
      
      <div className="w-full max-w-md space-y-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
             <User className="w-4 h-4 text-teal-600" />
             Qual seu nome?
           </label>
           <input 
             type="text" 
             placeholder="Digite seu nome"
             value={data.userName}
             onChange={(e) => setData({...data, userName: e.target.value})}
             className="w-full px-4 py-3 rounded-lg border border-black bg-white focus:ring-2 focus:ring-teal-500 outline-none text-lg text-slate-900 placeholder:text-slate-400"
           />
        </div>

        <button
          onClick={() => {
             if (data.userName.trim() === '') {
                 alert("Por favor, digite seu nome para continuar.");
                 return;
             }
             setStep(AppStep.INTERVIEW_QUANTITY);
          }}
          className="w-full group px-8 py-4 bg-teal-600 text-white rounded-xl font-semibold shadow-lg hover:bg-teal-700 transition-all flex items-center justify-center space-x-2"
        >
          <span>Começar Planejamento</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  const renderQuantity = () => (
    <div className="max-w-xl mx-auto space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <BookOpen className="text-teal-600" />
        Quantas disciplinas você vai estudar?
      </h2>
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
        <label className="block text-sm font-medium text-slate-700 mb-2">Número de Disciplinas (1-15)</label>
        <input
          type="number"
          min="1"
          max="15"
          value={data.subjectCount}
          onChange={(e) => {
            const count = parseInt(e.target.value) || 1;
            const validCount = Math.max(1, Math.min(15, count));
            // Adjust array size
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
          className="w-full px-4 py-3 rounded-lg border border-black bg-white focus:ring-2 focus:ring-teal-500 outline-none text-lg text-slate-900"
        />
      </div>
      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep(AppStep.WELCOME)}
          className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={() => setStep(AppStep.INTERVIEW_SUBJECTS)}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
        >
          Próximo: Detalhar Disciplinas
        </button>
      </div>
    </div>
  );

  const renderSubjects = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Detalhes das Disciplinas</h2>
        <button onClick={addSubject} className="text-teal-600 hover:text-teal-700 flex items-center gap-1 font-medium">
          <Plus className="w-4 h-4" /> Adicionar
        </button>
      </div>
      
      <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar p-1">
        {data.subjects.map((subject, index) => (
          <div key={subject.id} className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 transition-shadow hover:shadow-md">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome da Disciplina</label>
                <input
                  type="text"
                  placeholder="Ex: Cardiologia"
                  value={subject.name}
                  onChange={(e) => handleSubjectChange(subject.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-black bg-white focus:border-teal-500 outline-none text-slate-900"
                />
              </div>
              
              <div className="w-full md:w-32 space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dificuldade</label>
                <select
                  value={subject.difficulty}
                  onChange={(e) => handleSubjectChange(subject.id, 'difficulty', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-black bg-white focus:border-teal-500 outline-none text-slate-900"
                >
                  <option value={Difficulty.FACIL}>Fácil</option>
                  <option value={Difficulty.MEDIO}>Médio</option>
                  <option value={Difficulty.DIFICIL}>Difícil</option>
                </select>
              </div>

              <div className="w-full md:w-24 space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prioridade</label>
                <input
                  type="number"
                  min="1"
                  value={subject.priority}
                  onChange={(e) => handleSubjectChange(subject.id, 'priority', parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-black bg-white focus:border-teal-500 outline-none text-slate-900"
                />
              </div>

              <div className="flex-1 space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Objetivo</label>
                <select
                  value={subject.goal}
                  onChange={(e) => handleSubjectChange(subject.id, 'goal', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-black bg-white focus:border-teal-500 outline-none text-slate-900"
                >
                  <option>Revisar base</option>
                  <option>Fixar detalhes</option>
                  <option>Treinar questões</option>
                  <option>Simulados</option>
                </select>
              </div>

              <div className="flex items-end pb-2">
                <button 
                  onClick={() => removeSubject(subject.id)}
                  className="text-red-400 hover:text-red-600 transition-colors p-2"
                  disabled={data.subjects.length === 1}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep(AppStep.INTERVIEW_QUANTITY)}
          className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={() => {
            // Simple validation
            const hasEmpty = data.subjects.some(s => !s.name.trim());
            if (hasEmpty) {
              alert("Por favor, preencha o nome de todas as disciplinas.");
              return;
            }
            setStep(AppStep.INTERVIEW_LOGISTICS);
          }}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
        >
          Próximo: Logística
        </button>
      </div>
    </div>
  );

  const renderLogistics = () => (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <Clock className="text-teal-600" />
        Logística e Preferências
      </h2>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Horas de estudo (dia)</label>
            <input
              type="number"
              min="1"
              max="24"
              value={data.hoursPerDay}
              onChange={(e) => setData({ ...data, hoursPerDay: parseInt(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg border border-black bg-white focus:ring-2 focus:ring-teal-500 outline-none text-slate-900"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Dias por semana</label>
            <input
              type="number"
              min="1"
              max="7"
              value={data.daysPerWeek}
              onChange={(e) => setData({ ...data, daysPerWeek: parseInt(e.target.value) })}
              className="w-full px-4 py-2 rounded-lg border border-black bg-white focus:ring-2 focus:ring-teal-500 outline-none text-slate-900"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Horário preferencial (ex: 08:00-12:00)</label>
          <input
            type="text"
            value={data.timeSlots}
            onChange={(e) => setData({ ...data, timeSlots: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-black bg-white focus:ring-2 focus:ring-teal-500 outline-none text-slate-900"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="block text-sm font-medium text-slate-700">Foco em Metodologia Ativa</label>
            <span className="text-sm font-bold text-teal-600">{data.activeMethodologyFocus}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="10"
            value={data.activeMethodologyFocus}
            onChange={(e) => setData({ ...data, activeMethodologyFocus: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
          <p className="text-xs text-slate-500">Recomendado: 80%+</p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep(AppStep.INTERVIEW_SUBJECTS)}
          className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
        >
          Voltar
        </button>
        <button
          onClick={() => onComplete(data)}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Gerar Cronograma
        </button>
      </div>
    </div>
  );

  switch (step) {
    case AppStep.WELCOME: return renderWelcome();
    case AppStep.INTERVIEW_QUANTITY: return renderQuantity();
    case AppStep.INTERVIEW_SUBJECTS: return renderSubjects();
    case AppStep.INTERVIEW_LOGISTICS: return renderLogistics();
    default: return null;
  }
};