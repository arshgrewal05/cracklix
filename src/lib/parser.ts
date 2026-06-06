
/**
 * @fileOverview Institutional Ultimate Hybrid Ingestion Engine v3.0.
 * Features: Automatic Boundary Detection (Q1, Q291, etc.), Multilingual Mapping,
 * and aggressive numbering artifacts purge.
 */

import { Question, Difficulty, ContentStatus, QuestionType } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
  confidence: number;
}

/**
 * Aggressively cleans imported text and purges formatting debris.
 */
function cleanText(text: string): string {
  if (!text) return "";
  return text
    .replace(/^(\s*\**\s*(?:Q|Question|QUESTION NO\.)?\s*\d+[\.\):-]*\s*\*?\s*)/i, '') // Strips leading 1., Q1., Question 1:
    .replace(/^[\s\d\.\*]+/, '') 
    .replace(/\*+$/, '')         
    .replace(/[\*\_]/g, '')      
    .replace(/\s+/g, ' ')        
    .trim();
}

/**
 * Detects boundaries and splits text into individual question blocks.
 * Supports patterns: Q1, Q291, 1., Question 1, QUESTION NO. 1
 */
function splitIntoBlocks(text: string): string[] {
  // Pattern matches the start of a new question
  const boundaryRegex = /(?:\n|^)\s*(?:Q|Question|QUESTION NO\.)?\s*(\d+)[\.\):\s-]/i;
  
  // We use a manual split to preserve content
  const lines = text.split('\n');
  const blocks: string[] = [];
  let currentBlock: string[] = [];

  lines.forEach(line => {
    if (boundaryRegex.test(line) && currentBlock.length > 0) {
      // If we see a new question marker and we have current content, save the block
      blocks.push(currentBlock.join('\n').trim());
      currentBlock = [line];
    } else {
      currentBlock.push(line);
    }
  });

  if (currentBlock.length > 0) {
    blocks.push(currentBlock.join('\n').trim());
  }

  return blocks.filter(b => b.length > 10);
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

  if (blocks.length === 0) {
    return { questions: [], errors: ["No valid question patterns detected. Ensure you use Q1, 1., or Question 1 format."], confidence: 0 };
  }

  blocks.forEach((block, index) => {
    try {
      const parsed = parseComplexBlock(block, metadata);

      // Generate Institutional Sequential ID
      const prefix = metadata.examId.substring(0, 4).toUpperCase();
      const displayId = `${prefix}-${Date.now().toString().slice(-4)}-${index + 1}`;

      questions.push({
        ...parsed,
        displayId,
        isStandalone: true,
        status: metadata.status,
      });

    } catch (err: any) {
      errors.push(`Block ${index + 1}: ${err.message}`);
    }
  });

  const confidence = Math.round((questions.length / (questions.length + (errors.length || 0))) * 100);
  return { questions, errors, confidence };
}

function parseComplexBlock(block: string, metadata: any): Partial<Question> {
  // Regex patterns for various components
  const optionRegex = /(?:\n|^)\s*\**([A-D])[\.\)]\s*\*?\s*([\s\S]*?)(?=\n\s*\**[A-D][\.\)]|\n\s*\**Correct Answer|\n\s*\**Answer|\n\s*\**Explanation|\n\s*\**ਵਿਆਖਿਆ|$)/gi;
  const answerRegex = /(?:Correct Answer|Answer|Correct Option|ਜਵਾਬ):?\s*\**([A-D])\b/i;
  const explanationRegex = /(?:Explanation|ਵਿਆਖਿਆ):?\s*\**([\s\S]*)$/i;

  // Extract Question Text (everything before the first option)
  const firstOptionMatch = optionRegex.exec(block);
  optionRegex.lastIndex = 0; // Reset for later use
  
  const questionPart = firstOptionMatch 
    ? block.substring(0, firstOptionMatch.index).trim() 
    : block.split('\n')[0];

  // Multilingual split for question
  const qLines = questionPart.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const questionEn = cleanText(qLines[0] || "");
  const questionPa = qLines.length > 1 ? cleanText(qLines.slice(1).join('\n')) : "";

  // Extract Options
  const options: Record<string, { en: string; pa: string }> = {};
  let match;
  while ((match = optionRegex.exec(block)) !== null) {
    const label = match[1].toUpperCase();
    const content = match[2].trim();
    
    // Check for bilingual pipe separator
    if (content.includes('|')) {
      const [en, pa] = content.split('|').map(s => cleanText(s.trim()));
      options[label] = { en, pa };
    } else {
      // Try to detect script or just use as EN
      options[label] = { en: cleanText(content), pa: "" };
    }
  }

  // Extract Answer
  const ansMatch = block.match(answerRegex);
  const correctAnswer = (ansMatch?.[1].toUpperCase() || "A") as 'A' | 'B' | 'C' | 'D';

  // Extract Explanation
  const expMatch = block.match(explanationRegex);
  const explanationEn = expMatch ? cleanText(expMatch[1]) : "Solution synced to bank.";

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
    explanationPa: explanationPa ? explanationEn : "" // Simple mapping if single-lang
  };
}
