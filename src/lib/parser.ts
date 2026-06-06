/**
 * @fileOverview Institutional High-Fidelity Ingestion Engine v5.0.
 * Features: Absolute Formatting Cleanse, Bilingual Pipe Detection,
 * and Auto-Sequential Numbering.
 */

import { Question, Difficulty, ContentStatus } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
  confidence: number;
}

/**
 * Splits text into blocks based on '---' or question markers.
 */
function splitIntoBlocks(text: string): string[] {
  // Split by horizontal line separator or question number patterns
  const parts = text.split(/\n\s*---\s*\n/);
  if (parts.length > 1) return parts.filter(p => p.trim().length > 10);

  // Fallback: split by Q1, Q2...
  const boundaryRegex = /(?:\n|^)\s*(?:\*\*)?(?:Q|Question|QUESTION NO\.)?\s*\d+[\.\):\s-]*/gi;
  return text.split(boundaryRegex).filter(p => p.trim().length > 10);
}

export function parseBulkQuestions(
  rawText: string,
  metadata: {
    boardId: string;
    examId: string;
    subjectId: string;
    chapterId: string;
    difficulty: Difficulty;
    status: ContentStatus;
  }
): ParsedResults {
  const questions: Partial<Question>[] = [];
  const errors: string[] = [];
  
  const blocks = splitIntoBlocks(rawText);

  blocks.forEach((block, index) => {
    try {
      const parsed = parseFidelityBlock(block, metadata);
      questions.push({
        ...parsed,
        displayId: `Q${index + 1}`, // Auto-sequential numbering
        status: metadata.status || "PUBLISHED",
      });
    } catch (err: any) {
      errors.push(`Block ${index + 1}: ${err.message}`);
    }
  });

  const confidence = blocks.length > 0 ? Math.round((questions.length / blocks.length) * 100) : 0;
  return { questions, errors, confidence };
}

function parseFidelityBlock(block: string, metadata: any): Partial<Question> {
  // 1. Clean stars and unwanted formatting
  const cleanBlock = block.replace(/\*\*/g, '').trim();

  // 2. Extract Question (Bilingual split by first newline)
  const lines = cleanBlock.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let questionEn = lines[0] || "";
  let questionPa = "";
  
  // Strip leading question markers from EN question
  questionEn = questionEn.replace(/^(?:Q|Question|QUESTION NO\.)?\s*\d+[\.\):\s-]*/i, '').trim();

  // If second line isn't an option, it's Punjabi question
  if (lines[1] && !lines[1].match(/^[A-D][\.\)]/i)) {
    questionPa = lines[1];
  }

  // 3. Extract Options with Pipe Support
  const options: Record<string, { en: string; pa: string }> = {};
  const optionRegex = /(?:\n|^)\s*([A-D])[\.\)]\s*(.*)/gi;
  let match;
  while ((match = optionRegex.exec(cleanBlock)) !== null) {
    const label = match[1].toUpperCase();
    const content = match[2].trim();
    if (content.includes('|')) {
      const [en, pa] = content.split('|').map(s => s.trim());
      options[label] = { en, pa };
    } else {
      options[label] = { en: content, pa: "" };
    }
  }

  // 4. Extract Answer & Explanation
  const answerMatch = cleanBlock.match(/(?:Correct Answer|ਸਹੀ ਉੱਤਰ|Answer|ਜਵਾਬ):?\s*([A-D])/i);
  const correctAnswer = (answerMatch?.[1].toUpperCase() || "A") as 'A' | 'B' | 'C' | 'D';

  const expMatch = cleanBlock.match(/(?:Explanation|ਵਿਆਖਿਆ):?\s*([\s\S]*)$/i);
  const expPart = expMatch ? expMatch[1].trim() : "";
  
  // Split explanation if bilingual markers present
  let explanationEn = expPart;
  let explanationPa = "";
  if (expPart.includes('ਵਿਆਖਿਆ:')) {
    const parts = expPart.split(/ਵਿਆਖਿਆ:/);
    explanationEn = parts[0].trim();
    explanationPa = parts[1].trim();
  }

  return {
    ...metadata,
    questionType: 'MCQ',
    questionEn,
    questionPa: questionPa || questionEn,
    optionAEn: options['A']?.en || "Option A",
    optionAPa: options['A']?.pa || "",
    optionBEn: options['B']?.en || "Option B",
    optionBPa: options['B']?.pa || "",
    optionCEn: options['C']?.en || "Option C",
    optionCPa: options['C']?.pa || "",
    optionDEn: options['D']?.en || "Option D",
    optionDPa: options['D']?.pa || "",
    correctAnswer,
    explanationEn,
    explanationPa
  };
}
