
'use client';

import React from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import MathText from './MathText';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string, correctAnswerRaw?: string };
  language: 'en' | 'pa' | 'bilingual';
  showSolution?: boolean;
  hideOptions?: boolean;
}

/**
 * @fileOverview Institutional Solution Hub Renderer v5.0 (PSSSB / Testbook Style).
 * Features: Unified 22px typography, strict vertical spacing, and dark theme logic.
 */
export default function QuestionRenderer({ 
  question, 
  showSolution = false,
  hideOptions = false 
}: QuestionRendererProps) {
  
  return (
    <div className="w-full text-left font-body space-y-0 text-[#0F172A]">
      {/* 1. English Question Statement */}
      <div className="text-[18px] md:text-[22px] font-bold leading-relaxed antialiased">
         {question.displayId && <span className="mr-2 text-primary">Q{question.displayId}.</span>}
         <MathText text={question.questionEn || ""} className="inline" />
      </div>

      <div className="h-4" />

      {/* 2. Punjabi Question Statement */}
      {question.questionPa && (
        <div className="text-[18px] md:text-[22px] font-bold leading-relaxed antialiased text-slate-800">
           <MathText text={question.questionPa} />
        </div>
      )}

      <div className="h-6" />

      {/* 3. Options List - CLEAN LINE FORMAT */}
      {!hideOptions && (
        <div className="space-y-4">
          {['A', 'B', 'C', 'D'].map(key => {
            const content = (question as any)[`option${key}En`];
            if (!content) return null;

            return (
              <div key={key} className="text-[17px] md:text-[21px] font-bold text-slate-700 flex gap-3">
                <span className="shrink-0 text-slate-400">({key})</span>
                <MathText text={content} className="inline" />
              </div>
            )
          })}
        </div>
      )}

      <div className="h-10" />

      {/* 4. Correct Answer Indicator - SYNCED HIGH-FIDELITY SCALE */}
      <div className="text-[18px] md:text-[22px] font-black text-[#0F172A] border-y border-slate-100 py-8 mb-12">
         {question.correctAnswerRaw ? (
           <MathText text={question.correctAnswerRaw} />
         ) : (
           <p className="flex flex-wrap items-center gap-3">
             <span className="text-emerald-600 uppercase tracking-tight">Correct Answer:</span>
             <span className="uppercase">({question.correctAnswer}) {(question as any)[`option${question.correctAnswer}En`]}</span>
           </p>
         )}
      </div>

      {/* 5. Solution Hub - VERTICAL BILINGUAL FLOW */}
      {showSolution && (
        <div className="bg-[#121212] rounded-2xl md:rounded-[3rem] p-8 md:p-12 text-white shadow-4xl relative overflow-hidden border border-white/5 mt-10">
           <div className="space-y-0 relative z-10">
              
              {/* English Explanation */}
              {(question.explanationEn || question.explanation) && (
                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                      <span className="text-[15px] md:text-[17px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-1.5 rounded-lg border border-primary/20">
                        • English Explanation:
                      </span>
                   </div>
                   <div className="text-[18px] md:text-[22px] text-slate-100 font-medium leading-relaxed antialiased">
                      <MathText text={question.explanationEn || (question as any).explanation} />
                   </div>
                </div>
              )}

              {(question.explanationEn || (question as any).explanation) && question.explanationPa && <div className="h-16 border-b border-white/5 mb-16" />}

              {/* Punjabi Explanation */}
              {question.explanationPa && (
                <div className="space-y-6">
                   <div className="flex items-center gap-3">
                      <span className="text-[15px] md:text-[17px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-lg border border-emerald-500/20">
                        • ਪੰਜਾਬੀ ਵਿਆਖਿਆ:
                      </span>
                   </div>
                   <div className="text-[18px] md:text-[22px] text-slate-100 font-medium leading-relaxed antialiased">
                      <MathText text={question.explanationPa} />
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
