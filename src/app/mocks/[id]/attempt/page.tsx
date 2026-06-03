
"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useDoc, useFirestore, useUser } from "@/firebase"
import { doc, getDoc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore"
import Timer from "@/components/mocks/Timer"
import QuestionPalette from "@/components/mocks/QuestionPalette"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { 
  ChevronLeft, 
  ChevronRight, 
  PauseCircle, 
  PlayCircle,
  LayoutGrid,
  CheckCircle2,
  Languages,
  Loader2,
  Trash2,
  Zap,
  Monitor
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type LangMode = 'en' | 'reg' | 'bilingual'

/**
 * @fileOverview Final Testbook-Style CBT Engine (Phase 162).
 * Fixed: Consolidated Paper A headers, unified bilingual colors, and stabilized Timer/Palette.
 */

export default function MockAttemptPage() {
  const params = useParams()
  const router = useRouter()
  const db = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()
  const mockId = params.id as string
  
  const { data: mock, loading: mockLoading } = useDoc<any>(useMemo(() => (db ? doc(db, "mocks", mockId) : null), [db, mockId]))
  
  const [questions, setQuestions] = useState<any[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [flagged, setFlagged] = useState<number[]>([])
  const [visited, setVisited] = useState<number[]>([0])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [language, setLanguage] = useState<LangMode>('bilingual')
  const [remainingTime, setRemainingTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [loadingQs, setLoadingQs] = useState(true)

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
        toast({ variant: "destructive", title: "Sync Failure", description: "Could not fetch question nodes." })
      } finally {
        setLoadingQs(false)
      }
    }
    init()
  }, [db, mock, toast])

  useEffect(() => {
    if (!db || !user || !mockId) return
    const sessionRef = doc(db, "test_sessions", `${user.uid}_${mockId}`)
    getDoc(sessionRef).then(snap => {
      if (snap.exists() && snap.data().status === 'IN_PROGRESS') {
        const d = snap.data()
        setAnswers(d.answers || {})
        setFlagged(d.flagged || [])
        setVisited(d.visited || [0])
        setCurrentIdx(d.currentIdx || 0)
        setRemainingTime(d.remainingTime || remainingTime)
      }
    })
  }, [db, user, mockId])

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      const n = currentIdx + 1
      setCurrentIdx(n)
      if (!visited.includes(n)) setVisited(prev => [...prev, n])
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1)
  }

  const markForReview = () => {
    if (!flagged.includes(currentIdx)) setFlagged(prev => [...prev, currentIdx])
    handleNext()
  }

  const clearResponse = () => {
    setAnswers(prev => {
      const next = { ...prev }
      delete next[currentIdx]
      return next
    })
  }

  const submitMock = useCallback(async () => {
    if (isSubmitting || questions.length === 0 || !user || !db) return
    setIsSubmitting(true)

    const correctMap: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }
    let score = 0
    questions.forEach((q, idx) => {
      if (answers[idx] !== undefined && answers[idx] === correctMap[q.correctAnswer]) score++
    })

    const payload = {
      mockId, userId: user.uid, score, totalQuestions: questions.length,
      accuracy: Math.round((score / (Object.keys(answers).length || 1)) * 100),
      timestamp: new Date().toISOString(), answers, createdAt: serverTimestamp(),
      mockTitle: mock?.title || "Mock Test"
    }

    try {
      await addDoc(collection(db, "results"), payload)
      await setDoc(doc(db, "test_sessions", `${user.uid}_${mockId}`), { status: 'SUBMITTED', updatedAt: serverTimestamp() }, { merge: true })
      toast({ title: "Submission Success", description: "Mock finalized successfully." })
      router.push(`/results/${mockId}`)
    } catch (e) {
      toast({ variant: "destructive", title: "Audit Failed", description: "Submission failed. Check network." })
      setIsSubmitting(false)
    }
  }, [isSubmitting, questions, answers, mock, user, db, router, mockId, toast])

  if (mockLoading || loadingQs) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white space-y-4">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
      <p className="font-black uppercase text-[10px] tracking-widest text-slate-400 italic">Syncing Question Hub...</p>
    </div>
  )

  const q = questions[currentIdx]
  const regLabel = mock?.examType === 'central' ? 'हिन्दी' : 'ਪੰਜਾਬੀ'
  const regKey = mock?.examType === 'central' ? 'Hi' : 'Pa'

  // Correct Paper A Logic: Ensure questions 1-50 are strictly labeled as Punjabi Language
  const isPaperA = currentIdx < 50;
  const activePaper = isPaperA ? "PAPER A: PUNJABI QUALIFYING" : (q?.paper || "PAPER B: MAIN EXAM")
  
  const subjectNames: Record<string, string> = {
    'punjabi-qualifying': 'Punjabi Language & Grammar',
    'punjab-history': 'Punjab History & Culture',
    'gk-ca': 'General Knowledge & Current Affairs',
    'reasoning': 'Logical Reasoning',
    'math': 'Numerical Ability',
    'ict': 'Computers / IT',
    'english': 'General English'
  }

  const activeSection = isPaperA ? "Punjabi Language & Grammar" : (subjectNames[q?.subjectId] || q?.section || "General Assessment")

  // Duplicate Check: Prevents redundant blocks if translations match
  const qEnTrim = (q?.questionEn || "").trim()
  const qRegTrim = (q?.[`question${regKey}`] || "").trim()
  const hasDistinctTranslation = qEnTrim && qRegTrim && qEnTrim !== qRegTrim

  const showEn = (language === 'en' || (language === 'bilingual' && hasDistinctTranslation)) && qEnTrim
  const showReg = (language === 'reg' || language === 'bilingual')

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-[#0F172A]">
      <header className="h-14 border-b flex items-center justify-between px-4 bg-[#0B1528] text-white shrink-0 z-[60]">
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg">
           <LangTab label="EN" active={language === 'en'} onClick={() => setLanguage('en')} />
           <LangTab label={regLabel} active={language === 'reg'} onClick={() => setLanguage('reg')} />
           <LangTab label="BI" active={language === 'bilingual'} onClick={() => setLanguage('bilingual')} />
        </div>
        
        <div className="flex items-center gap-3">
          <Timer onTimeUp={submitMock} initialSeconds={remainingTime} onTick={setRemainingTime} isPaused={isPaused} />
          <Button variant="ghost" size="icon" onClick={() => setIsPaused(!isPaused)} className="h-9 w-9 text-slate-400 hover:text-white">
            {isPaused ? <PlayCircle className="h-5 w-5" /> : <PauseCircle className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => document.documentElement.requestFullscreen()} className="h-9 w-9 text-slate-400 hover:text-white hidden md:flex">
             <Monitor className="h-5 w-5" />
          </Button>
          <Button onClick={submitMock} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] h-9 px-6 rounded-xl shadow-lg transition-all active:scale-95">Submit Test</Button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
          <div className="px-6 py-2 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-sm">
             <div className="flex items-center gap-4 text-left">
                <div className="space-y-0.5">
                   <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest leading-none">{activePaper}</p>
                   <h2 className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{activeSection}</h2>
                </div>
                <div className="h-6 w-px bg-slate-100" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Question {currentIdx + 1} of {questions.length}</span>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
             <div className="max-w-4xl mx-auto space-y-6">
                <div className="space-y-4 text-left">
                   {showEn && (
                      <p className="text-lg md:text-xl font-bold leading-snug text-[#0B1528] antialiased whitespace-pre-line">
                         {q?.questionEn}
                      </p>
                   )}
                   {showReg && (
                      <p className={cn(
                        "text-lg md:text-xl font-bold leading-snug text-[#0B1528] antialiased whitespace-pre-line",
                        language === 'bilingual' && showEn ? 'border-t border-slate-100 pt-3' : ''
                      )}>
                         {q?.[`question${regKey}`] || q?.questionEn}
                      </p>
                   )}
                </div>

                <RadioGroup 
                  value={answers[currentIdx]?.toString() || ""} 
                  onValueChange={(v) => setAnswers(prev => ({ ...prev, [currentIdx]: parseInt(v) }))} 
                  className="grid grid-cols-1 gap-2.5"
                >
                  {['A', 'B', 'C', 'D'].map((k, i) => {
                    const isSelected = answers[currentIdx] === i
                    const optEn = (q?.[`option${k}En`] || "").trim()
                    const optReg = (q?.[`option${k}${regKey}`] || "").trim()
                    const hasValidTranslation = optReg && optReg !== optEn

                    return (
                      <div key={i} onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: i }))} className={cn(
                        "flex items-center space-x-3 p-3 md:p-4 border rounded-xl transition-all cursor-pointer bg-white shadow-sm hover:border-primary/30",
                        isSelected ? 'border-primary ring-1 ring-primary/20 bg-primary/[0.02]' : 'border-slate-200'
                      )}>
                         <RadioGroupItem value={i.toString()} id={`opt-${i}`} className="text-primary" />
                         <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer select-none text-sm md:text-base font-bold text-[#0B1528] flex flex-col gap-0.5">
                            {language === 'bilingual' ? (
                               <>
                                  <span className="text-[11px] text-[#0B1528] font-bold opacity-70">{optEn}</span>
                                  {hasValidTranslation && <span className="leading-tight">{optReg}</span>}
                               </>
                            ) : (
                               <span>{language === 'en' ? optEn : optReg || optEn}</span>
                            )}
                         </Label>
                         <span className="text-[10px] font-black text-slate-300">{k}</span>
                      </div>
                    )
                  })}
                </RadioGroup>
             </div>
          </div>

          <footer className="h-16 border-t border-slate-200 bg-white px-6 flex items-center justify-between shrink-0 z-50">
             <div className="flex gap-2">
                <Button variant="outline" className="h-10 px-4 text-[10px] font-black uppercase tracking-widest" onClick={handlePrev} disabled={currentIdx === 0}>Previous</Button>
                <Button variant="outline" className="h-10 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400" onClick={clearResponse}><Trash2 className="h-3.5 w-3.5 mr-1" /> Clear</Button>
             </div>
             
             <div className="flex items-center gap-2">
                <Button variant="outline" className={cn("h-10 px-4 text-[10px] font-black uppercase tracking-widest", flagged.includes(currentIdx) ? "bg-amber-500 border-amber-500 text-white" : "text-amber-600")} onClick={markForReview}>Review & Next</Button>
                <Button className="bg-[#0B1528] hover:bg-black text-white h-10 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest" onClick={handleNext}>
                  {currentIdx === questions.length - 1 ? 'Finish' : 'Save & Next'}
                </Button>
             </div>
          </footer>
        </div>

        <aside className="w-[300px] border-l border-slate-200 bg-white p-5 hidden lg:flex flex-col overflow-hidden shrink-0">
           <div className="flex-1 overflow-y-auto custom-scrollbar">
              <QuestionPalette 
                totalQuestions={questions.length} currentIndex={currentIdx} 
                answeredIndices={Object.keys(answers).map(Number)} 
                flaggedIndices={flagged} visitedIndices={visited}
                onSelect={(idx) => { setCurrentIdx(idx); if (!visited.includes(idx)) setVisited(p => [...p, idx]); }} 
              />
           </div>
        </aside>

        <div className="lg:hidden fixed bottom-20 right-4 z-[80]">
           <Sheet>
              <SheetTrigger asChild><Button className="h-12 w-12 rounded-full bg-[#0B1528] text-white shadow-2xl"><LayoutGrid className="h-5 w-5" /></Button></SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh] p-6 rounded-t-[3rem] border-t-4 border-primary">
                 <QuestionPalette totalQuestions={questions.length} currentIndex={currentIdx} answeredIndices={Object.keys(answers).map(Number)} flaggedIndices={flagged} visitedIndices={visited} onSelect={setCurrentIdx} />
              </SheetContent>
           </Sheet>
        </div>
      </main>

      {isPaused && <div className="fixed inset-0 z-[200] bg-[#0B1528]/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-6">
         <div className="h-16 w-16 bg-primary/20 rounded-2xl flex items-center justify-center"><PauseCircle className="h-8 w-8 text-primary" /></div>
         <h2 className="text-2xl font-black uppercase text-white">Audit Paused</h2>
         <Button onClick={() => setIsPaused(false)} className="h-14 px-12 bg-white text-[#0B1528] font-black uppercase text-xs rounded-2xl shadow-3xl">Resume Audit</Button>
      </div>}
    </div>
  )
}

function LangTab({ label, active, onClick }: any) {
  return (
    <button onClick={onClick} className={cn("px-2.5 py-1 rounded text-[10px] font-black tracking-widest transition-all", active ? "bg-white text-[#0B1528] shadow-sm" : "text-white/40 hover:text-white")}>{label}</button>
  )
}
