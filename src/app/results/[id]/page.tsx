
"use client"

import { useState, useMemo, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Trophy, 
  Target, 
  Zap, 
  Loader2, 
  BrainCircuit, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useFirestore, useUser, useCollection } from "@/firebase"
import { collection, query, where, doc, getDoc, deleteDoc, documentId, getDocs } from "firebase/firestore"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import QuestionRenderer from "@/components/questions/QuestionRenderer"
import BackButton from "@/components/navigation/BackButton"

/**
 * @fileOverview Institutional Results Hub v21.0.
 * Updated: Side-aligned back button to minimize vertical space usage.
 */

export default function ResultPage() {
  const params = useParams()
  const router = useRouter()
  const mockId = params.id as string
  const db = useFirestore()
  const { user } = useUser()
  const { toast } = useToast()

  const [expandedQs, setExpandedQs] = useState<Record<number, boolean>>({})
  const [questions, setQuestions] = useState<any[]>([])
  const [loadingContent, setLoadingContent] = useState(true)
  const [mockLanguageMode, setMockLanguageMode] = useState<any>('ENGLISH_PUNJABI')

  const resultsQuery = useMemo(() => {
    if (!db || !user) return null
    return query(collection(db, "results"), where("userId", "==", user.uid))
  }, [db, user])

  const { data: rawResultDocs, loading: resultsLoading } = useCollection<any>(resultsQuery)
  
  const sessionData = useMemo(() => {
    if (!rawResultDocs || !mockId) return null
    const filtered = rawResultDocs.filter((r: any) => r.mockId === mockId);
    if (filtered.length === 0) return undefined;
    
    return filtered.sort((a: any, b: any) => {
         const tA = new Date(a.timestamp || 0).getTime()
         const tB = new Date(b.timestamp || 0).getTime()
         return tB - tA
      })[0]
  }, [rawResultDocs, mockId])

  useEffect(() => {
    async function loadQuestions() {
      if (!db) return;
      if (resultsLoading) return;
      if (!sessionData) {
        setLoadingContent(false);
        return;
      }

      setLoadingContent(true)
      try {
        const mockSnap = await getDoc(doc(db, "mocks", mockId))
        if (mockSnap.exists()) {
          const mData = mockSnap.data();
          setMockLanguageMode(mData.languageMode || 'ENGLISH_PUNJABI');
          const questionIds = mData.questionIds || []
          const fetchedQuestions: any[] = []
          
          const chunks = []
          for (let i = 0; i < questionIds.length; i += 30) {
            chunks.push(questionIds.slice(i, i + 30))
          }

          const chunkSnaps = await Promise.all(
            chunks.map(chunk => {
               if (!db) return Promise.resolve({ docs: [] });
               return getDocs(query(collection(db, "questions"), where(documentId(), "in", chunk)))
            })
          )

          chunkSnaps.forEach(snap => {
            snap.docs.forEach(d => fetchedQuestions.push({ ...d.data(), id: d.id }))
          })

          setQuestions(questionIds.map(id => fetchedQuestions.find(q => q.id === id)).filter(Boolean))
        }
      } catch (e) {
        toast({ variant: "destructive", title: "Sync Failure" })
      } finally {
        setLoadingContent(false)
      }
    }
    loadQuestions()
  }, [db, sessionData, mockId, toast, resultsLoading])

  const handleReattempt = async () => {
    if (!db || !user || !mockId) return;
    if (!window.confirm("Restart evaluation node?")) return;

    const attemptId = `${user.uid}_${mockId}`;
    
    // Non-blocking background reset
    deleteDoc(doc(db, "attempts", attemptId)).catch(() => {});
    deleteDoc(doc(db, "results", attemptId)).catch(() => {});
    
    localStorage.removeItem(`attempt_${mockId}`);
    localStorage.removeItem(`result_${mockId}`);

    toast({ title: "Registry Reset" });
    router.push(`/mocks/${mockId}/instructions`);
  };

  if (resultsLoading || loadingContent) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white space-y-6">
       <Loader2 className="h-10 w-10 text-primary animate-spin" />
       <p className="text-[12px] font-black uppercase tracking-[0.4em] text-primary">Auditing Preparation Node...</p>
    </div>
  )

  if (!sessionData) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6 space-y-8">
       <Trophy className="h-20 w-20 text-slate-200" />
       <p className="text-lg font-bold text-slate-400 uppercase tracking-widest text-center">No Audit Node Detected</p>
       <Button asChild className="rounded-2xl h-16 px-12 bg-[#0B1528] text-white font-black uppercase text-[11px] tracking-widest shadow-xl">
          <Link href="/mocks">Explore All Hubs</Link>
       </Button>
    </div>
  )

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 font-body pb-32">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-6xl space-y-8 text-left animate-in fade-in duration-700">
        
        {/* Navigation Breadcrumb (Side Aligned) */}
        <div className="flex items-center gap-3">
           <BackButton label="Home" fallback="/dashboard" className="p-0 h-auto" />
           <div className="h-4 w-px bg-slate-200" />
           <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Institutional Audit Registry</p>
           </div>
        </div>

        {/* Master Scoreboard Node */}
        <Card className="border-none shadow-3xl rounded-[3rem] overflow-hidden bg-white">
           <div className="h-2 w-full bg-primary" />
           <CardHeader className="p-10 md:p-16 border-b border-slate-50 space-y-6 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                 <div className="space-y-4">
                    <div className="flex items-center justify-center md:justify-start gap-4">
                       <ShieldCheck className="h-8 w-8 text-primary" />
                       <Badge className="bg-emerald-50 text-emerald-600 border-none px-4 py-1.5 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg">VERIFIED ASSESSMENT</Badge>
                    </div>
                    <CardTitle className="text-3xl md:text-6xl font-headline font-black text-[#0F172A] uppercase leading-tight tracking-tight">
                       {sessionData.mockTitle}
                    </CardTitle>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                    <Button 
                      onClick={handleReattempt} 
                      type="button" 
                      className="h-16 px-10 bg-primary hover:bg-orange-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-primary/20 transition-all active:scale-95"
                    >
                      Initialize Re-Attempt
                    </Button>
                    <Button asChild variant="outline" className="h-16 px-10 border-slate-200 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-sm">
                      <Link href="/dashboard">Return Dashboard</Link>
                    </Button>
                 </div>
              </div>
           </CardHeader>

           <CardContent className="p-10 md:p-16 bg-slate-50/30">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                <MetricNode icon={<CheckCircle2 className="text-emerald-500 h-6 w-6" />} val={sessionData.score} label="CORRECT AUDIT" sub="Success Points" />
                <MetricNode icon={<XCircle className="text-rose-500 h-6 w-6" />} val={Object.keys(sessionData.answers).length - sessionData.score} label="WRONG NODES" sub="Logic Failures" />
                <MetricNode icon={<HelpCircle className="text-slate-400 h-6 w-6" />} val={sessionData.totalQuestions - Object.keys(sessionData.answers).length} label="SKIPPED ASSETS" sub="Untouched" />
                <MetricNode icon={<Target className="text-primary h-6 w-6" />} val={`${sessionData.accuracy}%`} label="PRECISION INDEX" sub="Registry Mastery" />
              </div>
           </CardContent>
        </Card>

        {/* Detailed Performance Node */}
        <div className="space-y-8">
           <div className="flex items-center justify-between border-b border-slate-200 pb-6">
              <h3 className="font-headline font-black text-2xl md:text-3xl uppercase text-[#0F172A] flex items-center gap-4">
                 <BrainCircuit className="h-8 w-8 text-primary" /> Performance Review
              </h3>
              <Badge variant="outline" className="border-slate-200 text-slate-400 font-black uppercase text-[10px] px-4 py-2 rounded-xl">
                 {questions.length} Items Locked
              </Badge>
           </div>
           
           <div className="grid grid-cols-1 gap-6 md:gap-8">
              {questions.map((q, idx) => {
                 const studentAnsIdx = sessionData.answers?.[idx];
                 const correctAnsIdx = ['A','B','C','D'].indexOf(q.correctAnswer);
                 const isCorrect = studentAnsIdx === correctAnsIdx;
                 const isSkipped = studentAnsIdx === undefined || studentAnsIdx === null;
                 const isExpanded = expandedQs[idx];

                 return (
                    <Card key={idx} className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white group hover:shadow-2xl transition-all duration-300">
                       <div className={cn("h-2 w-full transition-colors", isCorrect ? "bg-emerald-500" : isSkipped ? "bg-slate-200" : "bg-rose-500")} />
                       <CardContent className="p-8 md:p-12 space-y-8">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-6">
                                <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-lg text-slate-400 group-hover:text-primary transition-colors">
                                   {idx + 1}
                                </div>
                                <Badge className={cn(
                                  "border-none px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm",
                                  isCorrect ? "bg-emerald-50 text-emerald-600" : isSkipped ? "bg-slate-50 text-slate-400" : "bg-rose-50 text-rose-600"
                                )}>
                                   {isCorrect ? 'AUDIT SUCCESS' : isSkipped ? 'SKIPPED NODE' : 'REGISTRY FAILURE'}
                                </Badge>
                             </div>
                             
                             <Button 
                                variant="ghost"
                                onClick={() => setExpandedQs(p => ({ ...p, [idx]: !p[idx] }))}
                                className="h-12 px-8 font-black uppercase text-[10px] tracking-widest gap-3 text-primary bg-primary/5 hover:bg-primary/10 rounded-xl"
                             >
                                {isExpanded ? "Hide Logic" : "Audit Solution"}
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                             </Button>
                          </div>

                          <div className="px-1 md:px-4">
                            <QuestionRenderer 
                                question={q} 
                                language={mockLanguageMode} 
                                showSolution={isExpanded} 
                                selectedAnswer={studentAnsIdx}
                                hideOptions={false}
                                className="border-none shadow-none p-0 bg-transparent"
                            />
                          </div>
                       </CardContent>
                    </Card>
                 )
              })}
           </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function MetricNode({ icon, val, label, sub }: any) {
  return (
    <div className="space-y-4 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm text-center group hover:translate-y-[-6px] transition-all">
      <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto shadow-inner group-hover:scale-110 transition-transform">
         {icon}
      </div>
      <div className="space-y-1">
         <p className="text-4xl font-headline font-black text-[#0F172A] tracking-tighter">{val}</p>
         <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{label}</p>
         <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">{sub}</p>
      </div>
    </div>
  )
}
