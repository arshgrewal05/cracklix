'use client';

import React from 'react';
import { Question } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from 'recharts';
import Image from 'next/image';

interface QuestionRendererProps {
  question: Partial<Question>;
  language: 'en' | 'pa';
}

const COLORS = ['#F97316', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6'];

/**
 * @fileOverview Final Enterprise Question Renderer.
 * Hardened for strict bilingual support and complex DI nodes.
 */

export default function QuestionRenderer({ question, language }: QuestionRendererProps) {
  const isEn = language === 'en';
  const isPa = language === 'pa';
  
  // Safe Fallback for Language Data
  const questionEn = question.questionEn || "";
  const questionPa = question.questionPa || "";
  
  const instructionEn = question.instructionEn || "";
  const instructionPa = question.instructionPa || "";
  
  const passageEn = question.passageEn || "";
  const passagePa = question.passagePa || "";

  return (
    <div className="space-y-8 w-full text-left font-body">
      {/* 1. Instruction Node */}
      {(instructionEn || instructionPa) && (
        <div className="bg-blue-50/50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">Institutional Instruction</p>
          <div className="space-y-1">
             {(isEn || !isPa) && <p className="text-sm font-bold text-blue-900 leading-tight">{instructionEn}</p>}
             {(isPa || !isEn) && <p className="text-sm font-medium text-blue-800 leading-tight italic">{instructionPa}</p>}
          </div>
        </div>
      )}

      {/* 2. Passage Node (Reading Comprehension / Caselet) */}
      {(passageEn || passagePa) && (
        <div className="bg-slate-50 border border-slate-100 p-8 rounded-[2.5rem] shadow-inner">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Read the following passage carefully:</p>
          <div className="space-y-6">
             {(isEn || !isPa) && <div className="text-lg leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">{passageEn}</div>}
             {(isPa || !isEn) && <div className="text-lg leading-relaxed text-slate-600 whitespace-pre-wrap font-medium italic border-t border-slate-200 pt-6">{passagePa}</div>}
          </div>
        </div>
      )}

      {/* 3. Diagram / Visual Node */}
      {question.diagramType && question.diagramType !== 'none' && (
        <div className="w-full py-4">
          {/* Table DI */}
          {question.diagramType === 'table' && question.tableData && (
            <Card className="border-slate-200 overflow-hidden rounded-2xl shadow-xl">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    {question.tableData.headers.map((h, i) => (
                      <TableHead key={i} className="font-black uppercase text-[10px] tracking-widest text-slate-500">{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {question.tableData.rows.map((row, i) => (
                    <TableRow key={i}>
                      {row.map((cell, j) => (
                        <TableCell key={j} className="font-bold text-slate-700">{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}

          {/* Chart DI */}
          {(question.diagramType === 'barGraph' || question.diagramType === 'pieChart' || question.diagramType === 'lineGraph') && question.chartConfig && (
            <div className="h-[350px] w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
              <ResponsiveContainer width="100%" height="100%">
                {question.diagramType === 'barGraph' ? (
                  <BarChart data={question.chartConfig.labels.map((l, i) => ({ name: l, value: question.chartConfig!.values[i] }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 700}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" fill="#F97316" radius={[6, 6, 0, 0]} />
                  </BarChart>
                ) : question.diagramType === 'pieChart' ? (
                  <PieChart>
                    <Pie
                      data={question.chartConfig.labels.map((l, i) => ({ name: l, value: question.chartConfig!.values[i] }))}
                      cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value"
                    >
                      {question.chartConfig.labels.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (
                  <LineChart data={question.chartConfig.labels.map((l, i) => ({ name: l, value: question.chartConfig!.values[i] }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 11, fontWeight: 700}} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#F97316" strokeWidth={5} dot={{r: 7, fill: '#F97316'}} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          )}

          {/* Image Based */}
          {question.diagramType === 'image' && question.imageUrl && (
            <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden border-2 border-slate-100 shadow-2xl">
              <Image src={question.imageUrl} fill alt={question.imageAlt || "Question Diagram"} className="object-contain bg-white" />
            </div>
          )}
        </div>
      )}

      {/* 4. Question Statement Node */}
      <div className="space-y-5">
        <div className="flex items-center gap-3">
           <div className="h-6 w-1 bg-primary rounded-full" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Statement Node</span>
        </div>
        <div className="space-y-4">
           {(isEn || !isPa) && <p className="text-2xl font-black leading-snug text-[#0B1528] tracking-tight">{questionEn}</p>}
           {(isPa || !isEn) && <p className="text-2xl font-bold leading-snug text-slate-500 tracking-tight italic">{questionPa}</p>}
        </div>
      </div>
    </div>
  );
}
