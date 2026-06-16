'use client';

import React, { useMemo } from 'react';
import { useCollection, useFirestore, useDoc } from '@/firebase';
import { collection, query, limit, doc } from 'firebase/firestore';
import { Trophy, Medal, Activity, ChevronRight, Users, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import StudentAvatar from '@/components/brand/StudentAvatar';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * @fileOverview Balanced Punjab Merit Preview v3.0.
 * UPDATED: Optimized grid split and integrated stats under description for better balance.
 */
export default function MeritPreview() {
  const db = useFirestore();
  
  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats, loading: statsLoading } = useDoc<any>(statsRef);

  const resultsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "results"), limit(5));
  }, [db]);

  const { data: results, loading: resultsLoading } = useCollection<any>(resultsQuery);

  const topRankers = useMemo(() => {
    if (!results) return [];
    const map = new Map();
    [...results].sort((a, b) => b.score - a.score).forEach(r => {
      if (!map.has(r.userId) || map.get(r.userId).score < r.score) {
        map.set(r.userId, r);
      }
    });
    return Array.from(map.values()).sort((a, b) => b.score - a.score).slice(0, 5);
  }, [results]);

  const liveAspirantCount = useMemo(() => {
    if (statsLoading || !stats) return "---";
    const count = stats.totalUsers || 0;
    return count >= 1000 ? `${(count / 1000).toFixed(1)}K+` : `${count}+`;
  }, [stats, statsLoading]);

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden border-t border-slate-50">
      <div className="container mx-auto px-4 max-w-7xl text-left">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-20 items-center">
           
           <div className="space-y-10 md:space-y-12">
              <div className="space-y-6 max-w-xl">
                 <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">PUNJAB MERIT INDEX</span>
                 </div>
                 <h2 className="text-3xl md:text-6xl font-headline font-black text-[#0F172A] uppercase leading-tight tracking-tight">HALL OF <br/> <span className="text-primary">RANKERS</span></h2>
                 <p className="text-slate-500 font-medium text-base md:text-lg leading-relaxed">
                    Compare your performance with thousands of aspirants across 23 districts. Secure your spot in the official merit list.
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-6">
                 <div className="p-6 md:p-8 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner group transition-all">
                    <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-4 text-primary">
                       <Users className="h-5 w-5" />
                    </div>
                    <p className="text-3xl md:text-4xl font-headline font-black text-[#0F172A] tabular-nums">
                       {statsLoading ? "..." : liveAspirantCount}
                    </p>
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">ASPIRANT NODES</p>
                 </div>
                 <div className="p-6 md:p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 shadow-inner group transition-all">
                    <div className="h-10 w-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center mb-4 text-blue-600">
                       <MapPin className="h-5 w-5" />
                    </div>
                    <p className="text-3xl md:text-4xl font-headline font-black text-blue-600 tabular-nums">23</p>
                    <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">DISTRICTS COVERED</p>
                 </div>
              </div>

              <Button asChild className="h-14 md:h-16 px-10 bg-[#0F172A] hover:bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-3xl gap-3 transition-all active:scale-95 border-none">
                 <Link href="/leaderboard">Full Merit List <ChevronRight className="h-4 w-4 text-primary" /></Link>
              </Button>
           </div>

           <div className="relative w-full">
              <div className="absolute -inset-10 bg-primary/5 blur-[120px] rounded-full" />
              <Card className="border-none shadow-5xl rounded-[3rem] bg-white overflow-hidden relative z-10 border border-slate-100 w-full min-h-[400px]">
                 <div className="bg-[#0B1528] p-6 md:p-8 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                       <Medal className="h-5 w-5 text-primary" />
                       <h3 className="font-headline font-black text-sm uppercase tracking-widest">LIVE TOPPER HUB</h3>
                    </div>
                    <Badge className="bg-white/10 text-primary border-none text-[8px] font-black uppercase px-2">UPDATED: REAL-TIME</Badge>
                 </div>
                 <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                       {resultsLoading ? (
                          Array.from({ length: 4 }).map((_, i) => <div key={i} className="p-6"><Skeleton className="h-10 w-full rounded-xl" /></div>)
                       ) : topRankers.length > 0 ? topRankers.map((res: any, idx: number) => {
                          const name = (res.userName && res.userName !== 'Aspirant' && !res.userName.includes('@')) ? res.userName : (res.userEmail?.split('@')[0] || "Aspirant");
                          return (
                            <div key={res.id} className="p-6 md:p-8 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                               <div className="flex items-center gap-4 md:gap-6 min-w-0">
                                  <span className={cn("font-black text-sm md:text-xl w-6", idx === 0 ? "text-amber-400" : "text-slate-300")}>#{idx + 1}</span>
                                  <StudentAvatar profile={{ name, gender: res.gender }} className="h-10 w-10 md:h-12 md:w-12 rounded-xl shadow-md" />
                                  <div className="min-w-0">
                                     <p className="font-black text-sm md:text-lg text-[#0F172A] uppercase truncate">{name}</p>
                                     <p className="text-[8px] font-bold text-slate-400 uppercase truncate max-w-[150px]">{res.mockTitle}</p>
                                  </div>
                               </div>
                               <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] md:text-[11px] px-3 py-1 rounded-lg tabular-nums shadow-sm">{res.accuracy}%</Badge>
                            </div>
                          )
                       }) : (
                          <div className="py-20 text-center opacity-20 italic font-black uppercase text-[10px] flex flex-col items-center gap-4">
                             <Activity className="h-10 w-10 text-slate-300" />
                             Awaiting Merit Audit
                          </div>
                       )}
                    </div>
                 </CardContent>
              </Card>
           </div>

        </div>
      </div>
    </section>
  );
}
