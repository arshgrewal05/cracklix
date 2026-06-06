
/**
 * @fileOverview Institutional High-Fidelity Ingestion Engine v6.0.
 * Permanent Fix: Strict artifact sanitization, pipe-based bilingual splitting, and auto-indexing.
 */

import { Question, Difficulty, ContentStatus } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
  confidence: number;
}

function splitIntoBlocks(text: string): string[] {
  const parts = text.split(/\n\s*---\s*\n/);
  if (parts.length > 1) return parts.filter(p => p.trim().length > 10);

  const boundaryRegex = /(?:\n|^)\s*(?:\*\*)?(?:Q|Question|QUESTION NO\.)?\s*\d+[\.\):\s-]*/gi;
  return text.split(boundaryRegex).filter(p => p.trim().length > 10);
}

// Utility to clean text artifacts (A., 1., **, etc)
const sanitizeText = (text: string = "") => {
  return text
    .replace(/^[A-D][\.\):\s-]*/i, '') // Remove A., B) etc
    .replace(/^\d+[\.\):\s-]*/, '')    // Remove leading numbers
    .replace(/\*\*/g, '')              // Remove stars
    .trim();
};

export function parseBulkQuestions(
  rawText: string,
  metadata: any
): ParsedResults {
  const questions: Partial<Question>[];
  const errors: string[] = [];
  
  const blocks = splitIntoBlocks(rawText);

  const parsed = blocks.map((block, index) => {
    try {
      const q = parseFidelityBlock(block, metadata);
      return {
        ...q,
        displayId: `Q${index + 1}`, // Auto-sequential numbering
        status: metadata.status || "PUBLISHED",
      };
    } catch (err: any) {
      errors.push(`Block ${index + 1}: ${err.message}`);
      return null;
    }
  }).filter(Boolean) as Partial<Question>[];

  const confidence = blocks.length > 0 ? Math.round((parsed.length / blocks.length) * 100) : 0;
  return { questions: parsed, errors, confidence };
}

function parseFidelityBlock(block: string, metadata: any): Partial<Question> {
  const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  // 1. Identify Statement (Bilingual)
  // If line 0 is English and line 1 is Punjabi
  let questionEn = sanitizeText(lines[0]);
  let questionPa = "";
  if (lines[1] && !lines[1].match(/^[A-D][\.\)]/i)) {
    questionPa = sanitizeText(lines[1]);
  }

  // 2. Extract Options with Pipe Support
  const options: Record<string, { en: string; pa: string }> = {};
  const optionRegex = /(?:\n|^)\s*([A-D])[\.\)]\s*(.*)/gi;
  let match;
  while ((match = optionRegex.exec(block)) !== null) {
    const label = match[1].toUpperCase();
    const content = match[2].trim();
    if (content.includes('|')) {
      const [en, pa] = content.split('|').map(s => sanitizeText(s));
      options[label] = { en, pa };
    } else {
      options[label] = { en: sanitizeText(content), pa: "" };
    }
  }

  // 3. Extract Answer & Explanation
  const answerMatch = block.match(/(?:Correct Answer|ਸਹੀ ਉੱਤਰ|Answer|ਜਵਾਬ):?\s*([A-D])/i);
  const correctAnswer = (answerMatch?.[1].toUpperCase() || "A") as 'A' | 'B' | 'C' | 'D';

  const expMatch = block.match(/(?:Explanation|ਵਿਆਖਿਆ):?\s*([\s\S]*)$/i);
  const expPart = expMatch ? expMatch[1].trim() : "";
  
  let explanationEn = expPart;
  let explanationPa = "";
  if (expPart.includes('ਵਿਆਖਿਆ:')) {
    const parts = expPart.split(/ਵਿਆਖਿਆ:/);
    explanationEn = sanitizeText(parts[0]);
    explanationPa = sanitizeText(parts[1]);
  } else {
    explanationEn = sanitizeText(expPart);
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
