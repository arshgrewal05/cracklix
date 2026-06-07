
'use client';

import { useExamStore } from '@/store/useExamStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, Flag } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Institutional Tactical Action Belt v15.0.
 * Updated: Minimized vertical spacing and refined mobile ergonomic widths.
 */
export default function TacticalFooter({ onSubmit }: { onSubmit: () => void }) {
  const { currentIdx, questions, clearAnswer, markForReview, saveAndNext, setCurrentIdx } = useExamStore();
  const db = useFirestore();

  const isLast = currentIdx === questions.length - 1;

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-6 select-none">
      
      {/* SECONDARY ACTIONS (Grouped for mobile) */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button 
          variant="outline" 
          onClick={() => clearAnswer(currentIdx, db)}
          className="flex-1 sm:flex-none h-11 md:h-14 px-4 rounded-xl font-black uppercase text-[9px] tracking-widest border-slate-200 text-slate-400 hover:bg-slate-50 gap-2 transition-all active:scale-95"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Clear
        </Button>
        <Button 
          variant="outline" 
          onClick={() => markForReview(currentIdx, db)}
          className="flex-1 sm:flex-none h-11 md:h-14 px-4 rounded-xl font-black uppercase text-[9px] tracking-widest border-violet-100 text-violet-600 bg-violet-50 hover:bg-violet-100 gap-2 transition-all active:scale-95"
        >
          <Flag className="h-3.5 w-3.5" /> Mark
        </Button>
      </div>

      {/* PRIMARY NAVIGATION & SUBMISSION */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Button 
          variant="outline" 
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
          className="h-11 md:h-14 px-5 rounded-xl font-black uppercase text-[10px] tracking-widest border-slate-200 text-slate-500 disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        {isLast ? (
          <Button 
            onClick={onSubmit}
            className="flex-1 sm:min-w-[180px] h-11 md:h-14 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl gap-2 transition-all active:scale-95 border-none"
          >
            Submit Assessment <CheckCircle2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={() => saveAndNext(db)}
            className="flex-1 sm:min-w-[180px] h-11 md:h-14 px-6 bg-primary hover:bg-orange-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-orange-500/20 gap-2 transition-all active:scale-95 border-none"
          >
            Save & Next <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
