"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"

interface QuestionPaletteProps {
  questions: any[]
  currentIndex: number
  answeredIndices: number[]
  flaggedIndices: number[]
  visitedIndices: number[]
  onSelect: (index: number) => void
  subjectMap?: Record<string, string>
  examName?: string
}

/**
 * @fileOverview Paginated Institutional Audit Matrix v4.0.
 * Rules Enforcement:
 * 1. Exactly 25 questions per page view.
 * 2. Exam Name visible at the top.
 * 3. NO CIRCLE OVERLAP: Precise spacing and box-sizing.
 */

export default function QuestionPalette({
  questions,
  currentIndex,
  answeredIndices,
  flaggedIndices,
  visitedIndices,
  onSelect,
  subjectMap = {},
  examName = "OFFICIAL SERIES"
}: QuestionPaletteProps) {
  
  const [currentPage, setCurrentPage] = useState(0)
  const PAGE_SIZE = 25
  const totalQuestions = questions.length
  const totalPages = Math.ceil(totalQuestions / PAGE_SIZE)

  const currentQuestions = useMemo(() => {
    return questions.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE).map((q, i) => ({
        ...q,
        globalIdx: (currentPage * PAGE_SIZE) + i
    }));
  }, [questions, currentPage])

  const summary = useMemo(() => {
    const answered = answeredIndices.length
    const review = flaggedIndices.length
    const visited = visitedIndices.length
    const answeredAndReview = flaggedIndices.filter(idx => answeredIndices.includes(idx)).length
    
    return {
      answered: answered - answeredAndReview,
      review: review - answeredAndReview,
      notVisited: Math.max(0, totalQuestions - visited),
      notAnswered: Math.max(0, visited - answered),
    }
  }, [totalQuestions, answeredIndices, flaggedIndices, visitedIndices])

  return (
    <div className="space-y-6 flex flex-col h-full text-left font-body">
      {/* Dynamic Exam Branding */}
      <div className="space-y-1 pb-4 border-b border-slate-100">
         <p className="text-[7px] font-black text-primary uppercase tracking-[0.4em] leading-none">ACTIVE AUDIT</p>
         <h3 className="text-[12px] font-black text-[#0F172A] uppercase leading-tight truncate">
            {examName}
         </h3>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 gap-2">
         <PaletteStat count={summary.answered} label="Answered" color="bg-emerald-600" />
         <PaletteStat count={summary.notAnswered} label="Unanswered" color="bg-rose-500" />
         <PaletteStat count={summary.notVisited} label="Not Visited" color="bg-slate-100" textColor="text-slate-400" />
         <PaletteStat count={summary.review} label="Review" color="bg-amber-500" />
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2">
           {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shrink-0 border",
                  currentPage === i 
                    ? "bg-[#0F172A] text-white border-[#0F172A] shadow-lg" 
                    : "bg-white text-slate-400 border-slate-100 hover:border-primary/20"
                )}
              >
                Page {i + 1}
              </button>
           ))}
        </div>
      )}

      {/* High-Density Matrix (NO OVERLAP) */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pt-2">
         <div className="grid grid-cols-5 gap-3 p-1">
            {currentQuestions.map((q) => {
              const idx = q.globalIdx;
              const isCurrent = currentIndex === idx
              const isAnswered = answeredIndices.includes(idx)
              const isFlagged = flaggedIndices.includes(idx)
              const isVisited = visitedIndices.includes(idx)
              const isBoth = isAnswered && isFlagged

              return (
                <div key={idx} className="flex items-center justify-center p-0.5 box-border">
                  <button
                    onClick={() => onSelect(idx)}
                    className={cn(
                      "h-10 w-10 md:h-11 md:w-11 rounded-full text-[11px] font-black transition-all flex items-center justify-center shrink-0 border-2 box-border relative",
                      "hover:scale-105 active:scale-95",
                      isCurrent ? "border-primary ring-2 ring-primary ring-offset-2 bg-white text-primary z-20 shadow-xl" : "border-transparent",
                      !isCurrent && isBoth && "bg-purple-600 text-white border-purple-600",
                      !isCurrent && isAnswered && !isFlagged && "bg-emerald-600 text-white border-emerald-600",
                      !isCurrent && isFlagged && !isAnswered && "bg-amber-500 text-white border-amber-500",
                      !isCurrent && isVisited && !isAnswered && !isFlagged && "bg-rose-500 text-white border-rose-500",
                      !isCurrent && !isVisited && "bg-slate-50 text-slate-300",
                    )}
                  >
                    {idx + 1}
                  </button>
                </div>
              )
            })}
         </div>
      </div>
      
      <div className="pt-4 border-t border-slate-100">
         <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center">
            Nodes {currentPage * PAGE_SIZE + 1} - {Math.min((currentPage + 1) * PAGE_SIZE, totalQuestions)} of {totalQuestions}
         </p>
      </div>
    </div>
  )
}

function PaletteStat({ count, label, color, textColor = "text-white" }: any) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
       <div className={cn("h-4 w-4 rounded-md flex items-center justify-center text-[8px] font-black shrink-0", color, textColor)}>
          {count}
       </div>
       <span className="text-[8px] font-black uppercase text-slate-500 tracking-tight truncate">{label}</span>
    </div>
  )
}
