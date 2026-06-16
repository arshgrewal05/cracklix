'use client';

import React, { useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
import { Newspaper, Calendar, ChevronRight, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Home Study Updates Preview v1.0.
 * Displays the most recent 3 items from the Current Affairs registry.
 */
export default function CurrentAffairsPreview() {
  const db = useFirestore();
  
  const hubQuery = useMemo(() => {
    if (!db) return null;
    return query(
      collection(db, "current_affairs_hub"), 
      where("status", "==", "PUBLISHED"),
      limit(3)
    );
  }, [db]);

  const { data: items, loading } = useCollection<any>(hubQuery);

  return (
    <section className="py-16 md:py-24 bg-slate-50/50">
      <div className="container mx-auto px-4 max-w-7xl space-y-12 text-left">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
           <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm">
                    <Newspaper className="h-5 w-5" />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">STUDY CENTER</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-headline font-black text-[#0F172A] uppercase tracking-tight">CURRENT AFFAIRS</h2>
              <p className="text-slate-500 font-medium text-sm md:text-lg">Daily bilingual updates for all upcoming recruitments.</p>
           </div>
           <Button asChild variant="ghost" className="text-primary font-black uppercase text-[10px] tracking-widest gap-2">
              <Link href="/current-affairs">Full Study Hub <ChevronRight className="h-4 w-4" /></Link>
           </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
           {loading ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-[2.5rem] bg-white" />)
           ) : items?.map((item) => (
              <Link key={item.id} href="/current-affairs">
                 <Card className="border-none shadow-xl hover:shadow-4xl transition-all duration-500 rounded-[2.5rem] bg-white group overflow-hidden h-full flex flex-col border border-slate-100 p-8">
                    <div className="flex justify-between items-start mb-6">
                       <Badge variant="outline" className="bg-slate-50 border-slate-100 text-slate-400 text-[8px] font-black uppercase px-2">{item.type || 'DAILY'} HUB</Badge>
                       <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                          <Calendar className="h-3 w-3" /> {item.month} {item.year}
                       </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-[#0F172A] uppercase leading-tight group-hover:text-primary transition-colors flex-1 mb-8">
                       {item.title}
                    </h3>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                       <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest flex items-center gap-2">
                          <Zap className="h-3.5 w-3.5 text-primary fill-current" /> Read Now
                       </span>
                       <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-primary transition-all" />
                    </div>
                 </Card>
              </Link>
           ))}
        </div>
      </div>
    </section>
  );
}
