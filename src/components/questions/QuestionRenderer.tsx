'use client';

import React from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import MathText from './MathText';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string };
  language: 'en' | 'pa' | 'bilingual';
  showSolution?: boolean;
  hideOptions?: boolean;
}

/**
 * @fileOverview Institutional High-Fidelity Renderer v13.0.
 * Vertical Option Flow, Multi-line Answers, and Auto-Expanding Logic.
 */
export default function QuestionRenderer({ 
  question, 
  showSolution = false,
  hideOptions = false 
}: QuestionRendererProps) {
  
  // Extract Answer Parts for Bilingual Display
  const fullAnsValue = (question as any)[`option${question.correctAnswer}En`] || "";
  const [ansEn, ansPa] = fullAnsValue.split('/').map((s: string) => s.trim());

  return (
    <div className="w-full text-left font-body space-y-0 text-[#0F172A] bg-transparent">
      {/* 1. English Question Statement */}
      <div className="text-[18px] md:text-[22px] font-black leading-relaxed antialiased">
         <MathText text={question.questionEn || ""} className="inline" />
      </div>

      <div className="h-6" />

      {/* 2. Punjabi Question Statement */}
      {question.questionPa && (
        <div className="text-[18px] md:text-[22px] font-black leading-relaxed antialiased text-slate-800">
           <MathText text={question.questionPa} />
        </div>
      )}

      <div className="h-8" />

      {/* 3. Options List - STRICT VERTICAL FLOW */}
      {!hideOptions && (
        <div className="flex flex-col space-y-6">
          {['A', 'B', 'C', 'D'].map(key => {
            const content = (question as any)[`option${key}En`];
            if (!content) return null;

            return (
              <div key={key} className="text-[18px] md:text-[22px] font-bold text-[#0F172A] flex gap-4 leading-snug items-start">
                <span className="shrink-0 font-black">({key})</span>
                <div className="flex-1">
                   <MathText text={content} className="inline" />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="h-8" />

      {/* 4. Correct Answer Indicator - Institutional Multi-line */}
      <div className="text-[18px] md:text-[22px] font-black text-[#0F172A] border-y border-slate-100 py-8 mb-10 bg-slate-50/50 px-6 rounded-2xl shadow-inner">
         <div className="space-y-4">
            <p className="flex items-center gap-3">
               <span className="text-emerald-600 uppercase tracking-tight">Correct Answer:</span>
               <span>({question.correctAnswer}) {ansEn}</span>
            </p>
            {ansPa && (
               <p className="flex items-center gap-3 text-slate-700">
                  <span className="text-emerald-600 uppercase tracking-tight">ਸਹੀ ਉੱਤਰ:</span>
                  <span>{ansPa}</span>
               </p>
            )}
         </div>
      </div>

      {/* 5. Solution Hub - AUTO-EXPANDING HEIGHT */}
      {showSolution && (
        <div className="bg-[#121212] rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 text-white shadow-4xl border border-white/5 h-auto overflow-visible">
           <div className="space-y-12">
              
              {/* English Explanation */}
              {question.explanationEn && (
                <div className="space-y-6">
                   <div className="flex items-center">
                      <span className="text-[14px] md:text-[16px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-1.5 rounded-lg border border-primary/20">
                        • English Explanation:
                      </span>
                   </div>
                   <div className="text-[18px] md:text-[20px] text-slate-100 font-bold leading-relaxed antialiased whitespace-pre-wrap break-words">
                      <MathText text={question.explanationEn} />
                   </div>
                </div>
              )}

              {/* Punjabi Explanation */}
              {question.explanationPa && (
                <div className="space-y-6 pt-6 border-t border-white/5">
                   <div className="flex items-center">
                      <span className="text-[14px] md:text-[16px] font-black uppercase tracking-[0.2em] text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-lg border border-emerald-500/20">
                        • ਪੰਜਾਬੀ ਵਿਆਖਿਆ:
                      </span>
                   </div>
                   <div className="text-[18px] md:text-[20px] text-slate-100 font-bold leading-relaxed antialiased whitespace-pre-wrap break-words">
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
