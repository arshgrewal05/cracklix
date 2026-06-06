
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
 * @fileOverview Official Exam Solution Renderer (Testbook/PSSSB Style).
 * - High-Fidelity structured explanations
 * - KaTeX math rendering support
 * - Strict Language Segregation
 */
export default function QuestionRenderer({ 
  question, 
  language, 
  showSolution = false,
  hideOptions = false 
}: QuestionRendererProps) {
  
  const cleanText = (text: string = "") => {
    if (!text) return "";
    return text
      .replace(/^Q\d+[\.\):\s-]*/i, '')      
      .replace(/^ਪ੍ਰਸ਼ਨ\s*\d+[\.\):\s-]*/, '') 
      .replace(/^ਪ੍ਰਸ਼ਨ\s*\d+[\.\):\s-]*/, '')
      .replace(/^\d+[\.\):\s-]*/, '')        
      .trim();
  };

  const subjectId = (question.subjectId || "").toLowerCase();
  const isEnglishSubject = subjectId.includes('english');
  const isPunjabiSubject = subjectId.includes('punjabi');

  const qEn = cleanText(question.questionEn);
  const qPa = cleanText(question.questionPa);
  
  const expEn = question.explanationEn || (question as any).explanation || "";
  const expPa = question.explanationPa || "";

  // Content Selection Logic
  const getContent = () => {
    if (isEnglishSubject) return { en: qEn, pa: "" };
    if (isPunjabiSubject) return { en: "", pa: qPa || qEn };
    if (language === 'en') return { en: qEn, pa: "" };
    if (language === 'pa') return { en: "", pa: qPa || qEn };
    return { en: qEn, pa: qPa };
  };

  const content = getContent();

  return (
    <div className="w-full text-left font-body space-y-8">
      {/* 1. Question Statement */}
      <div className="space-y-4">
        {content.en && (
          <div className="text-[16px] md:text-[19px] font-bold text-[#0F172A] leading-relaxed antialiased">
             {question.displayId && <span className="mr-2 text-primary">{question.displayId}.</span>}
             <MathText text={content.en} className="inline" />
          </div>
        )}
        {content.pa && (
          <div className="text-[16px] md:text-[19px] font-bold text-[#0F172A] leading-relaxed antialiased">
             <MathText text={content.pa} className="inline" />
          </div>
        )}
      </div>

      {/* 2. Options Grid */}
      {!hideOptions && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {['A', 'B', 'C', 'D'].map(key => {
            const en = cleanText((question as any)[`option${key}En`]);
            const pa = cleanText((question as any)[`option${key}Pa`]);
            
            const showEn = isEnglishSubject || language === 'en' || language === 'bilingual';
            const showPa = isPunjabiSubject || language === 'pa' || language === 'bilingual';

            return (
              <div key={key} className="flex items-center gap-4 p-4 md:p-5 bg-white border border-slate-200 rounded-xl hover:border-primary/40 transition-colors shadow-sm">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-black text-[11px] text-[#0F172A] shrink-0 border border-slate-200">
                  {key}
                </div>
                <div className="text-[15px] md:text-[17px] font-bold text-slate-800 leading-snug">
                  {showEn && <MathText text={en} className="inline" />}
                  {showEn && showPa && pa && <span className="text-primary/30 mx-2">/</span>}
                  {showPa && <MathText text={pa || (!showEn ? en : "")} className="inline" />}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 3. Solution Hub (Institutional Structured Flow) */}
      {showSolution && (
        <div className="mt-12 bg-[#121212] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5">
              <svg className="w-40 h-40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
           </div>

           <div className="space-y-12 relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-8">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Official Answer Key</p>
                    <h4 className="text-3xl font-black uppercase leading-tight">Correct Option: ({question.correctAnswer})</h4>
                 </div>
                 <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/10">
                    <p className="text-[15px] font-black text-white leading-none">
                       {cleanText((question as any)[`option${question.correctAnswer}En` || `option${question.correctAnswer}Pa` || ""])}
                    </p>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
                 {/* English Explanation Segment */}
                 {expEn && (
                   <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <div className="h-1 w-12 bg-primary rounded-full" />
                         <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary">• English Explanation:</span>
                      </div>
                      <div className="space-y-6 text-[15px] md:text-[17px] text-slate-300 font-medium leading-relaxed antialiased">
                         <MathText text={expEn} />
                      </div>
                   </div>
                 )}

                 {/* Punjabi Explanation Segment */}
                 {expPa && (
                   <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <div className="h-1 w-12 bg-emerald-500 rounded-full" />
                         <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500">• ਪੰਜਾਬੀ ਵਿਆਖਿਆ:</span>
                      </div>
                      <div className="space-y-6 text-[15px] md:text-[17px] text-slate-300 font-medium leading-relaxed antialiased">
                         <MathText text={expPa} />
                      </div>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
