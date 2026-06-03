
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDoc, useFirestore, useUser } from "@/firebase"
import { doc, collection, getDoc, addDoc, setDoc, serverTimestamp } from "firebase/firestore"
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
  AlertTriangle, 
  Bookmark, 
  Maximize, 
  PauseCircle, 
  PlayCircle,
  LayoutGrid,
  Info,
  CheckCircle2
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

type LangMode = 'english' | 'punjabi' | 'bilingual'

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
        status: 'IN_PROGRESS', updatedAt: serverTimestamp()
      }, { merge: true })
    }, 15000)
    return () => clearInterval(interval)
  }, [db, user, mockId, currentIdx, answers, flagged, remainingTime, questions, isSubmitting, isPaused])

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || isSubmitting) return;
      if (e.key === "ArrowRight") {
        if (currentIdx < questions.length - 1) setCurrentIdx(p => p + 1);
      } else if (e.key === "ArrowLeft") {
        if (currentIdx > 0) setCurrentIdx(p => p - 1);
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
       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initializing High-Fidelity Engine...</p>
    </div>
  )

  const q = questions[currentIdx]
  const currentPaper = (currentIdx + 1) <= 50 ? "PAPER A: PUNJABI QUALIFYING" : "PAPER B: MAIN EXAM";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-[#0F172A] font-body">
      {/* Testbook Style Header */}
      <header className="h-16 border-b flex items-center justify-between px-4 md:px-8 bg-[#0B1528] text-white shrink-0 z-[60] shadow-xl">
        <div className="flex items-center gap-6">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <div className="hidden sm:block">
             <h1 className="font-black text-xs uppercase tracking-widest truncate max-w-xs">{mockConfig?.title}</h1>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Testbook Style Layout • 2026</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
             <LangTab label="ENGLISH" active={language === 'english'} onClick={() => setLanguage('english')} />
             <LangTab label="ਪੰਜਾਬੀ" active={language === 'punjabi'} onClick={() => setLanguage('punjabi')} />
             <LangTab label="BILINGUAL" active={language === 'bilingual'} onClick={() => setLanguage('bilingual')} />
          </div>

          <Timer onTimeUp={submitMock} initialSeconds={remainingTime} onTick={setRemainingTime} isPaused={isPaused} />

          <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" onClick={() => setIsPaused(!isPaused)} className="h-10 w-10 rounded-xl text-slate-400 hover:text-white hover:bg-white/5">
                {isPaused ? <PlayCircle className="h-5 w-5" /> : <PauseCircle className="h-5 w-5" />}
             </Button>
             <Button variant="ghost" size="icon" onClick={toggleFullScreen} className="h-10 w-10 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 hidden md:flex">
                <Maximize className="h-4 w-4" />
             </Button>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" className="bg-emerald-600 h-10 hover:bg-emerald-700 text-white font-black uppercase text-[10px] px-6 rounded-xl shadow-lg ml-2">Submit</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-[2.5rem] p-12 max-w-md">
                  <AlertDialogHeader className="text-left space-y-4">
                    <AlertDialogTitle className="text-3xl font-black font-headline uppercase leading-tight">End Assessment?</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm font-medium text-slate-500 leading-relaxed">
                      You have attempted {Object.keys(answers).length} out of {questions.length} questions. Final submission will generate your All Punjab Rank.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-8">
                     <SummaryNode label="Answered" val={Object.keys(answers).length} color="text-emerald-600" />
                     <SummaryNode label="Pending" val={questions.length - Object.keys(answers).length} color="text-slate-400" />
                  </div>
                  <AlertDialogFooter className="flex gap-3">
                    <AlertDialogCancel className="rounded-2xl font-black uppercase text-[10px] h-14 border-slate-100 flex-1">Review</AlertDialogCancel>
                    <AlertDialogAction onClick={submitMock} className="bg-[#0F172A] hover:bg-black text-white rounded-2xl h-14 font-black uppercase text-[10px] flex-1">Submit Now</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
             </AlertDialog>
          </div>
        </div>
      </header>

      {/* Progress Node */}
      <div className="h-1 w-full bg-slate-100 shrink-0">
         <div className="h-full bg-primary transition-all duration-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
      </div>

      <main className="flex flex-1 overflow-hidden relative">
        {/* Pause Overlay */}
        {isPaused && (
           <div className="absolute inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-300">
              <div className="h-24 w-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center">
                 <PauseCircle className="h-12 w-12 text-primary" />
              </div>
              <div className="text-center space-y-2">
                 <h2 className="text-4xl font-headline font-black uppercase text-[#0F172A]">Assessment Paused</h2>
                 <p className="text-slate-500 font-medium">Your progress is secured. Timer is suspended.</p>
              </div>
              <Button onClick={() => setIsPaused(false)} className="h-16 px-12 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl">
                 Resume Test Now
              </Button>
           </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/20">
          {/* Subheader: Paper & Counter */}
          <div className="px-4 py-4 md:px-10 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
             <div className="flex items-center gap-6">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{currentPaper}</span>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{q?.subjectId || 'General'}</p>
                </div>
                <div className="h-6 w-px bg-slate-100" />
                <span className="text-sm font-black text-[#0F172A] uppercase tracking-tight">Question {currentIdx + 1} <span className="text-slate-300 mx-2">of</span> {questions.length}</span>
             </div>
             <div className="flex items-center gap-4">
                <div className="hidden md:flex gap-4">
                   <SummaryBadge label="Answered" val={Object.keys(answers).length} color="text-emerald-600" />
                   <SummaryBadge label="Review" val={flagged.length} color="text-amber-500" />
                </div>
             </div>
          </div>

          {/* Question Display Node */}
          <div className="flex-1 overflow-y-auto p-4 md:p-12 custom-scrollbar">
             <div className="max-w-4xl mx-auto space-y-12 pb-20">
                <div className="space-y-10 text-left">
                   {(language === 'english' || language === 'bilingual') && (
                      <div className="space-y-4">
                         {language === 'bilingual' && <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">English</p>}
                         <p className="text-2xl md:text-[32px] font-bold leading-[1.5] text-[#0F172A] antialiased whitespace-pre-line">
                            {q.questionEn}
                         </p>
                      </div>
                   )}
                   
                   {language === 'bilingual' && <div className="h-px w-full bg-slate-100" />}

                   {(language === 'punjabi' || language === 'bilingual') && (
                      <div className="space-y-4">
                         {language === 'bilingual' && <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">ਪੰਜਾਬੀ (Punjabi)</p>}
                         <p className="text-2xl md:text-[32px] font-bold leading-[1.5] text-[#0F172A] antialiased whitespace-pre-line">
                            {q.questionPa || q.questionEn}
                         </p>
                      </div>
                   )}
                </div>

                <RadioGroup 
                  value={answers[currentIdx]?.toString() || ""} 
                  onValueChange={(val) => setAnswers(prev => ({ ...prev, [currentIdx]: parseInt(val) }))} 
                  className="grid grid-cols-1 gap-4 pt-10"
                >
                  {['A', 'B', 'C', 'D'].map((key, i) => {
                    const isSelected = answers[currentIdx] === i
                    return (
                      <div key={i} onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: i }))} className={cn(
                        "flex items-center space-x-6 p-5 md:p-6 border-2 rounded-[2rem] transition-all cursor-pointer bg-white group shadow-sm hover:shadow-xl",
                        isSelected ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-slate-100 hover:border-slate-200'
                      )}>
                         <RadioGroupItem value={i.toString()} id={`opt-${i}`} className="text-primary border-slate-300 shrink-0 h-5 w-5" />
                         <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer select-none text-[#0F172A] flex flex-col text-left leading-snug space-y-2">
                            {language === 'bilingual' ? (
                               <>
                                  <p className="text-sm font-medium text-slate-400">{q[`option${key}En`]}</p>
                                  <p className="text-lg md:text-[22px] font-bold">{q[`option${key}Pa`] || q[`option${key}En`]}</p>
                               </>
                            ) : (
                               <span className="text-lg md:text-[22px] font-bold">{language === 'english' ? q[`option${key}En`] : (q[`option${key}Pa`] || q[`option${key}En`])}</span>
                            )}
                         </Label>
                         <div className={cn(
                          "h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center text-xs font-black transition-all",
                          isSelected ? 'bg-primary text-white shadow-lg' : 'bg-slate-50 text-slate-300'
                        )}>{key}</div>
                      </div>
                    )
                  })}
                </RadioGroup>
             </div>
          </div>

          {/* Footer Actions */}
          <footer className="h-20 border-t border-slate-100 bg-white px-4 md:px-10 flex items-center justify-between shrink-0 shadow-2xl z-50">
             <div className="flex gap-3">
                <Button variant="outline" className="rounded-2xl h-12 px-8 font-black uppercase text-[10px] border-slate-100 shadow-sm" onClick={() => currentIdx > 0 && setCurrentIdx(currentIdx - 1)} disabled={currentIdx === 0}><ChevronLeft className="h-4 w-4 mr-2" /> Previous</Button>
                <Button variant="outline" className={cn("rounded-2xl h-12 px-8 font-black uppercase text-[10px] transition-all shadow-sm", flagged.includes(currentIdx) ? "bg-amber-500 border-amber-500 text-white" : "border-slate-100 text-slate-400")} onClick={() => setFlagged(prev => prev.includes(currentIdx) ? prev.filter(f => f !== currentIdx) : [...prev, currentIdx])}>
                   <Flag className="h-4 w-4 mr-2" /> {flagged.includes(currentIdx) ? 'Flagged' : 'Mark Review'}
                </Button>
             </div>
             
             <div className="flex items-center gap-4">
                <Sheet>
                   <SheetTrigger asChild>
                      <Button variant="ghost" className="h-12 px-6 rounded-2xl text-slate-400 font-black uppercase text-[10px] gap-3 hover:bg-slate-50 xl:hidden">
                         <LayoutGrid className="h-5 w-5" /> Palette
                      </Button>
                   </SheetTrigger>
                   <SheetContent side="bottom" className="rounded-t-[4rem] h-[75vh] p-12 overflow-hidden flex flex-col">
                      <SheetHeader className="mb-10 text-center">
                         <SheetTitle className="text-3xl font-black font-headline uppercase tracking-tight">Question Audit Palette</SheetTitle>
                      </SheetHeader>
                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                         <QuestionPalette 
                            totalQuestions={questions.length} 
                            currentIndex={currentIdx} 
                            answeredIndices={Object.keys(answers).map(Number)} 
                            flaggedIndices={flagged} 
                            onSelect={setCurrentIdx} 
                            questions={questions}
                         />
                      </div>
                   </SheetContent>
                </Sheet>
                <Button className="bg-[#0F172A] hover:bg-black text-white h-14 px-12 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl" onClick={() => {
                   if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1)
                }}>Save & Next <ChevronRight className="h-4 w-4 ml-2" /></Button>
             </div>
          </footer>
        </div>

        {/* Desktop Sidebar Palette */}
        <aside className="w-80 border-l border-slate-100 bg-white p-10 hidden xl:flex flex-col overflow-hidden">
           <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <QuestionPalette 
                totalQuestions={questions.length} 
                currentIndex={currentIdx} 
                answeredIndices={Object.keys(answers).map(Number)} 
                flaggedIndices={flagged} 
                onSelect={setCurrentIdx}
                questions={questions}
              />
           </div>
           <div className="mt-10 p-8 bg-[#0F172A] rounded-[2.5rem] space-y-4 text-left shadow-2xl relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 p-4 opacity-5"><ShieldCheck className="h-20 w-20 text-white" /></div>
              <ShieldCheck className="h-6 w-6 text-primary relative z-10" />
              <p className="text-[9px] text-slate-400 font-black leading-relaxed uppercase tracking-[0.2em] relative z-10">
                Institutional Integrity verified. Your attempt path is being synchronized with the central audit registry.
              </p>
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
          "px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all duration-300",
          active ? "bg-primary text-white shadow-lg" : "text-slate-400 hover:text-white"
        )}
      >
        {label}
      </button>
   )
}

function SummaryNode({ label, val, color }: any) {
   return (
      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center space-y-1">
         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</p>
         <p className={cn("text-3xl font-headline font-black", color)}>{val}</p>
      </div>
   )
}

function SummaryBadge({ label, val, color }: any) {
   return (
      <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
         <span className="text-[8px] font-black uppercase text-slate-400">{label}</span>
         <span className={cn("text-xs font-black", color)}>{val}</span>
      </div>
   )
}
