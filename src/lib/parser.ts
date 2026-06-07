/**
 * @fileOverview Institutional High-Fidelity Explicit Parser v43.0.
 * Supports standard Q1. format AND Gemini 'Question (English Box):' formats.
 * Now supports dynamic secondary language mapping (Punjabi/Hindi).
 */

export interface ParsedResults {
  questions: any[];
  errors: string[];
}

export function parseBulkQuestions(rawText: string, metadata: any): ParsedResults {
  const secondaryLang = metadata.secondaryLanguage || 'punjabi';
  
  // Normalize line endings and wrap with newlines for robust matching
  const text = "\n" + rawText.replace(/\r\n/g, '\n').trim() + "\n";
  
  // Splitter: Detect Q1., Question 1., or Question (English Box):
  const blocks = text.split(/\n(?=Q\s*\d+[\.\s]|Question\s*\d*[\.\s\:]|Question\s*\(English\s*Box\)\:)/i).filter(b => b.trim().length > 10);
  
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

      // Define field names based on target secondary language
      const qField = secondaryLang === 'hindi' ? 'hindiQuestion' : 'punjabiQuestion';
      const expField = secondaryLang === 'hindi' ? 'hindiExplanation' : 'punjabiExplanation';

      // 1. QUESTION EXTRACTION
      const hasEnglishBox = /Question\s*\(English\s*Box\)\:/i.test(fullText);
      const hasSecondaryBox = secondaryLang === 'hindi' 
        ? /Question\s*\(Hindi\s*Box\)\:/i.test(fullText)
        : /Question\s*\(Punjabi\s*Box\)\:/i.test(fullText);

      if (hasEnglishBox && hasSecondaryBox) {
        const enMatch = fullText.match(/Question\s*\(English\s*Box\)\:([\s\S]*?)(?=Question\s*\(.*?\s*Box\)\:)/i);
        const secRegex = secondaryLang === 'hindi' 
          ? /Question\s*\(Hindi\s*Box\)\:([\s\S]*?)(?=\(A\)|Option\s*A)/i
          : /Question\s*\(Punjabi\s*Box\)\:([\s\S]*?)(?=\(A\)|Option\s*A)/i;
        
        const secMatch = fullText.match(secRegex);
        q.englishQuestion = enMatch ? enMatch[1].trim() : "";
        q[qField] = secMatch ? secMatch[1].trim() : "";
      } else {
        const optionAIndex = lines.findIndex(l => /^\(A\)|Option\s*A/i.test(l));
        if (optionAIndex !== -1) {
          const secMarkerRegex = secondaryLang === 'hindi' 
            ? /(?:हिंदी|Hindi)[:\s]*/i 
            : /(?:ਪੰਜਾਬੀ|Punjabi)[:\s]*/i;
          
          const markerIdx = lines.findIndex(l => secMarkerRegex.test(l));
          
          if (markerIdx > 0 && markerIdx < optionAIndex) {
            q.englishQuestion = lines.slice(0, markerIdx).join('\n').replace(/^(?:Q|Question)\s*\d+[\.\s]*/i, '').trim();
            q[qField] = lines.slice(markerIdx).join('\n').replace(secMarkerRegex, '').trim();
          } else {
            q.englishQuestion = lines[0].replace(/^(?:Q|Question)\s*\d+[\.\s]*/i, '').trim();
            q[qField] = lines.slice(1, optionAIndex).join('\n').trim();
          }
        }
      }

      // 2. OPTION EXTRACTION
      const getOptionPair = (letter: string, next: string | null) => {
        const regex = next 
          ? new RegExp(`(?:\\(${letter}\\)|Option\\s*${letter})\\s*([\\s\\S]*?)(?=\\(${next}\\)|Option\\s*${next}|Correct Answer|Answer|Answer Key|•|$)`, 'i')
          : new RegExp(`(?:\\(${letter}\\)|Option\\s*${letter})\\s*([\\s\\S]*?)(?=Correct Answer|Answer|Answer Key|•|$)`, 'i');
        
        const match = fullText.match(regex);
        if (!match) return ["", ""];
        
        const raw = match[1].trim();
        const parts = raw.split('/').map(s => s.trim());
        return [parts[0] || "", parts[1] || parts[0] || ""];
      };

      const optSuffix = secondaryLang === 'hindi' ? 'Hindi' : 'Punjabi';
      [q.optionAEnglish, q[`optionA${optSuffix}`]] = getOptionPair('A', 'B');
      [q.optionBEnglish, q[`optionB${optSuffix}`]] = getOptionPair('B', 'C');
      [q.optionCEnglish, q[`optionC${optSuffix}`]] = getOptionPair('C', 'D');
      [q.optionDEnglish, q[`optionD${optSuffix}`]] = getOptionPair('D', null);

      // 3. CORRECT ANSWER
      const ansMatch = fullText.match(/(?:Correct Answer|Answer|Answer Key|Correct Option)[:\s]*\(?([A-D])\)?/i);
      if (ansMatch) q.correctAnswer = ansMatch[1].toUpperCase();

      // 4. EXPLANATIONS
      const enMarkerRegex = /(?:English\s+(?:Explanation|Logic|Rationale|Rationale Box)[:\s]*)/i;
      const secMarkerRegex = secondaryLang === 'hindi'
        ? /(?:(?:हिंदी व्याख्या|Hindi\s+(?:Explanation|Logic|Rationale|Rationale Box))[:\s]*)/i
        : /(?:(?:ਪੰਜਾਬੀ ਵਿਆਖਿਆ|Punjabi\s+(?:Explanation|Logic|Rationale|Rationale Box))[:\s]*)/i;

      const enMatch = fullText.match(enMarkerRegex);
      const secMatch = fullText.match(secMarkerRegex);

      if (enMatch && secMatch) {
        const enStartIndex = fullText.indexOf(enMatch[0]) + enMatch[0].length;
        const secStartIndex = fullText.indexOf(secMatch[0]);
        q.englishExplanation = fullText.substring(enStartIndex, secStartIndex).trim();
        q[expField] = fullText.substring(secStartIndex + secMatch[0].length).trim();
      } else if (enMatch) {
        q.englishExplanation = fullText.substring(fullText.indexOf(enMatch[0]) + enMatch[0].length).trim();
      }

      // Debugging Matrix
      q.debug = {
        EN_Q: q.englishQuestion ? 'YES' : 'NO',
        SEC_Q: q[qField] ? 'YES' : 'NO',
        OPT: (q.optionAEnglish && q[`optionA${optSuffix}`]) ? 'YES' : 'NO',
        KEY: q.correctAnswer ? 'YES' : 'NO',
        LOGIC: (q.englishExplanation) ? 'YES' : 'NO'
      };

      // Validation
      const missing = [];
      if (!q.englishQuestion) missing.push("English Question");
      if (!q.optionAEnglish) missing.push("Option A");
      if (!q.correctAnswer) missing.push("Correct Answer");

      if (missing.length === 0) {
        results.push(q);
      } else {
        errors.push(`Block ${index + 1} Rejected: Missing ${missing.join(', ')}`);
      }
    } catch (err: any) {
      errors.push(`Block ${index + 1} Parsing Error: ${err.message}`);
    }
  });

  return { questions: results, errors };
}
