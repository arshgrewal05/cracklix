'use client';

import React, { useMemo } from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, Info } from 'lucide-react';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string };
  language: 'en' | 'pa' | 'bilingual';
  showSolution?: boolean;
  hideOptions?: boolean;
}

/**
 * @fileOverview Institutional High-Fidelity Question Renderer v17.0.
 * Optimized for: High-density mobile friendly bilingual scaling (15px/17px).
 */

export default function QuestionRenderer({ 
  question, 
  language, 
  showSolution = false,
  hideOptions = false 
}: QuestionRendererProps) {
  
  const cleanText = (text: string = "") => {
    return text
      .replace(/^[A-D][\.\):\s-]*/i, '')
      .replace(/^\d+[\.\):\s-]*/, '')
      .replace(/^\*\*|\*\*$/g, '')
      .replace(/\*\*/g, '')
      .trim();
  };

  const renderContent = (en: string = "", pa: string = "") => {
    const cEn = cleanText(en);
    const cPa = cleanText(pa);

    if (language === 'en') return cEn;
    if (language === 'pa') return cPa || cEn;
    return `${cEn}${cPa && cPa !== cEn ? ` / ${cPa}` : ''}`;
  };

  const expEn = useMemo(() => question.explanationEn || (question as any).explanation || "", [question]);
  const expPa = useMemo(() => question.explanationPa || "", [question]);

  return (
    <div className="w-full text-left font-body space-y-4 md:space-y-6">
      {question.imageUrl && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 shadow-inner overflow-hidden">
           <img src={question.imageUrl} alt="Asset" className="max-h-[180px] rounded-xl mx-auto object-contain" />
        </div>
      )}

      {/* Question Statement - Compact High Density */}
      <div className="text-[15px] md:text-[17px] font-black leading-tight text-[#0F172A] whitespace-pre-wrap antialiased">
        {renderContent(question.questionEn, question.questionPa)}
      </div>

      {/* Options Hub */}
      {!hideOptions && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4">
          {['A', 'B', 'C', 'D'].map(key => {
            const en = (question as any)[`option${key}En`] || "";
            const pa = (question as any)[`option${key}Pa`] || "";
            const optionText = renderContent(en, pa);
            
            if (!optionText) return null;
            
            return (
                <div key={key} className="flex items-center gap-3 p-3 md:p-4 bg-white border border-slate-100 rounded-xl md:rounded-2xl shadow-sm">
                  <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-slate-50 flex items-center justify-center font-black text-[10px] md:text-xs text-primary shrink-0 border border-slate-100">
                     {key}
                  </div>
                  <p className="text-[13px] md:text-[15px] font-bold text-slate-700 leading-snug">
                      {optionText}
                  </p>
                </div>
            )
          })}
        </div>
      )}

      {showSolution && (
        <div className="mt-6 p-5 md:p-8 bg-emerald-50/40 rounded-2xl md:rounded-[2.5rem] border border-emerald-100 space-y-4 md:space-y-6 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-5"><CheckCircle2 className="h-32 w-32" /></div>
           
           <div className="flex items-center gap-3 relative z-10">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
                 <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="text-left">
                 <p className="text-[8px] md:text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Official Key</p>
                 <h4 className="text-base md:text-lg text-[#0F172A] font-black uppercase">Option {question.correctAnswer}</h4>
              </div>
           </div>
           
           <div className="space-y-2 md:space-y-3 pt-4 md:pt-6 border-t border-emerald-200/30 relative z-10">
              <div className="flex items-center gap-2 mb-1">
                 <Info className="h-3 md:h-3.5 w-3 md:w-3.5 text-emerald-600" />
                 <span className="text-[8px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest">Logic Hub</span>
              </div>
              <div className="text-[13px] md:text-[16px] text-slate-800 leading-relaxed font-semibold bg-white/60 p-4 md:p-6 rounded-xl md:rounded-2xl whitespace-pre-wrap border border-emerald-100/30 shadow-inner italic">
                {renderContent(expEn, expPa)}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
