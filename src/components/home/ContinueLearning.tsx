'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Trophy, Target, Star, GraduationCap, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * @fileOverview High-Fidelity "My Progress" Hub v11.1.
 * UPDATED: Simplified student-facing language.
 */

export default function ContinueLearning() {
  const { user, profile } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const resultsQuery = useMemo(() => {
    if (!db || !user || !mounted) return null;
    return query(collection(db, "results"), where("userId", "==", user.uid), limit(20));
  }, [db, user, mounted]);

  const examsQuery = useMemo(() => {
    if (!db || !mounted) return null;
    return collection(db, "exams");
  }, [db, mounted]);

  const { data: rawResults, loading: resultsLoading } = useCollection<any>(resultsQuery);
  const { data: allExams, loading: examsLoading } = useCollection<any>(examsQuery);
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]));

  const recentAttempts = useMemo(() => {
    if (!rawResults || rawResults.length === 0) return []
    return [...rawResults].sort((a, b) => {
       const timeA = new Date(a.timestamp || 0).getTime();
       const timeB = new Date(b.timestamp || 0).getTime();
       return timeB - timeA;
    }).slice(0, 2);
  }, [rawResults]);

  const pinnedExams = useMemo(() => {
    if (!allExams || !profile?.pinnedExams) return [];
    return (allExams as any[]).filter((e: any) => profile.pinnedExams?.includes(e.id)).slice(0, 3);
  }, [allExams, profile]);

  if (!mounted || !user) return null;

  const hasData = (recentAttempts && recentAttempts.length > 0) || (pinnedExams && pinnedExams.length > 0);
  if (!hasData && !resultsLoading && !examsLoading) return null;

  return (
    <section className="py-12 md:py-16 bg-white animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="container mx-auto px-4 max-w-7xl space-y-10 text-left">
        <div className="flex items-center justify-between px-1">
           <div className="flex items-center gap-3">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-orange-50 flex items-center justify-center text-primary shadow-sm shrink-0">
                 <Target className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <h2 className="text-xl md:text-3xl font-headline font-black text-[#0F172A] uppercase tracking-tight">MY EXAMS</h2>
           </div>
           <Button asChild variant="ghost" className="text-primary font-black uppercase text-[10px] tracking-widest gap-2">
              <Link href="/my-exams">View All <ChevronRight className="h-4 w-4" /></Link>
           </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-7 space-y-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                 <Zap className="h-3 w-3 text-primary" /> CONTINUE PRACTICE
              </p>
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                 {resultsLoading ? (
                    Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-[2.5rem] bg-slate-50" />)
                 ) : recentAttempts.length > 0 ? (
                    recentAttempts.map((res: any) => (
                      <Card key={res.id} className="border-none shadow-xl rounded-[2.5rem] bg-[#0B1528] text-white p-6 md:p-8 overflow-hidden relative group text-left border border-white/5">
                        <div className="absolute bottom-0 right-0 p-8 opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform duration-1000">
                            <Trophy className="h-32 w-32" />
                        </div>
                        <div className="relative z-10 flex flex-row items-center gap-6">
                            <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                <Zap className="h-6 w-6 md:h-8 md:w-8 text-primary fill-current" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-primary font-black text-[9px] uppercase tracking-[0.4em] mb-1">SCORE: {res.score}</p>
                                <h3 className="text-base md:text-xl font-black uppercase text-white truncate">{res.mockTitle}</h3>
                                <Button asChild className="h-9 mt-4 px-6 bg-primary hover:bg-orange-600 text-white font-black uppercase text-[9px] tracking-widest rounded-xl transition-all active:scale-95 border-none">
                                  <Link href={`/results/${res.mockId}`}>REVIEW TEST</Link>
                                </Button>
                            </div>
                        </div>
                      </Card>
                    ))
                 ) : (
                    <div className="p-12 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No tests found</p>
                    </div>
                 )}
              </div>
           </div>

           <div className="lg:col-span-5 space-y-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                 <Star className="h-3 w-3 text-amber-500 fill-current" /> SAVED EXAMS
              </p>
              <div className="grid grid-cols-1 gap-4">
                 {examsLoading ? (
                    Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-2xl bg-slate-50" />)
                 ) : pinnedExams.length > 0 ? (
                    pinnedExams.map((exam: any) => {
                       const board = boards?.find((b: any) => b.id === exam.boardId || b.abbreviation === exam.boardId);
                       const logoUrl = board?.iconUrl || exam.iconUrl;
                       
                       return (
                          <Link key={exam.id} href={`/exams/${exam.id}`}>
                             <div className="flex items-center justify-between p-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:translate-x-1 transition-all group">
                                <div className="flex items-center gap-4 min-w-0">
                                   <div className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 shadow-inner overflow-hidden">
                                      {logoUrl && !failedImages[exam.id] ? (
                                         <img src={logoUrl} className="h-full w-full object-contain p-2" alt="Logo" onError={() => setFailedImages(p => ({...p, [exam.id]: true}))} />
                                      ) : (
                                         <GraduationCap className="h-5 w-5 text-slate-300" />
                                      )}
                                   </div>
                                   <div className="min-w-0">
                                      <h4 className="text-sm font-black text-[#0F172A] uppercase truncate">{exam.name}</h4>
                                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{board?.abbreviation || 'PSSSB'} Hub</p>
                                   </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-200 group-hover:text-primary transition-all" />
                             </div>
                          </Link>
                       )
                    })
                 ) : (
                    <div className="p-8 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Follow an exam to see it here</p>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
