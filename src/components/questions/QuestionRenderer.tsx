
'use client';

import React from 'react';
import { Question, LanguageDisplayMode } from '@/types';
import { cn } from '@/lib/utils';
import MathText from './MathText';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string };
  language: LanguageDisplayMode | 'en' | 'pa' | 'hi' | 'bilingual';
  showSolution?: boolean;
  hideOptions?: boolean;
  selectedAnswer?: number; 
  onSelect?: (index: number) => void;
}

export default function QuestionRenderer({ 
  question, 
  language = 'ENGLISH_PUNJABI',
  showSolution = false,
  hideOptions = false,
  selectedAnswer,
  onSelect
}: QuestionRendererProps) {
  
  // Normalized Mode Logic
  const mode = language === 'en' ? 'ENGLISH' :
               language === 'pa' ? 'PUNJABI' :
               language === 'hi' ? 'HINDI' :
               language === 'bilingual' ? 'ENGLISH_PUNJABI' : language as LanguageDisplayMode;

  const q = question as any;
  
  // Extract standard fields
  const englishQ = q.englishQuestion || q.questionEn || q.questionText;
  const punjabiQ = q.punjabiQuestion || q.questionPa;
  const hindiQ = q.hindiQuestion || q.questionHi;
  
  const englishExp = q.englishExplanation || q.explanationEn || q.rationalization;
  const punjabiExp = q.punjabiExplanation || q.explanationPa;
  const hindiExp = q.hindiExplanation;

  // Visibility Rules
  const showEn = mode === 'ENGLISH' || mode === 'ENGLISH_PUNJABI' || mode === 'ENGLISH_HINDI';
  const showPa = mode === 'PUNJABI' || mode === 'ENGLISH_PUNJABI';
  const showHi = mode === 'HINDI' || mode === 'ENGLISH_HINDI';

  return (
    <div className="w-full text-left font-body bg-white text-[#0F172A] p-3 md:p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col select-none">
      
      {/* 1. Question Statements */}
      <div className="space-y-2 mb-4">
         {showEn && englishQ && (
           <div className="font-[700] text-[16px] leading-snug tracking-tight text-[#0F172A] antialiased">
             <MathText text={englishQ} />
           </div>
         )}
         {showPa && punjabiQ && (
           <div className="font-[700] text-[15px] leading-snug tracking-tight text-slate-500 antialiased">
             <MathText text={punjabiQ} />
           </div>
         )}
         {showHi && hindiQ && (
           <div className="font-[700] text-[15px] leading-snug tracking-tight text-slate-500 antialiased">
             <MathText text={hindiQ} />
           </div>
         )}
      </div>

      {/* 2. Options Matrix */}
      {!hideOptions && (
        <div className="flex flex-col space-y-2">
          {['A', 'B', 'C', 'D'].map((key, idx) => {
            const en = q[`option${key}English`];
            const pa = q[`option${key}Punjabi`];
            const hi = q[`option${key}Hindi`];
            
            const isSelected = selectedAnswer === idx;
            const isCorrect = q.correctAnswer === key;

            const boxClasses = cn(
              "flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all border-2",
              showSolution 
                ? isCorrect ? "bg-emerald-50 border-emerald-500" 
                  : isSelected ? "bg-rose-50 border-rose-500"
                  : "bg-slate-50 border-transparent"
                : isSelected ? "bg-orange-50 border-primary shadow-sm" 
                  : "bg-slate-50 border-transparent active:bg-slate-100"
            );

            return (
              <div key={key} onClick={() => onSelect?.(idx)} className={boxClasses}>
                <span className={cn(
                  "font-[900] text-[15px] shrink-0 mt-0.5",
                  showSolution ? (isCorrect ? "text-emerald-600" : isSelected ? "text-rose-600" : "text-[#0F172A]")
                  : (isSelected ? "text-primary" : "text-slate-400")
                )}>
                  {key}
                </span>
                <div className="flex flex-col flex-1 min-w-0">
                  {showEn && en && (
                    <div className="font-[700] text-[15px] leading-tight text-[#0F172A]"><MathText text={en} /></div>
                  )}
                  {showPa && pa && (
                    <div className="font-[700] text-[14px] leading-tight text-slate-500 mt-1"><MathText text={pa} /></div>
                  )}
                  {showHi && hi && (
                    <div className="font-[700] text-[14px] leading-tight text-slate-500 mt-1"><MathText text={hi} /></div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 3. Solution Hub */}
      {showSolution && (
        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 pt-5 border-t border-slate-100">
           <div className="font-[900] text-[10px] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 inline-block uppercase tracking-wider">
              VERIFIED KEY: ({q.correctAnswer || '?'})
           </div>

           <div className="space-y-4">
              {showEn && englishExp && (
                <div className="space-y-1">
                   <span className="text-[#0F172A] font-[900] uppercase tracking-widest text-[9px]">English Rationale:</span>
                   <div className="font-[600] text-[13px] leading-relaxed text-slate-600 antialiased">
                      <MathText text={englishExp} />
                   </div>
                </div>
              )}

              {showPa && punjabiExp && (
                <div className="space-y-1">
                   <span className="text-[#0F172A] font-[900] uppercase tracking-widest text-[9px]">ਪੰਜਾਬੀ ਵਿਆਖਿਆ:</span>
                   <div className="font-[600] text-[13px] leading-relaxed text-slate-600 antialiased">
                      <MathText text={punjabiExp} />
                   </div>
                </div>
              )}

              {showHi && hindiExp && (
                <div className="space-y-1">
                   <span className="text-[#0F172A] font-[900] uppercase tracking-widest text-[9px]">हिंदी व्याख्या:</span>
                   <div className="font-[600] text-[13px] leading-relaxed text-slate-600 antialiased">
                      <MathText text={hindiExp} />
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
