'use client';

import React, { useMemo } from 'react';
import { Question } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { CheckCircle2, Info, BrainCircuit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface QuestionRendererProps {
  question: Partial<Question> & { displayId?: string };
  language: 'en' | 'pa' | 'bilingual';
  showSolution?: boolean;
}

/**
 * @fileOverview High-Fidelity Question Renderer v5.0.
 * Optimized: Reliable field scanning to ensure your ICT explanations are visible.
 */

export default function QuestionRenderer({ question, language, showSolution = false }: QuestionRendererProps) {
  const showEn = language === 'en' || language === 'bilingual';
  const showPa = language === 'pa' || language === 'bilingual';
  
  // Robust scan for provided explanations
  const expEn = useMemo(() => {
     return question.explanationEn || (question as any).explanation || (question as any).solution || "";
  }, [question]);

  const expPa = useMemo(() => {
     return question.explanationPa || (question as any).punjabiExplanation || "";
  }, [question]);

  return (
    <div className="w-full text-left font-body">
      <div className="flex items-center gap-3 mb-6">
         <Badge className="bg-[#0F172A] text-white border-none text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
            {question.displayId || 'NODE'}
         </Badge>
         <div className="h-px flex-1 bg-slate-100" />
      </div>

      {question.imageUrl && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8 shadow-inner">
           <img src={question.imageUrl} alt="Audit" className="max-w-full rounded-xl mx-auto" />
        </div>
      )}

      <div className="space-y-6 mb-8">
        {showEn && question.questionEn && (
           <div className="text-[18px] md:text-[22px] font-black leading-tight text-black whitespace-pre-wrap">
              {question.questionEn}
           </div>
        )}
        {showPa && question.questionPa && (
           <div className={cn("text-[18px] md:text-[22px] font-black leading-tight text-black whitespace-pre-wrap", showEn ? "pt-4 border-t border-slate-100" : "")}>
              {question.questionPa}
           </div>
        )}
      </div>

      {showSolution && (
        <div className="mt-10 p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 space-y-6 shadow-xl">
           <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-white"><CheckCircle2 className="h-5 w-5" /></div>
              <h4 className="text-[16px] text-[#0F172A] font-black uppercase tracking-tight">Verified Answer: {question.correctAnswer}</h4>
           </div>
           
           <div className="space-y-6 pt-6 border-t border-emerald-200/50">
              {showEn && expEn && (
                <div className="space-y-2">
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Audit Rationale (EN)</p>
                   <div className="text-[14px] text-slate-800 leading-relaxed font-bold bg-white/60 p-6 rounded-2xl whitespace-pre-wrap">{expEn}</div>
                </div>
              )}
              {showPa && expPa && (
                <div className="space-y-2">
                   <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">ਵਿਆਖਿਆ (PA)</p>
                   <div className="text-[14px] text-slate-800 leading-relaxed font-bold bg-white/60 p-6 rounded-2xl whitespace-pre-wrap">{expPa}</div>
                </div>
              )}
              {!expEn && !expPa && (
                <div className="flex items-center gap-3 p-4 bg-white/40 rounded-xl border border-dashed border-emerald-200">
                   <BrainCircuit className="h-4 w-4 text-emerald-400" />
                   <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-tight">No detailed rationale recorded for this node.</p>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
