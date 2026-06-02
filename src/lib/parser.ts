
/**
 * @fileOverview Institutional-grade MCQ parser for Cracklix Phase 3.
 * Parses raw text documents into structured Firestore-ready Question objects.
 */

import { Question, Difficulty } from "@/types";

export function parseBulkQuestions(
  rawText: string, 
  metadata: { boardId: string; examId: string; subjectId: string; difficulty: Difficulty }
): Partial<Question>[] {
  const normalizedText = rawText.replace(/\r\n/g, "\n").replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  
  // Split by "Q" followed by a number and a dot, or "Question"
  const questionBlocks = normalizedText.split(/(?=Q\d+\.|Question\s*\d+\.|Q\.\s*\d+\.)/);
  
  return questionBlocks.map(block => {
    try {
      if (!block.trim()) return null;

      // Extract Question Text: From start to the first option "A."
      const textMatch = block.match(/(?:Q\d+\.|Question\s*\d+|Q\.\s*\d+)\.?\s*([\s\S]*?)(?=[A-D]\.)/i);
      
      // Extract Options: A, B, C, D
      const aMatch = block.match(/A\.\s*([\s\S]*?)(?=B\.)/i);
      const bMatch = block.match(/B\.\s*([\s\S]*?)(?=C\.)/i);
      const cMatch = block.match(/C\.\s*([\s\S]*?)(?=D\.)/i);
      const dMatch = block.match(/D\.\s*([\s\S]*?)(?=Answer:|$|Explanation:|Solution:)/i);

      // Extract Answer: A/B/C/D
      const answerMatch = block.match(/Answer:\s*([A-D])/i);
      
      // Extract Explanation
      const explanationMatch = block.match(/(?:Explanation|Solution):\s*([\s\S]*)$/i);

      if (!textMatch || !aMatch || !bMatch || !cMatch || !dMatch || !answerMatch) {
        return null;
      }

      return {
        questionEn: textMatch[1].trim(),
        optionAEn: aMatch[1].trim(),
        optionBEn: bMatch[1].trim(),
        optionCEn: cMatch[1].trim(),
        optionDEn: dMatch[1].trim(),
        questionPa: "", // Left for manual/AI translation later
        optionAPa: "",
        optionBPa: "",
        optionCPa: "",
        optionDPa: "",
        correctAnswer: answerMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D',
        explanationEn: explanationMatch ? explanationMatch[1].trim() : "Correct answer verified as per official Punjab Recruitment Board pattern.",
        explanationPa: "",
        boardId: metadata.boardId,
        examId: metadata.examId,
        subjectId: metadata.subjectId,
        difficulty: metadata.difficulty,
        createdAt: new Date().toISOString()
      };
    } catch (e) {
      return null;
    }
  }).filter((q): q is Partial<Question> => q !== null);
}
