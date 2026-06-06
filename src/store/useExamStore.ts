import { create } from 'zustand';
import { AttemptState, ExamLanguage, QuestionStatus, Question } from '@/types';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

/**
 * @fileOverview Enterprise CBT Global Store v17.0.
 * Hardened: atomic state updates and stable Firestore registry access.
 * Replaced window fallback with official initialization node.
 */

interface ExamStore extends AttemptState {
  questions: Question[];
  mockId: string;
  mockTitle: string;
  userId: string;
  language: ExamLanguage;
  isPaused: boolean;
  isSubmitting: boolean;
  isPaletteVisible: boolean;

  // Actions
  initExam: (mockId: string, mockTitle: string, userId: string, questions: Question[], duration: number, savedState?: any) => void;
  setLanguage: (lang: ExamLanguage) => void;
  setPaused: (paused: boolean) => void;
  setPaletteVisible: (visible: boolean) => void;
  togglePalette: () => void;
  setCurrentIdx: (idx: number) => void;
  setAnswer: (idx: number, optionIdx: number | null, db: any) => Promise<void>;
  clearAnswer: (idx: number, db: any) => Promise<void>;
  markForReview: (idx: number, db: any) => Promise<void>;
  saveAndNext: (db: any) => void;
  tick: () => void;
  addViolation: (db: any) => void;
  toggleBookmark: (idx: number, db: any) => void;
}

export const useExamStore = create<ExamStore>((set, get) => ({
  questions: [],
  mockId: '',
  mockTitle: '',
  userId: '',
  language: 'bilingual',
  isPaused: false,
  isSubmitting: false,
  isPaletteVisible: true,

  answers: {},
  status: {},
  visited: [0],
  bookmarks: [],
  timeLeft: 0,
  currentIdx: 0,
  currentSectionId: '',
  violations: 0,
  startTime: 0,
  endTime: 0,

  initExam: (mockId, mockTitle, userId, questions, duration, savedState) => {
    const now = Date.now();
    const endTime = savedState?.endTime || now + (duration * 60 * 1000);
    const timeLeft = Math.max(0, Math.floor((endTime - now) / 1000));
    
    set({
      mockId,
      mockTitle,
      userId,
      questions,
      timeLeft,
      startTime: savedState?.startTime || now,
      endTime,
      answers: savedState?.answers || {},
      status: savedState?.status || {},
      visited: Array.from(new Set([...(savedState?.visited || []), 0])),
      bookmarks: savedState?.bookmarks || [],
      violations: savedState?.violations || 0,
      currentIdx: savedState?.currentIdx || 0,
      currentSectionId: questions[savedState?.currentIdx || 0]?.sectionId || '',
      isPaused: false,
      isSubmitting: false
    });
  },

  setLanguage: (language) => set({ language }),
  setPaused: (isPaused) => set({ isPaused }),
  setPaletteVisible: (isPaletteVisible) => set({ isPaletteVisible }),
  togglePalette: () => set((state) => ({ isPaletteVisible: !state.isPaletteVisible })),

  setCurrentIdx: (idx) => {
    const { visited, questions, userId, mockId } = get();
    if (idx < 0 || idx >= questions.length) return;
    
    const newVisited = Array.from(new Set([...visited, idx]));
    set({ 
      currentIdx: idx, 
      visited: newVisited,
      currentSectionId: questions[idx]?.sectionId || ''
    });
    
    if (userId && mockId) {
      const { firestore: db } = initializeFirebase();
      updateDoc(doc(db, 'attempts', `${userId}_${mockId}`), {
         currentIdx: idx,
         visited: newVisited,
         updatedAt: serverTimestamp()
      }).catch(() => {});
    }
  },

  setAnswer: async (idx, optionIdx, db) => {
    const { answers, status, userId, mockId } = get();
    if (!userId || !mockId) return;

    const newAnswers = { ...answers };
    const newStatus = { ...status };

    if (optionIdx === null) {
      delete newAnswers[idx];
      newStatus[idx] = 'not-answered';
    } else {
      newAnswers[idx] = optionIdx;
      newStatus[idx] = 'answered';
    }

    set({ answers: newAnswers, status: newStatus });

    const attemptRef = doc(db, 'attempts', `${userId}_${mockId}`);
    updateDoc(attemptRef, {
      [`answers.${idx}`]: optionIdx,
      [`status.${idx}`]: newStatus[idx],
      updatedAt: serverTimestamp()
    }).catch(() => {});
  },

  clearAnswer: async (idx, db) => {
    const { answers, status, userId, mockId } = get();
    if (!userId || !mockId) return;

    const newAnswers = { ...answers };
    const newStatus = { ...status };
    delete newAnswers[idx];
    newStatus[idx] = 'not-answered';
    set({ answers: newAnswers, status: newStatus });

    const attemptRef = doc(db, 'attempts', `${userId}_${mockId}`);
    updateDoc(attemptRef, {
      [`answers.${idx}`]: null,
      [`status.${idx}`]: 'not-answered',
      updatedAt: serverTimestamp()
    }).catch(() => {});
  },

  markForReview: async (idx, db) => {
    const { status, answers, userId, mockId } = get();
    if (!userId || !mockId) return;

    const newStatus = { ...status };
    const hasAnswer = answers[idx] !== undefined;
    newStatus[idx] = hasAnswer ? 'answered-marked' : 'marked';
    set({ status: newStatus });

    const attemptRef = doc(db, 'attempts', `${userId}_${mockId}`);
    updateDoc(attemptRef, {
      [`status.${idx}`]: newStatus[idx],
      updatedAt: serverTimestamp()
    }).catch(() => {});
    
    get().saveAndNext(db);
  },

  saveAndNext: (db) => {
    const { currentIdx, questions, userId, mockId, visited } = get();
    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1;
      const newVisited = Array.from(new Set([...visited, nextIdx]));
      set({ 
        currentIdx: nextIdx, 
        visited: newVisited,
        currentSectionId: questions[nextIdx]?.sectionId || ''
      });
      
      if (userId && mockId) {
        const attemptRef = doc(db, 'attempts', `${userId}_${mockId}`);
        updateDoc(attemptRef, {
          currentIdx: nextIdx,
          visited: newVisited,
          updatedAt: serverTimestamp()
        }).catch(() => {});
      }
    }
  },

  tick: () => {
    const { endTime, isPaused, isSubmitting } = get();
    if (!isPaused && !isSubmitting && endTime > 0) {
      const now = Date.now();
      const remain = Math.max(0, Math.floor((endTime - now) / 1000));
      if (get().timeLeft !== remain) {
        set({ timeLeft: remain });
      }
    }
  },

  addViolation: async (db) => {
    const { violations, userId, mockId } = get();
    if (!userId || !mockId) return;
    
    const newVal = (violations || 0) + 1;
    set({ violations: newVal });
    updateDoc(doc(db, 'attempts', `${userId}_${mockId}`), { 
      violations: newVal,
      updatedAt: serverTimestamp()
    }).catch(() => {});
  },

  toggleBookmark: async (idx, db) => {
    const { bookmarks, userId, mockId } = get();
    if (!userId || !mockId) return;

    const next = bookmarks.includes(idx) ? bookmarks.filter(i => i !== idx) : [...bookmarks, idx];
    set({ bookmarks: next });
    updateDoc(doc(db, 'attempts', `${userId}_${mockId}`), { 
      bookmarks: next,
      updatedAt: serverTimestamp()
    }).catch(() => {});
  }
}));
