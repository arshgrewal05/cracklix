
/**
 * @fileOverview Exam-Grade Regex Parser for Deterministic Ingestion v9.0.
 * Strictly non-AI. Optimized for "Line 1 English / Line 2 Punjabi" format.
 * Features: High-precision explanation extraction and formula preservation.
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
        id: `q-node-${Date.now()}-${index}`,
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

      // 1. Extract Question Text (Line 1 EN, Line 2 PA)
      q.questionEn = lines[0].replace(/^Q\d+[\.\s]*/i, '').trim();

      let nextIdx = 1;
      if (lines[nextIdx] && !lines[nextIdx].match(/^\(?[A-D][\.\)\s]/i)) {
        q.questionPa = lines[nextIdx].replace(/^(ਪ੍ਰਸ਼ਨ|ਪ੍ਰਸ਼ਨ)\s*\d+[\.\s]*/, '').trim();
        nextIdx++;
      }

      // 2. Extract Options (A-D) with strict "/" split
      const optionPattern = /^\(?([A-D])[\.\)\s]+(.*)/i;
      for (let i = nextIdx; i < lines.length; i++) {
        const line = lines[i];
        const optMatch = line.match(optionPattern);
        if (optMatch) {
          const letter = optMatch[1].toUpperCase();
          const content = optMatch[2].trim();
          
          if (content.includes('/')) {
            const parts = content.split('/');
            q[`option${letter}En`] = parts[0]?.trim() || "";
            q[`option${letter}Pa`] = parts[1]?.trim() || "";
          } else {
            q[`option${letter}En`] = content;
          }
        }
      }

      // 3. Extract Correct Answer (Key logic)
      const ansLine = lines.find(l => 
        l.toLowerCase().includes('correct answer') || 
        l.toLowerCase().includes('ਸਹੀ ਉੱਤਰ') ||
        l.toLowerCase().startsWith('ans:')
      );
      
      if (ansLine) {
        const match = ansLine.match(/(?:correct answer|ans|ਸਹੀ ਉੱਤਰ)[:\s]*\(?([A-D])\)?/i);
        if (match) q.correctAnswer = match[1].toUpperCase();
      }

      // 4. Extract Explanations with High-Fidelity preservation
      const expEnStart = lines.findIndex(l => l.toLowerCase().includes('english explanation'));
      const expPaStart = lines.findIndex(l => l.toLowerCase().includes('ਪੰਜਾਬੀ ਵਿਆਖਿਆ'));

      if (expEnStart !== -1) {
        const end = expPaStart !== -1 ? expPaStart : lines.length;
        q.explanationEn = lines.slice(expEnStart + 1, end).join('\n').trim();
      }

      if (expPaStart !== -1) {
        q.explanationPa = lines.slice(expPaStart + 1).join('\n').trim();
      }

      // Validations
      if (!q.questionEn) throw new Error(`Missing Statement in Block ${index + 1}`);
      if (!q.correctAnswer) throw new Error(`Missing Answer Key in Block ${index + 1}`);
      if (!q.optionAEn || !q.optionBEn) throw new Error(`Insufficient Options in Block ${index + 1}`);

      questions.push(q);
    } catch (err: any) {
      errors.push(err.message);
    }
  });

  return { questions, errors };
}
