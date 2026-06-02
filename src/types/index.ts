
export type Difficulty = 'easy' | 'medium' | 'hard';
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STUDENT';
export type MockType = 'FULL' | 'SUBJECT' | 'SECTIONAL' | 'PYQ';

export interface Board {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  iconUrl?: string;
}

export interface Exam {
  id: string;
  boardId: string;
  name: string;
  category: string;
  description: string;
  totalMocks: number;
  activeQuestions: number;
  duration?: number;
}

export interface Series {
  id: string;
  title: string;
  examId: string;
  boardId: string;
  description: string;
  isPremium: boolean;
  mockCount?: number;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
}

export interface Question {
  id: string;
  boardId: string;
  examId: string;
  subjectId: string;
  difficulty: Difficulty;
  topic?: string;

  // Bilingual Content
  questionEn: string;
  questionPa: string;

  // Options Mapping - English
  optionAEn: string;
  optionBEn: string;
  optionCEn: string;
  optionDEn: string;

  // Options Mapping - Punjabi
  optionAPa: string;
  optionBPa: string;
  optionCPa: string;
  optionDPa: string;

  correctAnswer: 'A' | 'B' | 'C' | 'D';

  explanationEn: string;
  explanationPa: string;

  createdAt: any;
  author?: string;
}

export interface MockTest {
  id: string;
  title: string;
  seriesId?: string;
  boardId: string;
  examId: string;
  subjectId?: string;
  mockType: MockType;
  duration: number;
  totalQuestions: number;
  questionIds: string[];
  difficulty: string;
  published: boolean;
  createdAt: any;
  author?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  state: 'Punjab';
  targetExam: string;
  createdAt: any;
  status: 'Pro' | 'Free';
  planId?: string;
  bestScore?: number;
  rank?: string;
}

export interface RevisionItem {
  id: string;
  userId: string;
  questionId: string;
  questionText: string;
  type: 'BOOKMARK' | 'WRONG_ATTEMPT' | 'MARKED_FOR_REVIEW';
  subjectId: string;
  timestamp: any;
}
