/**
 * @fileOverview Final Exam Content Formatter AI v15.0.
 * 
 * - Rules: No prefixes (Q1., A, B, etc.), Math symbols preserved, Pure text output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const QuestionOutputSchema = z.object({
  question_number: z.number().describe('Index of the question.'),
  question_english: z.string().describe('Clean English question. NO PREFIXES like "Q1."'),
  question_punjabi: z.string().describe('Clean Punjabi question. NO PREFIXES like "ਪ੍ਰਸ਼ਨ 1."'),
  option_a_english: z.string().describe('Option A English text only.'),
  option_a_punjabi: z.string().describe('Option A Punjabi text only.'),
  option_b_english: z.string().describe('Option B English text only.'),
  option_b_punjabi: z.string().describe('Option B Punjabi text only.'),
  option_c_english: z.string().describe('Option C English text only.'),
  option_c_punjabi: z.string().describe('Option C Punjabi text only.'),
  option_d_english: z.string().describe('Option D English text only.'),
  option_d_punjabi: z.string().describe('Option D Punjabi text only.'),
  correct_option: z.enum(['A', 'B', 'C', 'D']),
  explanation_english: z.string().describe('English step-by-step logic. Use LaTeX format for math like $...$.'),
  explanation_punjabi: z.string().describe('Punjabi step-by-step logic. Use LaTeX format for math like $...$.')
});

const BulkParseInputSchema = z.object({
  rawText: z.string().describe('Raw bilingual text block.'),
});

const BulkParseOutputSchema = z.array(QuestionOutputSchema);

export async function bulkParseMCQ(input: { rawText: string }): Promise<z.infer<typeof BulkParseOutputSchema>> {
  return bulkParseMCQFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bulkParseMCQ',
  input: { schema: BulkParseInputSchema },
  output: { schema: BulkParseOutputSchema },
  prompt: `You are an expert bilingual exam content formatter. 

### FORMATTING RULES (STRICT):
1. NO PREFIXES: Remove "Q1.", "ਪ੍ਰਸ਼ਨ 1.", "(A)", "Option A" from ALL output fields. Stored values must be PURE text/math.
2. OPTION SPLIT: Split strings like "84 cm² / 84 ਵਰਗ ਸੈਂਟੀਮੀਟਰ" into English and Punjabi fields.
3. MATH RENDER: If you see formulas like Area = sqrt(s(s-a)...), convert them to basic LaTeX format using dollar signs: e.g. $\\text{Area} = \\sqrt{s(s-a)(s-b)(s-c)}$.
4. EXPLANATION: Capture the full logic. Do not summarize.

---
INPUT DATA:
{{{rawText}}}
---

Return ONLY a JSON array.`,
});

const bulkParseMCQFlow = ai.defineFlow(
  {
    name: 'bulkParseMCQFlow',
    inputSchema: BulkParseInputSchema,
    outputSchema: BulkParseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
