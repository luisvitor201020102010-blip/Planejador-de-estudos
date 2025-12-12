export enum Difficulty {
  FACIL = 'Fácil',
  MEDIO = 'Médio',
  DIFICIL = 'Difícil',
}

export interface Subject {
  id: string;
  name: string;
  difficulty: Difficulty;
  priority: number;
  goal: string;
}

export interface InterviewData {
  subjectCount: number;
  subjects: Subject[];
  hoursPerDay: number;
  daysPerWeek: number;
  durationWeeks: number;
  timeSlots: string;
  activeMethodologyFocus: number; // 0-100
  methodologies: string[];
}

// JSON Structure defined by the user prompt
export interface SheetRow {
  [key: string]: string | number | boolean | null;
}

export interface Sheet {
  name: string;
  rows: (string | number | boolean | null)[][]; // The AI returns rows as arrays of values
}

export interface PlannerOutput {
  file_name: string;
  sheets: Sheet[];
}

export enum AppStep {
  WELCOME,
  INTERVIEW_QUANTITY,
  INTERVIEW_SUBJECTS,
  INTERVIEW_LOGISTICS,
  GENERATING,
  DASHBOARD,
}