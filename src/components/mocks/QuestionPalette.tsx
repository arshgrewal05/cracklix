
"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, CheckCircle2, Flag, HelpCircle, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface QuestionPaletteProps {
  totalQuestions: number
  currentIndex: number
  answeredIndices: number[]
  flaggedIndices: number[]
  onSelect: (index: number) => void
  questions: any[]
}

export default function QuestionPalette({
  totalQuestions,
  currentIndex,
  answeredIndices,
  flaggedIndices,
  onSelect,
  questions
}: QuestionPaletteProps) {
  const PAGE_SIZE = 25
  const totalPages = Math.ceil(totalQuestions / PAGE_SIZE)
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    const targetPage = Math.floor(currentIndex / PAGE_SIZE)
    if (targetPage !== currentPage) setCurrentPage(targetPage)
  }, [currentIndex, currentPage])

  const startIdx = currentPage * PAGE_SIZE
  const endIdx = Math.min(startIdx + PAGE_SIZE, totalQuestions)
  const currentRange = Array.from({ length: endIdx - startIdx }, (_, i) => startIdx + i)

  // Subject-wise progress summary
  const subjectStats = useMemo(() => {
    const stats: Record<string, { total: number; done: number }> = {}
    questions.forEach((q, idx) => {
      const subj = q.subjectId || "General"
      if (!stats[subj]) stats[subj] = { total: 0, done: 0 }
      stats[subj].total++
      if (answeredIndices.includes(idx)) stats[subj].done++
    })
    return Object.entries(stats)
  }, [questions, answeredIndices])

  return (
    <div className="space-y-10">
      {/* Section Progress (Testbook Style) */}
      <div className="space-y-4">
         <div className="flex items-center gap-3">
            <Layers className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0F172A]">Sectional Progress</span>
         </div>
         <div className="grid grid-cols-1 gap-2.5">
            {subjectStats.map(([name, stat]) => (
               <div key={name} className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                  <span className="text-[9px] font-bold text-slate-500 uppercase truncate max-w-[120px]">{name}</span>
                  <span className="text-[10px] font-black text-primary">{stat.done} / {stat.total}</span>
               </div>
            ))}
         </div>
      </div>

      <div className="space-y-6">
         <div className="flex items-center justify-between">
            <h3 className="font-headline font-black text-[11px] uppercase tracking-widest text-[#0F172A]">
               Audit Map
            </h3>
            <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[9px] font-black">
               {answeredIndices.length} ANSWERED
            </Badge>
         </div>

         {/* Range Selector */}
         <div className="flex items-center justify-between bg-[#0F172A] p-2 rounded-2xl text-white shadow-xl">
            <button 
               onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
               disabled={currentPage === 0}
               className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-white/10 disabled:opacity-20 transition-all"
            >
               <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 text-center">
               <p className="text-[10px] font-black uppercase tracking-widest">
                  Qs {startIdx + 1} — {endIdx}
               </p>
            </div>
            <button 
               onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
               disabled={currentPage === totalPages - 1}
               className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-white/10 disabled:opacity-20 transition-all"
            >
               <ChevronRight className="h-5 w-5" />
            </button>
         </div>

         {/* Question Grid (5x5) */}
         <div className="grid grid-cols-5 gap-3">
            {currentRange.map((idx) => {
               const isCurrent = currentIndex === idx
               const isAnswered = answeredIndices.includes(idx)
               const isFlagged = flaggedIndices.includes(idx)
               const isBoth = isAnswered && isFlagged

               return (
                  <button
                     key={idx}
                     onClick={() => onSelect(idx)}
                     className={cn(
                        "h-11 w-11 rounded-xl text-[11px] font-black transition-all duration-300 border-2 flex items-center justify-center shadow-sm relative",
                        isCurrent && "border-primary bg-primary/10 text-primary scale-110 z-10 ring-4 ring-primary/10",
                        !isCurrent && isBoth && "bg-purple-600 border-purple-600 text-white",
                        !isCurrent && isAnswered && !isFlagged && "bg-emerald-600 border-emerald-600 text-white",
                        !isCurrent && isFlagged && !isAnswered && "bg-amber-500 border-amber-500 text-white",
                        !isCurrent && !isAnswered && !isFlagged && "bg-white border-slate-100 hover:border-slate-300 text-slate-400"
                     )}
                  >
                     {idx + 1}
                  </button>
               )
            })}
         </div>

         {/* Institutional Legend */}
         <div className="pt-10 border-t border-slate-50 grid grid-cols-2 gap-y-4 gap-x-6">
            <LegendItem color="bg-emerald-600" label="Answered" />
            <LegendItem color="bg-amber-500" label="For Review" />
            <LegendItem color="bg-purple-600" label="Ans & Review" />
            <LegendItem color="bg-white border-slate-100" label="Not Visited" />
            <LegendItem color="bg-primary/10 border-primary" label="Active" />
         </div>
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("h-3.5 w-3.5 rounded-lg border shadow-sm", color)} />
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{label}</span>
    </div>
  )
}
