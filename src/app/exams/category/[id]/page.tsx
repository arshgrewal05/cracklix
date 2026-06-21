"use client"

import { useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, where } from "firebase/firestore"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { AuthorityLogo } from "@/lib/exam-icons"

/**
 * @fileOverview Hierarchical Category Hub v52.0.
 * UI FIX: Enlarged logos by removing padding and using XL sizes.
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

  const { data: boards } = useCollection<any>(boardsQuery);
  const { data: rawExams } = useCollection<any>(examsQuery);
  
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
            <div className="flex items-center gap-8">
               <AuthorityLogo category={category} size="xl" className="bg-slate-50 rounded-[2.5rem]" />
               <div className="space-y-1">
                  <h1 className="text-3xl md:text-5xl font-black text-[#0F172A] leading-tight tracking-tight">
                     {category?.title || "Exam Selection"}
                  </h1>
                  <p className="text-sm md:text-xl font-bold text-slate-400 tracking-tight max-w-3xl">
                     {category?.description || "Select a board or authority to view specific exams."}
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
                     <AuthorityLogo board={board} category={category} size="lg" className="bg-slate-50 rounded-2xl mb-8 group-hover:scale-110 transition-transform" />
                     <h3 className="text-2xl font-black text-[#0F172A] group-hover:text-primary transition-colors leading-tight mb-4">{board.abbreviation}</h3>
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
                     <AuthorityLogo category={category} size="lg" className="bg-slate-50 rounded-2xl mb-8" />
                     <h3 className="text-2xl font-black text-[#0F172A] group-hover:text-primary transition-colors leading-tight mb-6">{exam.name}</h3>
                     <div className="mt-auto space-y-8">
                        <Button className="w-full h-12 rounded-xl bg-[#0F172A] text-white group-hover:bg-primary transition-all font-bold text-[11px] tracking-widest uppercase border-none shadow-md gap-2">
                           Open Exam <ChevronRight className="h-4 w-4" />
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