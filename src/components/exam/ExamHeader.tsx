'use client';

import { useExamStore } from '@/store/useExamStore';
import { Button } from '@/components/ui/button';
import { Pause, Play, LayoutGrid, Monitor, Smartphone, PanelRightOpen, PanelRightClose, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import Timer from '@/components/mocks/Timer';

/**
 * @fileOverview Institutional CBT Header v4.0.
 * Optimized: Reduced height and scaled down elements for high-density mobile visibility.
 */
export default function ExamHeader({ onPaletteToggle }: { onPaletteToggle: () => void }) {
  const { 
    isPaused, 
    setPaused, 
    language, 
    setLanguage, 
    mockTitle,
    timeLeft,
    currentIdx,
    questions,
    isPaletteVisible,
    togglePalette
  } = useExamStore();

  return (
    <header className="bg-[#0B1528] text-white flex flex-col shrink-0 shadow-2xl z-50 select-none">
      <div className="h-12 md:h-16 flex items-center justify-between px-3 md:px-8">
        
        {/* LEFT: PAUSE & IDENTITY */}
        <div className="flex items-center gap-3 min-w-0">
           <Button 
             variant="ghost" 
             size="icon" 
             onClick={() => setPaused(!isPaused)}
             className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-white/5 text-white hover:bg-white/10 shrink-0"
           >
             {isPaused ? <Play className="h-4 w-4 md:h-5 md:w-5 fill-current text-[#F97316]" /> : <Pause className="h-4 w-4 md:h-5 md:w-5 fill-current" />}
           </Button>
           <div className="hidden sm:block truncate ml-1">
              <p className="text-[6px] font-black uppercase text-slate-500 tracking-[0.3em] mb-0.5">Mock Series</p>
              <h1 className="text-[10px] md:text-[12px] font-black uppercase text-white tracking-tight truncate">{mockTitle}</h1>
           </div>
        </div>

        {/* CENTER: PROGRESS & TIMER */}
        <div className="flex items-center gap-4 md:gap-12">
           <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-8">
              <p className="text-[7px] font-black uppercase text-slate-500 tracking-widest mb-0.5">Progress</p>
              <p className="text-sm md:text-base font-black text-white leading-none">
                 Question {currentIdx + 1} <span className="text-slate-500 text-xs font-bold">/ {questions.length}</span>
              </p>
           </div>
           <Timer 
             onTimeUp={() => {}} 
             initialSeconds={timeLeft} 
             isPaused={isPaused} 
           />
        </div>

        {/* RIGHT: TACTICAL CONTROLS */}
        <div className="flex items-center gap-2 md:gap-5">
           {/* Language Switcher */}
           <div className="hidden lg:flex items-center bg-white/5 p-0.5 rounded-lg border border-white/10">
              {(['en', 'pa', 'bi'] as const).map(l => (
                <button 
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-[8px] font-black uppercase tracking-widest transition-all",
                    language === l ? "bg-[#F97316] text-white shadow-lg" : "text-slate-500 hover:text-white"
                  )}
                >
                  {l === 'bi' ? 'Bilingual' : l.toUpperCase()}
                </button>
              ))}
           </div>
           
           {/* Palette Toggle Control */}
           <Button 
             variant="ghost"
             onClick={() => {
                if (window.innerWidth < 1024) onPaletteToggle();
                else togglePalette();
             }}
             className="bg-[#F97316] hover:bg-orange-600 h-8 md:h-10 px-3 md:px-5 rounded-lg md:rounded-xl font-black uppercase text-[8px] md:text-[10px] tracking-widest gap-2 shadow-xl"
           >
              {isPaletteVisible ? <PanelRightClose className="h-3.5 w-3.5 md:h-4 md:w-4" /> : <PanelRightOpen className="h-3.5 w-3.5 md:h-4 md:w-4" />}
              <span className="hidden sm:inline">{isPaletteVisible ? 'Hide Palette' : 'Show Palette'}</span>
              <span className="sm:hidden">Palette</span>
           </Button>
        </div>
      </div>
    </header>
  );
}
