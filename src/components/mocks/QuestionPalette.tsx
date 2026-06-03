
"use client"

import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface QuestionPaletteProps {
  totalQuestions: number
  currentIndex: number
  answeredIndices: number[]
  flaggedIndices: number[]
  visitedIndices: number[]
  onSelect: (index: number) => void
  questions: any[]
}

/**
 * @fileOverview Refined Dense Exam Palette.
 * Ensures 25 nodes are visible in a compact grid without internal scrolling.
 */

export default function QuestionPalette({
  totalQuestions,
  currentIndex,
  answeredIndices,
  flaggedIndices,
  visitedIndices,
  onSelect
}: QuestionPaletteProps) {
  const PAGE_SIZE = 25
  const totalPages = Math.ceil(totalQuestions / PAGE_SIZE)
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    const targetPage = Math.floor(currentIndex / PAGE_SIZE)
    if (targetPage !== currentPage) setCurrentPage(targetPage)
  }, [currentIndex, totalQuestions])

  const startIdx = currentPage * PAGE_SIZE
  const endIdx = Math.min(startIdx + PAGE_SIZE, totalQuestions)
  const currentRange = Array.from({ length: endIdx - startIdx }, (_, i) => startIdx + i)

  const summary = useMemo(() => ({
    answered: answeredIndices.length,
    notAnswered: visitedIndices.length - answeredIndices.length,
    marked: flaggedIndices.length,
    notVisited: totalQuestions - visitedIndices.length
  }), [totalQuestions, answeredIndices, flaggedIndices, visitedIndices])

  return (
    <div className="space-y-6 flex flex-col h-full text-left overflow-hidden">
      {/* Live Stats Summary - Compact Grid */}
      <div className="grid grid-cols-2 gap-2 shrink-0">
         <SummaryNode count={summary.answered} label="Ans" color="bg-emerald-600" />
         <SummaryNode count={summary.marked} label="Rev" color="bg-amber-500" />
         <SummaryNode count={summary.notVisited} label="NV" color="bg-slate-100" textColor="text-slate-400" />
         <SummaryNode count={summary.notAnswered} label="NA" color="bg-rose-500" />
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
         {/* Navigation Range Selector */}
         <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-xl border border-slate-100 shrink-0">
            <button 
               onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
               disabled={currentPage === 0}
               className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white disabled:opacity-20 transition-all shadow-sm border border-transparent hover:border-slate-200"
            >
               <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-[9px] font-black uppercase text-[#0B1528] tracking-[0.2em]">
               Questions {startIdx + 1} - {endIdx}
            </p>
            <button 
               onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
               disabled={currentPage === totalPages - 1}
               className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-white disabled:opacity-20 transition-all shadow-sm border border-transparent hover:border-slate-200"
            >
               <ChevronRight className="h-4 w-4" />
            </button>
         </div>

         {/* 5x5 Grid for exactly 25 items */}
         <div className="grid grid-cols-5 gap-2 pb-4">
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
                        "h-9 w-9 md:h-10 md:w-10 rounded-lg text-[10px] font-black transition-all border flex items-center justify-center relative",
                        isCurrent ? "bg-blue-600 border-blue-600 text-white z-10 shadow-lg scale-105" : "border-transparent",
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

         {/* Official Legend - Compact */}
         <div className="pt-4 border-t border-slate-100 grid grid-cols-1 gap-2">
            <LegendRow color="bg-emerald-600" label="Answered" />
            <LegendRow color="bg-rose-500" label="Not Answered" />
            <LegendRow color="bg-amber-500" label="Marked for Review" />
            <LegendRow color="bg-purple-600" label="Answered & Review" />
            <LegendRow color="bg-slate-100" label="Not Visited" />
         </div>
      </div>
    </div>
  )
}

function SummaryNode({ count, label, color, textColor, className }: any) {
  return (
    <div className={cn("p-2 rounded-xl bg-white border border-slate-100 flex items-center gap-2 shadow-sm", className)}>
       <div className={cn("h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-black text-white", color, textColor)}>
          {count}
       </div>
       <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">{label}</span>
    </div>
  )
}

function LegendRow({ color, label }: any) {
  return (
    <div className="flex items-center gap-2">
       <div className={cn("h-3 w-3 rounded shadow-sm shrink-0", color)} />
       <span className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">{label}</span>
    </div>
  )
}
