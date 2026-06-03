
"use client"

import { useEffect, useState, useRef } from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimerProps {
  onTimeUp: () => void
  initialSeconds: number
  onTick?: (seconds: number) => void
  isPaused?: boolean
}

export default function Timer({ onTimeUp, initialSeconds, onTick, isPaused }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setTimeLeft(initialSeconds)
  }, [initialSeconds])

  useEffect(() => {
    if (isPaused) {
       if (timerRef.current) clearInterval(timerRef.current)
       return
    }

    if (timeLeft <= 0) {
      onTimeUp()
      return
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1
        if (onTick) onTick(next)
        return next
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timeLeft, onTimeUp, onTick, isPaused])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const isLowTime = timeLeft < 600 // 10 minutes warning

  return (
    <div className={cn(
      "flex items-center gap-4 px-6 py-2.5 rounded-2xl font-headline font-black text-lg border-2 transition-all duration-300 shadow-2xl tabular-nums",
      isLowTime ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse" : "bg-white/5 border-white/10 text-white"
    )}>
      <Clock className={cn("h-5 w-5", isLowTime ? "text-rose-500" : "text-primary")} />
      <span className="tracking-widest">⏱ {formatTime(timeLeft)}</span>
    </div>
  )
}
