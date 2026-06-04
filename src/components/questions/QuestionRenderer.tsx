
'use client';

import React from 'react';
import { Question } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { CheckCircle2, LayoutGrid } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface QuestionRendererProps {
  question: Partial<Question>;
  language: 'en' | 'pa' | 'bilingual';
  showSolution?: boolean;
}

/**
 * @fileOverview Refined Question Renderer.
 * Optimized for Testbook-style high-density layout.
 * Color: Absolute Black (#000000).
 * Logic: Single language focus to prevent mobile scrolling.
 */

export default function QuestionRenderer({ question, language, showSolution = false }: QuestionRendererProps) {
  // Logic: Show English only if 'en' is selected. 
  // Otherwise show Punjabi if 'pa' or 'bilingual' is selected (respecting state-exam primary focus).
  const showEn = language === 'en';
  const showPa = language === 'pa' || language === 'bilingual';
  
  const questionType = question.questionType || 'MCQ';
  const diagramType = question.diagramType || 'none';

  const hasContext = !!(question.instructionEn || question.instructionPa || question.passageEn || question.passagePa);

  return (
    <div className="w-full text-left font-body animate-in fade-in duration-300">
      {/* 1. Context Container (Ultra-Compact) */}
      {hasContext && (
        <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl mb-4 space-y-2">
           {(question.instructionEn || question.instructionPa) && (
             <div className="space-y-1">
                {showEn && question.instructionEn && <p className="text-[12px] font-bold text-black leading-tight">{question.instructionEn}</p>}
                {showPa && question.instructionPa && <p className="text-[12px] font-bold text-black leading-tight">{question.instructionPa}</p>}
             </div>
           )}

           {(question.passageEn || question.passagePa) && (
             <div className="space-y-2 border-t border-slate-200 pt-2">
                {showEn && question.passageEn && <div className="text-sm leading-snug text-black font-medium whitespace-pre-wrap">{question.passageEn}</div>}
                {showPa && question.passagePa && <div className="text-sm leading-snug text-black font-medium whitespace-pre-wrap">{question.passagePa}</div>}
             </div>
           )}
        </div>
      )}

      {/* 2. Visual Node */}
      {(question.imageUrl || question.tableData || question.chartConfig) && (
        <div className="mb-4">
           {question.imageUrl && (
             <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-100 bg-white">
               <Image 
                 src={question.imageUrl} 
                 fill 
                 alt="Diagram" 
                 className="object-contain p-2" 
                 unoptimized 
               />
             </div>
           )}

           {question.tableData && (
             <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
               <Table>
                 <TableHeader className="bg-slate-50">
                   <TableRow className="h-8">
                     {question.tableData.headers?.map((header: string, i: number) => (
                       <TableHead key={i} className="text-center font-black uppercase text-[10px] text-black px-2">{header}</TableHead>
                     ))}
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {question.tableData.rows?.map((row: any[], i: number) => (
                     <TableRow key={i} className="h-8">
                       {row.map((cell, j) => (
                         <TableCell key={j} className="text-center font-bold text-black border-r border-slate-50 last:border-0 py-1 text-[11px] px-2">{cell}</TableCell>
                       ))}
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             </div>
           )}

           {question.chartConfig && (
              <div className="h-[180px] w-full bg-white p-2 rounded-lg border border-slate-100">
                 <ResponsiveContainer width="100%" height="100%">
                    {diagramType === 'barGraph' ? (
                       <BarChart data={question.chartConfig.data}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#000', fontSize: 10}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#000', fontSize: 10}} />
                          <Tooltip />
                          <Bar dataKey="value" fill="#000" radius={[2, 2, 0, 0]} />
                       </BarChart>
                    ) : (
                       <LineChart data={question.chartConfig.data}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#000' }} />
                          <YAxis tick={{ fontSize: 10, fill: '#000' }} />
                          <Tooltip />
                          <Line type="monotone" dataKey="value" stroke="#000" strokeWidth={2} />
                       </LineChart>
                    )}
                 </ResponsiveContainer>
              </div>
           )}
        </div>
      )}

      {/* 3. Question Statement (Absolute Black & Dense) */}
      <div className="space-y-2 mb-6">
        {showEn && question.questionEn && (
           <div className="text-[16px] md:text-[18px] font-bold leading-snug text-black tracking-tight whitespace-pre-wrap">
              {question.questionEn}
           </div>
        )}
        {showPa && question.questionPa && (
           <div className="text-[16px] md:text-[18px] font-bold leading-snug text-black tracking-tight whitespace-pre-wrap">
              {question.questionPa}
           </div>
        )}
      </div>

      {/* 4. Solution Review Hub */}
      {showSolution && (
        <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 space-y-3">
           <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <h4 className="text-[14px] text-black font-black uppercase">Correct Option: {question.correctAnswer}</h4>
           </div>
           <div className="pt-2 border-t border-emerald-100/60">
              {showEn && question.explanationEn && (
                <div className="text-sm text-black leading-relaxed font-medium whitespace-pre-wrap">
                  {question.explanationEn}
                </div>
              )}
              {showPa && question.explanationPa && (
                <div className="text-sm text-black leading-relaxed font-medium whitespace-pre-wrap">
                  {question.explanationPa}
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
}
