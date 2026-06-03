/**
 * @fileOverview Hardened Trilingual Bulk MCQ Extraction Engine.
 * Optimized for targeting specific language nodes (EN/PA/HI) and multi-subject pastes.
 * Supports auto-detection of Mock Metadata (Title, Time) and Section/Part headers.
 */

import { Question, Difficulty } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  mockMetadata?: {
    title?: string;
    duration?: number;
    totalQuestions?: number;
  };
}

export function parseBulkQuestions(
  rawText: string, 
  metadata: { boardId: string; examId: string; subjectId: string; difficulty: Difficulty; targetLang: "En" | "Pa" | "Hi" }
): ParsedResults {
  const lines = rawText.split('\n');
  const questions: Partial<Question>[] = [];
  let currentQuestion: any = null;
  const lang = metadata.targetLang;
  
  let detectedTitle = "";
  let detectedDuration = 0;
  let detectedTotal = 0;

  const isQuestionStart = (line: string) => /^(Q\d+|Question\s*\d+|Q\.\s*\d+|\d+)[\.\:\)]/i.test(line.trim());
  const isOption = (line: string) => /^[A-D][\.\:\)]/i.test(line.trim());
  const isAnswer = (line: string) => /^(Answer|Key|Ans|Correct|Correct Answer)[\:\-]/i.test(line.trim());
  const isExplanation = (line: string) => /^(Explanation|Solution|Rationale|Details|Explanation\/Solution)[\:\-]/i.test(line.trim());
  const isSubject = (line: string) => /^(Subject|S\:|PART\-[A-Z]|Section)[\:\-]/i.test(line.trim());

  // Subject ID mapping helper
  const mapSubject = (val: string): string => {
    const cleaned = val.toLowerCase();
    if (cleaned.includes('punjabi')) return 'punjabi-qualifying';
    if (cleaned.includes('gk') || cleaned.includes('history')) return 'punjab-history';
    if (cleaned.includes('polity') || cleaned.includes('current')) return 'gk-ca';
    if (cleaned.includes('math') || cleaned.includes('aptitude')) return 'math';
    if (cleaned.includes('reasoning')) return 'reasoning';
    if (cleaned.includes('english')) return 'english';
    if (cleaned.includes('computer') || cleaned.includes('it')) return 'ict';
    return metadata.subjectId || 'gk-ca';
  };

  let activeSubjectId = metadata.subjectId;

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // First 10 lines: Look for Mock Metadata
    if (idx < 15) {
      if (trimmed.toUpperCase().includes('MOCK TEST') && !detectedTitle) {
        detectedTitle = trimmed;
      }
      if (trimmed.toLowerCase().includes('time allowed')) {
        const match = trimmed.match(/\d+/);
        if (match) detectedDuration = parseInt(match[0]);
      }
      if (trimmed.toLowerCase().includes('total questions')) {
        const match = trimmed.match(/\d+/);
        if (match) detectedTotal = parseInt(match[0]);
      }
    }

    if (isSubject(trimmed)) {
      const subjectName = trimmed.replace(/^(Subject|S\:|PART\-[A-Z]|Section)[\:\-]\s*/i, '');
      activeSubjectId = mapSubject(subjectName);
      return;
    }

    if (isQuestionStart(trimmed)) {
      if (currentQuestion) questions.push(currentQuestion);
      currentQuestion = {
        boardId: metadata.boardId,
        examId: metadata.examId,
        subjectId: activeSubjectId,
        difficulty: metadata.difficulty,
        correctAnswer: 'A',
        createdAt: new Date().toISOString()
      };
      currentQuestion[`question${lang}`] = trimmed.replace(/^(Q\d+|Question\s*\d+|Q\.\s*\d+|\d+)[\.\:\)]\s*/i, '');
    } else if (currentQuestion) {
      if (isOption(trimmed)) {
        const char = trimmed[0].toUpperCase();
        currentQuestion[`option${char}${lang}`] = trimmed.substring(2).trim();
      } else if (isAnswer(trimmed)) {
        const match = trimmed.match(/[A-D]/i);
        if (match) currentQuestion.correctAnswer = match[0].toUpperCase();
      } else if (isExplanation(trimmed)) {
        currentQuestion[`explanation${lang}`] = trimmed.replace(/^(Explanation|Solution|Rationale|Details|Explanation\/Solution)[\:\-]\s*/i, '');
      } else {
        // Append to current question text if no prefix matches
        if (!currentQuestion[`question${lang}`]) currentQuestion[`question${lang}`] = "";
        currentQuestion[`question${lang}`] += ' ' + trimmed;
      }
    }
  });

  if (currentQuestion) questions.push(currentQuestion);

  return {
    questions: questions.filter(q => q[`question${lang}`] && q[`optionA${lang}`]),
    mockMetadata: {
      title: detectedTitle,
      duration: detectedDuration,
      totalQuestions: detectedTotal || questions.length
    }
  };
}
