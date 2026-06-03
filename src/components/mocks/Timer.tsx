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

/**
 * @fileOverview Institutional Timer Node.
 * Fixed: Stabilized initialSeconds to prevent feedback loops and fixed setState re-render warning.
 */

export default function Timer({ onTimeUp, initialSeconds, onTick, isPaused }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const onTickRef = useRef(onTick)
  const hasSubmitted = useRef(false)

  // Keep onTick reference stable for the effect
  useEffect(() => {
    onTickRef.current = onTick
  }, [onTick])

  // Sync parent only when timeLeft changes, handled via stable ref to avoid render conflict
  useEffect(() => {
    if (onTickRef.current && !isPaused) {
      onTickRef.current(timeLeft)
    }
  }, [timeLeft, isPaused])

  useEffect(() => {
    if (isPaused) {
       if (timerRef.current) clearInterval(timerRef.current)
       return
    }

    if (timeLeft <= 0 && !hasSubmitted.current) {
      hasSubmitted.current = true
      onTimeUp()
      return
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timeLeft, onTimeUp, isPaused])

  const formatTime = (seconds: number) => {
    const safeSecs = Math.max(0, seconds)
    const h = Math.floor(safeSecs / 3600)
    const m = Math.floor((safeSecs % 3600) / 60)
    const s = safeSecs % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const isLowTime = timeLeft < 600 // 10 minutes warning

  return (
    <div className={cn(
      "flex items-center gap-3 px-5 py-2 rounded-xl font-black text-base border transition-all duration-500 tabular-nums shadow-xl",
      isLowTime ? "bg-rose-600 border-rose-500 text-white animate-pulse" : "bg-white/5 border-white/10 text-white"
    )}>
      <Clock className={cn("h-4 w-4", isLowTime ? "text-white" : "text-primary")} />
      <span className="tracking-[0.1em]">{formatTime(timeLeft)}</span>
    </div>
  )
}
