
'use client';

import { useExamStore } from '@/store/useExamStore';
import { Button } from '@/components/ui/button';
import { Pause, Play, LayoutGrid, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import Timer from '@/components/mocks/Timer';

/**
 * @fileOverview Institutional Testbook-Style Fixed Header.
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
    questions
  } = useExamStore();

  return (
    <header className="bg-[#0B1528] text-white flex flex-col shrink-0 shadow-2xl z-50 select-none">
      <div className="h-16 flex items-center justify-between px-4 md:px-10">
        
        {/* LEFT: PAUSE & LOGO */}
        <div className="flex items-center gap-4">
           <Button 
             variant="ghost" 
             size="icon" 
             onClick={() => setPaused(!isPaused)}
             className="h-10 w-10 rounded-xl bg-white/5 text-white hover:bg-white/10"
           >
             {isPaused ? <Play className="h-5 w-5 fill-current text-[#F97316]" /> : <Pause className="h-5 w-5 fill-current" />}
           </Button>
           <div className="hidden md:block">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Aspirant Mode</p>
              <p className="text-sm font-black uppercase text-white tracking-tight">CRACKLIX CBT ENGINE</p>
           </div>
        </div>

        {/* CENTER: TIMER & QUESTION COUNTER */}
        <div className="flex flex-col items-center">
           <div className="flex items-center gap-6">
              <div className="hidden sm:block text-right">
                 <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Question</p>
                 <p className="text-lg font-black text-white">{currentIdx + 1} <span className="text-slate-500 font-medium">/ {questions.length}</span></p>
              </div>
              <Timer 
                onTimeUp={() => {}} 
                initialSeconds={timeLeft} 
                isPaused={isPaused} 
              />
           </div>
           <p className="text-[8px] font-black uppercase text-[#F97316] tracking-[0.4em] mt-1 hidden sm:block truncate max-w-[200px]">{mockTitle}</p>
        </div>

        {/* RIGHT: LANGUAGE & PALETTE */}
        <div className="flex items-center gap-3">
           <div className="hidden lg:flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
              {(['en', 'pa', 'bi'] as const).map(l => (
                <button 
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                    language === l ? "bg-[#F97316] text-white shadow-lg" : "text-slate-500 hover:text-white"
                  )}
                >
                  {l === 'bi' ? 'Bilingual' : l.toUpperCase()}
                </button>
              ))}
           </div>
           
           <Button 
             onClick={onPaletteToggle}
             className="bg-[#F97316] hover:bg-orange-600 h-10 px-5 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl"
           >
              <LayoutGrid className="h-4 w-4" /> 
              <span className="hidden sm:inline">Palette</span>
           </Button>
        </div>
      </div>
    </header>
  );
}
