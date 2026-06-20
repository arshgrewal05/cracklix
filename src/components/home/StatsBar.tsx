'use client';

import React, { useMemo } from 'react';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Zap, ClipboardList, ShieldCheck, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

/**
 * @fileOverview High-Fidelity Trust Stats Bar v1.0 (Restored).
 */

export default function StatsBar() {
  const db = useFirestore();
  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats, loading } = useDoc<any>(statsRef);

  const items = [
    { 
      label: "Questions", 
      val: loading ? "..." : (Math.floor((stats?.totalQuestions || 50000) / 1000) + "K+"), 
      sub: "Verified MCQs",
      icon: <Zap className="h-6 w-6 text-white" />,
      color: "bg-blue-600"
    },
    { 
      label: "Mock Tests", 
      val: loading ? "..." : (stats?.totalMocks || 500) + "+", 
      sub: "Latest Pattern",
      icon: <ClipboardList className="h-6 w-6 text-white" />,
      color: "bg-purple-600"
    },
    { 
      label: "Exams", 
      val: loading ? "..." : (stats?.totalBoards || 50) + "+", 
      sub: "Authority Hubs",
      icon: <ShieldCheck className="h-6 w-6 text-white" />,
      color: "bg-emerald-600"
    },
    { 
      label: "Aspirants", 
      val: loading ? "..." : (Math.floor((stats?.totalUsers || 15000) / 1000) + "K+"), 
      sub: "Trust Cracklix",
      icon: <Users className="h-6 w-6 text-white" />,
      color: "bg-orange-500"
    }
  ];

  return (
    <section className="bg-white py-12 border-b border-slate-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex overflow-x-auto no-scrollbar gap-6 pb-4 -mx-4 px-4 md:mx-0 md:px-0 lg:grid lg:grid-cols-4">
          {items.map((item, i) => (
            <Card key={i} className="border-none shadow-xl rounded-[2rem] p-6 md:p-8 bg-white flex items-center gap-6 min-w-[280px] lg:min-w-0 group hover:translate-y-[-4px] transition-all duration-300">
              <div className={cn("h-14 w-14 md:h-16 md:w-16 rounded-2xl flex items-center justify-center shrink-0 shadow-2xl transition-transform group-hover:scale-110", item.color)}>
                {item.icon}
              </div>
              <div className="text-left space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-4xl font-black text-[#0F172A] tabular-nums tracking-tighter">{item.val}</span>
                  <span className="text-[10px] font-black text-[#0F172A] uppercase tracking-tight">{item.label}</span>
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.sub}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
