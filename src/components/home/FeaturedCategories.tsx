"use client"

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Landmark, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

/**
 * @fileOverview Canonical 7-Category Discovery Hub v40.0.
 * FIXED: Strictly displays only the 7 new rebuild categories.
 */

export default function FeaturedCategories() {
  const db = useFirestore();
  const catQuery = useMemo(() => (db ? query(collection(db, "categories"), orderBy("displayOrder", "asc")) : null), [db]);
  const { data: categories, loading: catLoading } = useCollection<any>(catQuery);
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]));

  // Strictly filter for the 7 rebuild categories
  const canonicalIds = [
    "punjab-government-exams",
    "punjab-teaching-exams",
    "punjab-technical-exams",
    "banking-exams",
    "medical-health-exams",
    "judiciary-exams",
    "central-government-exams"
  ];

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    return categories.filter(c => canonicalIds.includes(c.id));
  }, [categories]);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-7xl space-y-10 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
             <div className="flex items-center gap-3">
                <Landmark className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold text-slate-400 tracking-tight uppercase">Discovery Hub</span>
             </div>
             <h2 className="text-3xl md:text-5xl font-black text-[#0F172A] leading-tight tracking-tight">Choose Your Exam</h2>
          </div>
          <Button asChild variant="ghost" className="text-primary font-black uppercase text-[10px] tracking-widest gap-2 p-0 h-auto hover:bg-transparent">
             <Link href="/exams">All Categories <ArrowRight className="h-3.5 w-3.5" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {catLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-56 w-full rounded-[2.5rem] bg-slate-50" />)
          ) : filteredCategories.map((cat, idx) => {
            const examCount = exams?.filter(e => e.categoryId === cat.id).length || 0;
            return (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}>
                 <Link href={`/exams/category/${cat.id}`}>
                    <Card className="border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] bg-white group overflow-hidden flex flex-col p-8 min-h-[260px]">
                       <div className="flex justify-between items-start mb-6">
                          <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner text-primary shrink-0 transition-transform group-hover:scale-110">
                             <ShieldCheck className="h-6 w-6" />
                          </div>
                          <Badge className="bg-primary/5 text-primary border-none text-[8px] font-black uppercase px-2.5 py-1 rounded-lg">
                             {cat.highlight || "REBUILD"}
                          </Badge>
                       </div>
                       
                       <div className="space-y-2 flex-1">
                          <h3 className="text-xl font-black text-[#0F172A] group-hover:text-primary transition-colors leading-tight">{cat.title}</h3>
                          <p className="text-[13px] text-slate-500 font-medium leading-relaxed line-clamp-2">{cat.description}</p>
                       </div>

                       <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black text-[#0F172A] uppercase leading-none">{examCount}</span>
                             <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Exams</span>
                          </div>
                          <Button variant="ghost" className="h-10 px-6 rounded-xl bg-[#0F172A] text-white group-hover:bg-primary transition-all font-bold text-[10px] tracking-widest uppercase border-none shadow-md">
                             View Exams <ArrowRight className="ml-2 h-3.5 w-3.5" />
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
