export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  subject: string;
  difficulty: Difficulty;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  totalMocks: number;
}

export interface Mock {
  id: string;
  examId: string;
  title: string;
  durationInMinutes: number;
  questions: Question[];
  totalMarks: number;
}

export interface AttemptResult {
  id: string;
  mockId: string;
  userId: string;
  score: number;
  totalScore: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  timeTakenInSeconds: number;
  answers: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];
  timestamp: string;
}