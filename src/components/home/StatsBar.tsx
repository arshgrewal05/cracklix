
'use client';

import React, { useMemo } from 'react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card } from '@/components/ui/card';
import { BarChart3, Users, Zap, Target } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * @fileOverview Live Platform Statistics Bar v1.0.
 * Matches wireframe: 50,000+ Questions, 500+ Mocks, 15,000+ Aspirants, 94% Accuracy.
 */
export default function StatsBar() {
  const db = useFirestore();
  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats, loading } = useDoc<any>(statsRef);

  const displayStats = useMemo(() => {
    const qCount = stats?.totalQuestions || 50000;
    const mCount = stats?.totalMocks || 500;
    const uCount = stats?.totalUsers || 15000;
    const accuracy = stats?.averageAccuracy || 94;

    const format = (n: number) => n >= 1000 ? `${(n/1000).toFixed(n >= 10000 ? 0 : 1)}k+` : n.toString();

    return [
      { label: "Questions", val: format(qCount), icon: <Zap className="text-primary" /> },
      { label: "Mock Tests", val: format(mCount), icon: <BarChart3 className="text-blue-500" /> },
      { label: "Aspirants", val: format(uCount), icon: <Users className="text-emerald-500" /> },
      { label: "Accuracy", val: `${accuracy}%`, icon: <Target className="text-rose-500" /> }
    ];
  }, [stats]);

  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
         <div className="flex items-center gap-4 mb-12">
            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 shadow-inner">
               <BarChart3 className="h-5 w-5" />
            </div>
            <h2 className="text-xl md:text-3xl font-headline font-black text-[#0F172A] uppercase tracking-tight">Live Platform Stats</h2>
         </div>

         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {displayStats.map((s, i) => (
               <Card key={i} className="border-none shadow-xl rounded-[2rem] p-8 md:p-10 bg-slate-50/50 flex flex-col items-start gap-4 hover:translate-y-[-4px] transition-all group border border-slate-100">
                  <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                     {s.icon}
                  </div>
                  <div className="text-left space-y-1">
                     <p className="text-2xl md:text-4xl font-headline font-black text-[#0F172A] tracking-tighter leading-none">{s.val}</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
                  </div>
               </Card>
            ))}
         </div>
      </div>
    </section>
  );
}
