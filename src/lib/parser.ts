/**
 * @fileOverview Institutional Ultimate Hybrid Ingestion Engine.
 * Supports: 
 * 1. Simple Format (Q1. Text, A., B., C., D., Answer: B)
 * 2. High-Fidelity Tagged Format (QUESTION_TYPE: ..., QUESTION_EN: ..., etc.)
 * 3. Contextual Sets (DI_SET, PASSAGE)
 * Updated: Aggressive sanitization to strip Markdown artifacts (**), redundant dots, and numbering.
 */

import { Question, Difficulty, ContentStatus, QuestionType } from "@/types";

export interface ParsedResults {
  questions: Partial<Question>[];
  errors: string[];
  confidence: number;
}

/**
 * Strips Markdown artifacts, redundant dots, and extra whitespace.
 */
function cleanText(text: string): string {
  if (!text) return "";
  return text
    .replace(/^[\s\d\.\*]+/, '') // Remove leading numbers, dots, stars
    .replace(/[\*\_]{1,}/g, '')  // Remove Markdown bold/italic markers (*, **, _, __)
    .replace(/\s+/g, ' ')        // Normalize whitespace
    .trim();
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
  
  // Normalize and clean text
  const text = "\n" + rawText.replace(/\r\n/g, '\n').trim();
  
  // Resilient splitting: Look for separators like --- or === OR question starts like Q1, 1., **Q1**
  const blocks = text.split(/(?:\n\s*[=-]{3,}\s*\n|(?=\n\s*\**Q?\d+[\.\)])|(?=\n\s*QUESTION_TYPE:))/i)
    .map(b => b.trim())
    .filter(b => b.length > 5);

  if (blocks.length === 0) {
    return { questions: [], errors: ["No valid content blocks detected. Ensure questions start with Q1., 1. or use === separators."], confidence: 0 };
  }

  blocks.forEach((block, index) => {
    try {
      const isTaggedFormat = block.toUpperCase().includes('QUESTION_TYPE:') || block.toUpperCase().includes('QUESTION_EN:');
      
      let parsed: Partial<Question>;

      if (isTaggedFormat) {
        parsed = parseTaggedBlock(block, metadata);
      } else {
        parsed = parseSimpleBlock(block, metadata);
      }

      // Validate question existence
      if (!parsed.questionEn && parsed.questionType !== 'DI_SET' && parsed.questionType !== 'PASSAGE') {
        throw new Error("Could not extract question statement. Check formatting.");
      }

      questions.push({
        ...parsed,
        isStandalone: true,
        status: metadata.status
      });

    } catch (err: any) {
      errors.push(`Block ${index + 1}: ${err.message}`);
    }
  });

  const confidence = Math.round((questions.length / (questions.length + (errors.length || 0))) * 100);
  return { questions, errors, confidence };
}

function parseTaggedBlock(block: string, metadata: any): Partial<Question> {
  const getTag = (tag: string) => {
    const regex = new RegExp(`${tag}:?\\s*([\\s\\S]*?)(?=\\n[A-Z_\\d\\s]+:?|$)`, 'i');
    const match = block.match(regex);
    return match ? cleanText(match[1]) : null;
  };

  const qType = (getTag("QUESTION_TYPE") || "MCQ").toUpperCase() as QuestionType;
  const ansRaw = getTag("ANSWER") || getTag("CORRECT_ANSWER");
  const correctAnswer = (ansRaw?.match(/[A-D]/i)?.[0].toUpperCase() || "A") as 'A' | 'B' | 'C' | 'D';

  const tableDataRaw = getTag("TABLE_DATA");
  let tableData = null;
  if (tableDataRaw) {
    const lines = tableDataRaw.split('\n').filter(l => l.includes('|'));
    if (lines.length > 0) {
      const headers = lines[0].split('|').map(h => h.trim());
      const rows = lines.slice(1).map(r => r.split('|').map(c => c.trim()));
      tableData = { headers, rows };
    }
  }

  return {
    ...metadata,
    questionType: qType,
    diagramType: getTag("IMAGE_URL") ? 'image' : tableData ? 'table' : 'none',
    questionEn: getTag("QUESTION_EN") || getTag("TITLE"),
    questionPa: getTag("QUESTION_PA") || getTag("QUESTION_EN") || "",
    optionAEn: getTag("OPTION_A_EN") || "Option A",
    optionAPa: getTag("OPTION_A_PA") || "",
    optionBEn: getTag("OPTION_B_EN") || "Option B",
    optionBPa: getTag("OPTION_B_PA") || "",
    optionCEn: getTag("OPTION_C_EN") || "Option C",
    optionCPa: getTag("OPTION_C_PA") || "",
    optionDEn: getTag("OPTION_D_EN") || "Option D",
    optionDPa: getTag("OPTION_DPa") || "",
    correctAnswer,
    explanationEn: getTag("EXPLANATION_EN") || "Solution provided in bank.",
    explanationPa: getTag("EXPLANATION_PA") || "",
    imageUrl: getTag("IMAGE_URL"),
    passageEn: getTag("PASSAGE_EN"),
    passagePa: getTag("PASSAGE_PA")
  };
}

function parseSimpleBlock(block: string, metadata: any): Partial<Question> {
  // Split parts based on typical labels
  const parts = block.split(/(?=\n\s*\**[A-D][\.\)]\s*\*?|(?:\n\s*\**Correct Answer:?\**)|(?:\n\s*\**Explanation:?\**))/i);
  
  const questionPart = parts[0]?.trim();
  const qLines = questionPart.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  // Bilingual question detection (Line 1: EN, Line 2: PA)
  const questionEn = cleanText(qLines[0] || "");
  const questionPa = qLines.length > 1 ? cleanText(qLines.slice(1).join('\n')) : questionEn;

  const findRawPart = (prefix: string) => {
    return parts.find(p => {
       const cleanP = p.trim().replace(/^\**|\**$/g, '');
       return cleanP.toLowerCase().startsWith(prefix.toLowerCase());
    });
  };

  const extractOption = (prefix: string) => {
    const raw = findRawPart(prefix);
    if (!raw) return { en: `Option ${prefix}`, pa: "" };
    
    // Remove the A) or B. prefix and cleaning markers
    const content = raw.trim().replace(new RegExp(`^\\**${prefix}[\\.\\)]?\\s*\\**`, 'i'), '').trim();
    
    // Handle pipe separator for bilingual options
    if (content.includes('|')) {
      const [en, pa] = content.split('|').map(s => s.trim());
      return { en: cleanText(en), pa: cleanText(pa) };
    }
    
    return { en: cleanText(content), pa: "" };
  };

  const optA = extractOption("A");
  const optB = extractOption("B");
  const optC = extractOption("C");
  const optD = extractOption("D");

  const ansPart = findRawPart("Correct Answer") || "A";
  const correctAnswer = (ansPart.match(/[A-D]/i)?.[0].toUpperCase() || "A") as 'A' | 'B' | 'C' | 'D';

  const expPart = findRawPart("Explanation") || "";
  const expLines = expPart.replace(/^\**Explanation:?\**\s*/i, '').split('\n').filter(l => l.trim().length > 0);
  const explanationEn = cleanText(expLines[0] || "Rationale available in bank.");
  const explanationPa = expLines.length > 1 ? cleanText(expLines.slice(1).join('\n')) : "";

  return {
    ...metadata,
    questionType: 'MCQ',
    diagramType: 'none',
    questionEn,
    questionPa,
    optionAEn: optA.en,
    optionAPa: optA.pa,
    optionBEn: optB.en,
    optionBPa: optB.pa,
    optionCEn: optC.en,
    optionCPa: optC.pa,
    optionDEn: optD.en,
    optionDPa: optD.pa,
    correctAnswer,
    explanationEn,
    explanationPa,
    imageUrl: null,
    tableData: null
  };
}
