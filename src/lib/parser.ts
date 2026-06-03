/**
 * @fileOverview Strict Template-Driven Question Extraction Engine.
 * Follows exact position-based rules for English and Punjabi scripts.
 * NO AI Guessing. NO Script Combining.
 */

import { Question, Difficulty } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
}

export function parseBulkQuestions(
  rawText: string, 
  metadata: { boardId: string; examId: string; subjectId: string; difficulty: Difficulty }
): ParsedResults {
  // Normalize line endings and split by Question marker
  const cleanedText = rawText.replace(/\r\n/g, '\n');
  const blocks = cleanedText.split(/(?=Q\d+[\.\:])/g).filter(b => b.trim().length > 0);
  
  const parsedQuestions: Partial<Question>[] = [];
  const errors: string[] = [];

  blocks.forEach((block, index) => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 5) return; // Skip invalid fragments

    const qNumMatch = lines[0].match(/Q(\d+)/i);
    const qNum = qNumMatch ? qNumMatch[1] : (index + 1).toString();

    // 1. QUESTION STATEMENTS (Strict Line 1 & 2)
    // Line 1 contains the Q marker and English Question
    const questionEnglish = lines[0].replace(/^Q\d+[\.\:]\s*/i, '').trim();
    // Line 2 is the Punjabi Question
    const questionPunjabi = lines[1] || "";

    // 2. OPTIONS (Strict First occurrence = EN, Second = PA)
    const findOption = (letter: string, occurrence: number) => {
      const regex = new RegExp(`^${letter}\\)\\s*(.*)`, 'i');
      const matches = lines.filter(l => l.match(regex));
      if (matches.length < occurrence) return null;
      return matches[occurrence - 1].replace(regex, '$1').trim();
    };

    const optAEn = findOption('A', 1);
    const optAPa = findOption('A', 2);
    const optBEn = findOption('B', 1);
    const optBPa = findOption('B', 2);
    const optCEn = findOption('C', 1);
    const optCPa = findOption('C', 2);
    const optDEn = findOption('D', 1);
    const optDPa = findOption('D', 2);

    // 3. ANSWER KEY
    const getAfterMarker = (marker: string) => {
      const idx = lines.findIndex(l => l.toLowerCase().includes(marker.toLowerCase()));
      if (idx === -1 || idx === lines.length - 1) return null;
      // The answer is usually the line immediately following the marker
      return lines[idx + 1].trim();
    };

    const ansFull = getAfterMarker('Correct Answer:');
    const ansLetterMatch = ansFull?.match(/^[A-D]/i);
    const correctAnswer = ansLetterMatch ? ansLetterMatch[0].toUpperCase() : null;

    // 4. EXPLANATIONS (Capture multi-line text after marker)
    const getExplanationBlock = (marker: string) => {
      const idx = lines.findIndex(l => l.toLowerCase().includes(marker.toLowerCase()));
      if (idx === -1) return null;
      
      const contentLines = [];
      for (let i = idx + 1; i < lines.length; i++) {
        // Stop if we hit another major marker
        if (lines[i].match(/Correct Answer|ਸਹੀ ਉੱਤਰ|Explanation|ਵਿਆਖਿਆ|^Q\d+/i)) break;
        contentLines.push(lines[i]);
      }
      return contentLines.join('\n').trim();
    };

    const expEn = getExplanationBlock('Explanation (English):');
    const expPa = getExplanationBlock('ਵਿਆਖਿਆ (ਪੰਜਾਬੀ):');

    // 5. VALIDATION
    const qErrors: string[] = [];
    if (!questionEnglish) qErrors.push(`missing English Statement`);
    if (!questionPunjabi) qErrors.push(`missing Punjabi Statement`);
    if (!optAEn) qErrors.push(`missing English Option A`);
    if (!optAPa) qErrors.push(`missing Punjabi Option A`);
    if (!optBEn) qErrors.push(`missing English Option B`);
    if (!optBPa) qErrors.push(`missing Punjabi Option B`);
    if (!optCEn) qErrors.push(`missing English Option C`);
    if (!optCPa) qErrors.push(`missing Punjabi Option C`);
    if (!optDEn) qErrors.push(`missing English Option D`);
    if (!optDPa) qErrors.push(`missing Punjabi Option D`);
    if (!correctAnswer) qErrors.push(`missing Correct Answer`);
    if (!expEn) qErrors.push(`missing English Explanation`);
    if (!expPa) qErrors.push(`missing Punjabi Explanation`);

    if (qErrors.length > 0) {
      qErrors.forEach(err => errors.push(`Question ${qNum} ${err}`));
    } else {
      parsedQuestions.push({
        ...metadata,
        id: `temp-${qNum}-${Date.now()}`,
        questionEn: questionEnglish,
        questionPa: questionPunjabi,
        optionAEn: optAEn!,
        optionAPa: optAPa!,
        optionBEn: optBEn!,
        optionBPa: optBPa!,
        optionCEn: optCEn!,
        optionCPa: optCPa!,
        optionDEn: optDEn!,
        optionDPa: optDPa!,
        correctAnswer: correctAnswer as 'A' | 'B' | 'C' | 'D',
        explanationEn: expEn!,
        explanationPa: expPa!,
        status: 'PUBLISHED',
        createdAt: new Date().toISOString()
      });
    }
  });

  return { 
    questions: errors.length > 0 ? [] : parsedQuestions, 
    errors 
  };
}
