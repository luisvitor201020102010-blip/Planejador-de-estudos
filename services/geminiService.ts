import { GoogleGenAI } from "@google/genai";
import { InterviewData, PlannerOutput } from "../types";
import { SYSTEM_PROMPT } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("A chave de API não foi configurada. Se você está na Vercel, adicione a variável de ambiente 'API_KEY' nas configurações do projeto.");
  }
  
  return new GoogleGenAI({ apiKey });
};

export const generateStudyPlan = async (data: InterviewData): Promise<PlannerOutput> => {
  try {
    const ai = getClient();

    const userContext = `
      DADOS DO USUÁRIO (ENTREVISTA):
      
      Nome do Aluno: ${data.userName}

      1. Disciplinas (${data.subjectCount}):
      ${data.subjects.map(s => 
        `- ${s.name}: Dificuldade ${s.difficulty}, Prioridade ${s.priority}, Objetivo: ${s.goal}`
      ).join('\n')}

      2. Logística:
      - Horas por dia: ${data.hoursPerDay}
      - Dias por semana: ${data.daysPerWeek}
      - Duração do cronograma: ${data.durationWeeks} semanas
      - Horário preferencial: ${data.timeSlots}

      3. Metodologia:
      - Foco em Metodologia Ativa: ${data.activeMethodologyFocus}%
      - Metodologias obrigatórias: ${data.methodologies.join(', ')}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userContext,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
      },
    });

    if (!response.text) {
      throw new Error("A IA não retornou texto. Tente novamente.");
    }

    const jsonResponse = JSON.parse(response.text) as PlannerOutput;
    return jsonResponse;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Re-throw with a user-friendly message if possible
    if (error.message.includes("API_KEY")) {
      throw error; // Keep original message for config errors
    }
    throw new Error(`Erro na geração: ${error.message || "Tente novamente mais tarde."}`);
  }
};