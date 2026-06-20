"use client"

import { useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, where } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Landmark, GraduationCap, ShieldCheck, Zap, Globe, Wallet, Info, Shield, Landmark as LandmarkIcon } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Institutional Category Explorer v12.0 (Responsive Fix).
 * FIXED: Applied responsive typography scale with leading-[0.9].
 */

const ACRONYMS = ["PSSSB", "PPSC", "PUNJAB POLICE", "PSPCL", "PSTCL", "PSTET", "CTET", "MCQ", "MCQS", "PYQ", "PYQS", "GK", "CA"];

function toTitleCase(str: string) {
  if (!str) return "";
  return str.split(' ').map(word => {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (ACRONYMS.includes(cleanWord)) return cleanWord;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
}

const CATEGORY_META: Record<string, any> = {
  "punjab-govt": { title: "Punjab General Exams", icon: <img src="https://sssb.punjab.gov.in/wp-content/themes/ssbtheme/images/punjab-gov.svg" className="h-full w-full object-contain" /> },
  "punjab-teaching": { title: "Punjab Teaching Exams", icon: <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbNnoge6pNWx1HZYrUJKM58qWk1dDw85xvKPBoG-O4ew&s=10" className="h-full w-full object-contain" /> },
  "punjab-technical": { title: "Punjab Technical Exams", icon: <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0ZK9JI5KMfg9RoNdIwcsNlpx5IcPBWuKZw&s" className="h-full w-full object-contain" /> },
  "banking": { title: "Punjab Banking Exams", icon: <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7McWqZqOgKy-BakccvR02WQdEQFrwuvmHBG5rYJzuEg&s=10" className="h-full w-full object-contain" /> },
  "central-govt": { title: "Central Govt Exams", icon: <img src="https://alchetron.com/cdn/government-of-india-973b74d1-e25f-41f2-ba2b-51595702248-resize-750.jpeg" className="h-full w-full object-contain" /> }
};

export default function CategoryHubsPage() {
  const params = useParams();
  const router = useRouter();
  const db = useFirestore();
  const catId = params.id as string;
  const meta = CATEGORY_META[catId] || { title: "Exam List", icon: <Landmark className="h-full w-full" /> };

  const boardsQuery = useMemo(() => (db ? collection(db, "boards") : null), [db]);
  const examsQuery = useMemo(() => (db ? collection(db, "exams") : null), [db]);

  const { data: boards, loading: boardsLoading } = useCollection<any>(boardsQuery);
  const { data: allExams } = useCollection<any>(examsQuery);

  const categoryHubs = useMemo(() => {
     if (!boards) return [];
     const hubMap = new Map();
     boards.forEach((b: any) => {
        if (b.categoryId === catId) {
           const abbrev = (b.abbreviation || "").toUpperCase();
           const key = b.id || abbrev;
           if (!hubMap.has(key)) hubMap.set(key, b);
        }
     });
     return Array.from(hubMap.values()).sort((a, b) => (a.abbreviation || "").localeCompare(b.abbreviation || ""));
  }, [boards, catId]);

  return (
    <div className="min-h-screen bg-slate-50/50 font-body">
      <Navbar />
      
      <section className="bg-white border-b border-slate-100 py-10 md:py-20 text-left relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-[0.02]"><Landmark className="h-48 w-48" /></div>
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
            <div className="flex items-center gap-6 mb-8 md:mb-12">
               <button onClick={() => router.back()} className="h-10 w-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-black transition-all">
                  <ChevronLeft className="h-5 w-5" />
               </button>
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                     <div className="h-full w-full flex items-center justify-center overflow-hidden rounded-md">
                        {meta.icon}
                     </div>
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-slate-500 tracking-tight">Registry Nodes</span>
               </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#0F172A] leading-[0.9] tracking-tight break-words antialiased">
                {toTitleCase(meta.title)}
              </h1>
              <p className="text-sm md:text-2xl font-bold text-slate-400 tracking-tight max-w-3xl">
                Official recruitment centers for the {toTitleCase(meta.title)} category.
              </p>
            </div>
         </div>
      </section>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 lg:py-24 max-w-7xl">
         {boardsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
               {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-[2.5rem]" />)}
            </div>
         ) : categoryHubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
               {categoryHubs.map((hub) => {
                  const examCount = (allExams || []).filter((e: any) => 
                     e.boardId?.toLowerCase() === hub.id?.toLowerCase() ||
                     e.boardId?.toLowerCase() === hub.abbreviation?.toLowerCase()
                  ).length;

                  const id = hub.id?.toLowerCase();
                  const abbrev = hub.abbreviation?.toLowerCase();
                  const isPolice = id.includes('police') || abbrev === 'police';
                  
                  return (
                    <Link key={hub.id} href={`/exams/hub/${hub.id}`}>
                       <Card className="border-none shadow-xl hover:shadow-4xl transition-all duration-500 rounded-[2rem] md:rounded-[2.5rem] bg-white group overflow-hidden h-full flex flex-col border border-slate-100 p-6 md:p-8 text-left min-h-[180px] md:min-h-[260px]">
                          <div className="flex justify-between items-start mb-6 md:mb-8">
                             <div className="h-14 w-14 md:h-16 md:w-16 rounded-[1.2rem] bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                                {hub.iconUrl ? (
                                   <img src={hub.iconUrl} className="h-full w-full object-contain p-2" alt="Hub Logo" referrerPolicy="no-referrer" />
                                ) : (
                                   <div className="text-primary opacity-40 p-4">
                                      {isPolice ? <Shield className="h-full w-full" /> : 
                                       <LandmarkIcon className="h-full w-full" />}
                                   </div>
                                )}
                             </div>
                             <Badge variant="outline" className="text-[8px] font-bold text-slate-400 tracking-tight border-slate-100 uppercase">OFFICIAL CENTER</Badge>
                          </div>
                          
                          <div className="space-y-2 flex-1 min-w-0">
                             <h3 className="text-lg md:text-xl font-bold text-[#0F172A] tracking-tight group-hover:text-primary transition-colors truncate">{hub.abbreviation} Exams</h3>
                             <p className="text-[10px] md:text-sm font-semibold text-slate-400 leading-snug line-clamp-2 min-h-[25px]">{toTitleCase(hub.name)}</p>
                          </div>

                          <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-50 flex items-center justify-between">
                             <div className="space-y-0.5">
                                <p className="text-sm font-bold text-[#0F172A]">{examCount}</p>
                                <p className="text-[8px] font-bold text-slate-400 tracking-tight uppercase">EXAMS LISTED</p>
                             </div>
                             <Button variant="ghost" className="h-9 md:h-10 px-4 md:px-6 rounded-xl bg-slate-900 text-white flex items-center gap-2 font-bold text-xs tracking-tight group-hover:bg-primary transition-all border-none">
                                View <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                             </Button>
                          </div>
                       </Card>
                    </Link>
                  )
               })}
            </div>
         ) : (
            <div className="py-40 text-center opacity-20 flex flex-col items-center">
               <Info className="h-20 w-20 mb-6" />
               <p className="font-headline font-black text-2xl uppercase tracking-widest">Awaiting Exams Deployment</p>
            </div>
         )}
      </main>
      <Footer />
    </div>
  )
}
