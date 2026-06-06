/**
 * @fileOverview Institutional High-Fidelity Explicit Parser v42.0.
 * Supports standard Q1. format AND Gemini 'Question (English Box):' formats.
 * Preserves markdown tables for DI questions.
 */

export interface ParsedResults {
  questions: any[];
  errors: string[];
}

export function parseBulkQuestions(rawText: string, metadata: any): ParsedResults {
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

      // 1. QUESTION EXTRACTION (Handling Box Format or Standard)
      const hasEnglishBox = /Question\s*\(English\s*Box\)\:/i.test(fullText);
      const hasPunjabiBox = /Question\s*\(Punjabi\s*Box\)\:/i.test(fullText);

      if (hasEnglishBox && hasPunjabiBox) {
        // Advanced 'Box' Extraction
        const enMatch = fullText.match(/Question\s*\(English\s*Box\)\:([\s\S]*?)(?=Question\s*\(Punjabi\s*Box\)\:)/i);
        const paMatch = fullText.match(/Question\s*\(Punjabi\s*Box\)\:([\s\S]*?)(?=\(A\)|Option\s*A)/i);
        q.englishQuestion = enMatch ? enMatch[1].trim() : "";
        q.punjabiQuestion = paMatch ? paMatch[1].trim() : "";
      } else {
        // Standard 'Q1.' Extraction
        const optionAIndex = lines.findIndex(l => /^\(A\)|Option\s*A/i.test(l));
        if (optionAIndex !== -1) {
          // Identify potential language split if English/Punjabi markers exist in the block
          const paMarkerRegex = /(?:ਪੰਜਾਬੀ|Punjabi)[:\s]*/i;
          const markerIdx = lines.findIndex(l => paMarkerRegex.test(l));
          
          if (markerIdx > 0 && markerIdx < optionAIndex) {
            q.englishQuestion = lines.slice(0, markerIdx).join('\n').replace(/^(?:Q|Question)\s*\d+[\.\s]*/i, '').trim();
            q.punjabiQuestion = lines.slice(markerIdx).join('\n').replace(paMarkerRegex, '').trim();
          } else {
            // Default fallback: Take first line as English, rest as Punjabi
            q.englishQuestion = lines[0].replace(/^(?:Q|Question)\s*\d+[\.\s]*/i, '').trim();
            q.punjabiQuestion = lines.slice(1, optionAIndex).join('\n').trim();
          }
        }
      }

      // 2. OPTION EXTRACTION (Handling slash format or explicit markers)
      const getOptionPair = (letter: string, next: string | null) => {
        const regex = next 
          ? new RegExp(`(?:\\(${letter}\\)|Option\\s*${letter})\\s*([\\s\\S]*?)(?=\\(${next}\\)|Option\\s*${next}|Correct Answer|Answer|Answer Key|•|$)`, 'i')
          : new RegExp(`(?:\\(${letter}\\)|Option\\s*${letter})\\s*([\\s\\S]*?)(?=Correct Answer|Answer|Answer Key|•|$)`, 'i');
        
        const match = fullText.match(regex);
        if (!match) return ["", ""];
        
        const raw = match[1].trim();
        // Support slash separated English / Punjabi
        const parts = raw.split('/').map(s => s.trim());
        return [parts[0] || "", parts[1] || parts[0] || ""];
      };

      [q.optionAEnglish, q.optionAPunjabi] = getOptionPair('A', 'B');
      [q.optionBEnglish, q.optionBPunjabi] = getOptionPair('B', 'C');
      [q.optionCEnglish, q.optionCPunjabi] = getOptionPair('C', 'D');
      [q.optionDEnglish, q.optionDPunjabi] = getOptionPair('D', null);

      // 3. CORRECT ANSWER
      const ansMatch = fullText.match(/(?:Correct Answer|Answer|Answer Key|Correct Option)[:\s]*\(?([A-D])\)?/i);
      if (ansMatch) q.correctAnswer = ansMatch[1].toUpperCase();

      // 4. EXPLANATIONS (Improved multi-line support)
      const enMarkerRegex = /(?:English\s+(?:Explanation|Logic|Rationale|Rationale Box)[:\s]*)/i;
      const paMarkerRegex = /(?:(?:ਪੰਜਾਬੀ ਵਿਆਖਿਆ|Punjabi\s+(?:Explanation|Logic|Rationale|Rationale Box))[:\s]*)/i;

      const enMatch = fullText.match(enMarkerRegex);
      const paMatch = fullText.match(paMarkerRegex);

      if (enMatch && paMatch) {
        const enStartIndex = fullText.indexOf(enMatch[0]) + enMatch[0].length;
        const paStartIndex = fullText.indexOf(paMatch[0]);
        q.englishExplanation = fullText.substring(enStartIndex, paStartIndex).trim();
        q.punjabiExplanation = fullText.substring(paStartIndex + paMatch[0].length).trim();
      } else if (enMatch) {
        q.englishExplanation = fullText.substring(fullText.indexOf(enMatch[0]) + enMatch[0].length).trim();
      }

      // Debugging Matrix for UI verification
      q.debug = {
        EN_Q: q.englishQuestion ? 'YES' : 'NO',
        PA_Q: q.punjabiQuestion ? 'YES' : 'NO',
        OPT: (q.optionAEnglish && q.optionAPunjabi) ? 'YES' : 'NO',
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
