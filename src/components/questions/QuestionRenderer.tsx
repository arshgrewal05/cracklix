'use client';

import React, { useMemo } from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, BrainCircuit, LayoutGrid } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string };
  language: 'en' | 'pa' | 'bilingual';
  showSolution?: boolean;
}

/**
 * @fileOverview High-Fidelity Question Renderer v7.0.
 * Optimized: Full Bilingual Option Support and Artifact Cleanup.
 */

export default function QuestionRenderer({ question, language, showSolution = false }: QuestionRendererProps) {
  const showEn = language === 'en' || language === 'bilingual';
  const showPa = language === 'pa' || language === 'bilingual';
  
  const expEn = useMemo(() => question.explanationEn || (question as any).explanation || "", [question]);
  const expPa = useMemo(() => question.explanationPa || "", [question]);

  return (
    <div className="w-full text-left font-body">
      <div className="flex items-center gap-3 mb-6">
         <Badge className="bg-[#0F172A] text-white border-none text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
            {question.displayId || 'NODE'}
         </Badge>
         <div className="h-px flex-1 bg-slate-100" />
      </div>

      {question.imageUrl && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8 shadow-inner overflow-hidden">
           <img src={question.imageUrl} alt="Audit Asset" className="max-h-[400px] rounded-xl mx-auto object-contain" />
        </div>
      )}

      {/* Question Statements */}
      <div className="space-y-6 mb-10">
        {showEn && question.questionEn && (
           <div className="text-[18px] md:text-[22px] font-black leading-tight text-black whitespace-pre-wrap antialiased">
              {question.questionEn.replace(/^\d+[\.\):\s-]*/, '')}
           </div>
        )}
        {showPa && question.questionPa && (
           <div className={cn(
              "text-[18px] md:text-[22px] font-black leading-tight text-black whitespace-pre-wrap antialiased",
              showEn ? "pt-6 border-t border-slate-100 mt-6" : ""
           )}>
              {question.questionPa.replace(/^\d+[\.\):\s-]*/, '')}
           </div>
        )}
      </div>

      {/* MCQ Options Rendering */}
      <div className="grid grid-cols-1 gap-3 mb-10">
        {['A', 'B', 'C', 'D'].map((key) => {
          const optEn = (question as any)[`option${key}En`];
          const optPa = (question as any)[`option${key}Pa`];
          if (!optEn && !optPa) return null;

          return (
            <div key={key} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/30">
               <div className="h-7 w-7 rounded-lg bg-[#0F172A] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-lg">
                  {key}
               </div>
               <div className="space-y-2 flex-1">
                  {showEn && optEn && <p className="text-[15px] font-bold text-slate-800 leading-tight">{optEn}</p>}
                  {showPa && optPa && <p className={cn("text-[15px] font-bold text-slate-800 leading-tight", showEn && optEn ? "pt-2 border-t border-slate-100/50" : "")}>{optPa}</p>}
               </div>
            </div>
          )
        })}
      </div>

      {showSolution && (
        <div className="mt-12 p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 space-y-6 shadow-xl">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg"><CheckCircle2 className="h-5 w-5" /></div>
              <h4 className="text-[16px] text-[#0F172A] font-black uppercase tracking-tight">Verified Key: {question.correctAnswer}</h4>
           </div>
           
           <div className="space-y-6 pt-6 border-t border-emerald-200/50">
              {showEn && expEn && (
                <div className="space-y-2">
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Audit Rationale (EN)</p>
                   <div className="text-[14px] text-slate-800 leading-relaxed font-bold bg-white/60 p-6 rounded-2xl whitespace-pre-wrap antialiased border border-emerald-100/50">{expEn}</div>
                </div>
              )}
              {showPa && expPa && (
                <div className="space-y-2">
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">ਵਿਆਖਿਆ (PA)</p>
                   <div className="text-[14px] text-slate-800 leading-relaxed font-bold bg-white/60 p-6 rounded-2xl whitespace-pre-wrap antialiased border border-emerald-100/50">{expPa}</div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
