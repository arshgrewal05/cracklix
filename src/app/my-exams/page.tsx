"use client"

import { useMemo, useEffect, useState } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useUser, useCollection, useFirestore } from "@/firebase"
import { collection, query, where, doc, updateDoc, limit, arrayRemove, serverTimestamp } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Target, 
  Zap, 
  ChevronRight, 
  History, 
  Search, 
  Star,
  ShieldCheck,
  LayoutGrid,
  Clock,
  Sparkles,
  GraduationCap,
  Activity,
  Trash2,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Plus,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

/**
 * @file Overview My Hub Dashboard v3.2.
 * UPDATED: Steady Shell pattern - Navbar is always visible.
 */

export default function MyExamsPage() {
  const { user, profile, loading: userLoading, profileLoading } = useUser()
  const db = useFirestore()
  const router = useRouter()
  const { toast } = useToast()
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})
  const [unpinningId, setUnpinningId] = useState<string | null>(null)
  const [settingTargetId, setSettingTargetId] = useState<string | null>(null)

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login?returnUrl=/my-exams")
    }
  }, [user, userLoading, router])

  const examsQuery = useMemo(() => (db ? collection(db, "exams") : null), [db])
  const boardsQuery = useMemo(() => (db ? collection(db, "boards") : null), [db])
  const mocksQuery = useMemo(() => (db ? query(collection(db, "mocks"), where("published", "==", true), limit(100)) : null), [db])
  
  const { data: allExams, loading: examsLoading } = useCollection<any>(examsQuery)
  const { data: boards } = useCollection<any>(boardsQuery)
  const { data: rawRecentMocks } = useCollection<any>(mocksQuery)

  const recentMocks = useMemo(() => {
    if (!rawRecentMocks) return []
    return [...rawRecentMocks].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
  }, [rawRecentMocks])

  const resultsQuery = useMemo(() => {
    if (!db || !user) return null
    return query(collection(db, "results"), where("userId", "==", user.uid), limit(10))
  }, [db, user])

  const { data: rawResults, loading: attemptsLoading } = useCollection<any>(resultsQuery)

  const recentAttempts = useMemo(() => {
    if (!rawResults) return []
    return [...rawResults].sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [rawResults])

  const pinnedExams = useMemo(() => {
    if (!allExams || !profile?.pinnedExams) return []
    return allExams.filter((e: any) => profile.pinnedExams?.includes(e.id))
  }, [allExams, profile])

  const handleUnpin = async (examId: string) => {
    if (!db || !user || unpinningId) return;
    setUnpinningId(examId);
    
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        pinnedExams: arrayRemove(examId),
        updatedAt: serverTimestamp()
      });
      toast({ title: "Removed from Hub", description: "Exam node cleared from interests." });
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed" });
    } finally {
      setUnpinningId(null);
    }
  };

  const handleSetTarget = async (examName: string, examId: string) => {
    if (!db || !user || settingTargetId) return;
    setSettingTargetId(examId);
    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        targetExam: examName,
        updatedAt: serverTimestamp()
      });
      toast({ title: "Target Locked", description: `You are now preparing for ${examName}.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Update Failed" });
    } finally {
      setSettingTargetId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 font-body pb-safe text-left">
      <Navbar />
      
      {userLoading ? (
         <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <Zap className="h-10 w-10 text-primary animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing My Hub...</p>
         </div>
      ) : (
         <main className="container mx-auto px-4 py-6 md:py-12 max-w-6xl space-y-12">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 text-left">
               <div className="space-y-3">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                        <LayoutGrid className="h-6 w-6" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Aspirant Prep Hub</span>
                  </div>
                  <h1 className="text-4xl md:text-7xl font-headline font-black text-[#0F172A] uppercase tracking-tighter leading-none">MY <span className="text-primary">HUB</span></h1>
                  <p className="text-sm md:text-xl text-slate-400 font-medium max-w-xl">Manage your selected exams and track preparation nodes.</p>
               </div>
               <Button asChild className="h-16 px-10 bg-[#0F172A] hover:bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-4xl gap-3">
                  <Link href="/exams"><Plus className="h-5 w-5 text-primary" /> Select More Exams</Link>
               </Button>
            </div>

            {/* PINNED HUBS */}
            <section className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                     <ShieldCheck className="h-4 w-4 text-primary" /> Your Active Selections
                  </h3>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profileLoading || examsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-[2.5rem]" />)
                  ) : pinnedExams.length > 0 ? pinnedExams.map((exam) => {
                     const board = boards?.find((b: any) => b.id.toLowerCase() === exam.boardId?.toLowerCase() || b.abbreviation?.toLowerCase() === exam.boardId?.toLowerCase());
                     const logoUrl = board?.iconUrl || exam.iconUrl;
                     const isImgFailed = failedImages[exam.id];
                     const isTarget = profile?.targetExam === exam.name;
                     const isUnpinning = unpinningId === exam.id;
                     const isSettingTarget = settingTargetId === exam.id;

                     return (
                      <Card key={exam.id} className="border-none shadow-xl hover:shadow-4xl transition-all duration-500 rounded-[2.5rem] bg-white group overflow-hidden h-full flex flex-col border border-slate-100 relative">
                        {isTarget && (
                           <div className="absolute top-0 right-0 p-6 z-20">
                              <Badge className="bg-emerald-500 text-white border-none shadow-lg px-3 py-1 font-black text-[8px] uppercase flex items-center gap-1.5 rounded-lg">
                                 <CheckCircle2 className="h-3 w-3" /> CURRENT TARGET
                              </Badge>
                           </div>
                        )}
                        
                        <CardContent className="p-8 flex flex-col h-full">
                           <div className="flex justify-between items-start mb-8">
                              <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-inner group-hover:scale-105 transition-transform overflow-hidden">
                                 {logoUrl && !isImgFailed ? (
                                   <img src={logoUrl} className="w-full h-full object-contain p-2" referrerPolicy="no-referrer" alt="Logo" onError={() => setFailedImages(p => ({...p, [exam.id]: true}))} />
                                 ) : (
                                   <GraduationCap className="h-8 w-8 text-slate-200" />
                                 )}
                              </div>
                           </div>
                           
                           <h4 className="font-black text-xl text-[#0F172A] uppercase leading-tight flex-1 mb-6 pr-4">{exam.name}</h4>
                           
                           <div className="space-y-4 pt-6 border-t border-slate-50">
                              {isTarget ? (
                                 <Button asChild className="w-full h-14 bg-[#0F172A] hover:bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-xl border-none">
                                    <Link href={`/exams/${exam.id}`}>Open Exam Center <ChevronRight className="h-4 w-4" /></Link>
                                 </Button>
                              ) : (
                                 <div className="grid grid-cols-2 gap-3">
                                    <Button 
                                      onClick={() => handleSetTarget(exam.name, exam.id)}
                                      disabled={isSettingTarget}
                                      variant="outline" 
                                      className="h-12 rounded-xl border-slate-200 font-black uppercase text-[8px] tracking-widest gap-2"
                                    >
                                       {isSettingTarget ? <Loader2 className="h-3 w-3 animate-spin" /> : <Target className="h-3 w-3" />} SELECT TARGET
                                    </Button>
                                    <Button asChild className="h-12 bg-slate-900 text-white rounded-xl font-black uppercase text-[8px] tracking-widest border-none">
                                       <Link href={`/exams/${exam.id}`}>OPEN HUB</Link>
                                    </Button>
                                 </div>
                              )}
                              
                              <button 
                                 onClick={() => handleUnpin(exam.id)}
                                 disabled={isUnpinning}
                                 className="w-full text-center py-2 text-[8px] font-black text-slate-300 hover:text-rose-500 uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                              >
                                 {isUnpinning ? <RefreshCw className="h-2.5 w-2.5 animate-spin" /> : <X className="h-2.5 w-2.5" />} Remove from Hub
                              </button>
                           </div>
                        </CardContent>
                      </Card>
                     )
                  }) : (
                     <Card className="col-span-full border-2 border-dashed border-slate-200 bg-white/50 py-24 rounded-[3.5rem] flex flex-col items-center justify-center text-center space-y-6">
                        <div className="h-20 w-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-300 shadow-inner">
                           <Plus className="h-10 w-10" />
                        </div>
                        <div className="space-y-2 px-6">
                           <p className="text-xl font-headline font-black text-[#0F172A] uppercase">Hub Registry Empty</p>
                           <p className="text-sm font-medium text-slate-400 uppercase tracking-widest max-w-xs">You haven't selected any exams for your preparation hub yet.</p>
                        </div>
                        <Button asChild className="bg-[#0F172A] hover:bg-black rounded-xl h-14 px-10 font-black uppercase text-[10px] tracking-widest shadow-xl border-none">
                           <Link href="/exams">Select Your Exams</Link>
                        </Button>
                     </Card>
                  )}
               </div>
            </section>

            {/* RECENT ACTIVITY */}
            <section className="space-y-6">
               <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-3 px-2">
                  <History className="h-4 w-4" /> RECENT TEST LOGS
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {attemptsLoading ? (
                     Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-[2.5rem]" />)
                  ) : recentAttempts.length > 0 ? recentAttempts.map((r: any) => (
                     <Link key={r.id} href={`/results/${r.mockId}`}>
                        <Card className="border-none shadow-xl hover:shadow-4xl transition-all duration-300 rounded-[2.5rem] bg-white p-6 md:p-10 flex items-center justify-between group overflow-hidden border border-slate-100">
                           <div className="flex items-center gap-8 min-w-0">
                              <div className="h-14 w-14 md:h-20 md:w-20 rounded-[1.5rem] bg-slate-50 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-primary/5 transition-all">
                                 <Zap className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                              </div>
                              <div className="min-w-0 space-y-2">
                                 <h4 className="font-black text-lg md:text-2xl text-[#0F172A] uppercase truncate leading-none">{r.mockTitle}</h4>
                                 <div className="flex items-center gap-4 text-[10px] md:text-[12px] font-bold text-slate-400 uppercase tracking-tight">
                                    <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-primary" /> {new Date(r.timestamp).toLocaleDateString()}</span>
                                    <Badge className="bg-emerald-50 text-emerald-600 border-none font-black px-2 py-0">Score: {r.score}</Badge>
                                 </div>
                              </div>
                           </div>
                           <ChevronRight className="h-6 w-6 text-slate-200 group-hover:text-primary transition-all group-hover:translate-x-2" />
                        </Card>
                     </Link>
                  )) : (
                    <div className="col-span-full py-16 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm opacity-30 italic">
                       <p className="font-black uppercase tracking-[0.3em] text-[10px]">No recent test sessions recorded.</p>
                    </div>
                  )}
               </div>
            </section>
         </main>
      )}

      {!userLoading && <Footer />}
    </div>
  )
}
