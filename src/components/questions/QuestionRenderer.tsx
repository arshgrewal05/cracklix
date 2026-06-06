
'use client';

import React from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import MathText from './MathText';
import { Bookmark, AlertTriangle, Flag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string };
  language: 'en' | 'pa' | 'hi' | 'bi';
  showSolution?: boolean;
  hideOptions?: boolean;
}

/**
 * @fileOverview Institutional Uniform Typography Question Engine v78.0.
 * Strictly enforces identical typography (#111111, 700 weight) for both EN and PA.
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

  // Responsive font sizes for high-density reading - 700 weight as requested
  const typographyClass = "font-[700] leading-[1.4] antialiased tracking-normal text-[#111111] text-[20px] md:text-[24px] lg:text-[28px]";

  return (
    <div className="w-full text-left font-body bg-transparent h-auto min-h-0 flex flex-col select-none">
      
      {/* 1. TOP METADATA ROW */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-3">
         <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center font-black text-sm shadow-xl">
               {question.displayId || '1'}
            </div>
            <div className="flex items-center gap-2">
               <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-black text-[9px] uppercase px-3 py-1">+1.0 Marks</Badge>
               <Badge className="bg-rose-50 text-rose-600 border-rose-100 font-black text-[9px] uppercase px-3 py-1">-0.25 Negative</Badge>
            </div>
         </div>
         <div className="flex gap-4">
            <button className="text-slate-300 hover:text-[#F97316] transition-all p-1"><Bookmark className="h-5 w-5" /></button>
            <button className="text-slate-300 hover:text-rose-500 transition-all p-1"><Flag className="h-5 w-5" /></button>
         </div>
      </div>

      {/* 2. CORE QUESTION STATEMENT */}
      <div className="flex flex-col gap-8 flex-1">
         {(isEn || isBi) && (
            <div className={typographyClass}>
               <MathText text={question.englishQuestion || "Loading question..."} />
            </div>
         )}
         
         {isBi && <div className="h-px w-full bg-slate-50 border-t border-dashed border-slate-200" />}

         {(isPa || isBi) && (
            <div className={typographyClass}>
               <MathText text={question.punjabiQuestion || ""} />
            </div>
         )}
      </div>

      <div className="h-12 shrink-0" />

      {/* 3. OPTION HUB */}
      {!hideOptions && (
        <div className="flex flex-col space-y-3 mt-auto pb-8">
          {['A', 'B', 'C', 'D'].map(key => {
            const en = (question as any)[`option${key}English`];
            const pa = (question as any)[`option${key}Punjabi`];

            return (
              <div key={key} className="flex gap-5 items-center group p-4 rounded-xl border-2 border-slate-100 hover:border-[#F97316]/30 transition-all bg-white shadow-sm cursor-pointer hover:shadow-xl active:scale-[0.99]">
                <span className="shrink-0 font-black px-3 py-1 bg-slate-50 text-slate-400 group-hover:bg-[#F97316] group-hover:text-white rounded-lg text-xs transition-colors">({key})</span>
                <div className="flex-1 overflow-hidden">
                   <div className="flex flex-col gap-1">
                      {(isEn || isBi) && <p className="font-[700] text-[18px] text-[#111111] leading-tight">{en}</p>}
                      {(isPa || isBi) && <p className="font-[700] text-[18px] text-[#111111] leading-tight">{pa || en}</p>}
                   </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 4. SOLUTION HUB */}
      {showSolution && (
        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
           <div className="bg-emerald-50 border-2 border-emerald-100 p-5 rounded-[2rem] flex items-center gap-6">
              <div className="h-12 w-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                 <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="text-left">
                 <p className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.2em]">Institutional Audit Key</p>
                 <h4 className="text-2xl font-black text-emerald-900 uppercase">Correct: Option {question.correctAnswer}</h4>
              </div>
           </div>
           <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-200">
              <div className="font-[500] text-[18px] text-[#111111] leading-relaxed">
                 {(isEn || isBi) && <MathText text={question.englishExplanation || ""} />}
                 {(isPa || isBi) && <MathText text={question.punjabiExplanation || ""} />}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}
