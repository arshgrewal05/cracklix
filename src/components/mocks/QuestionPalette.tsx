
'use client';

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { LayoutGrid, List, Info, CheckCircle2, FileText } from "lucide-react"
import { useExamStore } from '@/store/useExamStore';
import { Button } from "@/components/ui/badge";

/**
 * @fileOverview Institutional High-Density Palette Hub.
 * Strictly implements requested color logic and Testbook grid flow.
 */
export default function QuestionPalette({ onSelect }: { onSelect: (index: number) => void }) {
  const { questions, status, currentIdx, visited } = useExamStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const summary = useMemo(() => {
    const s = { answered: 0, marked: 0, notAnswered: 0, notVisited: 0, ansMarked: 0 };
    questions.forEach((_, i) => {
      const st = status[i];
      if (st === 'answered') s.answered++;
      else if (st === 'marked') s.marked++;
      else if (st === 'answered-marked') s.ansMarked++;
      else if (visited.includes(i)) s.notAnswered++;
      else s.notVisited++;
    });
    return s;
  }, [questions, status, visited]);

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 text-left font-body select-none">
      
      {/* TABS HUB */}
      <div className="flex border-b border-slate-100 shrink-0">
         <button onClick={() => setViewMode('grid')} className={cn("flex-1 h-14 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all", viewMode === 'grid' ? "border-[#F97316] text-[#F97316] bg-orange-50/30" : "border-transparent text-slate-400 hover:text-slate-600")}>
            <LayoutGrid className="h-4 w-4" /> GRID VIEW
         </button>
         <button onClick={() => setViewMode('list')} className={cn("flex-1 h-14 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all", viewMode === 'list' ? "border-[#F97316] text-[#F97316] bg-orange-50/30" : "border-transparent text-slate-400 hover:text-slate-600")}>
            <List className="h-4 w-4" /> LIST VIEW
         </button>
      </div>

      {/* LEGEND AUDIT */}
      <div className="p-4 grid grid-cols-2 gap-2 bg-slate-50/50 shrink-0 border-b border-slate-100">
         <LegendItem count={summary.answered} label="Answered" color="bg-blue-600" />
         <LegendItem count={summary.notAnswered} label="Not Answered" color="bg-slate-400" />
         <LegendItem count={summary.marked} label="Marked" color="bg-pink-500" />
         <LegendItem count={summary.notVisited} label="Not Visited" color="bg-white border-slate-200" textColor="text-slate-300" />
         <LegendItem count={summary.ansMarked} label="Ans & Marked" color="bg-violet-600" colSpan={2} />
      </div>

      {/* GRID MATRIX */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white">
         <div className="grid grid-cols-5 gap-3">
            {questions.map((_, idx) => {
              const st = status[idx];
              const isVisited = visited.includes(idx);
              const isCurrent = currentIdx === idx;

              return (
                <button
                  key={idx}
                  onClick={() => onSelect(idx)}
                  className={cn(
                    "relative w-11 h-11 rounded-xl flex items-center justify-center font-black text-xs transition-all border-2",
                    isCurrent ? "border-[#F97316] bg-white text-[#F97316] scale-110 shadow-lg z-10" : "border-transparent",
                    !isCurrent && st === 'answered' ? "bg-blue-600 text-white" :
                    !isCurrent && st === 'marked' ? "bg-pink-500 text-white" :
                    !isCurrent && st === 'answered-marked' ? "bg-violet-600 text-white" :
                    !isCurrent && isVisited ? "bg-slate-400 text-white" :
                    !isCurrent && "bg-white text-slate-300 border-slate-100"
                  )}
                >
                  {idx + 1}
                  {st === 'answered-marked' && <CheckCircle2 className="absolute -top-1 -right-1 h-4 w-4 text-white bg-emerald-500 rounded-full border-2 border-white" />}
                </button>
              )
            })}
         </div>
      </div>

      {/* FOOTER LINKS */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 shrink-0 grid grid-cols-2 gap-2">
         <button className="flex items-center justify-center gap-2 h-10 rounded-lg bg-white border border-slate-200 text-[9px] font-black uppercase text-slate-500 hover:bg-slate-100 transition-colors">
            <Info className="h-3 w-3" /> Instructions
         </button>
         <button className="flex items-center justify-center gap-2 h-10 rounded-lg bg-white border border-slate-200 text-[9px] font-black uppercase text-slate-500 hover:bg-slate-100 transition-colors">
            <FileText className="h-3 w-3" /> Question Paper
         </button>
      </div>
    </div>
  )
}

function LegendItem({ count, label, color, textColor = "text-white", colSpan = 1 }: any) {
  return (
    <div className={cn("flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-100 shadow-sm", colSpan > 1 && "col-span-2")}>
       <div className={cn("h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-black shrink-0", color, textColor)}>
          {count}
       </div>
       <span className="text-[10px] font-black uppercase text-slate-400 tracking-tight truncate">{label}</span>
    </div>
  )
}
