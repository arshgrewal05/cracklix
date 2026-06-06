
'use client';

import { useExamStore } from '@/store/useExamStore';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { useFirestore } from '@/firebase';

/**
 * @fileOverview Tactical Navigation Belt v3.0.
 * Reordered: [PREVIOUS] ... [SAVE & NEXT] [MARK FOR REVIEW] [CLEAR RESPONSE].
 * This places the primary action closest to the palette area for better ergonomic flow.
 */
export default function TacticalFooter({ onSubmit }: { onSubmit: () => void }) {
  const { currentIdx, questions, clearAnswer, markForReview, saveAndNext, setCurrentIdx } = useExamStore();
  const db = useFirestore();

  const isLast = currentIdx === questions.length - 1;

  return (
    <footer className="h-16 bg-white border-t border-slate-200 px-4 md:px-10 flex items-center justify-between shrink-0 z-50 select-none">
      
      {/* LEFT: BACK NAVIGATION */}
      <div className="flex items-center">
        <Button 
          variant="outline" 
          onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
          disabled={currentIdx === 0}
          className="h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] border-slate-200 text-slate-500 hover:bg-slate-50"
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
        </Button>
      </div>

      {/* RIGHT: TACTICAL GROUP (Ergonomically Reordered) */}
      <div className="flex items-center gap-3">
        {/* Primary Action is now on the left of the tactical group */}
        {isLast ? (
          <Button 
            onClick={onSubmit}
            className="bg-emerald-600 hover:bg-emerald-700 text-white h-11 px-10 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl"
          >
            Submit Test <CheckCircle2 className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={() => saveAndNext(db)}
            className="bg-[#F97316] hover:bg-orange-600 text-white h-11 px-10 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl"
          >
            Save & Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}

        <Button 
          variant="outline" 
          onClick={() => markForReview(currentIdx, db)}
          className="h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-tight border-violet-200 text-violet-600 bg-violet-50 hover:bg-violet-100 hidden sm:flex"
        >
          Mark For Review & Next
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => clearAnswer(currentIdx, db)}
          className="h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-tight border-slate-200 text-slate-500 hover:bg-slate-50"
        >
          <RotateCcw className="h-4 w-4 mr-2" /> Clear Response
        </Button>
      </div>
    </footer>
  );
}
