"use client"

import React, { useMemo, useState, useEffect } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useDoc, useCollection, useFirestore, useUser } from "@/firebase"
import { doc, collection, query, where, limit, orderBy, updateDoc, arrayUnion, arrayRemove, serverTimestamp, getDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Clock, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight,
  FileText,
  Zap,
  ChevronLeft,
  Info,
  Lock,
  GraduationCap,
  List,
  Download,
  Layers,
  RefreshCw,
  Play,
  BarChart3,
  Newspaper,
  Star,
  ArrowRight,
  LucideIcon,
  Scale,
  CheckCircle2,
  RefreshCcw
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { getAuthorityIcon } from "@/lib/exam-icons"

/**
 * @fileOverview Institutional Exam Hub v45.1.
 * UPDATED: Simplified terminology for study material and tests.
 */

const SUPER_ADMIN_WHITELIST = ['arshdeepgrewal1122@gmail.com'];

export default function ExamHubPage() {
  const params = useParams()
  const router = useRouter()
  const db = useFirestore()
  const { toast } = useToast()
  const { user, profile, loading: userLoading } = useUser()
  const examId = params.id as string

  const { data: exam, loading: examLoading } = useDoc<any>(useMemo(() => (db && examId ? doc(db, "exams", examId) : null), [db, examId]))
  
  const mocksQuery = useMemo(() => (db ? query(collection(db, "mocks"), where("published", "==", true)) : null), [db]);
  const notesQuery = useMemo(() => (db && examId ? query(collection(db, "notes"), where("examId", "==", examId)) : null), [db, examId]);
  const pyqsQuery = useMemo(() => (db && examId ? query(collection(db, "pyqs"), where("examId", "==", examId)) : null), [db, examId]);
  const resultsQuery = useMemo(() => (db && user ? query(collection(db, "results"), where("userId", "==", user.uid)) : null), [db, user]);

  const { data: rawMocks, loading: mocksLoading } = useCollection<any>(mocksQuery)
  const { data: rawNotes, loading: notesLoading } = useCollection<any>(notesQuery)
  const { data: rawPyqs, loading: pyqsLoading } = useCollection<any>(pyqsQuery)
  const { data: userResults } = useCollection<any>(resultsQuery)
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))

  const [isPinning, setIsPinning] = useState(false);

  const isPinned = useMemo(() => profile?.pinnedExams?.includes(examId) || false, [profile, examId]);

  const togglePin = async () => {
    if (!db || !user || isPinning) return;
    setIsPinning(true);
    const userRef = doc(db, "users", user.uid);
    try {
      if (isPinned) {
        await updateDoc(userRef, { pinnedExams: arrayRemove(examId), updatedAt: serverTimestamp() });
        toast({ title: "Removed from My Exams", description: "This exam has been removed from your saved list." });
      } else {
        await updateDoc(userRef, { pinnedExams: arrayUnion(examId), updatedAt: serverTimestamp() });
        toast({ title: "Added to My Exams", description: "Successfully added to your saved exams." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed" });
    } finally { setIsPinning(false); }
  };

  const isPassActive = useMemo(() => {
     if (!user || !profile) return false;
     const userEmail = user.email?.toLowerCase();
     if (profile.role === 'ADMIN' || (userEmail && SUPER_ADMIN_WHITELIST.includes(userEmail))) return true;
     return profile?.passStatus === 'active';
  }, [user, profile]);

  const groupedContent = useMemo(() => {
    const mocks = (rawMocks || []).filter(m => m.examId === examId || m.examIds?.includes(examId));
    return {
      FULL: mocks.filter(m => m.mockType === 'FULL'),
      SUBJECT: mocks.filter(m => m.mockType === 'SUBJECT'),
      SECTIONAL: mocks.filter(m => m.mockType === 'SECTIONAL'),
      PYQ: (rawPyqs || []),
      NOTES: (rawNotes || []).filter(n => n.category === 'NOTES'),
      SYLLABUS: (rawNotes || []).filter(n => n.category === 'SYLLABUS')
    }
  }, [rawMocks, rawNotes, rawPyqs, examId])

  if (examLoading || userLoading) return <div className="h-screen flex flex-col items-center justify-center bg-white space-y-4"><Zap className="h-8 w-8 text-primary animate-pulse" /><p className="text-[10px] font-black uppercase text-slate-300">Syncing Information...</p></div>;
  if (!exam) return <div className="h-screen flex flex-col items-center justify-center text-center p-6 space-y-4"><h2 className="text-xl font-black uppercase">Not Found</h2><Button onClick={() => router.push('/exams')}>Return</Button></div>;

  const activeBoard = boards?.find((b: any) => b.id === exam.boardId || b.abbreviation === exam.boardId);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 font-body text-left">
      <Navbar />
      
      <section className="bg-white border-b border-slate-100 py-10 md:py-14 relative overflow-hidden">
         <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
               <div className="flex items-start gap-4 flex-1 min-w-0">
                  <button onClick={() => router.back()} className="h-9 w-9 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 hover:bg-slate-50"><ChevronLeft className="h-4 w-4" /></button>
                  <div className="min-w-0 space-y-4">
                     <div className="flex items-center gap-3">
                        <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-sm">{activeBoard?.abbreviation || 'OFFICIAL'} INFORMATION</Badge>
                        <button onClick={togglePin} disabled={isPinning} className={cn("flex items-center gap-2 px-3 py-1 rounded-full border transition-all active:scale-90 shadow-sm font-black uppercase text-[8px] tracking-widest", isPinned ? "bg-primary border-primary text-white" : "bg-white border-slate-200 text-slate-400 hover:text-primary")}>
                           {isPinning ? <RefreshCw className="h-2.5 w-2.5 animate-spin" /> : isPinned ? <CheckCircle2 className="h-2.5 w-2.5" /> : <Star className="h-2.5 w-2.5" />}
                           {isPinned ? 'FOLLOWING' : 'SAVE EXAM'}
                        </button>
                     </div>
                     <div className="space-y-1">
                        <h1 className="text-3xl md:text-5xl font-black text-[#0F172A] leading-tight tracking-tight">
                           {exam.name}
                        </h1>
                        <p className="text-sm md:text-xl font-bold text-slate-400 max-w-3xl leading-snug">Prepare with official patterns and verified study materials.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <main className="container mx-auto px-4 py-8 max-w-7xl pb-40">
         <Tabs defaultValue="FULL" className="space-y-8 md:space-y-10">
            <div className="bg-white border border-slate-100 rounded-2xl p-1 shadow-md overflow-x-auto no-scrollbar">
               <TabsList className="bg-transparent border-none p-0 flex h-12 w-full justify-start gap-1">
                  <DashboardTab value="FULL" label="Full Mock Tests" icon={Zap} />
                  <DashboardTab value="SUBJECT" label="Subject Tests" icon={BookOpen} />
                  <DashboardTab value="SECTIONAL" label="Sectional Tests" icon={List} />
                  <DashboardTab value="PYQ" label="Official Papers" icon={Layers} />
                  <DashboardTab value="NOTES" label="Study Notes" icon={FileText} />
                  <DashboardTab value="SYLLABUS" label="Syllabus" icon={Info} />
               </TabsList>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
               <TabsContent value="FULL"><MockList data={groupedContent.FULL} results={userResults} isPassActive={isPassActive} loading={mocksLoading} boards={boards} exam={exam} /></TabsContent>
               <TabsContent value="SUBJECT"><MockList data={groupedContent.SUBJECT} results={userResults} isPassActive={isPassActive} loading={mocksLoading} boards={boards} exam={exam} /></TabsContent>
               <TabsContent value="SECTIONAL"><MockList data={groupedContent.SECTIONAL} results={userResults} isPassActive={isPassActive} loading={mocksLoading} boards={boards} exam={exam} /></TabsContent>
               <TabsContent value="PYQ"><NotesList data={groupedContent.PYQ} isPassActive={isPassActive} loading={pyqsLoading} type="PYQ" /></TabsContent>
               <TabsContent value="NOTES"><NotesList data={groupedContent.NOTES} isPassActive={isPassActive} loading={notesLoading} type="NOTE" /></TabsContent>
               <TabsContent value="SYLLABUS"><NotesList data={groupedContent.SYLLABUS} isPassActive={isPassActive} loading={notesLoading} type="SYLLABUS" /></TabsContent>
            </div>
         </Tabs>
      </main>
      <Footer />
    </div>
  )
}

function DashboardTab({ value, label, icon: Icon }: { value: string, label: string, icon: LucideIcon }) {
   return (
      <TabsTrigger value={value} className="px-5 md:px-8 h-full font-black text-[9px] md:text-[10px] uppercase tracking-widest text-slate-400 data-[state=active]:bg-[#0F172A] data-[state=active]:text-white rounded-xl transition-all whitespace-nowrap flex items-center gap-2">
         <Icon className="h-3.5 w-3.5" /> {label}
      </TabsTrigger>
   )
}

function MockList({ data, results, isPassActive, loading, boards, exam }: any) {
   const router = useRouter();
   if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-[2rem] bg-white" />)}</div>;
   if (data.length === 0) return <div className="py-24 text-center opacity-20 flex flex-col items-center gap-4"><Zap className="h-10 w-10 text-slate-300" /><p className="font-headline font-black text-lg uppercase tracking-widest">Section Empty</p></div>;

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
         {data.map((mock: any) => {
            const result = results?.find((r: any) => r.mockId === mock.id);
            const isPremium = mock.accessLevel === 'PREMIUM';
            const locked = isPremium && !isPassActive;
            const board = boards?.find((b: any) => b.id === (mock.boardIds?.[0] || mock.boardId));

            return (
               <Card key={mock.id} className="border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] bg-white p-6 md:p-8 text-center flex flex-col h-[380px] group relative overflow-hidden">
                  <div className="h-10 w-10 mx-auto rounded-xl bg-slate-50 flex items-center justify-center p-2 mb-6 shadow-inner relative overflow-hidden border border-slate-100">
                     {board?.iconUrl ? <img src={board.iconUrl} className="w-full h-full object-contain p-1" alt="Logo" /> : <ShieldCheck className="h-full w-full text-slate-200" />}
                  </div>
                  <CardHeader className="p-0 flex-1 space-y-4">
                     <CardTitle className="font-black text-lg md:text-xl text-[#0F172A] leading-tight line-clamp-2">
                        {mock.title}
                     </CardTitle>
                     <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> {mock.totalQuestions} Qs</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {mock.duration}m</span>
                     </div>
                     <div className="flex items-center justify-center gap-2">
                        {isPremium && <Badge className="bg-amber-50 text-amber-600 border-none text-[8px] font-black px-2 py-0.5 rounded">PREMIUM</Badge>}
                        <Badge variant="outline" className="border-slate-100 text-slate-400 text-[8px] font-black px-2 py-0.5 rounded uppercase">{board?.abbreviation || 'PSSSB'}</Badge>
                        {result && <Badge className="bg-emerald-50 text-emerald-600 border-none font-black px-2 py-0.5 rounded">ATTEMPTED</Badge>}
                     </div>
                  </CardHeader>
                  <CardContent className="p-0 mt-6">
                     <Button onClick={() => router.push(locked ? '/pass' : `/mocks/${mock.id}`)} className={cn("w-full h-12 rounded-xl font-black text-[10px] tracking-widest uppercase shadow-lg border-none", locked ? "bg-amber-500 hover:bg-amber-600" : "bg-[#0F172A] hover:bg-black")}>
                        {locked ? <><Lock className="h-3.5 w-3.5 mr-2" /> Unlock Test</> : 'Start Test'}
                     </Button>
                  </CardContent>
               </Card>
            )
         })}
      </div>
   )
}

function NotesList({ data, isPassActive, loading, type }: any) {
   if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl bg-white" />)}</div>;
   if (data.length === 0) return <div className="py-24 text-center opacity-20 flex flex-col items-center gap-4"><FileText className="h-10 w-10 text-slate-300" /><p className="font-headline font-black text-lg uppercase tracking-widest">No Materials Found</p></div>;

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
         {data.map((item: any) => {
            const isLocked = !item.isFree && !isPassActive;
            return (
               <Card key={item.id} className="border border-slate-100 shadow-lg rounded-2xl bg-white p-6 flex items-center justify-between group transition-all hover:shadow-xl">
                  <div className="flex items-center gap-5 min-w-0">
                     <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-blue-50 transition-colors">
                        {isLocked ? <Lock className="h-5 w-5 text-amber-500" /> : <FileText className={cn("h-5 w-5", type === 'PYQ' ? 'text-emerald-500' : 'text-blue-500')} />}
                     </div>
                     <div className="min-w-0">
                        <h3 className="text-base font-black text-[#0F172A] truncate max-w-[240px]">{item.title}</h3>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.category || type}</p>
                     </div>
                  </div>
                  <Button asChild className="h-10 px-6 bg-[#0F172A] hover:bg-black text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-md shrink-0">
                     <Link href={isLocked ? '/pass' : (item.pdfUrl || '#')} target={isLocked ? '_self' : '_blank'}>
                        {isLocked ? 'UNLOCK' : 'DOWNLOAD'}
                     </Link>
                  </Button>
               </Card>
            )
         })}
      </div>
   )
}
