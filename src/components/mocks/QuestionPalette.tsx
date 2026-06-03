
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
}

/**
 * @fileOverview Final Paginated Audit Map.
 * Updated: Centered grid to prevent clipping and corrected "QUESTIONS" terminology.
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
  }, [currentIndex, totalQuestions, currentPage])

  const startIdx = currentPage * PAGE_SIZE
  const endIdx = Math.min(startIdx + PAGE_SIZE, totalQuestions)
  const currentRange = Array.from({ length: endIdx - startIdx }, (_, i) => startIdx + i)

  const summary = useMemo(() => {
    const answered = answeredIndices.length
    const review = flaggedIndices.length
    const visited = visitedIndices.length
    const answeredAndReview = flaggedIndices.filter(idx => answeredIndices.includes(idx)).length
    
    return {
      answered: answered - answeredAndReview,
      review: review - answeredAndReview,
      notVisited: totalQuestions - visited,
      notAnswered: Math.max(0, visited - answered),
      answeredAndReview
    }
  }, [totalQuestions, answeredIndices, flaggedIndices, visitedIndices])

  return (
    <div className="space-y-6 flex flex-col h-full text-left">
      {/* Stats Summary Hub */}
      <div className="grid grid-cols-2 gap-3">
         <PaletteStat count={summary.answered} label="Answered" color="bg-emerald-600" />
         <PaletteStat count={summary.notAnswered} label="Wrong" color="bg-rose-500" />
         <PaletteStat count={summary.notVisited} label="Not Visited" color="bg-slate-100" textColor="text-slate-400" />
         <PaletteStat count={summary.review} label="Review" color="bg-amber-500" />
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
         <div className="flex items-center justify-between px-1">
            <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Audit Grid</h4>
            <div className="flex gap-1.5">
               <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0} className="p-1 hover:bg-slate-100 rounded-lg disabled:opacity-20 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
               <button onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1} className="p-1 hover:bg-slate-100 rounded-lg disabled:opacity-20 transition-colors"><ChevronRight className="h-4 w-4" /></button>
            </div>
         </div>

         {/* Standardized 5x5 Grid: Perfectly centered to prevent clipping */}
         <div className="grid grid-cols-5 gap-2 px-1 justify-items-center">
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
                        "h-8 w-8 rounded-lg text-[10px] font-black transition-all border flex items-center justify-center shadow-sm shrink-0",
                        isCurrent ? "ring-2 ring-primary ring-offset-2 scale-110 z-10 bg-white text-primary border-primary" : "",
                        !isCurrent && isBoth && "bg-purple-600 text-white border-purple-600",
                        !isCurrent && isAnswered && !isFlagged && "bg-emerald-600 text-white border-emerald-600",
                        !isCurrent && isFlagged && !isAnswered && "bg-amber-500 text-white border-amber-500",
                        !isCurrent && isVisited && !isAnswered && !isFlagged && "bg-rose-500 text-white border-rose-500",
                        !isCurrent && !isVisited && "bg-slate-50 text-slate-300 border-transparent",
                     )}
                  >
                     {idx + 1}
                  </button>
               )
            })}
         </div>
         <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center">QUESTIONS {startIdx + 1} — {endIdx}</p>
      </div>
    </div>
  )
}

function PaletteStat({ count, label, color, textColor = "text-white" }: any) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-xl border border-slate-50 bg-white shadow-sm">
       <div className={cn("h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 shadow-sm", color, textColor)}>
          {count}
       </div>
       <span className="text-[9px] font-black uppercase text-slate-400 tracking-tight truncate">{label}</span>
    </div>
  )
}
