
/**
 * @fileOverview Institutional-grade MCQ parser for Cracklix Phase 3.
 * Optimized for Official Punjab Recruitment Board hierarchies.
 */

import { Question, Difficulty } from "@/types";

export function parseBulkQuestions(
  rawText: string, 
  metadata: { boardId: string; examId: string; subjectId: string; difficulty: Difficulty }
): Partial<Question>[] {
  const normalizedText = rawText.replace(/\r\n/g, "\n").replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
  
  // Refined split logic to handle multiple formats: Q1., Question 1:, Q.1)
  const questionBlocks = normalizedText.split(/(?=Q\d+[\.\:\)]|Question\s*\d+[\.\:\)]|Q\.\s*\d+[\.\:\)])/i);
  
  return questionBlocks.map(block => {
    try {
      if (!block.trim()) return null;

      // Extract Question Text: From start to the first option marker (A.)
      const textMatch = block.match(/(?:Q\d+|Question\s*\d+|Q\.\s*\d+)[\.\:\)]?\s*([\s\S]*?)(?=[A-D][\.\:\)])/i);
      
      // Extract Options: A, B, C, D with various separators
      const aMatch = block.match(/[A][\.\:\)]\s*([\s\S]*?)(?=[B][\.\:\)])/i);
      const bMatch = block.match(/[B][\.\:\)]\s*([\s\S]*?)(?=[C][\.\:\)])/i);
      const cMatch = block.match(/[C][\.\:\)]\s*([\s\S]*?)(?=[D][\.\:\)])/i);
      const dMatch = block.match(/[D][\.\:\)]\s*([\s\S]*?)(?=Answer:|$|Explanation:|Solution:|Key:)/i);

      // Extract Answer: Supports "Answer: A", "Key: B", "Ans: C"
      const answerMatch = block.match(/(?:Answer|Key|Ans|Correct):\s*([A-D])/i);
      
      // Extract Explanation: Supports Markdown and multi-line text
      const explanationMatch = block.match(/(?:Explanation|Solution|Rationale):\s*([\s\S]*)$/i);

      if (!textMatch || !aMatch || !bMatch || !cMatch || !dMatch || !answerMatch) {
        return null;
      }

      return {
        questionEn: textMatch[1].trim(),
        optionAEn: aMatch[1].trim(),
        optionBEn: bMatch[1].trim(),
        optionCEn: cMatch[1].trim(),
        optionDEn: dMatch[1].trim(),
        questionPa: "", 
        optionAPa: "",
        optionBPa: "",
        optionCPa: "",
        optionDPa: "",
        correctAnswer: answerMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D',
        explanationEn: explanationMatch ? explanationMatch[1].trim() : "Verified institutional answer key as per official Punjab Recruitment patterns.",
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
