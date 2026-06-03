
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDoc, useFirestore, useUser } from "@/firebase"
import { doc, getDoc, addDoc, setDoc, serverTimestamp, collection } from "firebase/firestore"
import Timer from "@/components/mocks/Timer"
import QuestionPalette from "@/components/mocks/QuestionPalette"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  Loader2, 
  Maximize, 
  PauseCircle, 
  PlayCircle,
  LayoutGrid,
  Monitor,
  CheckCircle2,
  Trash2,
  Settings
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
import { cn } from "@/lib/utils"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors"

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
  const [visited, setVisited] = useState<number[]>([0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [language, setLanguage] = useState<LangMode>('en') 
  const [remainingTime, setRemainingTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [sessionRecovered, setSessionRecovered] = useState(false)

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

  useEffect(() => {
    if (!db || !user || !mockId) return
    const sessionRef = doc(db, "test_sessions", `${user.uid}_${mockId}`)
    getDoc(sessionRef).then(snap => {
      if (snap.exists()) {
        const data = snap.data()
        if (data.status === 'IN_PROGRESS') {
          setAnswers(data.answers || {})
          setFlagged(data.flagged || [])
          setVisited(data.visited || [0])
          setCurrentIdx(data.currentIdx || 0)
          if (data.remainingTime > 0) setRemainingTime(data.remainingTime)
          setSessionRecovered(true)
        }
      }
    })
  }, [db, user, mockId])

  useEffect(() => {
    if (!db || !user || questions.length === 0 || isSubmitting || isPaused) return
    const interval = setInterval(() => {
      const sessionRef = doc(db, "test_sessions", `${user.uid}_${mockId}`)
      setDoc(sessionRef, {
        userId: user.uid, mockId, currentIdx, answers, flagged, remainingTime,
        visited: visited,
        status: 'IN_PROGRESS', updatedAt: serverTimestamp()
      }, { merge: true })
    }, 15000)
    return () => clearInterval(interval)
  }, [db, user, mockId, currentIdx, answers, flagged, remainingTime, questions, isSubmitting, isPaused, visited])

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      const nextIdx = currentIdx + 1
      setCurrentIdx(nextIdx)
      if (!visited.includes(nextIdx)) setVisited(prev => [...prev, nextIdx])
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1)
  }

  const handleSelectIdx = (idx: number) => {
    setCurrentIdx(idx)
    if (!visited.includes(idx)) setVisited(prev => [...prev, idx])
  }

  const clearResponse = () => {
    const newAnswers = { ...answers }
    delete newAnswers[currentIdx]
    setAnswers(newAnswers)
  }

  const markForReview = () => {
    if (!flagged.includes(currentIdx)) {
      setFlagged([...flagged, currentIdx])
    }
    handleNext()
  }

  const submitMock = useCallback(() => {
    if (isSubmitting || questions.length === 0 || !user || !db) return
    setIsSubmitting(true)

    const correctMap: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }
    const subjectStats: Record<string, any> = {}
    let correctCount = 0

    questions.forEach((q, idx) => {
      const subj = q.section || q.subjectId || "General Awareness"
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
      mockId, 
      mockTitle: mockConfig?.title || "Mock Test Attempt", 
      userId: user.uid,
      score: correctCount, 
      totalQuestions: questions.length,
      accuracy: Math.round((correctCount / (Object.keys(answers).length || 1)) * 100),
      timestamp: new Date().toISOString(), 
      subjectStats, 
      answers
    }

    const resultsRef = collection(db, "results")
    addDoc(resultsRef, { ...resultData, createdAt: serverTimestamp() })
      .then(() => {
        const sessionRef = doc(db, "test_sessions", `${user.uid}_${mockId}`)
        return setDoc(sessionRef, { status: 'SUBMITTED', updatedAt: serverTimestamp() }, { merge: true })
      })
      .then(() => {
        toast({ title: "Mock Submitted", description: "Your results have been synchronized." })
        router.push(`/results/${mockId}`)
      })
      .catch(async (serverError) => {
        setIsSubmitting(false)
        const permissionError = new FirestorePermissionError({
          path: 'results',
          operation: 'create',
          requestResourceData: resultData,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
  }, [isSubmitting, questions, answers, mockId, mockConfig, user, db, router, toast])

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
    }
  }

  if (mockLoading || loadingQuestions) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white space-y-6">
       <Loader2 className="h-10 w-10 text-primary animate-spin" />
       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Initializing Secure Hub...</p>
    </div>
  )

  const q = questions[currentIdx]
  const activePaper = q?.paper || (currentIdx < 50 ? "PAPER A: PUNJABI QUALIFYING" : "PAPER B: MAIN EXAM");
  const activeSection = q?.section || q?.subjectId || "General Test";

  const renderOptionContent = (key: string) => {
    const en = q[`option${key}En`];
    const pa = q[`option${key}Pa`];
    const hasValidPa = pa && pa !== en;

    if (language === 'bilingual') {
      return (
        <div className="flex flex-col text-left py-0.5">
          <span className="text-[13px] text-slate-500 font-medium leading-tight">{en}</span>
          {hasValidPa ? (
            <span className="text-[15px] text-[#0B1528] font-bold block mt-0.5">{pa}</span>
          ) : (
            <span className="text-[10px] text-rose-500 italic block mt-0.5">(Pa Translation Pending)</span>
          )}
        </div>
      );
    }
    if (language === 'pa') return <span className="text-[15px] font-bold text-[#0B1528]">{pa || en}</span>;
    return <span className="text-[15px] font-medium text-slate-700">{en}</span>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-[#0F172A] font-body selection:bg-primary/20">
      {/* Testbook Style Header */}
      <header className="h-12 border-b flex items-center justify-between px-3 md:px-6 bg-[#0B1528] text-white shrink-0 z-[60] shadow-sm">
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 scale-90 md:scale-100 origin-left">
           <LangTab label="ENGLISH" active={language === 'en'} onClick={() => setLanguage('en')} />
           <LangTab label="ਪੰਜਾਬੀ" active={language === 'pa'} onClick={() => setLanguage('pa')} />
           <LangTab label="BILINGUAL" active={language === 'bilingual'} onClick={() => setLanguage('bilingual')} />
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          <Timer onTimeUp={submitMock} initialSeconds={remainingTime} onTick={setRemainingTime} isPaused={isPaused} />
          
          <Button variant="ghost" size="icon" onClick={() => setIsPaused(!isPaused)} className="h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/5">
            {isPaused ? <PlayCircle className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleFullScreen} className="h-8 w-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 hidden md:flex">
             <Maximize className="h-4 w-4" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" className="bg-emerald-600 h-8 hover:bg-emerald-700 text-white font-black uppercase text-[9px] px-4 rounded-lg shadow-lg">
                {isSubmitting ? "Processing..." : "Submit"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl p-8">
              <AlertDialogHeader className="space-y-3">
                <AlertDialogTitle className="text-xl font-black uppercase text-[#0B1528]">Final Submission</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-500 font-medium">
                  Attempted {Object.keys(answers).length} / {questions.length}. Finalize now?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-6 gap-3">
                <AlertDialogCancel className="rounded-xl h-11 font-bold border-slate-200">Review</AlertDialogCancel>
                <AlertDialogAction onClick={submitMock} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 font-bold">Yes, Submit</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        {isPaused && (
           <div className="absolute inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-300">
              <PauseCircle className="h-16 w-16 text-primary" />
              <div className="text-center space-y-2">
                 <h2 className="text-2xl font-black uppercase text-[#0B1528]">Audit Paused</h2>
                 <p className="text-slate-500 font-medium">Timer and trail secured.</p>
              </div>
              <Button onClick={() => setIsPaused(false)} className="h-14 px-10 bg-[#0B1528] hover:bg-black text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-2xl">
                 Resume Attempt
              </Button>
           </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
          <div className="px-4 py-2 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
             <div className="flex items-center gap-4">
                <div className="flex flex-col text-left">
                   <span className="text-[9px] font-black text-orange-600 uppercase tracking-[0.2em]">{activePaper}</span>
                   <h2 className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">{activeSection}</h2>
                </div>
                <div className="h-6 w-px bg-slate-100" />
                <span className="text-[11px] font-black text-[#0B1528] uppercase tracking-tight">Question {currentIdx + 1} <span className="text-slate-300 font-medium mx-1">of</span> {questions.length}</span>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
             <div className="max-w-4xl mx-auto space-y-8">
                <div className="space-y-4 text-left">
                   {(language === 'en' || language === 'bilingual') && (
                      <p className="text-lg md:text-xl lg:text-2xl font-bold leading-relaxed text-[#0B1528] whitespace-pre-line antialiased">
                         {q.questionEn}
                      </p>
                   )}
                   {language === 'bilingual' && <div className="h-px w-16 bg-slate-100 my-2" />}
                   {(language === 'pa' || language === 'bilingual') && (
                      <p className="text-lg md:text-xl lg:text-2xl font-bold leading-relaxed text-[#0B1528] whitespace-pre-line antialiased">
                         {q.questionPa || q.questionEn}
                      </p>
                   )}
                </div>

                <RadioGroup 
                  value={answers[currentIdx]?.toString() || ""} 
                  onValueChange={(val) => setAnswers(prev => ({ ...prev, [currentIdx]: parseInt(val) }))} 
                  className="grid grid-cols-1 gap-3"
                >
                  {['A', 'B', 'C', 'D'].map((key, i) => {
                    const isSelected = answers[currentIdx] === i
                    return (
                      <div key={i} onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: i }))} className={cn(
                        "flex items-center space-x-4 p-3.5 border-2 rounded-xl transition-all cursor-pointer bg-white shadow-sm hover:shadow-md",
                        isSelected ? 'border-primary ring-4 ring-primary/5' : 'border-slate-50'
                      )}>
                         <RadioGroupItem value={i.toString()} id={`opt-${i}`} className="text-primary border-slate-200 shrink-0 h-4 w-4" />
                         <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer select-none space-y-1 py-0.5">
                            {renderOptionContent(key)}
                         </Label>
                         <div className={cn(
                          "h-8 w-8 shrink-0 rounded-lg flex items-center justify-center text-[10px] font-black transition-all",
                          isSelected ? 'bg-primary text-white shadow-lg' : 'bg-slate-50 text-slate-400'
                        )}>{key}</div>
                      </div>
                    )
                  })}
                </RadioGroup>
             </div>
          </div>

          <footer className="h-16 border-t border-slate-200 bg-white px-3 md:px-6 flex items-center justify-between shrink-0 z-50 shadow-inner">
             <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl h-10 px-4 font-black uppercase text-[9px] tracking-widest border-slate-200 hidden md:flex" onClick={handlePrev} disabled={currentIdx === 0}>Previous</Button>
                <Button variant="outline" className="rounded-xl h-10 px-4 font-black uppercase text-[9px] tracking-widest border-slate-200 text-slate-400 hover:bg-slate-50" onClick={clearResponse}>Clear</Button>
                <Button 
                  variant="outline" 
                  className={cn("rounded-xl h-10 px-4 font-black uppercase text-[9px] tracking-widest transition-all", flagged.includes(currentIdx) ? "bg-amber-500 border-amber-500 text-white" : "border-slate-200 text-amber-600")} 
                  onClick={markForReview}
                >
                   Review & Next
                </Button>
             </div>
             
             <div className="flex items-center gap-3">
                <Sheet>
                   <SheetTrigger asChild>
                      <Button variant="ghost" className="h-10 px-4 rounded-xl text-slate-400 font-black uppercase text-[9px] tracking-widest gap-2 hover:bg-slate-50 lg:hidden border border-slate-100">
                         <LayoutGrid className="h-4 w-4" /> Palette
                      </Button>
                   </SheetTrigger>
                   <SheetContent side="bottom" className="h-[80vh] p-6 flex flex-col rounded-t-[2.5rem] border-none">
                      <SheetHeader className="mb-4">
                         <SheetTitle className="text-lg font-black uppercase text-left">Exam Palette</SheetTitle>
                      </SheetHeader>
                      <div className="flex-1 overflow-y-auto custom-scrollbar">
                         <QuestionPalette 
                            totalQuestions={questions.length} 
                            currentIndex={currentIdx} 
                            answeredIndices={Object.keys(answers).map(Number)} 
                            flaggedIndices={flagged} 
                            visitedIndices={visited}
                            onSelect={handleSelectIdx} 
                            questions={questions}
                         />
                      </div>
                   </SheetContent>
                </Sheet>
                <Button className="bg-[#0B1528] hover:bg-black text-white h-11 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl" onClick={handleNext}>
                  {currentIdx === questions.length - 1 ? 'End Review' : 'Save & Next'}
                </Button>
             </div>
          </footer>
        </div>

        <aside className="w-[320px] border-l border-slate-200 bg-white p-6 hidden lg:flex flex-col overflow-hidden">
           <div className="flex-1 overflow-y-auto custom-scrollbar">
              <QuestionPalette 
                totalQuestions={questions.length} 
                currentIndex={currentIdx} 
                answeredIndices={Object.keys(answers).map(Number)} 
                flaggedIndices={flagged} 
                visitedIndices={visited}
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
          "px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all duration-300",
          active ? "bg-white text-[#0B1528] shadow-md" : "text-white/40 hover:text-white"
        )}
      >
        {label}
      </button>
   )
}
