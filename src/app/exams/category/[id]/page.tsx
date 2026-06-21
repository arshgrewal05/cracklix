"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, where } from "firebase/firestore"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Landmark, GraduationCap, Info, Zap } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Canonical Explorer v20.0.
 * UPDATED: Strictly implements Title Case and content-only visibility.
 */

export default function CategoryHubsPage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const catId = params.id as string;

  const { data: categories } = useCollection<any>(useMemo(() => (db ? collection(db, "categories") : null), [db]));
  const category = categories?.find(c => c.id === catId);

  const boardsQuery = useMemo(() => (db ? query(collection(db, "boards"), where("categoryId", "==", catId)) : null), [db, catId]);
  const examsQuery = useMemo(() => (db ? query(collection(db, "exams"), where("categoryId", "==", catId)) : null), [db, catId]);

  const { data: boards, loading: boardsLoading } = useCollection<any>(boardsQuery);
  const { data: exams, loading: examsLoading } = useCollection<any>(examsQuery);
  const { data: mocks } = useCollection<any>(useMemo(() => (db ? collection(db, "mocks") : null), [db]));
  const { data: pyqs } = useCollection<any>(useMemo(() => (db ? collection(db, "pyqs") : null), [db]));

  const statsMap = useMemo(() => {
    const map: Record<string, any> = {};
    (mocks || []).forEach(m => {
      const eids = m.examIds || (m.examId ? [m.examId] : []);
      eids.forEach((eid: string) => {
        if (!map[eid]) map[eid] = { full: 0, subject: 0, sectional: 0, pyq: 0, total: 0 };
        if (m.mockType === 'FULL') map[eid].full++;
        else if (m.mockType === 'SUBJECT') map[eid].subject++;
        else if (m.mockType === 'SECTIONAL') map[eid].sectional++;
        map[eid].total++;
      });
    });
    (pyqs || []).forEach(p => {
       if (p.examId) {
          if (!map[p.examId]) map[p.examId] = { full: 0, subject: 0, sectional: 0, pyq: 0, total: 0 };
          map[p.examId].pyq++;
          map[p.examId].total++;
       }
    });
    return map;
  }, [mocks, pyqs]);

  const hasBoards = boards && boards.length > 0;

  return (
    <div className="min-h-screen bg-slate-50/50 font-body text-left">
      <Navbar />
      
      <section className="bg-white border-b border-slate-100 py-8 md:py-12 relative overflow-hidden">
         <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <button onClick={() => router.back()} className="h-9 w-9 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-black mb-6 transition-all">
               <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="space-y-2">
               <Badge className="bg-primary/5 text-primary border-none px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase">Category Explorer</Badge>
               <h1 className="text-2xl md:text-5xl font-black text-[#0F172A] leading-tight tracking-tight">
                  {category?.title || "Exam Category"}
               </h1>
               <p className="text-sm md:text-xl font-bold text-slate-400 tracking-tight max-w-3xl leading-tight">
                  {category?.description || "Select a vertical to start preparation."}
               </p>
            </div>
         </div>
      </section>

      <main className="container mx-auto px-4 py-12 max-w-7xl">
         {hasBoards ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {boardsLoading ? <SkeletonGrid /> : boards.map(board => (
                  <Link key={board.id} href={`/exams/hub/${board.id}`}>
                     <Card className="border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] bg-white group p-8 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-8">
                           <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                              <Landmark className="h-6 w-6 text-primary" />
                           </div>
                           <Badge variant="outline" className="text-[8px] font-black text-slate-400 border-slate-100 uppercase">{board.abbreviation}</Badge>
                        </div>
                        <h3 className="text-2xl font-black text-[#0F172A] group-hover:text-primary transition-colors mb-2">{board.abbreviation} Exams</h3>
                        <p className="text-sm font-bold text-slate-400 leading-snug line-clamp-2 mb-8">{board.name}</p>
                        <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                           <span className="text-[10px] font-black uppercase tracking-widest text-primary">View Exams</span>
                           <ChevronRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                        </div>
                     </Card>
                  </Link>
               ))}
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {examsLoading ? <SkeletonGrid /> : exams.filter(e => (statsMap[e.id]?.total || 0) > 0).map(exam => {
                  const s = statsMap[exam.id] || { full: 0, subject: 0, sectional: 0, pyq: 0, total: 0 };
                  return (
                    <Card key={exam.id} onClick={() => router.push(`/exams/${exam.id}`)} className="border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] bg-white group p-8 flex flex-col h-full cursor-pointer">
                       <h3 className="text-xl font-black text-[#0F172A] leading-tight group-hover:text-primary transition-colors mb-4">{exam.name}</h3>
                       <div className="space-y-3 mb-8">
                          <p className="text-xs font-black text-[#0F172A] leading-none uppercase">{s.total} Content Items</p>
                          <p className="text-[10px] font-bold text-slate-400 leading-relaxed">
                             {s.full} Full Mocks • {s.subject} Subject • {s.sectional} Sectional • {s.pyq} PYQs
                          </p>
                       </div>
                       <Button className="mt-auto w-full h-11 rounded-xl bg-[#0F172A] hover:bg-primary text-white font-black uppercase text-[10px] tracking-widest gap-2 shadow-md border-none">Open Exam <ChevronRight className="h-3.5 w-3.5" /></Button>
                    </Card>
                  )
               })}
            </div>
         )}

         {(!boardsLoading && !examsLoading && boards?.length === 0 && exams?.length === 0) && (
            <div className="py-40 text-center opacity-20 flex flex-col items-center">
               <Info className="h-20 w-20 mb-6" />
               <p className="font-headline font-black text-2xl uppercase tracking-widest">Awaiting Verification</p>
            </div>
         )}
      </main>
      <Footer />
    </div>
  )
}

function SkeletonGrid() {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
         {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 w-full rounded-[2.5rem]" />)}
      </div>
   )
}
