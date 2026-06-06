
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
  examName?: string
}

/**
 * @fileOverview Institutional CBT Matrix v10.0.
 * Design: High-fidelity legend with large touch-accurate grids.
 */

export default function QuestionPalette({
  questions,
  currentIndex,
  answeredIndices,
  flaggedIndices,
  visitedIndices,
  onSelect,
  examName = "MOCK TEST"
}: QuestionPaletteProps) {
  
  const totalQuestions = questions.length

  const summary = useMemo(() => {
    const answered = answeredIndices.length
    const review = flaggedIndices.length
    const visited = visitedIndices.length
    const answeredAndReview = flaggedIndices.filter(idx => answeredIndices.includes(idx)).length
    
    return {
      answered: answered - answeredAndReview,
      review: review,
      notVisited: Math.max(0, totalQuestions - visited),
      notAnswered: Math.max(0, visited - answered),
    }
  }, [totalQuestions, answeredIndices, flaggedIndices, visitedIndices])

  return (
    <div className="space-y-10 flex flex-col h-full text-left font-body">
      
      {/* 1. LEGEND HUB */}
      <div className="grid grid-cols-2 gap-3">
         <LegendItem count={summary.answered} label="Answered" color="bg-emerald-500" />
         <LegendItem count={summary.notAnswered} label="Not Answered" color="bg-rose-500" />
         <LegendItem count={summary.review} label="Marked Review" color="bg-purple-600" />
         <LegendItem count={summary.notVisited} label="Not Visited" color="bg-slate-100" textColor="text-slate-400" />
      </div>

      <div className="h-px w-full bg-slate-50" />

      {/* 2. NAVIGATION GRID */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
         <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">Pick a Node</span>
            <div className="h-px flex-1 bg-slate-50" />
         </div>
         <div className="grid grid-cols-5 gap-3">
            {questions.map((_, idx) => {
              const isCurrent = currentIndex === idx
              const isAnswered = answeredIndices.includes(idx)
              const isFlagged = flaggedIndices.includes(idx)
              const isVisited = visitedIndices.includes(idx)

              return (
                <button
                  key={idx}
                  onClick={() => onSelect(idx)}
                  className={cn(
                    "w-11 h-11 rounded-xl text-[13px] font-black transition-all flex items-center justify-center border-2",
                    isCurrent ? "border-primary bg-white text-primary shadow-xl scale-110 z-10" : "border-transparent",
                    !isCurrent && isFlagged ? "bg-purple-600 text-white shadow-lg shadow-purple-200" :
                    !isCurrent && isAnswered ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100" :
                    !isCurrent && isVisited ? "bg-rose-500 text-white shadow-lg shadow-rose-100" :
                    !isCurrent && "bg-slate-50 text-slate-300 border-slate-100 hover:bg-slate-100"
                  )}
                >
                  {idx + 1}
                </button>
              )
            })}
         </div>
      </div>
      
      <div className="pt-6 border-t border-slate-50">
         <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] text-center">
            MASTER REGISTRY v5.0
         </p>
      </div>
    </div>
  )
}

function LegendItem({ count, label, color, textColor = "text-white" }: any) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-50 bg-white shadow-sm transition-all hover:border-primary/20">
       <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 shadow-inner", color, textColor)}>
          {count}
       </div>
       <span className="text-[9px] font-black uppercase text-slate-500 tracking-tight leading-none">{label}</span>
    </div>
  )
}
