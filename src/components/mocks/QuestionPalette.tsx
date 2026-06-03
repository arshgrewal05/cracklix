"use client"

import { cn } from "@/lib/utils"

interface QuestionPaletteProps {
  totalQuestions: number
  currentIndex: number
  answeredIndices: number[]
  flaggedIndices: number[]
  onSelect: (index: number) => void
}

export default function QuestionPalette({
  totalQuestions,
  currentIndex,
  answeredIndices,
  flaggedIndices,
  onSelect
}: QuestionPaletteProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-headline font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">
          Audit Palette
        </h3>
        <span className="text-[9px] font-black text-primary px-3 py-1 bg-primary/5 rounded-lg border border-primary/10">
          {answeredIndices.length} / {totalQuestions}
        </span>
      </div>
      
      {/* Dense 5-column grid for high node visibility */}
      <div className="grid grid-cols-5 gap-2.5">
        {Array.from({ length: totalQuestions }).map((_, i) => {
          const isCurrent = currentIndex === i
          const isAnswered = answeredIndices.includes(i)
          const isFlagged = flaggedIndices.includes(i)

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={cn(
                "h-9 w-9 rounded-lg text-[10px] font-black transition-all duration-200 border-2 flex items-center justify-center shadow-sm",
                isCurrent && "border-primary bg-primary/10 text-primary scale-110 z-10",
                !isCurrent && isAnswered && "bg-emerald-600 border-emerald-600 text-white",
                !isCurrent && isFlagged && "bg-amber-500 border-amber-500 text-white",
                !isCurrent && !isAnswered && !isFlagged && "bg-slate-50 border-slate-100 hover:border-slate-300 text-slate-400"
              )}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-y-3 gap-x-4">
        <LegendItem variant="current" label="Current" />
        <LegendItem variant="answered" label="Answered" />
        <LegendItem variant="flagged" label="Review" />
        <LegendItem variant="remaining" label="Not Visited" />
      </div>
    </div>
  )
}

function LegendItem({ variant, label }: { variant: 'current' | 'answered' | 'flagged' | 'remaining', label: string }) {
  const getStyles = () => {
    switch (variant) {
      case 'current': return "bg-primary/10 border-primary"
      case 'answered': return "bg-emerald-600"
      case 'flagged': return "bg-amber-500"
      case 'remaining': return "bg-slate-100"
    }
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className={cn("h-2.5 w-2.5 rounded-sm border", getStyles())} />
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
  )
}
