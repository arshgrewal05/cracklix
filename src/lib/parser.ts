/**
 * @fileOverview Exam-Grade Regex Parser for Deterministic Ingestion.
 * Strictly non-AI. Deterministic pattern matching for English/Punjabi MCQs.
 * Optimized for Testbook/PSSSB style data blocks.
 */

import { Question } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
}

export function parseBulkQuestions(rawText: string, metadata: any): ParsedResults {
  // Normalize line endings and split by Q followed by a number
  const cleanRaw = rawText.replace(/\r\n/g, '\n');
  
  // Pattern to find boundaries of questions (e.g., Q1., Q24., Q100.)
  const blocks = cleanRaw.split(/\n(?=Q\d+[\.\s])/g).filter(b => b.trim().length > 10);
  
  // Fallback for cases where the very first question doesn't have a preceding newline
  if (blocks.length === 1 && !blocks[0].trim().startsWith('Q')) {
    const initialSplit = cleanRaw.split(/(?=Q\d+[\.\s])/g).filter(b => b.trim().length > 10);
    if (initialSplit.length > 0 && initialSplit[0].trim().startsWith('Q')) {
      return parseBlocks(initialSplit, metadata);
    }
  }

  return parseBlocks(blocks, metadata);
}

function parseBlocks(blocks: string[], metadata: any): ParsedResults {
  const questions: Partial<Question>[] = [];
  const errors: string[] = [];

  blocks.forEach((block, index) => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 3) return;

    try {
      const q: any = { 
        ...metadata,
        id: `temp-${Date.now()}-${index}`,
        status: metadata.status || "PUBLISHED",
        isStandalone: true,
        questionEn: "",
        questionPa: "",
        optionAEn: "", optionAPa: "",
        optionBEn: "", optionBPa: "",
        optionCEn: "", optionCPa: "",
        optionDEn: "", optionDPa: "",
        correctAnswer: "",
        explanationEn: "",
        explanationPa: ""
      };

      // 1. Extract Question Text
      // The first line is English, second is Punjabi (if it doesn't look like an option)
      q.questionEn = lines[0].replace(/^Q\d+[\.\s]*/i, '').trim();

      let nextIdx = 1;
      if (lines[nextIdx] && !lines[nextIdx].match(/^\(?[A-D][\.\)\s]/i)) {
        q.questionPa = lines[nextIdx].replace(/^(ਪ੍ਰਸ਼ਨ|ਪ੍ਰਸ਼ਨ)\s*\d+[\.\s]*/, '').trim();
        nextIdx++;
      }

      // 2. Extract Options (A-D)
      const optionPattern = /^\(?([A-D])[\.\)\s]+(.*)/i;
      for (let i = nextIdx; i < lines.length; i++) {
        const line = lines[i];
        const optMatch = line.match(optionPattern);
        if (optMatch) {
          const letter = optMatch[1].toUpperCase();
          const content = optMatch[2].trim();
          
          // Split by / to handle bilingual options: "84 cm² / 84 ਵਰਗ ਸੈਂਟੀਮੀਟਰ"
          if (content.includes('/')) {
            const parts = content.split('/');
            q[`option${letter}En`] = parts[0]?.trim() || "";
            q[`option${letter}Pa`] = parts[1]?.trim() || "";
          } else {
            q[`option${letter}En`] = content;
          }
        }
      }

      // 3. Extract Correct Answer
      const ansLine = lines.find(l => l.toLowerCase().includes('correct answer') || l.toLowerCase().startsWith('ans:'));
      if (ansLine) {
        const match = ansLine.match(/(?:correct answer|ans)[:\s]*\(?([A-D])\)?/i);
        if (match) q.correctAnswer = match[1].toUpperCase();
      }

      // 4. Extract Explanations
      const expEnStart = lines.findIndex(l => l.toLowerCase().includes('english explanation'));
      const expPaStart = lines.findIndex(l => l.toLowerCase().includes('ਪੰਜਾਬੀ ਵਿਆਖਿਆ'));

      if (expEnStart !== -1) {
        const end = expPaStart !== -1 ? expPaStart : lines.length;
        q.explanationEn = lines.slice(expEnStart + 1, end).join('\n').trim();
      }

      if (expPaStart !== -1) {
        q.explanationPa = lines.slice(expPaStart + 1).join('\n').trim();
      }

      // Final Validations before pushing
      if (!q.questionEn) throw new Error(`Missing English question text in Block ${index + 1}`);
      if (!q.correctAnswer) throw new Error(`Missing correct answer in Block ${index + 1}`);
      if (!q.optionAEn || !q.optionBEn) throw new Error(`Insufficient options in Block ${index + 1}`);

      questions.push(q);
    } catch (err: any) {
      errors.push(err.message);
    }
  });

  return { questions, errors };
}
