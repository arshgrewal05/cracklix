
'use client';

import React from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import MathText from './MathText';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string };
  language: 'en' | 'pa' | 'bilingual';
  showSolution?: boolean;
  hideOptions?: boolean;
}

/**
 * @fileOverview Institutional CBT Language Isolation Engine v45.0.
 * Redesign: Standardized font weights, language-specific labels, zero cross-bleed.
 */
export default function QuestionRenderer({ 
  question, 
  language = 'bilingual',
  showSolution = false,
  hideOptions = false 
}: QuestionRendererProps) {
  
  const isEn = language === 'en';
  const isPa = language === 'pa';
  const isBi = language === 'bilingual';

  return (
    <div className="w-full text-left font-body text-[#0F172A] bg-transparent">
      
      {/* 1. LANGUAGE-LOCKED STATEMENT */}
      <div className="space-y-6">
         {/* EN Mode or BI Mode (English Part) */}
         {(isEn || isBi) && (
            <div className="text-[19px] md:text-[22px] font-black leading-[1.6] antialiased text-[#0F172A] tracking-tight">
               <MathText text={question.englishQuestion || ""} />
            </div>
         )}
         
         {/* PA Mode or BI Mode (Punjabi Part) */}
         {(isPa || isBi) && (
            <div className={cn(
               "text-[19px] md:text-[22px] font-black leading-[1.6] antialiased text-[#0F172A] tracking-tight",
               isBi && "pt-6 border-t border-slate-100 mt-6"
            )}>
               <MathText text={question.punjabiQuestion || ""} />
            </div>
         )}
      </div>

      <div className="h-8 md:h-12" />

      {/* 2. DISCRETE OPTION HUB */}
      {!hideOptions && (
        <div className="flex flex-col space-y-4">
          {['A', 'B', 'C', 'D'].map(key => {
            const en = (question as any)[`option${key}English`];
            const pa = (question as any)[`option${key}Punjabi`];

            return (
              <div key={key} className="text-[16px] md:text-[19px] font-black flex gap-4 leading-normal items-start group p-4 rounded-2xl border-2 border-slate-50 hover:border-primary/20 hover:bg-slate-50 transition-all">
                <span className="shrink-0 font-black px-3 py-1 bg-[#0F172A] text-white rounded-lg text-xs md:text-sm">({key})</span>
                <div className="flex-1 pt-0.5">
                   {isEn && <MathText text={en || ""} />}
                   {isPa && <MathText text={pa || ""} />}
                   {isBi && (
                      <div className="space-y-1">
                         <MathText text={en || ""} className="block" />
                         <MathText text={pa || ""} className="block text-slate-400 font-bold" />
                      </div>
                   )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 3. SUBMIT-GATED SOLUTION HUB */}
      {showSolution && (
        <div className="mt-12 md:mt-20 space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
           
           {/* Unified Answer Key */}
           <div className="bg-emerald-50 border-2 border-emerald-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-5">
                 <div className="h-14 w-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <CheckCircle2 className="h-8 w-8" />
                 </div>
                 <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Institutional Audit Key</p>
                    <h4 className="text-2xl md:text-3xl font-headline font-black text-emerald-900 uppercase">Option {question.correctAnswer}</h4>
                 </div>
              </div>
              <div className="text-left md:text-right border-t md:border-t-0 md:border-l border-emerald-200 pt-6 md:pt-0 md:pl-10">
                 {isEn && <p className="font-black text-emerald-800 text-lg">{(question as any)[`option${question.correctAnswer}English`]}</p>}
                 {isPa && <p className="font-black text-emerald-800 text-lg">{(question as any)[`option${question.correctAnswer}Punjabi`]}</p>}
                 {isBi && (
                    <div className="space-y-1">
                       <p className="font-black text-emerald-800 text-lg">{(question as any)[`option${question.correctAnswer}English`]}</p>
                       <p className="font-bold text-emerald-600 text-sm">{(question as any)[`option${question.correctAnswer}Punjabi`]}</p>
                    </div>
                 )}
              </div>
           </div>

           {/* Strategic Rationale Block */}
           <div className="bg-[#121212] rounded-[3.5rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12"><Zap className="h-64 w-64" /></div>

              <div className="relative z-10 space-y-12">
                 {(isEn || isBi) && (
                    <div className="space-y-8">
                       <div className="flex items-center gap-4">
                          <span className="h-2 w-2 rounded-full bg-primary" />
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">English Rationale</p>
                       </div>
                       <div className="text-[17px] md:text-[20px] text-slate-100 leading-[2.2] font-medium tracking-wide">
                          <MathText text={question.englishExplanation || "Detailed logic gated by Arsh Grewal Management."} />
                       </div>
                    </div>
                 )}

                 {(isPa || isBi) && (
                    <div className={cn("space-y-8", isBi && "pt-12 border-t border-white/5")}>
                       <div className="flex items-center gap-4">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">ਪੰਜਾਬੀ ਵਿਆਖਿਆ</p>
                       </div>
                       <div className="text-[17px] md:text-[20px] text-slate-100 leading-[2.2] font-medium tracking-wide">
                          <MathText text={question.punjabiExplanation || "ਵਿਸਥਾਰਪੂਰਵਕ ਤਰਕ ਪ੍ਰਬੰਧਨ ਦੁਆਰਾ ਸੁਰੱਖਿਅਤ ਹੈ।"} />
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
