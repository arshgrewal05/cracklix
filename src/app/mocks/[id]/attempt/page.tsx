
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDoc, useFirestore, useUser, useCollection } from "@/firebase"
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore"
import Timer from "@/components/mocks/Timer"
import QuestionPalette from "@/components/mocks/QuestionPalette"
import QuestionRenderer from "@/components/questions/QuestionRenderer"
import { Button } from "@/components/ui/button"
import { RadioGroup } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, Target, LayoutGrid, ChevronRight, ChevronLeft, ShieldCheck, Pause, Play } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"

type LangMode = 'en' | 'pa' | 'bilingual'

/**
 * @fileOverview Institutional High-Fidelity CBT Engine v13.0.
 * Optimized: Unified bilingual selection logic and sanitized artifacts.
 */

export default function MockAttemptPage() {
  const params = useParams()
  const router = useRouter()
  const db = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()
  const mockId = params.id as string
  
  const { data: mock, loading: mockLoading } = useDoc<any>(useMemo(() => (db && mockId ? doc(db, "mocks", mockId) : null), [db, mockId]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))
  
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [flagged, setFlagged] = useState<number[]>([])
  const [visited, setVisited] = useState<number[]>([0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [language, setLanguage] = useState<LangMode>('bilingual')
  const [remainingTime, setRemainingTime] = useState(0)
  const [loadingQs, setLoadingQs] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    async function init() {
      if (!db || !mock?.questionIds) return
      setLoadingQs(true)
      try {
        const fetchPromises = mock.questionIds.map((id: string) => getDoc(doc(db, "questions", id)))
        const snapshots = await Promise.all(fetchPromises)
        const qData = snapshots.map(snap => snap.exists() ? { ...snap.data(), id: snap.id } : null).filter(Boolean)
        setQuestions(qData)
        setRemainingTime((mock.duration || 120) * 60)
      } catch (err) {
        toast({ variant: "destructive", title: "Audit Sync Error" })
      } finally {
        setLoadingQs(false)
      }
    }
    init()
  }, [db, mock, toast])

  const contextInfo = useMemo(() => {
    const currentQ = questions[currentIdx];
    const examName = exams?.find(e => e.id === mock?.examId)?.name || mock?.title || "MOCK HUB";
    const subjectName = subjects?.find(s => s.id === currentQ?.subjectId)?.name || "GENERAL KNOWLEDGE";
    
    return {
      exam: examName.toUpperCase(),
      section: subjectName.toUpperCase()
    };
  }, [currentIdx, questions, subjects, exams, mock])

  const cleanText = (text: string = "") => {
    return text.replace(/^[A-D][\.\):\s-]*/i, '').trim();
  };

  const submitMock = useCallback(async () => {
    if (isSubmitting || questions.length === 0 || !user || !db) return
    setIsSubmitting(true)
    const correctMap: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }
    let score = 0
    const subjectStats: Record<string, any> = {}

    questions.forEach((q, idx) => {
      const subj = q.subjectId || 'general'
      if (!subjectStats[subj]) subjectStats[subj] = { correct: 0, total: 0, attempted: 0 }
      subjectStats[subj].total++
      if (answers[idx] !== undefined) {
        subjectStats[subj].attempted++
        if (answers[idx] === correctMap[q.correctAnswer]) {
          score++
          subjectStats[subj].correct++
        }
      }
    })

    const payload = {
      mockId, userId: user.uid, score, totalQuestions: questions.length,
      accuracy: Math.round((score / (Object.keys(answers).length || 1)) * 100),
      timestamp: new Date().toISOString(), answers, createdAt: serverTimestamp(),
      mockTitle: mock?.title || "Test Series",
      subjectStats,
      timeTaken: (mock.duration * 60) - remainingTime
    }

    try {
      await addDoc(collection(db, "results"), payload)
      router.push(`/results/${mockId}`)
    } catch (e) {
      toast({ variant: "destructive", title: "Submission Failed" })
      setIsSubmitting(false)
    }
  }, [isSubmitting, questions, answers, mock, user, db, router, mockId, toast, remainingTime])

  if (mockLoading || loadingQs) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="h-8 w-8 text-primary animate-spin" />
    </div>
  )

  const q = questions[currentIdx]

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-black font-body">
      <header className="h-12 border-b flex items-center justify-between px-4 bg-[#0B1528] text-white shrink-0 z-[100]">
        <div className="flex items-center gap-4">
           <ShieldCheck className="h-5 w-5 text-primary" />
           <div className="flex flex-col text-left">
              <p className="text-[7px] font-black text-primary uppercase tracking-[0.2em] leading-none">OFFICIAL EVALUATION</p>
              <h1 className="text-[11px] font-black uppercase tracking-tight truncate max-w-[150px] md:max-w-none">
                {contextInfo.exam}
              </h1>
           </div>
        </div>

        <div className="flex items-center gap-2">
           <div className="flex items-center gap-0.5 bg-white/5 p-1 rounded-xl">
              <LangTab label="EN" active={language === 'en'} onClick={() => setLanguage('en')} />
              <LangTab label="PA" active={language === 'pa'} onClick={() => setLanguage('pa')} />
              <LangTab label="BI" active={language === 'bilingual'} onClick={() => setLanguage('bilingual')} />
           </div>
           <div className="h-8 w-px bg-white/10 mx-2" />
           <Timer onTimeUp={submitMock} initialSeconds={remainingTime} onTick={setRemainingTime} isPaused={isPaused} />
           <Button variant="ghost" size="icon" onClick={() => setIsPaused(!isPaused)} className="h-9 w-9 rounded-xl bg-white/5 text-white ml-2">
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
           </Button>
           <Button onClick={submitMock} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest h-9 px-4 rounded-xl shadow-lg ml-2">
             FINISH
          </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        {isPaused && (
           <div className="absolute inset-0 z-[200] bg-[#0B1528]/95 backdrop-blur-md flex flex-col items-center justify-center text-white">
              <Pause className="h-10 w-10 text-primary mb-4" />
              <h2 className="text-2xl font-black uppercase mb-6 tracking-tighter">Audit Paused</h2>
              <Button onClick={() => setIsPaused(false)} className="bg-primary text-white font-black h-14 px-12 rounded-2xl uppercase text-[11px] tracking-widest shadow-2xl">Resume Audit</Button>
           </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="px-6 py-1.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-6">
                <div className="text-left">
                   <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">SECTION</p>
                   <h2 className="text-[10px] font-black text-black uppercase flex items-center gap-2 mt-0.5">
                     <Target className="h-2.5 w-2.5 text-primary" /> {contextInfo.section}
                   </h2>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <div className="text-left">
                   <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">NODE</p>
                   <p className="text-[10px] font-black text-black mt-0.5">{currentIdx + 1} / {questions.length}</p>
                </div>
             </div>
             
             <Sheet>
               <SheetTrigger asChild>
                 <Button variant="outline" className="lg:hidden rounded-xl h-8 px-3 gap-2 font-black text-[9px] uppercase border-slate-200 bg-white">
                    <LayoutGrid className="h-3 w-3" /> Map
                 </Button>
               </SheetTrigger>
               <SheetContent side="right" className="p-0 border-none w-[280px]">
                  <div className="p-4 h-full overflow-y-auto bg-white pt-12">
                     <QuestionPalette 
                        totalQuestions={questions.length} currentIndex={currentIdx} 
                        answeredIndices={Object.keys(answers).map(Number)} 
                        flaggedIndices={flagged} visitedIndices={visited}
                        onSelect={(idx) => { setCurrentIdx(idx); if (!visited.includes(idx)) setVisited(p => [...p, idx]); }} 
                      />
                  </div>
               </SheetContent>
             </Sheet>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
             <div className="max-w-3xl mx-auto pb-10">
                <QuestionRenderer 
                   language={language}
                   question={q}
                />
                
                <div className="mt-6 space-y-2">
                   <RadioGroup 
                     value={answers[currentIdx]?.toString() || ""} 
                     onValueChange={(v) => setAnswers(prev => ({ ...prev, [currentIdx]: parseInt(v) }))} 
                     className="grid grid-cols-1 gap-2"
                   >
                     {['A', 'B', 'C', 'D'].map((k, i) => {
                       const isSelected = answers[currentIdx] === i;
                       const rawEn = q?.[`option${k}En`] || "";
                       const rawPa = q?.[`option${k}Pa`] || "";
                       const cEn = cleanText(rawEn);
                       const cPa = cleanText(rawPa);

                       let displayVal = "";
                       if (language === 'en') displayVal = cEn;
                       else if (language === 'pa') displayVal = cPa || cEn;
                       else displayVal = `${cEn}${cPa ? ` / ${cPa}` : ''}`;

                       return (
                         <div key={i} className={cn(
                           "flex items-center space-x-3 p-3 md:p-4 border-2 rounded-xl transition-all cursor-pointer shadow-sm",
                           isSelected ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white hover:border-slate-200'
                         )} onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: i }))}>
                            <div className={cn(
                               "h-6 w-6 md:h-8 md:w-8 rounded-full border-2 flex items-center justify-center font-black text-[10px] md:text-xs shrink-0",
                               isSelected ? "bg-primary border-primary text-white" : "border-slate-200 text-slate-300"
                            )}>
                               {k}
                            </div>
                            <Label className="flex-1 cursor-pointer select-none text-sm md:text-base font-bold text-black text-left leading-snug">
                               {displayVal || "N/A"}
                            </Label>
                         </div>
                       )
                     })}
                   </RadioGroup>
                </div>
             </div>
          </div>

          <footer className="h-14 md:h-16 border-t border-slate-100 bg-white px-4 md:px-8 flex items-center justify-between shrink-0 shadow-sm">
             <div className="flex gap-2">
                <Button variant="outline" className="h-9 md:h-11 px-4 text-[9px] font-black uppercase rounded-lg border-slate-200" onClick={() => currentIdx > 0 && setCurrentIdx(currentIdx - 1)} disabled={currentIdx === 0}>
                   <ChevronLeft className="h-3 w-3 mr-1" /> Prev
                </Button>
                <Button variant="ghost" className="h-9 md:h-11 px-3 text-[9px] font-black uppercase text-slate-300 rounded-lg hidden sm:flex" onClick={() => setAnswers(p => { const n={...p}; delete n[currentIdx]; return n; })}>Clear</Button>
             </div>
             <div className="flex gap-2">
                <Button variant="outline" className={cn("h-9 md:h-11 px-4 text-[9px] font-black uppercase rounded-lg border-2 transition-all", flagged.includes(currentIdx) ? "bg-amber-500 border-amber-500 text-white" : "text-amber-500 border-amber-100 hover:bg-amber-50")} onClick={() => { if(!flagged.includes(currentIdx)) setFlagged(p=>[...p, currentIdx]); else setFlagged(p=>p.filter(idx=>idx!==currentIdx)); }}>
                   {flagged.includes(currentIdx) ? 'FLAGGED' : 'REVIEW'}
                </Button>
                <Button className="bg-black hover:bg-slate-900 text-white h-9 md:h-11 px-6 md:px-8 rounded-lg font-black uppercase text-[9px] tracking-widest shadow-xl transition-all active:scale-95" onClick={() => { if(currentIdx < questions.length-1) { const next = currentIdx + 1; setCurrentIdx(next); if(!visited.includes(next)) setVisited(v=>[...v, next])} }}>
                   Next <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
             </div>
          </footer>
        </div>

        <aside className="w-[280px] border-l border-slate-50 bg-white hidden lg:flex flex-col shrink-0 overflow-hidden">
           <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <QuestionPalette 
                totalQuestions={questions.length} currentIndex={currentIdx} 
                answeredIndices={Object.keys(answers).map(Number)} 
                flaggedIndices={flagged} visitedIndices={visited}
                onSelect={(idx) => { setCurrentIdx(idx); if (!visited.includes(idx)) setVisited(p => [...p, idx]); }} 
              />
           </div>
        </aside>
      </main>
    </div>
  )
}

function LangTab({ label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={cn("px-3 py-1 rounded-lg text-[8px] font-black tracking-widest transition-all", active ? "bg-primary text-white shadow-lg" : "text-white/40 hover:text-white hover:bg-white/5")}>{label}</button>
  )
}
