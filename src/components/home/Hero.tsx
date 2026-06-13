'use client';

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  Trophy,
  ChevronRight, 
  ClipboardList,
  Users,
  Sparkles,
  Layers,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

/**
 * @fileOverview Definitive Hero Hub v65.0.
 * FIXED: Precise padding guard (pr-10) for the italic heading to prevent 'S' clipping.
 * DESIGN: Pure visual dashboard with cinematic framing and restored registry stats.
 */

export default function Hero() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats } = useDoc<any>(statsRef);

  const displayStats = useMemo(() => {
    const qCount = stats?.totalQuestions || 50000;
    const mCount = stats?.totalMocks || 500;
    const uCount = stats?.totalUsers || 15000;
    const accuracy = stats?.averageAccuracy || 94;
    const format = (n: number) => n >= 1000 ? `${(n/1000).toFixed(0)}k+` : n.toString();

    return [
      { label: "Practice Questions", val: format(qCount), icon: <Zap className="h-5 w-5 text-primary" /> },
      { label: "Mock Tests", val: format(mCount), icon: <ClipboardList className="h-5 w-5 text-blue-400" /> },
      { label: "Active Aspirants", val: format(uCount), icon: <Users className="h-5 w-5 text-emerald-400" /> },
      { label: "Success Rate", val: `${accuracy}%`, icon: <Target className="h-5 w-5 text-rose-400" /> }
    ];
  }, [stats]);

  if (!mounted) {
    return (
      <section className="relative min-h-[90vh] bg-[#070D19] flex flex-col justify-center items-center w-full">
         <Zap className="h-10 w-10 text-primary animate-pulse" />
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-[#070D19] overflow-hidden text-left pt-24 pb-16">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-primary/10 to-transparent blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* 1. PRIMARY CONTENT HUB */}
          <div className="lg:col-span-7 space-y-8 md:space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-inner"
            >
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-300">
                Official Punjab Recruitment Registry
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-8"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight uppercase">
                CRACK PUNJAB <br />
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent italic pr-10 inline-block">GOVT EXAMS</span>
              </h1>
              <p className="text-base md:text-xl text-slate-400 font-medium max-w-xl leading-relaxed antialiased">
                Prepare for PSSSB, Punjab Police, PPSC and other major state recruitments with pattern-based mocks and official PYQs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Button asChild className="h-16 md:h-20 px-10 md:px-12 bg-primary hover:bg-orange-600 text-white font-black uppercase text-[11px] md:text-xs tracking-[0.2em] rounded-[1.5rem] md:rounded-[2rem] shadow-4xl shadow-primary/20 transition-all active:scale-95 border-none gap-4">
                <Link href="/mocks">
                  Start Free Mock <Zap className="h-5 w-5 md:h-6 md:w-6 fill-current" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-16 md:h-20 px-10 md:px-12 border-white/10 bg-white/[0.02] hover:bg-white/[0.08] text-white font-black uppercase text-[11px] md:text-xs tracking-[0.2em] rounded-[1.5rem] md:rounded-[2rem] transition-all active:scale-95 gap-3">
                <Link href="/exams">
                  Explore Hubs <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3 pt-6"
            >
              {["PSSSB", "POLICE", "PPSC", "PSPCL", "PSTET"].map((chip) => (
                <Badge key={chip} variant="outline" className="px-5 py-2.5 border-white/5 bg-white/[0.03] text-slate-500 font-black uppercase text-[9px] tracking-[0.2em] rounded-xl hover:border-primary/40 hover:text-white transition-all cursor-default shadow-sm">
                  {chip}
                </Badge>
              ))}
            </motion.div>
          </div>

          {/* 2. COMMAND CENTER VISUAL */}
          <div className="lg:col-span-5 relative justify-self-center w-full max-w-[550px]">
             <motion.div 
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 1, ease: "easeOut" }}
               className="relative w-full"
             >
                <div className="absolute -inset-2 bg-gradient-to-tr from-primary/30 via-white/5 to-blue-500/20 rounded-[4rem] blur-md opacity-40" />
                
                <div className="relative aspect-[4/5] rounded-[3.8rem] bg-[#0F172A] border-[16px] border-white/[0.02] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10 group">
                   <img 
                     src="https://i.ibb.co/gZCGMQNJ/IMG-20260612-WA0010.jpg" 
                     alt="Dashboard"
                     className="w-full h-full object-cover opacity-90 transition-all duration-1000 group-hover:scale-105 group-hover:opacity-100"
                     referrerPolicy="no-referrer"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#070D19] via-transparent to-transparent opacity-70" />
                   
                   <div className="absolute top-10 left-10 w-16 h-16 border-t-[3px] border-l-[3px] border-primary/40 rounded-tl-2xl" />
                   <div className="absolute bottom-10 right-10 w-16 h-16 border-b-[3px] border-r-[3px] border-primary/40 rounded-br-2xl" />
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
             </motion.div>
          </div>
        </div>

        {/* 3. INTEGRATED REGISTRY STATS */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-24 lg:mt-36 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-t border-white/5 pt-12"
        >
          {displayStats.map((s, i) => (
            <Card key={i} className="border-none bg-white/[0.02] backdrop-blur-2xl rounded-[2rem] p-8 md:p-10 flex flex-col items-center md:items-start text-center md:text-left gap-6 group hover:bg-white/[0.04] transition-all duration-500 shadow-inner ring-1 ring-white/5">
              <div className="h-14 w-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center shadow-3xl group-hover:scale-110 group-hover:border-primary/40 transition-all duration-500">
                {s.icon}
              </div>
              <div className="space-y-1">
                <p className="text-3xl md:text-5xl font-headline font-black text-white tracking-tighter leading-none">{s.val}</p>
                <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-500 mt-2">{s.label}</p>
              </div>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
