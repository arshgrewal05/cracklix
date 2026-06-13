'use client';

import React, { useMemo, useState, useEffect } from "react"
import { motion } from "framer-motion";
import { 
  ChevronRight, 
  Landmark, 
  BookOpen, 
  Zap, 
  Shield, 
  ShieldCheck, 
  GraduationCap, 
  Scale,
  Star,
  FileText,
  Newspaper,
  Info,
  Stethoscope,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Screenshot Matched Popular Hubs v40.0.
 * MATCHED: Clean white cards with left-aligned branding and dual stat footer.
 */

function getBoardIcon(id: string, abbrev: string) {
  const key = (abbrev || id || "").toLowerCase();
  if (key.includes('psssb')) return <img src="https://sssb.punjab.gov.in/wp-content/themes/ssbtheme/images/punjab-gov.svg" className="h-full w-full object-contain" />;
  if (key.includes('police')) return <img src="https://www.punjabpolice.gov.in/media/images/Logo_of_Punjab_Police_India.original.png" className="h-full w-full object-contain" />;
  if (key.includes('ppsc')) return <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR8W5eTBPdzztA7cziqnMmtWk9InL1yflUD_xb4vAsLw&s=10" className="h-full w-full object-contain" />;
  if (key.includes('teaching')) return <GraduationCap className="h-full w-full text-orange-500" />;
  if (key.includes('court')) return <Scale className="h-full w-full text-slate-600" />;
  if (key.includes('pspcl')) return <Zap className="h-full w-full text-blue-500" />;
  if (key.includes('bfuhs')) return <Stethoscope className="h-full w-full text-emerald-600" />;
  if (key.includes('banking')) return <Landmark className="h-full w-full text-[#0B1F3A]" />;
  return <Landmark className="h-full w-full text-slate-300" />;
}

export default function PopularExams() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const boardsQuery = useMemo(() => (db ? query(collection(db, "boards"), orderBy("displayOrder", "asc")) : null), [db]);
  const { data: boards, loading } = useCollection<any>(boardsQuery);
  const { data: allExams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]));
  const { data: mocks } = useCollection<any>(useMemo(() => (db ? collection(db, "mocks") : null), [db]));

  const filteredBoards = useMemo(() => {
    if (!boards || !mounted) return [];
    // Force specific boards from screenshot if they exist, or just take first 8
    return boards.slice(0, 8);
  }, [boards, mounted]);

  if (!mounted) return null;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
         
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 text-left">
            <div className="space-y-2">
               <h2 className="text-3xl md:text-4xl font-headline font-black text-[#0F172A] uppercase tracking-tight">Popular Exams</h2>
               <p className="text-slate-500 font-medium text-sm md:text-lg">Complete preparation for all major Punjab government exams</p>
            </div>
            <Link href="/exams" className="flex items-center gap-1.5 text-orange-500 font-bold uppercase text-[10px] md:text-sm hover:underline">
               View All Exams <ChevronRight className="h-4 w-4" />
            </Link>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {loading ? (
               Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)
            ) : filteredBoards.map((board) => {
               const examCount = allExams?.filter(e => e.boardId === board.id || e.boardId === board.abbreviation).length || 0;
               const mockCount = mocks?.filter(m => (m.boardIds && m.boardIds.includes(board.id)) || m.boardId === board.id).length || 0;
               
               return (
                  <Link key={board.id} href={`/exams/hub/${board.id}`}>
                     <Card className="border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-2xl md:rounded-[1.8rem] bg-white group p-6 text-left">
                        <div className="flex items-center gap-5">
                           <div className="h-16 w-16 md:h-18 md:w-18 rounded-xl bg-slate-50 flex items-center justify-center p-3 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                              {getBoardIcon(board.id, board.abbreviation)}
                           </div>
                           <div className="min-w-0">
                              <h3 className="text-lg md:text-xl font-black text-[#0F172A] uppercase leading-tight group-hover:text-primary transition-colors">{board.abbreviation}</h3>
                              <p className="text-[10px] font-bold text-slate-400 mt-1 truncate">{board.name}</p>
                           </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-slate-50 grid grid-cols-2 gap-4">
                           <div className="flex items-center gap-2">
                              <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                              <span className="text-[10px] font-bold text-slate-600 uppercase">{examCount} Exams</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <Zap className="h-3.5 w-3.5 text-orange-500" />
                              <span className="text-[10px] font-bold text-slate-600 uppercase">{mockCount} Mocks</span>
                           </div>
                        </div>
                     </Card>
                  </Link>
               )
            })}
         </div>
      </div>
    </section>
  );
}

