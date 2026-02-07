export interface UserConfig {
  daysPerWeek: number;
  dailyTargets: {
    contacts: number;
    conversations: number;
    meetings: number;
  };
  focus: 'prospecting' | 'meetings' | 'conversion';
  isOnboarded: boolean;
}

export interface DailyLog {
  date: string; // ISO Date string YYYY-MM-DD
  contacts: number;
  conversations: number;
  meetings: number;
}

export enum RhythmStatus {
  LOW = 'BAIXO',
  MEDIUM = 'MÉDIO',
  HEALTHY = 'SAUDÁVEL',
}

export interface Lesson {
  id: number;
  pillar: string;
  title: string;
  content: string;
}

export type ViewState = 'dashboard' | 'log' | 'guidance' | 'settings';
