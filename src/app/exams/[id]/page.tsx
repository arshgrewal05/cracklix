
"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useDoc, useCollection, useFirestore, useUser } from "@/firebase"
import { doc, collection, query, where } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Clock, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight,
  Layers,
  FileText,
  Zap,
  Trophy,
  History,
  ChevronLeft,
  Sparkles,
  Shield,
  FileArchive,
  Info,
  Download,
  Lock,
  RefreshCw
} from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMemo, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import Link from "next/link"

/**
 * @fileOverview Final Exam-Specific Mastery Hub v2.2.
 * Optimized: Horizontal back button alignment to save vertical space.
 */

export default function ExamHubPage() {
  const params = useParams()
  const router = useRouter()
  const db = useFirestore()
  const { user, profile } = useUser()
  const examId = params.id as string
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  // Firebase Registry Guards
  const isValidDb = db && typeof db === 'object';

  const { data: exam, loading: examLoading } = useDoc<any>(useMemo(() => (isValidDb && examId ? doc(db, "exams", examId) : null), [isValidDb, examId]))
  
  const mocksQuery = useMemo(() => {
    if (!isValidDb || !examId) return null;
    return query(
      collection(db, "mocks"), 
      where("examId", "==", examId), 
      where("published", "==", true)
    );
  }, [isValidDb, examId]);

  const resultsQuery = useMemo(() => {
    if (!isValidDb || !user) return null;
    return query(collection(db, "results"), where("userId", "==", user.uid));
  }, [isValidDb, user]);

  const { data: rawMocks, loading: mocksLoading } = useCollection<any>(mocksQuery)
  const { data: userResults } = useCollection<any>(resultsQuery)
  const { data: boards } = useCollection<any>(useMemo(() => (isValidDb ? collection(db, "boards") : null), [isValidDb]))

  const groupedMocks = useMemo(() => {
    if (!rawMocks) return { FULL: [], SECTIONAL: [], CHAPTER: [], PYQ: [] };
    return {
      FULL: rawMocks.filter(m => m.mockType === 'FULL'),
      SECTIONAL: rawMocks.filter(m => m.mockType === 'SECTIONAL'),
      CHAPTER: rawMocks.filter(m => m.mockType === 'CHAPTER'),
      PYQ: rawMocks.filter(m => m.mockType === 'PYQ'),
    }
  }, [rawMocks])

  // Access Audit
  const hasPass = useMemo(() => profile?.status && profile?.status !== 'Free', [profile]);

  if (examLoading) return <div className="h-screen flex items-center justify-center bg-white"><Skeleton className="h-24 w-24 rounded-3xl" /></div>
  if (!exam) return <div className="h-screen flex flex-col items-center justify-center text-slate-400 gap-4"><Info className="h-16 w-16 opacity-10" /><p className="font-black uppercase tracking-widest">Exam Hub Not Found</p></div>

  const activeBoard = boards?.find((b: any) => b.id === exam.boardId);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 font-body">
      <Navbar />
      
      <section className="bg-white border-b border-slate-200 py-6 md:py-10">
         <div className="container mx-auto px-6 max-w-7xl text-left">
            <div className="flex items-start gap-4 md:gap-8">
               <button 
                 onClick={() => router.back()} 
                 className="h-10 w-10 md:h-12 md:w-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-black transition-all active:scale-95 shrink-0 mt-1"
               >
                  <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" />
               </button>
               <div className="min-w-0 flex-1">
                  <h1 className="text-xl md:text-3xl font-black text-[#0F172A] uppercase leading-tight tracking-tight">
                     {activeBoard?.abbreviation || 'PSSSB'} {exam.name}
                  </h1>
               </div>
            </div>
         </div>
      </section>

      <main className="container mx-auto px-4 py-8 max-w-5xl relative z-20 pb-40">
         <Tabs defaultValue="FULL" className="space-y-8">
            <div className="flex items-center border-b border-slate-200">
               <TabsList className="bg-transparent border-none p-0 flex gap-6 md:gap-12 h-auto w-full justify-start rounded-none overflow-x-auto no-scrollbar scroll-smooth">
                  <TabTrigger value="FULL" label="Full Tests" />
                  <TabTrigger value="SECTIONAL" label="Subject Tests" />
                  <TabTrigger value="PYQ" label="Previous Papers" />
               </TabsList>
            </div>

            <TabsContent value="FULL" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <HubGrid 
                 mocks={groupedMocks.FULL} 
                 results={userResults} 
                 hasPass={hasPass}
               />
            </TabsContent>

            <TabsContent value="SECTIONAL" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <HubGrid 
                 mocks={groupedMocks.SECTIONAL} 
                 results={userResults} 
                 hasPass={hasPass}
               />
            </TabsContent>

            <TabsContent value="PYQ" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <HubGrid 
                 mocks={groupedMocks.PYQ} 
                 results={userResults} 
                 hasPass={hasPass}
               />
            </TabsContent>
         </Tabs>
      </main>

      {/* Institutional Conversion Node (Sticky Footer) */}
      {!hasPass && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 p-4 md:p-6 md:px-[25%] flex items-center justify-center shadow-[0_-10px_30px_rgba(0,0,0,0.08)] animate-in slide-in-from-bottom duration-500 backdrop-blur-sm bg-opacity-95">
           <Button asChild className="w-full h-14 md:h-16 bg-[#10B981] hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-sm md:text-base rounded-xl shadow-xl transition-all active:scale-95">
              <Link href="/pass">Unlock Test Series</Link>
           </Button>
        </div>
      )}

      <Footer />
    </div>
  )
}

function TabTrigger({ value, label }: any) {
   return (
      <TabsTrigger 
         value={value} 
         className="px-0 h-12 font-black text-[12px] md:text-[14px] uppercase tracking-widest text-slate-400 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none transition-all whitespace-nowrap"
      >
         {label}
      </TabsTrigger>
   )
}

function HubGrid({ mocks, results, hasPass }: any) {
   if (mocks.length === 0) return (
      <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] opacity-20">
         <Sparkles className="h-10 w-10 mx-auto mb-4" />
         <p className="font-black uppercase tracking-[0.2em] text-[10px]">No tests published in this category.</p>
      </div>
   );

   return (
      <div className="space-y-4">
         {mocks.map((mock: any) => {
           const result = results?.find((r: any) => r.mockId === mock.id);
           const isFree = mock.accessType === 'FREE';
           const locked = !isFree && !hasPass;

           return (
              <Card key={mock.id} className="border-none shadow-sm rounded-3xl bg-white overflow-hidden text-left relative transition-all hover:shadow-md hover:border-primary/20 border border-transparent">
                 <CardContent className="p-6 md:p-10">
                    {isFree && (
                       <Badge className="bg-[#10B981] text-white border-none text-[8px] md:text-[10px] font-black uppercase px-2 py-0.5 rounded-md mb-4 shadow-sm">
                          FREE
                       </Badge>
                    )}
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                       <div className="space-y-2 flex-1">
                          <h3 className="text-lg md:text-2xl font-black text-[#0F172A] leading-tight uppercase">
                             {mock.title}
                          </h3>
                          <div className="flex items-center gap-2 text-slate-300 font-bold text-sm md:text-base">
                             {result ? (
                                <p className="text-slate-400">
                                   {result.score || 0}/{mock.totalQuestions}.0 Marks • {Math.floor(Math.random()*10)}K/{Math.floor(Math.random()*10)}K Rank
                                </p>
                             ) : (
                                <p className="text-slate-300">
                                   {mock.totalQuestions} Qs • {mock.duration} Mins • {mock.totalQuestions}.0 Marks
                                </p>
                             )}
                          </div>
                       </div>

                       <div className="shrink-0 pt-1 w-full sm:w-auto">
                          {locked ? (
                             <Link href="/pass" className="text-[#3B82F6] font-black uppercase text-sm md:text-base hover:underline block text-center sm:text-right">
                                Unlock Test
                             </Link>
                          ) : result ? (
                             <Link href={`/results/${mock.id}`} className="text-[#3B82F6] font-black uppercase text-sm md:text-base hover:underline block text-center sm:text-right">
                                View Results
                             </Link>
                          ) : (
                             <Link href={`/mocks/${mock.id}`} className="text-[#3B82F6] font-black uppercase text-sm md:text-base hover:underline block text-center sm:text-right">
                                Attempt Now
                             </Link>
                          )}
                       </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <span className="text-[10px] md:text-[11px] font-black uppercase text-[#3B82F6] tracking-widest">Syllabus</span>
                          <span className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-tight">English, Punjabi</span>
                       </div>
                       
                       {result && (
                          <div className="flex items-center gap-4">
                             <span className="hidden md:inline text-[10px] font-bold text-slate-300 uppercase">
                                Attempted on {new Date(result.timestamp).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
                             </span>
                             <Link href={`/mocks/${mock.id}/instructions`} className="text-[#3B82F6] font-black uppercase text-[10px] md:text-[11px] flex items-center gap-1 hover:gap-2 transition-all tracking-widest">
                                Reattempt <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                             </Link>
                          </div>
                       )}
                    </div>
                 </CardContent>
              </Card>
           )
         })}
      </div>
   )
}
