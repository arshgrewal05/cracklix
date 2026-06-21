"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, where } from "firebase/firestore"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Zap, Landmark, GraduationCap, Building2, Globe, ShieldCheck, Scale } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Hierarchical Category Hub v48.0.
 * FLOW: Category -> Board Selection Hub or Exam Vertical List.
 */

const CATEGORY_ICONS: Record<string, any> = {
  "punjab-government-exams": <Landmark className="h-8 w-8" />,
  "punjab-teaching-exams": <GraduationCap className="h-8 w-8" />,
  "punjab-technical-exams": <Zap className="h-8 w-8" />,
  "banking-exams": <Building2 className="h-8 w-8" />,
  "judiciary-exams": <Scale className="h-8 w-8" />,
  "central-government-exams": <Globe className="h-8 w-8" />
};

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
  const { data: rawExams, loading: examsLoading } = useCollection<any>(examsQuery);
  
  const { data: mocks } = useCollection<any>(useMemo(() => (db ? collection(db, "mocks") : null), [db]));
  const { data: pyqs } = useCollection<any>(useMemo(() => (db ? collection(db, "pyqs") : null), [db]));

  const statsMap = useMemo(() => {
    const map: Record<string, any> = {};
    (mocks || []).forEach(m => {
      const eids = m.examIds || (m.examId ? [m.examId] : []);
      eids.forEach((eid: string) => {
        if (!map[eid]) map[eid] = { total: 0 };
        map[eid].total++;
      });
    });
    (pyqs || []).forEach(p => {
       if (p.examId) {
          if (!map[p.examId]) map[p.examId] = { total: 0 };
          map[p.examId].total++;
       }
    });
    return map;
  }, [mocks, pyqs]);

  // CONTENT GUARD: Only show exams with 1+ content items
  const activeExams = useMemo(() => {
     if (!rawExams) return [];
     return rawExams.filter(e => (statsMap[e.id]?.total || 0) > 0);
  }, [rawExams, statsMap]);

  const hasBoards = boards && boards.length > 0;

  return (
    <div className="min-h-screen bg-slate-50/50 font-body text-left">
      <Navbar />
      
      <section className="bg-white border-b border-slate-100 py-12 md:py-20 relative overflow-hidden">
         <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <button onClick={() => router.back()} className="h-10 w-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-black mb-8 transition-all">
               <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-6">
               <div className="h-16 w-16 md:h-20 md:w-20 rounded-[2rem] bg-primary/5 text-primary flex items-center justify-center shrink-0 shadow-inner">
                  {CATEGORY_ICONS[catId] || <ShieldCheck className="h-8 w-8" />}
               </div>
               <div className="space-y-1">
                  <h1 className="text-3xl md:text-5xl font-black text-[#0F172A] leading-tight tracking-tight">
                     {category?.title || "Exam Selection"}
                  </h1>
                  <p className="text-sm md:text-xl font-bold text-slate-400 tracking-tight max-w-3xl">
                     {category?.description || "Select a board or exam vertical to view preparation materials."}
                  </p>
               </div>
            </div>
         </div>
      </section>

      <main className="container mx-auto px-4 py-16 max-w-7xl">
         {hasBoards ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {boards.map((board) => (
                  <Card key={board.id} onClick={() => router.push(`/exams/hub/${board.id}`)} className="border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] bg-white group overflow-hidden flex flex-col p-10 text-left cursor-pointer h-full">
                     <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 text-primary shadow-inner transition-transform group-hover:scale-110">
                        <Landmark className="h-8 w-8" />
                     </div>
                     <h3 className="text-2xl font-black text-[#0F172A] group-hover:text-primary transition-colors leading-tight mb-4">{board.abbreviation} Hub</h3>
                     <p className="text-sm text-slate-500 font-medium mb-10 flex-1 leading-relaxed">{board.name}</p>
                     <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Board Authority</span>
                        <Button variant="ghost" className="h-11 px-8 rounded-xl bg-[#0F172A] text-white group-hover:bg-primary transition-all font-bold text-[11px] tracking-widest uppercase border-none shadow-md gap-2">
                           View Exams <ChevronRight className="h-4 w-4" />
                        </Button>
                     </div>
                  </Card>
               ))}
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {activeExams.map((exam) => (
                  <Card key={exam.id} onClick={() => router.push(`/exams/${exam.id}`)} className="border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] bg-white group overflow-hidden h-full flex flex-col p-10 text-left cursor-pointer">
                     <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 text-primary shadow-inner">
                        <GraduationCap className="h-8 w-8" />
                     </div>
                     <h3 className="text-2xl font-black text-[#0F172A] group-hover:text-primary transition-colors leading-tight mb-6">{exam.name}</h3>
                     <div className="mt-auto space-y-8">
                        <Button className="w-full h-12 rounded-xl bg-[#0F172A] text-white group-hover:bg-primary transition-all font-bold text-[11px] tracking-widest uppercase border-none shadow-md gap-2">
                           View Exams <ChevronRight className="h-4 w-4" />
                        </Button>
                     </div>
                  </Card>
               ))}
            </div>
         )}
      </main>
      <Footer />
    </div>
  )
}
