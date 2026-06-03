
"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, CheckCircle2, Flag, HelpCircle, Layers, Bookmark } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface QuestionPaletteProps {
  totalQuestions: number
  currentIndex: number
  answeredIndices: number[]
  flaggedIndices: number[]
  visitedIndices: number[]
  onSelect: (index: number) => void
  questions: any[]
}

export default function QuestionPalette({
  totalQuestions,
  currentIndex,
  answeredIndices,
  flaggedIndices,
  visitedIndices,
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

  const summary = useMemo(() => ({
    answered: answeredIndices.length,
    marked: flaggedIndices.length,
    notAnswered: visitedIndices.length - answeredIndices.length,
    notVisited: totalQuestions - visitedIndices.length
  }), [totalQuestions, answeredIndices, flaggedIndices, visitedIndices])

  return (
    <div className="space-y-8 flex flex-col h-full">
      {/* Exam Summary (Compact) */}
      <div className="grid grid-cols-2 gap-3 shrink-0">
         <SummaryBox count={summary.answered} label="Answered" color="bg-emerald-600" />
         <SummaryBox count={summary.notAnswered} label="Not Answered" color="bg-rose-500" />
         <SummaryBox count={summary.notVisited} label="Not Visited" color="bg-slate-100" />
         <SummaryBox count={summary.marked} label="Review" color="bg-amber-500" />
      </div>

      <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
         <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-headline font-black text-[10px] uppercase tracking-widest text-[#0F172A]">
               Audit Map
            </h3>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Page {currentPage + 1} / {totalPages}</span>
         </div>

         {/* Range Selector */}
         <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-xl border border-slate-100">
            <button 
               onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
               disabled={currentPage === 0}
               className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white disabled:opacity-20 transition-all shadow-sm"
            >
               <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-[9px] font-black uppercase text-slate-500">
               Questions {startIdx + 1} - {endIdx}
            </p>
            <button 
               onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
               disabled={currentPage === totalPages - 1}
               className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white disabled:opacity-20 transition-all shadow-sm"
            >
               <ChevronRight className="h-4 w-4" />
            </button>
         </div>

         {/* Question Grid */}
         <div className="grid grid-cols-5 gap-2 pb-4 overflow-y-auto custom-scrollbar">
            {currentRange.map((idx) => {
               const isCurrent = currentIndex === idx
               const isAnswered = answeredIndices.includes(idx)
               const isFlagged = flaggedIndices.includes(idx)
               const isVisited = visitedIndices.includes(idx)
               const isBoth = isAnswered && isFlagged

               return (
                  <button
                     key={idx}
                     onClick={() => onSelect(idx)}
                     className={cn(
                        "h-10 w-10 rounded-lg text-[10px] font-black transition-all border-2 flex items-center justify-center shadow-sm relative",
                        isCurrent ? "border-primary bg-primary text-white scale-105 z-10" : "border-transparent",
                        !isCurrent && isBoth && "bg-purple-600 text-white",
                        !isCurrent && isAnswered && !isFlagged && "bg-emerald-600 text-white",
                        !isCurrent && isFlagged && !isAnswered && "bg-amber-500 text-white",
                        !isCurrent && isVisited && !isAnswered && !isFlagged && "bg-rose-500 text-white",
                        !isCurrent && !isVisited && "bg-slate-100 text-slate-400"
                     )}
                  >
                     {idx + 1}
                  </button>
               )
            })}
         </div>

         {/* Legend (Minimalist) */}
         <div className="pt-4 mt-auto border-t border-slate-50 grid grid-cols-1 gap-2">
            <LegendRow color="bg-emerald-600" label="Answered" />
            <LegendRow color="bg-rose-500" label="Not Answered" />
            <LegendRow color="bg-amber-500" label="Marked for Review" />
            <LegendRow color="bg-slate-100" label="Not Visited" />
         </div>
      </div>
    </div>
  )
}

function SummaryBox({ count, label, color }: any) {
  return (
    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
       <div className={cn("h-5 w-5 rounded-md mb-1 flex items-center justify-center text-[10px] font-black text-white shadow-sm", color)}>
          {count}
       </div>
       <span className="text-[8px] font-black uppercase text-slate-400 tracking-tight leading-none">{label}</span>
    </div>
  )
}

function LegendRow({ color, label }: any) {
  return (
    <div className="flex items-center gap-2">
       <div className={cn("h-3 w-3 rounded-md shadow-sm", color)} />
       <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">{label}</span>
    </div>
  )
}
