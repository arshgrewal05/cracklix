"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimerProps {
  initialMinutes: number
  onTimeUp: () => void
}

export default function Timer({ initialMinutes, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60)

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const isLowTime = timeLeft < (initialMinutes * 0.1 * 60) // 10% left

  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg font-headline font-bold text-lg border transition-colors",
      isLowTime ? "bg-destructive/10 border-destructive text-destructive animate-pulse" : "bg-card border-border text-primary"
    )}>
      <Clock className="h-5 w-5" />
      <span>{formatTime(timeLeft)}</span>
    </div>
  )
}