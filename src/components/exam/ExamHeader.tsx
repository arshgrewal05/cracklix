
'use client';

import { useExamStore } from '@/store/useExamStore';
import { Button } from '@/components/ui/button';
import { Pause, Play, PanelRightOpen, PanelRightClose, Menu, LogOut, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Timer from '@/components/mocks/Timer';

/**
 * @fileOverview Institutional CBT Header v10.0.
 * Optimized: Ultra-compact mobile bar to prevent clipping of tactical controls.
 */
export default function ExamHeader({ 
  onPaletteToggle, 
  onExitRequest 
}: { 
  onPaletteToggle: () => void,
  onExitRequest: () => void
}) {
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
    <header className="bg-[#0B1528] text-white flex flex-col shrink-0 shadow-2xl z-[100] select-none border-b border-white/5">
      {/* Mobile Top Row: Compact Identity */}
      <div className="flex lg:hidden items-center justify-between px-2 h-8 border-b border-white/5 bg-black/40">
         <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <button onClick={onExitRequest} className="p-1 rounded-md text-slate-400 hover:text-white active:scale-90 transition-transform">
              <ChevronLeft className="h-3 w-3" />
            </button>
            <p className="text-[7px] font-black uppercase tracking-widest text-primary truncate">
              {mockTitle}
            </p>
         </div>
         <button onClick={onExitRequest} className="text-[6px] font-black uppercase text-rose-500 tracking-[0.2em] border border-rose-500/20 px-1.5 py-0.5 rounded ml-2 shrink-0">
           EXIT
         </button>
      </div>

      <div className="h-10 md:h-16 flex items-center justify-between px-2 md:px-8">
        
        {/* LEFT: PROGRESS & PAUSE */}
        <div className="flex items-center gap-1 md:gap-4">
           <Button 
             variant="ghost" 
             onClick={onExitRequest}
             className="hidden lg:flex h-10 px-4 rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 gap-2 shrink-0 border border-white/5 font-black uppercase text-[10px] tracking-widest"
           >
             <LogOut className="h-4 w-4" /> Exit Test
           </Button>

           <div className="h-6 w-px bg-white/5 hidden lg:block mx-2" />

           <Button 
             variant="ghost" 
             size="icon" 
             onClick={() => setPaused(!isPaused)}
             className="h-7 w-7 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-white/5 text-white hover:bg-white/10 shrink-0 border border-white/5"
           >
             {isPaused ? <Play className="h-3 w-3 md:h-4 md:w-4 fill-current text-[#F97316]" /> : <Pause className="h-3 w-3 md:h-4 md:w-4 fill-current" />}
           </Button>
           
           <div className="flex flex-col items-start leading-none ml-1 md:ml-2">
              <p className="text-[5px] md:text-[7px] font-black uppercase text-slate-500 tracking-widest mb-0.5">PROGRESS</p>
              <p className="text-[10px] md:text-sm font-black text-white">
                 {currentIdx + 1}<span className="text-slate-500 text-[8px] md:text-xs font-bold">/{questions.length}</span>
              </p>
           </div>
        </div>

        {/* CENTER: TIMER */}
        <div className="flex-1 flex justify-center px-1 md:px-4">
           <Timer 
             onTimeUp={() => {}} 
             initialSeconds={timeLeft} 
             isPaused={isPaused} 
           />
        </div>

        {/* RIGHT: TACTICAL CONTROLS */}
        <div className="flex items-center gap-1 md:gap-5">
           {/* Language Toggle (Desktop Only) */}
           <div className="hidden lg:flex items-center bg-white/5 p-0.5 rounded-lg border border-white/10">
              {(['en', 'pa', 'bilingual'] as const).map(l => (
                <button 
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-[8px] font-black uppercase tracking-widest transition-all",
                    language === l ? "bg-[#F97316] text-white shadow-lg" : "text-slate-500 hover:text-white"
                  )}
                >
                  {l === 'bilingual' ? 'Bilingual' : l.toUpperCase()}
                </button>
              ))}
           </div>
           
           <Button 
             variant="ghost"
             onClick={() => {
                if (window.innerWidth < 1024) onPaletteToggle();
                else togglePalette();
             }}
             className="bg-[#F97316] hover:bg-orange-600 h-7 md:h-12 px-2 md:px-6 rounded-lg md:rounded-xl font-black uppercase text-[7px] md:text-[10px] tracking-widest gap-1 md:gap-2 shadow-xl shrink-0"
           >
              <Menu className="h-3 w-3 lg:hidden" />
              {isPaletteVisible ? <PanelRightClose className="h-4 w-4 hidden lg:inline" /> : <PanelRightOpen className="h-4 w-4 hidden lg:inline" />}
              <span className="hidden sm:inline">{isPaletteVisible ? 'Close Palette' : 'Question Palette'}</span>
              <span className="sm:hidden text-[7px]">Palette</span>
           </Button>
        </div>
      </div>
    </header>
  );
}
