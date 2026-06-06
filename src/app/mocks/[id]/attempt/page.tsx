
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDoc, useFirestore, useUser, useCollection } from "@/firebase"
import { doc, getDoc, serverTimestamp, collection, addDoc } from "firebase/firestore"
import Timer from "@/components/mocks/Timer"
import QuestionPalette from "@/components/mocks/QuestionPalette"
import QuestionRenderer from "@/components/questions/QuestionRenderer"
import { Button } from "@/components/ui/button"
import { RadioGroup } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, Target, LayoutGrid, ChevronRight, ChevronLeft, ShieldCheck, Pause, Play, LogOut, Info, Globe, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"

type LangMode = 'en' | 'pa' | 'bilingual'

/**
 * @fileOverview Final Professional CBT Evaluation Engine v50.0.
 * Design Pattern: Testbook/IBPS Style Dual-Pane.
 * Features: Viewport locking, Language Isolation, Fixed Palette, Pause Overlay.
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

  const activeSubject = useMemo(() => {
     const q = questions[currentIdx];
     if (!q || !subjects) return "General Intelligence";
     const sub = subjects.find((s: any) => s.id === q.subjectId);
     return sub?.name || "Mock Section";
  }, [questions, currentIdx, subjects]);

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
    <div className="h-screen flex flex-col items-center justify-center bg-white space-y-4">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
      <p className="font-black uppercase text-[10px] tracking-widest text-slate-400">Loading Exam Hub...</p>
    </div>
  )

  const q = questions[currentIdx]

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8FAFC] text-[#0F172A] font-body">
      
      {/* 1. PROFESSIONAL CBT HEADER */}
      <header className="h-[72px] md:h-20 bg-white border-b flex items-center justify-between px-4 md:px-10 shrink-0 z-[100] shadow-sm">
        <div className="flex flex-col text-left">
           <h1 className="text-xs md:text-sm font-black text-[#0F172A] uppercase truncate max-w-[200px] md:max-w-md">{mock?.title}</h1>
           <p className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
              <Target className="h-3 w-3" /> {activeSubject}
           </p>
        </div>

        <div className="hidden md:flex flex-col items-center">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">CBT Status</p>
           <p className="text-sm font-black uppercase">Question {currentIdx + 1} of {questions.length}</p>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
           <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
              <Timer onTimeUp={submitMock} initialSeconds={remainingTime} onTick={setRemainingTime} isPaused={isPaused} />
              <Button variant="ghost" size="icon" onClick={() => setIsPaused(!isPaused)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary">
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
           </div>

           <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
             <LangToggle active={language === 'en'} label="EN" onClick={() => setLanguage('en')} />
             <LangToggle active={language === 'pa'} label="PA" onClick={() => setLanguage('pa')} />
             <LangToggle active={language === 'bilingual'} label="BI" onClick={() => setLanguage('bilingual')} />
           </div>

           <Button onClick={submitMock} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest h-10 px-6 rounded-xl shadow-lg shadow-emerald-500/10">
             FINISH
           </Button>
        </div>
      </header>

      {/* 2. MAIN EVALUATION ZONE */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Pause Screen Overlay */}
        {isPaused && (
           <div className="absolute inset-0 z-[200] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
              <div className="h-20 w-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mb-6 animate-pulse shadow-2xl">
                 <Pause className="h-10 w-10 fill-current" />
              </div>
              <h2 className="text-4xl font-headline font-black text-[#0F172A] uppercase tracking-tight mb-2">Test Paused</h2>
              <p className="text-slate-500 font-medium mb-10">Your time has been frozen. Resume whenever you are ready.</p>
              <Button onClick={() => setIsPaused(false)} className="bg-[#0F172A] text-white h-16 px-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-4xl active:scale-95 transition-all">Resume Evaluation</Button>
           </div>
        )}

        {/* LEFT: QUESTION FLOW */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white border-r">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
             <div className="max-w-[1000px] mx-auto p-6 md:p-14 space-y-10">
                <div className="flex items-center justify-between mb-4 lg:hidden">
                   <p className="text-xs font-black uppercase">Question {currentIdx + 1}</p>
                   <Sheet>
                      <SheetTrigger asChild>
                         <Button variant="outline" size="sm" className="rounded-lg font-black text-[9px] uppercase"><LayoutGrid className="h-3 w-3 mr-2" /> Palette</Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="p-0 border-none w-80">
                         <SheetHeader className="sr-only"><SheetTitle>Navigation Palette</SheetTitle></SheetHeader>
                         <div className="p-6 pt-16 h-full bg-white"><QuestionPalette questions={questions} currentIndex={currentIdx} answeredIndices={Object.keys(answers).map(Number)} flaggedIndices={flagged} visitedIndices={visited} onSelect={(idx) => { setCurrentIdx(idx); if (!visited.includes(idx)) setVisited(p => [...p, idx]); }} /></div>
                      </SheetContent>
                   </Sheet>
                </div>

                <QuestionRenderer 
                   language={language}
                   question={q}
                   hideOptions={true}
                />
                
                <div className="space-y-4">
                   <RadioGroup 
                     value={answers[currentIdx]?.toString() || ""} 
                     onValueChange={(v) => setAnswers(prev => ({ ...prev, [currentIdx]: parseInt(v) }))} 
                     className="grid grid-cols-1 gap-3"
                   >
                     {['A', 'B', 'C', 'D'].map((k, i) => {
                       const isSelected = answers[currentIdx] === i;
                       const enVal = q[`option${k}English`] || "";
                       const paVal = q[`option${k}Punjabi`] || "";

                       return (
                         <div key={i} className={cn(
                           "flex items-center space-x-5 p-4 border-2 rounded-2xl transition-all cursor-pointer shadow-sm min-h-[64px] group",
                           isSelected ? 'border-primary bg-primary/5' : 'border-slate-50 bg-white hover:border-slate-200'
                         )} onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: i }))}>
                            <div className={cn(
                               "h-10 w-10 rounded-xl border-2 flex items-center justify-center font-black text-sm shrink-0 transition-all",
                               isSelected ? "bg-primary border-primary text-white scale-105 shadow-lg" : "border-slate-100 bg-slate-50 text-slate-400 group-hover:border-primary/20"
                            )}>
                               {k}
                            </div>
                            <Label className="flex-1 cursor-pointer select-none text-[16px] md:text-[19px] font-black text-[#0F172A] text-left leading-snug">
                                {language === 'en' ? enVal : 
                                 language === 'pa' ? (paVal || enVal) : 
                                 (
                                  <div className="space-y-1">
                                    <p className="block">{enVal}</p>
                                    <p className="block text-slate-400 font-bold">{paVal}</p>
                                  </div>
                                 )}
                            </Label>
                         </div>
                       )
                     })}
                   </RadioGroup>
                </div>
             </div>
          </div>

          {/* TACTICAL NAVIGATION FOOTER */}
          <footer className="h-20 border-t bg-white px-6 md:px-12 flex items-center justify-between shrink-0 z-50">
             <Button variant="outline" className="h-12 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 border-slate-200 text-slate-500" onClick={() => currentIdx > 0 && setCurrentIdx(currentIdx - 1)} disabled={currentIdx === 0}>
                <ChevronLeft className="h-4 w-4" /> PREVIOUS
             </Button>
             
             <div className="flex gap-4">
                <Button variant="outline" className={cn("h-12 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all", flagged.includes(currentIdx) ? "bg-purple-600 border-purple-600 text-white" : "text-amber-600 border-amber-200 bg-amber-50")} onClick={() => { if(!flagged.includes(currentIdx)) setFlagged(p=>[...p, currentIdx]); else setFlagged(p=>p.filter(idx=>idx!==currentIdx)); }}>
                   {flagged.includes(currentIdx) ? 'MARKED' : 'MARK REVIEW'}
                </Button>
                <Button className="bg-[#0F172A] hover:bg-black text-white h-12 px-12 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95" onClick={() => { if(currentIdx < questions.length-1) { const next = currentIdx + 1; setCurrentIdx(next); if(!visited.includes(next)) setVisited(v=>[...v, next])} }}>
                   SAVE & NEXT <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
             </div>
          </footer>
        </div>

        {/* RIGHT: QUESTION PALETTE (FIXED ON DESKTOP) */}
        <aside className="hidden lg:block w-[320px] bg-white overflow-y-auto custom-scrollbar shrink-0 shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
           <div className="p-8">
              <QuestionPalette 
                questions={questions} 
                currentIndex={currentIdx} 
                answeredIndices={Object.keys(answers).map(Number)} 
                flaggedIndices={flagged} 
                visitedIndices={visited}
                onSelect={(idx) => { setCurrentIdx(idx); if (!visited.includes(idx)) setVisited(p => [...p, idx]); }} 
                examName={mock?.title}
              />
           </div>
        </aside>
      </main>
    </div>
  )
}

function LangToggle({ active, label, onClick }: any) {
  return (
    <button onClick={onClick} className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black tracking-widest transition-all", active ? "bg-primary text-white shadow-md" : "text-slate-400 hover:text-slate-600 hover:bg-white")}>{label}</button>
  )
}
