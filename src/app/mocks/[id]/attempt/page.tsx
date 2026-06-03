
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
import { ChevronLeft, ChevronRight, Flag, ShieldCheck, Languages, Loader2, AlertTriangle, Bookmark, LayoutGrid, Menu, X } from "lucide-react"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Final Mobile-Optimized CBT Engine.
 * Optimized for single-page view without scrolling. Fixed translation logic.
 */

type LangMode = 'english' | 'punjabi' | 'hindi'

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
  const [language, setLanguage] = useState<LangMode>('english')
  const [isBilingual, setIsBilingual] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [sessionRecovered, setSessionRecovered] = useState(false)

  const [isBookmarking, setIsBookmarking] = useState(false)
  const [reportData, setReportData] = useState({ type: "WRONG_ANS", comment: "" })
  const [isReporting, setIsReporting] = useState(false)

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
          setCurrentIdx(data.currentIdx || 0)
          if (data.remainingTime > 0) setRemainingTime(data.remainingTime)
          setSessionRecovered(true)
        }
      }
    })
  }, [db, user, mockId])

  useEffect(() => {
    if (!db || !user || questions.length === 0 || isSubmitting) return
    const interval = setInterval(() => {
      const sessionRef = doc(db, "test_sessions", `${user.uid}_${mockId}`)
      setDoc(sessionRef, {
        userId: user.uid, mockId, currentIdx, answers, flagged, remainingTime,
        status: 'IN_PROGRESS', updatedAt: serverTimestamp()
      }, { merge: true })
    }, 15000)
    return () => clearInterval(interval)
  }, [db, user, mockId, currentIdx, answers, flagged, remainingTime, questions, isSubmitting])

  const submitMock = useCallback(() => {
    if (isSubmitting || questions.length === 0) return
    setIsSubmitting(true)

    const correctMap: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }
    const subjectStats: Record<string, any> = {}
    let correctCount = 0

    questions.forEach((q, idx) => {
      const subj = q.subjectId || "GK"
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

  const handleBookmark = () => {
    if (!db || !user || !questions[currentIdx]) return
    setIsBookmarking(true)
    const q = questions[currentIdx]
    const bookmarkRef = doc(collection(db, "bookmarks"))
    setDoc(bookmarkRef, {
      id: bookmarkRef.id, userId: user.uid, questionId: q.id,
      questionText: q.questionEn, subjectId: q.subjectId,
      timestamp: new Date().toISOString(), createdAt: serverTimestamp()
    }).then(() => {
      toast({ title: "Saved", description: "MCQ added to repository." })
    }).finally(() => setIsBookmarking(false))
  }

  const handleReport = () => {
    if (!db || !user || !questions[currentIdx]) return
    setIsReporting(true)
    const reportRef = doc(collection(db, "reports"))
    setDoc(reportRef, {
      ...reportData, id: reportRef.id, userId: user.uid,
      questionId: questions[currentIdx].id, status: 'PENDING',
      timestamp: serverTimestamp()
    }).then(() => {
      toast({ title: "Feedback Logged" })
      setReportData({ type: "WRONG_ANS", comment: "" })
    }).finally(() => setIsReporting(false))
  }

  if (mockLoading || loadingQuestions) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white space-y-6">
       <Loader2 className="h-10 w-10 text-primary animate-spin" />
       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Securing Workspace...</p>
    </div>
  )

  const q = questions[currentIdx]

  const getQuestionText = (target: LangMode) => {
    if (target === 'english') return q.questionEn
    if (target === 'punjabi') return q.questionPa || q.questionEn
    if (target === 'hindi') return q.questionHi || q.questionEn
    return q.questionEn
  }

  const getOptionText = (opt: 'A'|'B'|'C'|'D', target: LangMode) => {
    if (target === 'english') return q[`option${opt}En`]
    if (target === 'punjabi') return q[`option${opt}Pa`] || q[`option${opt}En`]
    if (target === 'hindi') return q[`option${opt}Hi`] || q[`option${opt}En`]
    return q[`option${opt}En`]
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-[#0F172A]">
      {/* Dynamic Header */}
      <header className="h-14 md:h-16 border-b flex items-center justify-between px-4 md:px-8 bg-[#0B1528] text-white shrink-0 z-50">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h1 className="font-bold text-[10px] md:text-xs uppercase tracking-tight truncate max-w-[120px] md:max-w-xs">{mockConfig?.title}</h1>
        </div>
        
        <div className="flex items-center gap-2 md:gap-6">
          <Timer initialMinutes={mockConfig?.duration || 120} onTimeUp={submitMock} initialSeconds={remainingTime} onTick={setRemainingTime} />
          
          <div className="hidden lg:flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
             <button onClick={() => { setLanguage('english'); setIsBilingual(false); }} className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all", language === 'english' && !isBilingual ? "bg-primary text-white" : "text-slate-400 hover:text-white")}>EN</button>
             <button onClick={() => { setLanguage('punjabi'); setIsBilingual(false); }} className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all", language === 'punjabi' && !isBilingual ? "bg-primary text-white" : "text-slate-400 hover:text-white")}>PA</button>
             <button onClick={() => { setLanguage('hindi'); setIsBilingual(false); }} className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all", language === 'hindi' && !isBilingual ? "bg-primary text-white" : "text-slate-400 hover:text-white")}>HI</button>
             <button onClick={() => setIsBilingual(!isBilingual)} className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all", isBilingual ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white")}>Bilingual</button>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild><Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] px-4 md:px-8 rounded-lg shadow-lg">Submit</Button></AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl p-10 max-w-sm mx-auto">
              <AlertDialogHeader className="text-left">
                <AlertDialogTitle className="text-2xl font-black uppercase">End Audit?</AlertDialogTitle>
                <AlertDialogDescription className="py-4 text-sm font-medium text-slate-500">You have answered {Object.keys(answers).length} of {questions.length} questions.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex gap-2">
                <AlertDialogCancel className="rounded-xl font-bold uppercase text-[10px] h-12 border-slate-100 flex-1">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={submitMock} className="bg-[#0F172A] hover:bg-black text-white rounded-xl h-12 font-black uppercase text-[10px] flex-1">Submit</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      {/* Progress Node */}
      <div className="h-1 w-full bg-slate-100 shrink-0">
         <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
      </div>

      <main className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/30">
          
          {/* Question Meta Area */}
          <div className="px-4 py-3 md:px-8 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
             <div className="flex items-center gap-3">
                <Badge className="bg-[#0F172A] text-white border-none px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest">Q {currentIdx + 1}</Badge>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{q?.subjectId || "Syllabus"}</span>
             </div>
             <div className="flex items-center gap-3">
                <button onClick={handleBookmark} disabled={isBookmarking} className="text-slate-300 hover:text-primary transition-colors"><Bookmark className={cn("h-4 w-4", isBookmarking && "animate-pulse")} /></button>
                <Dialog>
                   <DialogTrigger asChild><button className="text-slate-300 hover:text-rose-500 transition-colors"><AlertTriangle className="h-4 w-4" /></button></DialogTrigger>
                   <DialogContent className="rounded-3xl p-8 max-w-sm">
                      <DialogHeader className="text-left space-y-2">
                        <DialogTitle className="text-xl font-black uppercase">Audit Flag</DialogTitle>
                        <DialogDescription className="text-xs">Maintain institutional accuracy.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                         <Select value={reportData.type} onValueChange={(v) => setReportData({...reportData, type: v})}>
                            <SelectTrigger className="h-12 rounded-xl text-xs font-bold"><SelectValue /></SelectTrigger>
                            <SelectContent>
                               <SelectItem value="WRONG_ANS">Incorrect Answer</SelectItem>
                               <SelectItem value="TYPO">Trilingual Error</SelectItem>
                               <SelectItem value="MISSING_DATA">Data Missing</SelectItem>
                            </SelectContent>
                         </Select>
                         <Textarea value={reportData.comment} onChange={(e) => setReportData({...reportData, comment: e.target.value})} className="rounded-xl h-24 text-xs" placeholder="Audit comment..." />
                      </div>
                      <Button onClick={handleReport} className="w-full h-12 rounded-xl font-black uppercase text-[10px]">Log Report</Button>
                   </DialogContent>
                </Dialog>
                <div className="lg:hidden flex items-center gap-2 ml-2 border-l border-slate-100 pl-3">
                   <button onClick={() => { setIsBilingual(false); setLanguage(l => l === 'english' ? 'punjabi' : l === 'punjabi' ? 'hindi' : 'english') }} className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px] font-black uppercase">{language === 'english' ? 'EN' : language === 'punjabi' ? 'PA' : 'HI'}</button>
                </div>
             </div>
          </div>

          {/* Question Content Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
             <div className="max-w-4xl mx-auto space-y-6 md:space-y-10">
                
                {/* Question Statement */}
                <div className="space-y-4 text-left">
                   {isBilingual && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-4 mb-4">
                         <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-200 pb-1 mb-2">Primary: English</p>
                         <p className="text-sm md:text-lg font-bold leading-relaxed whitespace-pre-line">{getQuestionText('english')}</p>
                      </div>
                   )}
                   <p className={cn("text-base md:text-2xl font-black leading-tight whitespace-pre-line", isBilingual ? "text-primary" : "text-[#0F172A]")}>
                      {isBilingual ? <span className="text-[8px] block uppercase text-primary/50 tracking-[0.2em] mb-1">Target Language</span> : null}
                      {getQuestionText(language)}
                   </p>
                </div>

                {/* Options Grid */}
                <RadioGroup 
                  value={answers[currentIdx]?.toString() || ""} 
                  onValueChange={(val) => setAnswers(prev => ({ ...prev, [currentIdx]: parseInt(val) }))} 
                  className="grid grid-cols-1 gap-3 md:gap-4"
                >
                  {['A', 'B', 'C', 'D'].map((key, i) => {
                    const isSelected = answers[currentIdx] === i
                    return (
                      <div key={i} onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: i }))} className={cn(
                        "flex items-center space-x-3 md:space-x-4 p-4 md:p-6 border-2 rounded-2xl transition-all cursor-pointer bg-white group shadow-sm",
                        isSelected ? 'border-primary bg-primary/5' : 'border-transparent hover:border-slate-200'
                      )}>
                         <RadioGroupItem value={i.toString()} id={`opt-${i}`} className="text-primary border-slate-300 shrink-0" />
                         <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer text-sm md:text-lg font-bold select-none text-slate-700 flex flex-col text-left leading-snug">
                            {isBilingual ? (
                               <div className="space-y-1">
                                  <p className="text-xs md:text-sm font-medium text-slate-400">{getOptionText(key as any, 'english')}</p>
                                  <p className="text-sm md:text-lg font-black text-primary">{getOptionText(key as any, language)}</p>
                               </div>
                            ) : (
                               <span className="whitespace-pre-line">{getOptionText(key as any, language)}</span>
                            )}
                         </Label>
                         <span className={cn(
                          "h-7 w-7 md:h-10 md:w-10 shrink-0 rounded-lg flex items-center justify-center text-[10px] md:text-xs font-black transition-all",
                          isSelected ? 'bg-primary text-white' : 'bg-slate-50 text-slate-300'
                        )}>{key}</span>
                      </div>
                    )
                  })}
                </RadioGroup>
             </div>
          </div>

          {/* Fixed Footer Controller */}
          <footer className="h-20 border-t border-slate-100 bg-white px-4 md:px-8 flex items-center justify-between shrink-0 shadow-2xl">
             <div className="flex gap-2">
                <Button variant="outline" size="lg" className="rounded-xl h-12 md:h-14 px-4 md:px-8 font-black uppercase text-[9px] md:text-[10px] border-slate-100" onClick={() => currentIdx > 0 && setCurrentIdx(currentIdx - 1)} disabled={currentIdx === 0}><ChevronLeft className="h-4 w-4 mr-1" /> Prev</Button>
                <Button variant="outline" size="icon" className={cn("h-12 w-12 md:h-14 md:w-14 rounded-xl border-2 transition-all", flagged.includes(currentIdx) ? "text-amber-600 bg-amber-50 border-amber-300" : "border-slate-100 text-slate-300")} onClick={() => setFlagged(prev => prev.includes(currentIdx) ? prev.filter(f => f !== currentIdx) : [...prev, currentIdx])}>
                   <Flag className="h-4 w-4" />
                </Button>
             </div>
             
             <div className="flex items-center gap-3">
                <Sheet>
                   <SheetTrigger asChild>
                      <Button variant="ghost" className="h-12 px-3 md:h-14 md:px-6 rounded-xl text-slate-400 font-black uppercase text-[10px] gap-2">
                         <LayoutGrid className="h-4 w-4" /> <span className="hidden sm:inline">Palette</span>
                      </Button>
                   </SheetTrigger>
                   <SheetContent side="bottom" className="rounded-t-[3rem] h-[60vh] px-8 pt-10">
                      <SheetHeader className="mb-8">
                         <SheetTitle className="text-2xl font-black uppercase tracking-tight text-center">Institutional Trail</SheetTitle>
                      </SheetHeader>
                      <div className="overflow-y-auto max-h-full pb-20 custom-scrollbar">
                         <QuestionPalette totalQuestions={questions.length} currentIndex={currentIdx} answeredIndices={Object.keys(answers).map(Number)} flaggedIndices={flagged} onSelect={(idx) => { setCurrentIdx(idx); }} />
                      </div>
                   </SheetContent>
                </Sheet>
                <Button className="flex-1 md:flex-none bg-[#0F172A] hover:bg-black text-white h-12 md:h-14 px-6 md:px-12 rounded-xl font-black uppercase text-[9px] md:text-[10px] tracking-widest shadow-xl" onClick={() => currentIdx < questions.length - 1 && setCurrentIdx(currentIdx + 1)} disabled={currentIdx === questions.length - 1}>Save & Next <ChevronRight className="h-4 w-4 ml-1" /></Button>
             </div>
          </footer>
        </div>

        {/* Sidebar Palette (Desktop Only) */}
        <aside className="w-80 border-l border-slate-100 bg-white p-8 hidden xl:block overflow-y-auto custom-scrollbar">
           <QuestionPalette totalQuestions={questions.length} currentIndex={currentIdx} answeredIndices={Object.keys(answers).map(Number)} flaggedIndices={flagged} onSelect={setCurrentIdx} />
           <div className="mt-20 p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 text-left">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase">Institutional Integrity monitors active attempt trails. Data synced with central node.</p>
           </div>
        </aside>
      </main>
    </div>
  )
}
