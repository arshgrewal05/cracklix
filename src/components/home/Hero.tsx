'use client';

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Zap, GraduationCap, Landmark, ShieldCheck, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

/**
 * @fileOverview Official Live Hero Hub v120.0 (Background Removed).
 * UPDATED: Integrated live Firestore stats for institutional trust and functional portal routing.
 */

export default function Hero() {
  const db = useFirestore();
  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats } = useDoc<any>(statsRef);

  // REGISTRY LIVE AUDIT
  const liveStats = useMemo(() => {
    const qCount = stats?.totalQuestions || 10000;
    const boardCount = stats?.totalBoards || 50;

    const format = (n: number) => n >= 1000 ? `${(n/1000).toFixed(0)}K+` : n.toString();

    return {
      portals: format(boardCount),
      questions: format(qCount),
      verified: "100%",
      reports: "Live"
    };
  }, [stats]);

  return (
    <section className="relative w-full bg-[#0A0E1A] bg-radial-at-t from-gray-900 via-[#0A0E1A] to-[#0A0E1A] font-body text-left overflow-hidden min-h-[600px] lg:min-h-[800px] flex flex-col justify-center">
      
      {/* 1. MAIN CONTENT HUB */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-20 pt-10 lg:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: INSTITUTIONAL HEADLINES */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] md:text-xs font-black uppercase tracking-wider mx-auto lg:mx-0 shadow-2xl"
            >
              🎯 DEDICATED PUNJAB EXAMS PORTAL
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-1"
            >
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] uppercase">
                PREPARE SMARTER.<br />
                <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent italic">ACHIEVE HIGHER.</span>
              </h1>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-sm sm:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              Punjab Government Exams di Complete Preparation ik hi Center te, <span className="text-white font-bold">Latest PSSSB & PPSC Exam Patterns</span> de Naal. Full length mock tests custom designed for Punjab aspirants.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Button asChild className="w-full sm:w-auto h-14 md:h-16 px-8 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-[10px] md:text-xs tracking-widest rounded-xl shadow-2xl shadow-orange-500/20 transition-all border-none group">
                <Link href="/exams" className="flex items-center gap-2">Choose Your Exam Portal <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
              </Button>
              <Button asChild className="w-full sm:w-auto h-14 md:h-16 px-8 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-black uppercase text-[10px] md:text-xs rounded-xl shadow-xl transition-all border-none">
                <Link href="/mocks">Explore Free Mocks</Link>
              </Button>
            </motion.div>
          </div>

          {/* RIGHT: INTERACTIVE EXAM PORTALS */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
             <div className="absolute -inset-4 bg-orange-500/5 blur-3xl rounded-full pointer-events-none"></div>

             <ExamPortalCard 
               emoji="📝" 
               tag="PSSSB" 
               title="Patwari & Clerk" 
               desc="Full syllabus mock tests, sectionals, and daily current Punjab GK trackers."
               color="orange"
               href="/exams/category/punjab-govt"
             />
             <ExamPortalCard 
               emoji="🏛" 
               tag="PPSC" 
               title="PCS & Analysts" 
               desc="High-level reasoning, aptitude structures, and administrative pattern mocks."
               color="blue"
               href="/exams/category/punjab-govt"
             />
             <ExamPortalCard 
               emoji="⚡" 
               tag="PSPCL" 
               title="JE & ALM Matrix" 
               desc="Technical theory question banks and customized department level papers."
               color="emerald"
               href="/exams/category/punjab-technical"
             />
             <ExamPortalCard 
               emoji="🎓" 
               tag="TEACHING" 
               title="PSTET & Cadres" 
               desc="Master Cadre, Lecturer, ETT, and CTET complete child pedagogy modules."
               color="purple"
               href="/exams/category/punjab-teaching"
             />
          </div>
        </div>

        {/* 2. TRUST REGISTRY STRIP */}
        <section className="mt-16 md:mt-24 w-full">
           <div className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-2xl backdrop-blur-md">
              <TrustNode val={liveStats.portals} label="Specialized Portals" />
              <TrustNode val={liveStats.questions} label="State Level Questions" />
              <TrustNode val={liveStats.verified} label="Verified Solutions" />
              <TrustNode val={liveStats.reports} label="State Ranking Reports" />
           </div>
        </section>
      </div>
    </section>
  );
}

function ExamPortalCard({ emoji, tag, title, desc, color, href }: any) {
  const colorStyles: any = {
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl bg-[#111827]/60 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all shadow-2xl flex flex-col justify-between group h-full text-left"
    >
       <div className="space-y-4">
          <div className="flex items-center justify-between">
             <div className={cn("p-2.5 rounded-xl text-xl shadow-inner", colorStyles[color])}>
                {emoji}
             </div>
             <Badge className={cn("border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm", colorStyles[color])}>
                {tag}
             </Badge>
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight leading-tight">{title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-medium line-clamp-2">{desc}</p>
       </div>
       <Button asChild className="mt-8 w-full py-6 bg-white/5 border border-white/5 group-hover:bg-white text-slate-400 group-hover:text-black font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-sm border-none">
          <Link href={href}>Start Practice</Link>
       </Button>
    </motion.div>
  );
}

function TrustNode({ val, label }: any) {
  return (
    <div className="space-y-1">
       <h4 className="text-2xl sm:text-4xl font-black text-white tracking-tighter">{val}</h4>
       <p className="text-[9px] md:text-[11px] text-slate-500 uppercase font-black tracking-widest">{label}</p>
    </div>
  )
}
