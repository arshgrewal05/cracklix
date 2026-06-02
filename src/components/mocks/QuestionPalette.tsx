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
    <div className="p-4 bg-card border rounded-xl">
      <h3 className="font-headline font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
        Question Palette
      </h3>
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
                "h-9 w-9 rounded-md text-xs font-bold transition-all border flex items-center justify-center",
                isCurrent && "border-primary ring-2 ring-primary/20 bg-primary/10 text-primary",
                !isCurrent && isAnswered && "bg-secondary border-secondary text-secondary-foreground",
                !isCurrent && isFlagged && "bg-yellow-500/10 border-yellow-500 text-yellow-500",
                !isCurrent && !isAnswered && !isFlagged && "bg-muted/50 hover:bg-muted"
              )}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      <div className="mt-8 space-y-2 border-t pt-4">
        <LegendItem color="bg-primary/20 border-primary" label="Current" />
        <LegendItem color="bg-secondary" label="Answered" />
        <LegendItem color="bg-yellow-500/20 border-yellow-500" label="Review later" />
        <LegendItem color="bg-muted/50" label="Not Answered" />
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className={cn("h-3 w-3 rounded", color)} />
      <span>{label}</span>
    </div>
  )
}