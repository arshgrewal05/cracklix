"use client"

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, BookOpen, Layers } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthorityLogo } from '@/lib/exam-icons';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Institutional Category Discovery v112.0.
 * UPDATED: Real-time data aggregation for Exams, Mocks, and PYQs.
 * NO HARDCODED STATS: All numbers are derived from live database records.
 * UI FIX: Removed uppercase from headings and titles.
 */

const STRICT_WHITELIST = [
  "punjab-government-exams",
  "punjab-teaching-exams",
  "punjab-technical-exams",
  "banking-exams",
  "punjab-health-exams",
  "judiciary-exams",
  "high-court-exams"
];

export default function FeaturedCategories() {
  const db = useFirestore();
  
  // REAL DATA FETCHING
  const { data: rawCategories, loading: catLoading } = useCollection<any>(useMemo(() => (db ? query(collection(db, "categories"), orderBy("displayOrder", "asc")) : null), [db]));
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]));
  const { data: mocks } = useCollection<any>(useMemo(() => (db ? collection(db, "mocks") : null), [db]));
  const { data: pyqs } = useCollection<any>(useMemo(() => (db ? collection(db, "pyqs") : null), [db]));
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]));

  const categories = useMemo(() => {
     if (!rawCategories) return [];
     return rawCategories.filter(c => STRICT_WHITELIST.includes(c.id));
  }, [rawCategories]);

  return (
    <section className="py-16 bg-white border-t border-slate-50">
      <div className="container mx-auto px-4 max-w-7xl space-y-12 text-left">
        <div className="space-y-2 px-2">
           <h2 className="text-3xl md:text-5xl font-black text-[#0F172A] leading-tight tracking-tight">Choose Your Category</h2>
           <p className="text-slate-500 font-medium text-sm md:text-lg">Select a recruitment vertical to browse verified boards and mock tests.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {catLoading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-[2.5rem] bg-slate-50" />)
          ) : categories.map((cat, idx) => {
            // DYNAMIC STATISTICS CALCULATION
            const catExams = exams?.filter(e => e.categoryId === cat.id) || [];
            const catExamIds = catExams.map(e => e.id);
            
            const catMocksCount = mocks?.filter(m => 
              catExamIds.includes(m.examId) || 
              (m.examIds && m.examIds.some(id => catExamIds.includes(id)))
            ).length || 0;
            
            const catPyqsCount = pyqs?.filter(p => catExamIds.includes(p.examId)).length || 0;
            const catBoards = boards?.filter(b => b.categoryId === cat.id) || [];

            return (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}>
                 <Link href={`/exams/category/${cat.id}`}>
                    <Card className="border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] bg-white group overflow-hidden flex flex-col p-8 md:p-10 h-full relative">
                       <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                          <AuthorityLogo category={cat} size="xl" />
                       </div>
                       
                       <div className="mb-8 flex justify-start">
                          <AuthorityLogo category={cat} size="lg" className="bg-slate-50 rounded-2xl shadow-inner group-hover:scale-105 transition-transform shadow-inner" />
                       </div>
                       
                       <div className="space-y-4 flex-1">
                          <h3 className="text-2xl md:text-3xl font-black text-[#0F172A] group-hover:text-primary transition-colors leading-tight">{cat.title}</h3>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">{cat.description}</p>
                          
                          {/* REAL-TIME STATS GRID */}
                          <div className="grid grid-cols-2 gap-3 pt-4">
                             {catExams.length > 0 && <StatChip label="Exams" val={catExams.length} icon={BookOpen} />}
                             {catMocksCount > 0 && <StatChip label="Mock Tests" val={catMocksCount} icon={Zap} />}
                             {catPyqsCount > 0 && <StatChip label="PYQ Papers" val={catPyqsCount} icon={Layers} />}
                          </div>

                          {/* DYNAMIC BOARD DISCOVERY */}
                          {catBoards.length > 0 && (
                             <div className="pt-6 space-y-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Boards</p>
                                <div className="flex flex-wrap gap-2">
                                   {catBoards.slice(0, 3).map(b => (
                                      <Badge key={b.id} variant="outline" className="bg-slate-50 border-slate-100 text-slate-500 text-[9px] font-black uppercase px-2 py-0.5 rounded-lg">{b.abbreviation}</Badge>
                                   ))}
                                   {catBoards.length > 3 && <span className="text-[9px] font-bold text-slate-300">+{catBoards.length - 3} More</span>}
                                </div>
                             </div>
                          )}
                       </div>

                       <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between">
                          <Button variant="ghost" className="w-full h-14 rounded-2xl bg-[#0F172A] text-white group-hover:bg-primary transition-all font-black text-xs tracking-widest uppercase border-none shadow-xl gap-3 active:scale-95">
                             Open Selection <ArrowRight className="h-4 w-4" />
                          </Button>
                       </div>
                    </Card>
                 </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
}

function StatChip({ label, val, icon: Icon }: any) {
   return (
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col gap-1 items-start">
         <Icon className="h-3.5 w-3.5 text-primary" />
         <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-[#0F172A] tabular-nums">{val}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase truncate">{label}</span>
         </div>
      </div>
   )
}
