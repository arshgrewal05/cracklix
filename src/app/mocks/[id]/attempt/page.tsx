
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDoc, useFirestore, useUser } from "@/firebase"
import { doc, getDoc, addDoc, setDoc, serverTimestamp } from "firebase/firestore"
import Timer from "@/components/mocks/Timer"
import QuestionPalette from "@/components/mocks/QuestionPalette"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  ShieldCheck, 
  Languages, 
  Loader2, 
  Maximize, 
  PauseCircle, 
  PlayCircle,
  LayoutGrid,
  Info,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Circle
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type LangMode = 'en' | 'pa' | 'bilingual'

export default function MockAttemptPage() {
  const params = useParams()
  const router = useRouter()
  const db = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()
  const mockId = params.id as string
  
  const { data: mockConfig, loading: mockLoading } = useDoc<any>(useMemo(() => (db ? doc(db, "mocks", mockId) : null), [db, mockId]))
  
  const [questions, setQuestions] = useState<any[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [flagged, setFlagged] = useState<number[]>([])
  const [visited, setVisited] = useState<Set<number>>(new Set([0]))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [language, setLanguage] = useState<LangMode>('bilingual') 
  const [remainingTime, setRemainingTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [sessionRecovered, setSessionRecovered] = useState(false)

  // Fetch Questions
  useEffect(() => {
    async function fetchQuestions() {
      if (!db || !mockConfig?.questionIds) return
      setLoadingQuestions(true)
      try {
        const qData: any[] = []
        const fetchPromises = mockConfig.questionIds.map((id: string) => getDoc(doc(db, "questions", id)))
        const snapshots = await Promise.all(fetchPromises)
        snapshots.forEach(snap => { if (snap.exists()) qData.push({ ...snap.data(), id: snap.id }) })
        setQuestions(qData)
        if (!sessionRecovered) setRemainingTime((mockConfig.duration || 120) * 60)
      } catch (e) {
        console.error("CBT Engine Failure", e)
      } finally {
        setLoadingQuestions(false)
      }
    }
    fetchQuestions()
  }, [db, mockConfig, sessionRecovered])

  // Session Recovery
  useEffect(() => {
    if (!db || !user || !mockId) return
    const sessionRef = doc(db, "test_sessions", `${user.uid}_${mockId}`)
    getDoc(sessionRef).then(snap => {
      if (snap.exists()) {
        const data = snap.data()
        if (data.status === 'IN_PROGRESS') {
          setAnswers(data.answers || {})
          setFlagged(data.flagged || [])
          setVisited(new Set(data.visited || [0]))
          setCurrentIdx(data.currentIdx || 0)
          if (data.remainingTime > 0) setRemainingTime(data.remainingTime)
          setSessionRecovered(true)
        }
      }
    })
  }, [db, user, mockId])

  // Auto-Save Node
  useEffect(() => {
    if (!db || !user || questions.length === 0 || isSubmitting || isPaused) return
    const interval = setInterval(() => {
      const sessionRef = doc(db, "test_sessions", `${user.uid}_${mockId}`)
      setDoc(sessionRef, {
        userId: user.uid, mockId, currentIdx, answers, flagged, remainingTime,
        visited: Array.from(visited),
        status: 'IN_PROGRESS', updatedAt: serverTimestamp()
      }, { merge: true })
    }, 15000)
    return () => clearInterval(interval)
  }, [db, user, mockId, currentIdx, answers, flagged, remainingTime, questions, isSubmitting, isPaused, visited])

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1
      setCurrentIdx(nextIdx)
      setVisited(prev => new Set([...Array.from(prev), nextIdx]))
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1)
  }

  const handleSelectIdx = (idx: number) => {
    setCurrentIdx(idx)
    setVisited(prev => new Set([...Array.from(prev), idx]))
  }

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || isSubmitting) return;
      if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "ArrowLeft") {
        handlePrev()
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        setAnswers(prev => ({ ...prev, [currentIdx]: parseInt(e.key) - 1 }));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIdx, questions.length, isPaused, isSubmitting]);

  const submitMock = useCallback(() => {
    if (isSubmitting || questions.length === 0) return
    setIsSubmitting(true)

    const correctMap: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }
    const subjectStats: Record<string, any> = {}
    let correctCount = 0

    questions.forEach((q, idx) => {
      const subj = q.subjectId || "General Awareness"
      if (!subjectStats[subj]) subjectStats[subj] = { total: 0, correct: 0, attempted: 0 }
      subjectStats[subj].total++
      if (answers[idx] !== undefined) {
        subjectStats[subj].attempted++
        if (answers[idx] === correctMap[q.correctAnswer]) {
          subjectStats[subj].correct++; correctCount++
        }
      }
    })

    const resultData = {
      mockId, mockTitle: mockConfig?.title, userId: user?.uid,
      score: correctCount, totalQuestions: questions.length,
      accuracy: Math.round((correctCount / (Object.keys(answers).length || 1)) * 100),
      timestamp: new Date().toISOString(), subjectStats, answers
    }

    addDoc(collection(db, "results"), { ...resultData, createdAt: serverTimestamp() }).then(() => {
      setDoc(doc(db, "test_sessions", `${user?.uid}_${mockId}`), { status: 'SUBMITTED' }, { merge: true })
      router.push(`/results/${mockId}`)
    })
  }, [isSubmitting, questions, answers, mockId, mockConfig, user, db, router])

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  }

  if (mockLoading || loadingQuestions) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white space-y-6">
       <Loader2 className="h-10 w-10 text-primary animate-spin" />
       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initializing Exam Environment...</p>
    </div>
  )

  const q = questions[currentIdx]
  const currentPaper = (currentIdx + 1) <= 50 ? "PAPER A: PUNJABI QUALIFYING" : "PAPER B: MAIN EXAM";

  const counts = {
    answered: Object.keys(answers).length,
    marked: flagged.length,
    notVisited: questions.length - visited.size,
    notAnswered: visited.size - Object.keys(answers).length
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-[#0F172A] font-body selection:bg-primary/20">
      {/* Testbook Style Header */}
      <header className="h-14 border-b flex items-center justify-between px-4 md:px-6 bg-[#0B1528] text-white shrink-0 z-[60] shadow-md">
        <div className="flex items-center gap-4">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h1 className="font-black text-[11px] uppercase tracking-widest truncate max-w-[200px] hidden sm:block">
            {mockConfig?.title}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-0.5 bg-white/5 p-1 rounded-lg border border-white/10">
             <LangTab label="EN" active={language === 'en'} onClick={() => setLanguage('en')} />
             <LangTab label="ਪੰਜਾਬੀ" active={language === 'pa'} onClick={() => setLanguage('pa')} />
             <LangTab label="BI" active={language === 'bilingual'} onClick={() => setLanguage('bilingual')} />
          </div>

          <Timer onTimeUp={submitMock} initialSeconds={remainingTime} onTick={setRemainingTime} isPaused={isPaused} />

          <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" onClick={() => setIsPaused(!isPaused)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
                {isPaused ? <PlayCircle className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
             </Button>
             <Button variant="ghost" size="icon" onClick={toggleFullScreen} className="h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 hidden md:flex">
                <Maximize className="h-4 w-4" />
             </Button>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" className="bg-emerald-600 h-8 hover:bg-emerald-700 text-white font-black uppercase text-[10px] px-4 rounded-lg shadow-lg">Submit</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl p-10 max-w-md">
                  <AlertDialogHeader className="text-left space-y-4">
                    <AlertDialogTitle className="text-2xl font-black font-headline uppercase">Submit Assessment?</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm font-medium text-slate-500">
                      You have attempted {counts.answered} questions. Are you sure you want to finish the test?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex gap-3 pt-6">
                    <AlertDialogCancel className="rounded-xl font-bold h-12 flex-1">Review</AlertDialogCancel>
                    <AlertDialogAction onClick={submitMock} className="bg-[#0F172A] hover:bg-black text-white rounded-xl h-12 font-bold flex-1">Submit</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
             </AlertDialog>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        {isPaused && (
           <div className="absolute inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-300">
              <PauseCircle className="h-16 w-16 text-primary" />
              <div className="text-center">
                 <h2 className="text-3xl font-headline font-black uppercase text-[#0F172A]">Paused</h2>
                 <p className="text-slate-500 font-medium">Progress secured.</p>
              </div>
              <Button onClick={() => setIsPaused(false)} className="h-14 px-10 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-widest rounded-xl shadow-2xl">
                 Resume Test
              </Button>
           </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/20">
          {/* Subheader */}
          <div className="px-6 py-3 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
             <div className="flex items-center gap-4">
                <div className="flex flex-col">
                   <span className="text-[9px] font-black text-primary uppercase tracking-[0.1em]">{currentPaper}</span>
                   <p className="text-[10px] font-bold text-slate-500 uppercase truncate max-w-[200px]">{q?.subjectId || 'General'}</p>
                </div>
                <div className="h-5 w-px bg-slate-100" />
                <span className="text-xs font-black text-[#0F172A] uppercase">Question {currentIdx + 1} <span className="text-slate-300 font-medium">of</span> {questions.length}</span>
             </div>
             
             {/* Desktop Quick Stats */}
             <div className="hidden lg:flex items-center gap-4">
                <StatDot color="bg-emerald-500" label="Ans" count={counts.answered} />
                <StatDot color="bg-amber-500" label="Review" count={counts.marked} />
             </div>
          </div>

          {/* Question Display Node */}
          <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
             <div className="max-w-4xl mx-auto space-y-8 pb-20">
                <div className="space-y-8 text-left">
                   {(language === 'en' || language === 'bilingual') && (
                      <div className="space-y-3">
                         {language === 'bilingual' && <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest">English</p>}
                         <p className="text-[20px] md:text-[24px] font-bold leading-relaxed text-[#0F172A] antialiased whitespace-pre-line">
                            {q.questionEn}
                         </p>
                      </div>
                   )}
                   
                   {language === 'bilingual' && <div className="h-px w-full bg-slate-50" />}

                   {(language === 'pa' || language === 'bilingual') && (
                      <div className="space-y-3">
                         {language === 'bilingual' && <p className="text-[9px] font-black uppercase text-primary tracking-widest">ਪੰਜਾਬੀ (Punjabi)</p>}
                         <p className="text-[20px] md:text-[24px] font-bold leading-relaxed text-[#0F172A] antialiased whitespace-pre-line">
                            {q.questionPa || q.questionEn}
                         </p>
                      </div>
                   )}
                </div>

                <RadioGroup 
                  value={answers[currentIdx]?.toString() || ""} 
                  onValueChange={(val) => setAnswers(prev => ({ ...prev, [currentIdx]: parseInt(val) }))} 
                  className="grid grid-cols-1 gap-3 pt-6"
                >
                  {['A', 'B', 'C', 'D'].map((key, i) => {
                    const isSelected = answers[currentIdx] === i
                    return (
                      <div key={i} onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: i }))} className={cn(
                        "flex items-center space-x-4 p-4 border-2 rounded-2xl transition-all cursor-pointer bg-white shadow-sm",
                        isSelected ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'
                      )}>
                         <RadioGroupItem value={i.toString()} id={`opt-${i}`} className="text-primary border-slate-300 shrink-0 h-4 w-4" />
                         <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer select-none text-[#0F172A] flex flex-col text-left space-y-1">
                            {language === 'bilingual' ? (
                               <>
                                  <p className="text-xs font-medium text-slate-400">{q[`option${key}En`]}</p>
                                  <p className="text-[16px] md:text-[18px] font-bold">{q[`option${key}Pa`] || q[`option${key}En`]}</p>
                               </>
                            ) : (
                               <span className="text-[16px] md:text-[18px] font-bold">{language === 'en' ? q[`option${key}En`] : (q[`option${key}Pa`] || q[`option${key}En`])}</span>
                            )}
                         </Label>
                         <div className={cn(
                          "h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-[10px] font-black transition-all",
                          isSelected ? 'bg-primary text-white' : 'bg-slate-50 text-slate-300'
                        )}>{key}</div>
                      </div>
                    )
                  })}
                </RadioGroup>
             </div>
          </div>

          {/* Footer Actions */}
          <footer className="h-16 border-t border-slate-100 bg-white px-6 flex items-center justify-between shrink-0 z-50 shadow-inner">
             <div className="flex gap-2">
                <Button variant="outline" className="rounded-lg h-10 px-6 font-bold text-xs border-slate-100" onClick={handlePrev} disabled={currentIdx === 0}>Previous</Button>
                <Button variant="outline" className={cn("rounded-lg h-10 px-6 font-bold text-xs transition-all", flagged.includes(currentIdx) ? "bg-amber-500 border-amber-500 text-white" : "border-slate-100 text-slate-400")} onClick={() => setFlagged(prev => prev.includes(currentIdx) ? prev.filter(f => f !== currentIdx) : [...prev, currentIdx])}>
                   {flagged.includes(currentIdx) ? 'Flagged' : 'Mark Review'}
                </Button>
             </div>
             
             <div className="flex items-center gap-3">
                <Sheet>
                   <SheetTrigger asChild>
                      <Button variant="ghost" className="h-10 px-4 rounded-lg text-slate-400 font-bold text-xs gap-2 hover:bg-slate-50 lg:hidden">
                         <LayoutGrid className="h-4 w-4" /> Palette
                      </Button>
                   </SheetTrigger>
                   <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6 flex flex-col">
                      <SheetHeader className="mb-6">
                         <SheetTitle className="text-xl font-black uppercase text-left">Exam Palette</SheetTitle>
                      </SheetHeader>
                      <div className="flex-1 overflow-y-auto custom-scrollbar">
                         <QuestionPalette 
                            totalQuestions={questions.length} 
                            currentIndex={currentIdx} 
                            answeredIndices={Object.keys(answers).map(Number)} 
                            flaggedIndices={flagged} 
                            visitedIndices={Array.from(visited)}
                            onSelect={handleSelectIdx} 
                            questions={questions}
                         />
                      </div>
                   </SheetContent>
                </Sheet>
                <Button className="bg-[#0F172A] hover:bg-black text-white h-11 px-10 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl" onClick={handleNext}>
                  {currentIdx === questions.length - 1 ? 'Last Question' : 'Save & Next'}
                </Button>
             </div>
          </footer>
        </div>

        {/* Desktop Sidebar Palette */}
        <aside className="w-[280px] border-l border-slate-100 bg-white p-6 hidden lg:flex flex-col overflow-hidden">
           <div className="flex-1 overflow-y-auto custom-scrollbar">
              <QuestionPalette 
                totalQuestions={questions.length} 
                currentIndex={currentIdx} 
                answeredIndices={Object.keys(answers).map(Number)} 
                flaggedIndices={flagged} 
                visitedIndices={Array.from(visited)}
                onSelect={handleSelectIdx}
                questions={questions}
              />
           </div>
        </aside>
      </main>
    </div>
  )
}

function LangTab({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
   return (
      <button 
        onClick={onClick}
        className={cn(
          "px-4 py-1.5 rounded-md text-[9px] font-black uppercase transition-all duration-200",
          active ? "bg-primary text-white shadow-sm" : "text-slate-400 hover:text-white"
        )}
      >
        {label}
      </button>
   )
}

function StatDot({ color, label, count }: any) {
   return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100">
         <div className={cn("h-2 w-2 rounded-full", color)} />
         <span className="text-[8px] font-black uppercase text-slate-400">{label}:</span>
         <span className="text-[10px] font-black text-[#0F172A]">{count}</span>
      </div>
   )
}
