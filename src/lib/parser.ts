
/**
 * @fileOverview Institutional Bulk MCQ Extraction Engine.
 * Optimized for high-volume data entry for PSSSB, PPSC, and Punjab Police.
 */

import { Question, Difficulty } from "@/types";

export function parseBulkQuestions(
  rawText: string, 
  metadata: { boardId: string; examId: string; subjectId: string; difficulty: Difficulty }
): Partial<Question>[] {
  const normalizedText = rawText.replace(/\r\n/g, "\n").trim();
  
  // Robust splitting logic for Q1., 1., Q.1, Question 1, etc.
  const questionBlocks = normalizedText.split(/(?=Q\d+[\.\:\)]|Question\s*\d+[\.\:\)]|Q\.\s*\d+[\.\:\)]|^\d+[\.\:\)])/im);
  
  return questionBlocks.map(block => {
    try {
      if (!block.trim()) return null;

      // Extract Question Text (matches everything up to option A)
      const textMatch = block.match(/(?:Q\d+|Question\s*\d+|Q\.\s*\d+|^\d+)[\.\:\)]?\s*([\s\S]*?)(?=[A][\.\:\)])/im);
      
      // Extract Options (A, B, C, D) using a more flexible pattern
      const aMatch = block.match(/[A][\.\:\)]\s*([\s\S]*?)(?=[B][\.\:\)])/im);
      const bMatch = block.match(/[B][\.\:\)]\s*([\s\S]*?)(?=[C][\.\:\)])/im);
      const cMatch = block.match(/[C][\.\:\)]\s*([\s\S]*?)(?=[D][\.\:\)])/im);
      const dMatch = block.match(/[D][\.\:\)]\s*([\s\S]*?)(?=Answer:|$|Explanation:|Key:|Ans:|Correct Answer:)/im);

      // Extract Answer Label (A/B/C/D) - Handles various formats
      const answerMatch = block.match(/(?:Answer|Key|Ans|Correct|Correct Answer):\s*([A-D])/im);
      
      // Extract Rationale (Explanation)
      const explanationMatch = block.match(/(?:Explanation|Solution|Rationale|Details):\s*([\s\S]*)$/im);

      if (!textMatch || !aMatch || !bMatch || !cMatch || !dMatch || !answerMatch) {
        return null;
      }

      return {
        questionEn: textMatch[1].trim(),
        optionAEn: aMatch[1].trim(),
        optionBEn: bMatch[1].trim(),
        optionCEn: cMatch[1].trim(),
        optionDEn: dMatch[1].trim(),
        correctAnswer: answerMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D',
        explanationEn: explanationMatch ? explanationMatch[1].trim() : "Verified institutional answer key as per official Punjab patterns.",
        boardId: metadata.boardId,
        examId: metadata.examId,
        subjectId: metadata.subjectId,
        difficulty: metadata.difficulty,
        author: "Arsh Grewal Management",
        createdAt: new Date().toISOString()
      };
    } catch (e) {
      return null;
    }
  }).filter((q): q is Partial<Question> => q !== null);
}
