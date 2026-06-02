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
    <div className="p-6 bg-card border rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline font-black text-xs uppercase tracking-widest text-muted-foreground">
          Question Palette
        </h3>
        <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded">
          {answeredIndices.length} / {totalQuestions} Done
        </span>
      </div>
      
      <div className="question-palette-grid">
        {Array.from({ length: totalQuestions }).map((_, i) => {
          const isCurrent = currentIndex === i
          const isAnswered = answeredIndices.includes(i)
          const isFlagged = flaggedIndices.includes(i)

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={cn(
                "h-10 w-10 rounded-xl text-xs font-bold transition-all border-2 flex items-center justify-center",
                isCurrent && "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10",
                !isCurrent && isAnswered && "bg-secondary border-secondary text-secondary-foreground",
                !isCurrent && isFlagged && "bg-orange-500 border-orange-500 text-white",
                !isCurrent && !isAnswered && !isFlagged && "bg-muted/30 border-transparent hover:border-muted-foreground/20 text-muted-foreground"
              )}
            >
              {(i + 1).toString().padStart(2, '0')}
            </button>
          )
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-foreground/5 grid grid-cols-2 gap-y-3 gap-x-4">
        <LegendItem variant="current" label="Current" />
        <LegendItem variant="answered" label="Answered" />
        <LegendItem variant="flagged" label="Review" />
        <LegendItem variant="not-answered" label="Remaining" />
      </div>
    </div>
  )
}

function LegendItem({ variant, label }: { variant: 'current' | 'answered' | 'flagged' | 'not-answered', label: string }) {
  const getStyles = () => {
    switch (variant) {
      case 'current': return "bg-primary/20 border-primary"
      case 'answered': return "bg-secondary"
      case 'flagged': return "bg-orange-500"
      case 'not-answered': return "bg-muted/30"
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-3 w-3 rounded-md", getStyles())} />
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
    </div>
  )
}
