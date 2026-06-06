'use client';

import React from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import MathText from './MathText';
import { Bookmark, Flag, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string };
  language: 'en' | 'pa' | 'hi' | 'bi';
  showSolution?: boolean;
  hideOptions?: boolean;
}

/**
 * @fileOverview Hardened CBT Question Renderer v3.0.
 * Optimized: Reduced typography sizes and margins for high-density mobile interface.
 */
export default function QuestionRenderer({ 
  question, 
  language = 'bi',
  showSolution = false,
  hideOptions = false 
}: QuestionRendererProps) {
  
  const isEn = language === 'en';
  const isPa = language === 'pa';
  const isBi = language === 'bi';

  const typographyClass = "font-[700] leading-[1.3] antialiased tracking-normal text-[#111111] text-[18px] md:text-[21px]";

  const q = question as any;
  const englishQ = q.englishQuestion || q.questionEn || q.question_english || q.titleEn || q.questionText;
  const punjabiQ = q.punjabiQuestion || q.questionPa || q.question_punjabi || q.titlePa;
  
  const englishExp = q.englishExplanation || q.explanationEn || q.explanation_english || q.rationalization;
  const punjabiExp = q.punjabiExplanation || q.explanationPa || q.explanation_punjabi;

  return (
    <div className="w-full text-left font-body bg-transparent h-auto min-h-0 flex flex-col select-none">
      
      {/* 1. TOP INFO BAR (Compact) */}
      <div className="flex items-center justify-between mb-4 md:mb-6 border-b border-slate-100 pb-3 md:pb-4">
         <div className="flex items-center gap-4 md:gap-6">
            <div className="flex flex-col">
               <span className="text-[7px] font-black uppercase text-slate-400 tracking-widest">Question No.</span>
               <p className="text-xl md:text-2xl font-black text-[#0B1528] leading-none">{question.displayId || '1'}</p>
            </div>
            <div className="h-6 md:h-8 w-px bg-slate-100 mx-1 md:mx-2" />
            <div className="flex gap-1.5 md:gap-2">
               <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[8px] md:text-[9px] uppercase px-2 md:px-3 py-0.5 md:py-1">+1.0</Badge>
               <Badge className="bg-rose-50 text-rose-600 border-rose-100 font-black text-[8px] md:text-[9px] uppercase px-2 md:px-3 py-0.5 md:py-1">-0.25</Badge>
            </div>
         </div>
         <div className="flex gap-2 md:gap-3">
            <button className="h-9 w-9 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary transition-all shadow-sm">
               <Bookmark className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>
            <button className="h-9 w-9 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all shadow-sm">
               <Flag className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>
         </div>
      </div>

      {/* 2. CORE QUESTION STATEMENT (Tighter) */}
      <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-10">
         {(isEn || isBi) && (
            <div className={typographyClass}>
               <MathText text={englishQ || "Restoring question logic..."} />
            </div>
         )}
         
         {isBi && <div className="h-px w-full bg-slate-50 border-t border-dashed border-slate-200 my-1" />}

         {(isPa || isBi) && (
            <div className={typographyClass}>
               <MathText text={punjabiQ || ""} />
            </div>
         )}
      </div>

      {/* 3. OPTION HUB (High Density) */}
      {!hideOptions && (
        <div className="flex flex-col space-y-2 md:space-y-3 mb-4 md:mb-6">
          {['A', 'B', 'C', 'D'].map(key => {
            const en = q[`option${key}English`] || q[`option_${key.toLowerCase()}_english`];
            const pa = q[`option${key}Punjabi`] || q[`option_${key.toLowerCase()}_punjabi`];

            return (
              <div key={key} className="flex gap-3 md:gap-5 items-center group p-3 md:p-4 rounded-lg md:rounded-xl border-2 border-slate-100 hover:border-[#F97316]/30 transition-all bg-white shadow-sm cursor-pointer hover:shadow-lg active:scale-[0.99]">
                <div className="shrink-0 h-7 w-7 md:h-8 md:w-8 rounded-md md:rounded-lg bg-slate-50 flex items-center justify-center font-black text-[10px] md:text-xs text-slate-400 group-hover:bg-[#F97316] group-hover:text-white transition-colors">
                  {key}
                </div>
                <div className="flex-1 overflow-hidden text-left">
                   <div className="flex flex-col gap-0.5">
                      {(isEn || isBi) && <p className="font-[700] text-[15px] md:text-[18px] text-[#111111] leading-tight">{en}</p>}
                      {(isPa || isBi) && <p className="font-[700] text-[15px] md:text-[18px] text-[#111111] leading-tight">{pa || en}</p>}
                   </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 4. SOLUTION HUB (Compact) */}
      {showSolution && (
        <div className="mt-4 md:mt-8 space-y-3 md:space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
           <div className="bg-emerald-50 border-2 border-emerald-100 p-4 md:p-5 rounded-xl md:rounded-2xl flex items-center gap-4 md:gap-6">
              <div className="h-10 w-10 md:h-12 md:w-12 bg-emerald-500 rounded-lg md:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 shrink-0">
                 <Info className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="text-left">
                 <p className="text-[7px] md:text-[8px] font-black uppercase text-emerald-600 tracking-[0.2em]">Institutional Audit Key</p>
                 <h4 className="text-xl md:text-2xl font-black text-emerald-900 uppercase">Correct: Option {question.correctAnswer}</h4>
              </div>
           </div>
           <div className="bg-slate-50 rounded-xl md:rounded-2xl p-6 md:p-8 border border-slate-200 text-left">
              <div className="font-[500] text-[15px] md:text-[18px] text-[#111111] leading-relaxed">
                 {(isEn || isBi) && <MathText text={englishExp || ""} />}
                 {(isPa || isBi) && <MathText text={punjabiExp || ""} />}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
