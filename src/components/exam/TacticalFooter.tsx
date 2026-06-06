'use client';

import { useExamStore } from '@/store/useExamStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { useFirestore } from '@/firebase';

/**
 * @fileOverview Tactical Navigation Belt v4.0.
 * Optimized: Reduced height and padding for high-density mobile interface.
 */
export default function TacticalFooter({ onSubmit }: { onSubmit: () => void }) {
  const { currentIdx, questions, clearAnswer, markForReview, saveAndNext, setCurrentIdx } = useExamStore();
  const db = useFirestore();

  const isLast = currentIdx === questions.length - 1;

  return (
    <footer className="h-14 md:h-16 bg-white border-t border-slate-200 px-3 md:px-10 flex items-center justify-between shrink-0 z-50 select-none">
      
      {/* LEFT: BACK NAVIGATION */}
      <div className="flex items-center">
        <Button 
          variant="outline" 
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
          className="h-10 px-4 md:px-6 rounded-lg md:rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] border-slate-200 text-slate-500 hover:bg-slate-50"
        >
          <ChevronLeft className="h-3.5 w-3.5 mr-1 md:mr-2" /> Previous
        </Button>
      </div>

      {/* RIGHT: TACTICAL GROUP (Compact Calibration) */}
      <div className="flex items-center gap-2 md:gap-3">
        {isLast ? (
          <Button 
            onClick={onSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white h-10 px-6 md:px-10 rounded-lg md:rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] shadow-xl"
          >
            Submit <span className="hidden sm:inline">Test</span> <CheckCircle2 className="ml-1 md:ml-2 h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button 
            onClick={() => saveAndNext(db)}
            className="bg-[#F97316] hover:bg-orange-600 text-white h-10 px-6 md:px-10 rounded-lg md:rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] shadow-xl"
          >
            Save & Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        )}

        <Button 
          variant="outline" 
          onClick={() => markForReview(currentIdx, db)}
          className="h-10 px-4 md:px-6 rounded-lg md:rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-tight border-violet-200 text-violet-600 bg-violet-50 hover:bg-violet-100 hidden sm:flex"
        >
          Mark & Next
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => clearAnswer(currentIdx, db)}
          className="h-10 px-3 md:px-6 rounded-lg md:rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-tight border-slate-200 text-slate-500 hover:bg-slate-50"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1 md:mr-2" /> Clear <span className="hidden sm:inline">Response</span>
        </Button>
      </div>
    </footer>
  );
}
