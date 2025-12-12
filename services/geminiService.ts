import { GoogleGenAI } from "@google/genai";
import { InterviewData, PlannerOutput } from "../types";
import { SYSTEM_PROMPT } from "../constants";

const getClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateStudyPlan = async (data: InterviewData): Promise<PlannerOutput> => {
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

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userContext,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
      },
    });

    if (!response.text) {
      throw new Error("No response text from Gemini");
    }

    const jsonResponse = JSON.parse(response.text) as PlannerOutput;
    return jsonResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};