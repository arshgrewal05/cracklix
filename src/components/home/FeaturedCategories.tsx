"use client"

import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Landmark, 
  ChevronRight,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * @fileOverview Elite Exam Categories Hub v27.1.
 * UPDATED: Simplified category language.
 */

const FALLBACK_ICONS: Record<string, string> = {
  "punjab-govt": "https://sssb.punjab.gov.in/wp-content/themes/ssbtheme/images/punjab-gov.svg",
  "punjab-teaching": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbNnoge6pNWx1HZYrUJKM58qWk1dDw85xvKPBoG-O4ew&s=10",
  "punjab-technical": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0ZK9JI5KMfg9RoNdIwcsNlpx5IcPBWuKZw&s",
  "banking": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7McWqZqOgKy-BakccvR02WQdEQFrwuvmHBG5rYJzuEg&s=10",
  "central-govt": "https://alchetron.com/cdn/government-of-india-973b74d1-e25f-41f2-ba2b-51595702248-resize-750.jpeg"
};

export default function FeaturedCategories() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const catQuery = useMemo(() => (db ? query(collection(db, "categories"), orderBy("displayOrder", "asc")) : null), [db]);
  const examsQuery = useMemo(() => (db ? collection(db, "exams") : null), [db]);

  const { data: categories, loading: catLoading } = useCollection<any>(catQuery);
  const { data: exams, loading: examsLoading } = useCollection<any>(examsQuery);

  if (!mounted) return null;

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 max-w-7xl space-y-8 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2 max-w-3xl">
             <div className="flex items-center gap-3">
                <Landmark className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                <span className="text-[10px] md:text-[11px] font-bold text-slate-400 tracking-tight uppercase">Exam Categories</span>
             </div>
             <h2 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-black tracking-tight text-[#0F172A] leading-[1.1]">
                Choose Your <span className="text-primary">Exam Category</span>
             </h2>
             <p className="text-slate-600 font-medium text-sm md:text-base">Select a category to start your official preparation.</p>
          </div>
          <Button asChild variant="ghost" className="text-primary font-bold text-xs tracking-tight gap-2 p-0 h-auto hover:bg-transparent">
             <Link href="/exams">All Categories <ArrowRight className="h-3.5 w-3.5" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {catLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)
          ) : categories && categories.length > 0 ? (
            categories.map((cat, idx) => {
              const count = (exams || []).filter((e: any) => e.categoryId === cat.id).length;
              const iconUrl = cat.iconUrl || FALLBACK_ICONS[cat.id] || "";
              
              return (
                <motion.div 
                  key={cat.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                   <Link href={`/exams/category/${cat.id}`}>
                      <Card className="border border-[#E5E7EB] shadow-sm hover:shadow-xl transition-all duration-500 rounded-[1.5rem] md:rounded-[2rem] bg-white group overflow-hidden min-h-[260px] md:min-h-[320px] flex flex-col p-5 md:p-7 relative">
                         <div className={cn("h-11 w-11 md:h-14 md:w-14 rounded-xl md:rounded-[1.25rem] flex items-center justify-center mb-5 shadow-inner transition-transform group-hover:scale-110 relative shrink-0 bg-slate-50 text-slate-300")}>
                            <div className="h-full w-full flex items-center justify-center overflow-hidden rounded-xl relative p-1.5">
                              {iconUrl ? (
                                <Image 
                                  src={iconUrl} 
                                  alt={cat.title}
                                  fill
                                  sizes="64px"
                                  className="object-contain p-1"
                                />
                              ) : (
                                <ShieldCheck className="h-5 w-5 md:h-7 md:w-7 text-primary" />
                              )}
                            </div>
                         </div>
                         
                         <div className="space-y-2 flex-1 min-w-0">
                            <h3 className="text-lg md:text-[22px] font-black leading-tight text-[#0F172A] group-hover:text-primary transition-colors line-clamp-2">
                              {cat.title}
                            </h3>
                            <p className="text-[13px] md:text-sm text-slate-600 tracking-tight leading-snug line-clamp-3">
                              {cat.description}
                            </p>
                         </div>

                         <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-[10px] md:text-[11px] font-bold text-slate-400 tracking-tight uppercase">{count} Exams Live</span>
                            <div className="h-7 w-7 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-slate-300 shadow-sm border border-slate-100">
                               <ChevronRight className="h-3.5 w-3.5" />
                            </div>
                         </div>
                      </Card>
                   </Link>
                </motion.div>
              )
            })
          ) : (
            <div className="col-span-full py-16 text-center opacity-20 italic text-sm">Awaiting Categories...</div>
          )}
        </div>
      </div>
    </section>
  );
}
