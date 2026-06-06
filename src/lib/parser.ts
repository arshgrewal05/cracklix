
/**
 * @fileOverview Institutional Compact Parser v15.0.
 * Optimized for "Line 1 EN / Line 2 PA / Inline Options / Vertical Explanations" format.
 * Features: High-fidelity math block extraction and bilingual logic mapping.
 */

import { Question } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
}

export function parseBulkQuestions(rawText: string, metadata: any): ParsedResults {
  const cleanRaw = rawText.replace(/\r\n/g, '\n');
  
  // Split by Q followed by a number
  const blocks = cleanRaw.split(/\n(?=Q\d+[\.\s])/g).filter(b => b.trim().length > 10);
  
  // Fallback for first block if it doesn't start with newline
  if (blocks.length === 1 && !blocks[0].trim().startsWith('Q')) {
    const initialSplit = cleanRaw.split(/(?=Q\d+[\.\s])/g).filter(b => b.trim().startsWith('Q'));
    return parseBlocks(initialSplit, metadata);
  }

  return parseBlocks(blocks, metadata);
}

function parseBlocks(blocks: string[], metadata: any): ParsedResults {
  const questions: Partial<Question>[] = [];
  const errors: string[] = [];

  blocks.forEach((block, index) => {
    try {
      const q: any = { 
        ...metadata,
        id: `q-node-${Date.now()}-${index}`,
        status: metadata.status || "PUBLISHED",
        isStandalone: true,
        questionEn: "",
        questionPa: "",
        optionAEn: "",
        optionBEn: "",
        optionCEn: "",
        optionDEn: "",
        correctAnswer: "",
        explanationEn: "",
        explanationPa: ""
      };

      const rawLines = block.split('\n').map(l => l.trim());
      
      // 1. Extract Question Text (Line 1 EN, Line 2 PA)
      q.questionEn = rawLines[0].replace(/^Q\d+[\.\s]*/i, '').trim();

      if (rawLines[1] && !rawLines[1].includes('(A)')) {
        q.questionPa = rawLines[1].replace(/^(ਪ੍ਰਸ਼ਨ|ਪ੍ਰਸ਼ਨ)\s*\d+[\.\s]*/, '').trim();
      }

      // 2. Extract Options (Deterministic Inline or Vertical)
      const fullBlockText = block.replace(/\n/g, ' ');
      
      const extractOption = (key: string, nextKey: string | null) => {
        const startMarker = `(${key})`;
        const startIndex = fullBlockText.indexOf(startMarker);
        if (startIndex === -1) return "";
        
        let endIndex = nextKey ? fullBlockText.indexOf(`(${nextKey})`, startIndex) : fullBlockText.indexOf('Correct Answer', startIndex);
        if (endIndex === -1) endIndex = fullBlockText.indexOf('• English Explanation', startIndex);
        if (endIndex === -1) endIndex = fullBlockText.length;
        
        const data = fullBlockText.substring(startIndex + startMarker.length, endIndex);
        return data.trim();
      };

      q.optionAEn = extractOption('A', 'B');
      q.optionBEn = extractOption('B', 'C');
      q.optionCEn = extractOption('C', 'D');
      q.optionDEn = extractOption('D', null);

      // 3. Extract Correct Answer Key
      const ansLine = rawLines.find(l => /Correct Answer|ਸਹੀ ਉੱਤਰ/i.test(l));
      if (ansLine) {
        const match = ansLine.match(/(?:Correct Answer|ਸਹੀ ਉੱਤਰ|Ans)[:\s]*\(?([A-D])\)?/i);
        if (match) q.correctAnswer = match[1].toUpperCase();
        q.correctAnswerRaw = ansLine.trim();
      }

      // 4. Extract Explanations (Vertical Block Preservation)
      const expEnStart = rawLines.findIndex(l => /English Explanation/i.test(l));
      const expPaStart = rawLines.findIndex(l => /ਪੰਜਾਬੀ ਵਿਆਖਿਆ/i.test(l));

      if (expEnStart !== -1) {
        const end = expPaStart !== -1 ? expPaStart : rawLines.length;
        q.explanationEn = rawLines.slice(expEnStart + 1, end).join('\n').trim();
      }

      if (expPaStart !== -1) {
        q.explanationPa = rawLines.slice(expPaStart + 1).join('\n').trim();
      }

      if (q.questionEn && q.correctAnswer) {
        questions.push(q);
      } else {
        errors.push(`Block ${index + 1}: Check statements or Correct Answer Node.`);
      }
    } catch (err: any) {
      errors.push(`Block ${index + 1}: ${err.message}`);
    }
  });

  return { questions, errors };
}
