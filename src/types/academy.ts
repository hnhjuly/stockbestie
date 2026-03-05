export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export type QuestionTier = 'basic' | 'understanding' | 'situation';

export interface LessonQuestion {
  id: string;
  tier: QuestionTier;
  question: string;
  options: QuizOption[];
  explanation: string;
  explanationExtended?: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  icon: string;
  questions: LessonQuestion[];
}
