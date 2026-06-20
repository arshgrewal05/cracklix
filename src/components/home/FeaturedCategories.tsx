"use client"

import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Landmark, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * @fileOverview Elite Exam Categories Hub v19.0.
 * TYPOGRAPHY: Removed uppercase from headings and card titles.
 */

const CATEGORY_META = [
  {
    id: "punjab-govt",
    title: "Punjab General Exams",
    desc: "Police • PSSSB • PPSC • Revenue",
    icon: "https://sssb.punjab.gov.in/wp-content/themes/ssbtheme/images/punjab-gov.svg",
    color: "text-primary",
    bgColor: "bg-orange-50"
  },
  {
    id: "punjab-teaching",
    title: "Punjab Teaching Exams",
    desc: "PSTET • CTET • Master Cadre • ETT",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbNnoge6pNWx1HZYrUJKM58qWk1dDw85xvKPBoG-O4ew&s=10",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    id: "punjab-technical",
    title: "Punjab Technical Exams",
    desc: "PSPCL • PSTCL • ALM • Technical Assistant",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0ZK9JI5KMfg9RoNdIwcsNlpx5IcPBWuKZw&s",
    color: "text-amber-500",
    bgColor: "bg-amber-50"
  },
  {
    id: "banking",
    title: "Punjab Banking Exams",
    desc: "Cooperative • Apex • PADB • State Banks",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7McWqZqOgKy-BakccvR02WQdEQFrwuvmHBG5rYJzuEg&s=10",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50"
  },
  {
    id: "central-govt",
    title: "Central Govt Exams",
    desc: "SSC • Railways • Army • National",
    icon: "https://alchetron.com/cdn/government-of-india-973b74d1-e25f-41f2-ba2b-51595702248-resize-750.jpeg",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50"
  }
];

export default function FeaturedCategories() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const examsQuery = useMemo(() => (db ? collection(db, "exams") : null), [db]);
  const { data: exams, loading } = useCollection<any>(examsQuery);

  if (!mounted) return null;

  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl space-y-12 text-left">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
             <div className="flex items-center gap-3">
                <Landmark className="h-5 w-5 text-primary" />
                <span className="text-[11px] font-bold text-slate-500 tracking-tight">Vertical Library</span>
             </div>
             <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight text-[#0F172A] leading-[1.05] break-words">
                Choose Your <span className="text-primary">Exam Category</span>
             </h2>
             <p className="text-slate-500 font-medium text-sm md:text-lg">Select a vertical to browse official preparation centers.</p>
          </div>
          <Button asChild variant="ghost" className="text-primary font-bold text-sm tracking-tight gap-2">
             <Link href="/exams">Full Category List <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {CATEGORY_META.map((cat, idx) => {
            const count = (exams || []).filter((e: any) => e.categoryId === cat.id).length;
            return (
              <motion.div 
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                 <Link href={`/exams/category/${cat.id}`}>
                    <Card className="border border-[#E5E7EB] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:translate-y-[-8px] transition-all duration-500 rounded-[2rem] md:rounded-[2.5rem] bg-white group overflow-hidden h-[260px] md:h-[320px] flex flex-col p-6 md:p-8 relative">
                       <div className={cn("h-14 w-14 md:h-16 md:w-16 rounded-[1.2rem] flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-110 relative shrink-0", cat.bgColor, cat.color)}>
                          <div className="h-full w-full flex items-center justify-center overflow-hidden rounded-xl relative p-2.5">
                            <Image 
                              src={cat.icon} 
                              alt={cat.title}
                              fill
                              sizes="120px"
                              className="object-contain p-2"
                            />
                          </div>
                       </div>
                       
                       <div className="space-y-1 flex-1 min-w-0">
                          <h3 className="text-lg md:text-xl font-bold text-[#0F172A] leading-tight group-hover:text-primary transition-colors line-clamp-2">{cat.title}</h3>
                          <p className="text-[10px] md:text-xs font-semibold text-slate-400 tracking-tight leading-snug line-clamp-2">{cat.desc}</p>
                       </div>

                       <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 tracking-tight">{count} Exams Live</span>
                          <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-slate-300 shadow-sm border border-slate-100">
                             <ChevronRight className="h-4 w-4" />
                          </div>
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