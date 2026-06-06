/**
 * @fileOverview Institutional High-Fidelity Ingestion Engine v10.0.
 * Optimized for: "Question En / Question Pa" and "(A) Opt En / Opt Pa" format.
 */

import { Question } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
  confidence: number;
}

const sanitizeText = (text: string = "") => {
  return text
    .replace(/^\*\*|\*\*$/g, '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export function parseBulkQuestions(
  rawText: string,
  metadata: any
): ParsedResults {
  // Split by Question markers (Q1, Q2, Q24, etc.)
  const blocks = rawText.split(/(?=Q\d+[\.\):\s-])/g).filter(p => p.trim().length > 10);
  
  const parsed = blocks.map((block, index) => {
    try {
      const q = parseStandardBlock(block, metadata);
      if (!q.questionEn) return null;
      return {
        ...q,
        displayId: `Q${index + 1}`,
        status: metadata.status || "PUBLISHED",
      };
    } catch (err: any) {
      return null;
    }
  }).filter(Boolean) as Partial<Question>[];

  const confidence = blocks.length > 0 ? Math.round((parsed.length / blocks.length) * 100) : 0;
  return { questions: parsed, errors: [], confidence };
}

function parseStandardBlock(block: string, metadata: any): Partial<Question> {
  // 1. Extract Question Statement (Everything before (A))
  const qMatch = block.match(/Q\d+[\.\):\s-](.*?)(?=\s*\(A\))/s);
  const qFullText = qMatch ? qMatch[1].trim() : "";
  let questionEn = qFullText;
  let questionPa = qFullText;

  if (qFullText.includes('/')) {
    const parts = qFullText.split('/');
    questionEn = sanitizeText(parts[0]);
    questionPa = sanitizeText(parts[1] || parts[0]);
  }

  // 2. Extract Options (A, B, C, D)
  const options: Record<string, { en: string; pa: string }> = {};
  ['A', 'B', 'C', 'D'].forEach(label => {
    const nextLabel = label === 'A' ? 'B' : label === 'B' ? 'C' : label === 'C' ? 'D' : 'Correct Answer';
    const regex = new RegExp(`\\(${label}\\)(.*?)(?=\\s*\\(${nextLabel}\\)|\\s*${nextLabel}|$)`, 's');
    const match = block.match(regex);
    if (match) {
      const optText = match[1].trim();
      if (optText.includes('/')) {
        const parts = optText.split('/');
        options[label] = { en: sanitizeText(parts[0]), pa: sanitizeText(parts[1] || parts[0]) };
      } else {
        options[label] = { en: sanitizeText(optText), pa: "" };
      }
    }
  });

  // 3. Extract Correct Answer
  const answerMatch = block.match(/(?:Correct Answer|ਸਹੀ ਉੱਤਰ|Answer|ਜਵਾਬ):?\s*(?:\()?\s*([A-D])\s*(?:\))?/i);
  const correctAnswer = (answerMatch?.[1].toUpperCase() || "A") as 'A' | 'B' | 'C' | 'D';

  // 4. Extract Explanations
  const engExpMatch = block.match(/English Explanation:\s*(.*?)(?=\s*\*|Punjabi Explanation|$)/s);
  const punExpMatch = block.match(/Punjabi Explanation:\s*(.*)$/s);

  const explanationEn = sanitizeText(engExpMatch?.[1] || "");
  const explanationPa = sanitizeText(punExpMatch?.[1] || "");

  return {
    ...metadata,
    questionType: 'MCQ',
    questionEn,
    questionPa,
    optionAEn: options['A']?.en || "Option A",
    optionAPa: options['A']?.pa || "",
    optionBEn: options['B']?.en || "Option B",
    optionBPa: options['B']?.pa || "",
    optionCEn: options['C']?.en || "Option C",
    optionCPa: options['C']?.pa || "",
    optionDEn: options['D']?.en || "Option D",
    optionDPa: options['D']?.pa || "",
    correctAnswer,
    explanationEn: explanationEn || explanationPa,
    explanationPa: explanationPa || explanationEn
  };
}
