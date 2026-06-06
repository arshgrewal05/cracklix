/**
 * @fileOverview Institutional High-Fidelity Regex Parser v29.0.
 * Deterministic extraction with robust boundary detection and detailed validation.
 */

export interface ParsedResults {
  questions: any[];
  errors: string[];
}

export function parseBulkQuestions(rawText: string, metadata: any): ParsedResults {
  // Normalize line endings and add padding for regex splitting
  const text = "\n" + rawText.replace(/\r\n/g, '\n').trim() + "\n";
  
  // Split blocks using Q1. or Question 1 etc. (Case Insensitive)
  const blocks = text.split(/\n(?=(?:Q|Question)\s*\d+[\.\s])/i).filter(b => b.trim().length > 10);
  
  const results: any[] = [];
  const errors: string[] = [];

  blocks.forEach((block, index) => {
    try {
      const fullText = block.trim();
      const lines = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      
      const q: any = { 
        ...metadata,
        id: `q-node-${Date.now()}-${index}`,
        status: metadata.status || "PUBLISHED",
        isStandalone: true,
        debug: {}
      };

      // 1. Identify Option A line to find Question parts
      const optionAIndex = lines.findIndex(l => /^\(A\)/i.test(l));
      
      if (optionAIndex !== -1) {
        // Line 0 is the EN Question Statement
        q.questionEn = lines[0].replace(/^(?:Q|Question)\s*\d+[\.\s]*/i, '').trim();
        // Lines between index 1 and Option A are PA Question Statement
        q.questionPa = lines.slice(1, optionAIndex).join('\n').trim();
      }

      q.debug.QuestionEnFound = q.questionEn ? "YES" : "NO";
      q.debug.QuestionPaFound = q.questionPa ? "YES" : "NO";

      // 2. Extract Options (A-D) - Support both multiline and inline (A) / (B)
      // We take everything between (A) and (B), (B) and (C), etc.
      const getOption = (letter: string, next: string | null) => {
        const regex = next 
          ? new RegExp(`\\(${letter}\\)\\s*([\\s\\S]*?)(?=\\(${next}\\)|Correct Answer|Answer|Answer Key|•|$)`, 'i')
          : new RegExp(`\\(${letter}\\)\\s*([\\s\\S]*?)(?=Correct Answer|Answer|Answer Key|•|$)`, 'i');
        
        const match = fullText.match(regex);
        return match ? match[1].trim() : "";
      };

      q.optionAEn = getOption('A', 'B');
      q.optionBEn = getOption('B', 'C');
      q.optionCEn = getOption('C', 'D');
      q.optionDEn = getOption('D', null);

      q.debug.OptionAFound = q.optionAEn ? "YES" : "NO";
      q.debug.OptionBFound = q.optionBEn ? "YES" : "NO";
      q.debug.OptionCFound = q.optionCEn ? "YES" : "NO";
      q.debug.OptionDFound = q.optionDEn ? "YES" : "NO";

      // 3. Correct Answer Extraction (Extract Code Only)
      const ansMatch = fullText.match(/(?:Correct Answer|Answer|Answer Key|Correct Option)[:\s]*\(?([A-D])\)?/i);
      if (ansMatch) q.correctAnswer = ansMatch[1].toUpperCase();

      q.debug.CorrectAnswerFound = q.correctAnswer ? "YES" : "NO";

      // 4. Explanation Extraction (EN / PA)
      const enMarkerRegex = /(?:•?\s*English\s+(?:Explanation|Logic|Rationale)[:\s]*)/i;
      const paMarkerRegex = /(?:•?\s*(?:ਪੰਜਾਬੀ ਵਿਆਖਿਆ|Punjabi\s+(?:Explanation|Logic|Rationale))[:\s]*)/i;

      const enMatch = fullText.match(enMarkerRegex);
      const paMatch = fullText.match(paMarkerRegex);

      if (enMatch && paMatch) {
        const enStartIndex = fullText.indexOf(enMatch[0]) + enMatch[0].length;
        const paStartIndex = fullText.indexOf(paMatch[0]);
        
        q.explanationEn = fullText.substring(enStartIndex, paStartIndex).trim();
        
        const finalPaStartIndex = paStartIndex + paMatch[0].length;
        q.explanationPa = fullText.substring(finalPaStartIndex).trim();
      }

      q.debug.ExplanationEnFound = q.explanationEn ? "YES" : "NO";
      q.debug.ExplanationPaFound = q.explanationPa ? "YES" : "NO";

      // 5. Validation Check
      const missing = [];
      if (!q.questionEn) missing.push("EN Question");
      if (!q.questionPa) missing.push("PA Question");
      if (!q.optionAEn) missing.push("Option A");
      if (!q.optionBEn) missing.push("Option B");
      if (!q.optionCEn) missing.push("Option C");
      if (!q.optionDEn) missing.push("Option D");
      if (!q.correctAnswer) missing.push("Answer Key");
      if (!q.explanationEn) missing.push("EN Logic");
      if (!q.explanationPa) missing.push("PA Logic");

      if (missing.length === 0) {
        results.push(q);
      } else {
        errors.push(`Block ${index + 1} Reject: Missing ${missing.join(', ')}`);
      }
    } catch (err: any) {
      errors.push(`Block ${index + 1} Logic Error: ${err.message}`);
    }
  });

  return { questions: results, errors };
}
