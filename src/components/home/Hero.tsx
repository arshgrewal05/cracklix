'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  ChevronRight, 
  ClipboardList,
  ShieldCheck,
  Star,
  Activity,
  BarChart3,
  BookOpen,
  ArrowRight,
  Map as MapIcon,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDoc, useFirestore } from '@/firebase';
import { doc } from "firebase/firestore";

/**
 * @fileOverview Final High-Fidelity "Master Interface" Hero v30.0.
 * MATCHED: Pixel-perfect alignment with reference screenshot.
 * FEATURES: Punjab map overlay, Cinematic background, Glassy Stat Cards.
 * DATA: Real-time Firestore synchronization.
 */

export default function Hero() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats } = useDoc<any>(statsRef);

  const liveStats = useMemo(() => {
    const formatNumber = (num: number, fallback: string) => {
      if (!num) return fallback;
      if (num >= 1000) return (num / 1000).toFixed(0) + ',000+';
      return num.toString() + '+';
    };

    return {
      questions: formatNumber(stats?.totalQuestions, "10,000+"),
      mocks: formatNumber(stats?.totalMocks, "500+"),
      exams: formatNumber(stats?.totalBoards, "50+"),
      analytics: "Detailed"
    };
  }, [stats]);

  if (!mounted) return null;

  return (
    <section className="relative w-full bg-[#020817] overflow-hidden flex flex-col items-center">
      
      {/* 1. CINEMATIC BACKGROUND & MAP OVERLAY */}
      <div className="w-full relative min-h-[380px] md:h-auto md:aspect-[21/9] flex items-center">
        {/* Background Image - Golden Temple */}
        <motion.img 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          src="https://i.ibb.co/fYJttX5d/Gemini-Generated-Image-n1so6on1so6on1so.png" 
          alt="Golden Temple" 
          className="absolute inset-0 w-full h-full object-cover object-[center_35%] z-0"
          referrerPolicy="no-referrer"
        />
        
        {/* Punjab Map Outline (Matched to Screenshot) */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.15]">
           <div className="absolute top-[45%] left-[22%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[650px] md:h-[650px] bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ea/Outline_Map_of_Punjab_India.svg')] bg-contain bg-no-repeat grayscale invert" />
        </div>

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020817]/90 via-[#020817]/40 to-transparent z-[15]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent z-[15] h-full opacity-90" />
        
        {/* TEXT CONTENT HUB (Desktop Balanced) */}
        <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-20">
           <div className="max-w-[90vw] md:max-w-3xl space-y-4 md:space-y-8 text-left">
              
              {/* Pill Badge */}
              <motion.div
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="inline-flex items-center gap-2 md:gap-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md px-4"
              >
                 <Star className="h-3 w-3 md:h-4 md:w-4 text-orange-500 fill-current" />
                 <span className="text-[8px] md:text-[11px] font-black text-white uppercase tracking-[0.25em]">
                    #1 Punjab Exam Preparation Platform
                 </span>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="space-y-1 md:space-y-3"
              >
                 <h1 className="text-3xl sm:text-5xl md:text-[85px] font-black text-white leading-[1.05] tracking-tight uppercase drop-shadow-2xl antialiased">
                    Prepare Smarter.<br/>
                    <span className="text-[#F97316]">Score Higher.</span>
                 </h1>
                 <p className="text-[12px] md:text-2xl text-slate-100 font-medium max-w-xs md:max-w-2xl leading-relaxed opacity-90">
                    Punjab Government Exams di Complete Preparation ik hi Platform te.
                 </p>
              </motion.div>

              {/* Tactical Buttons */}
              <motion.div
                 initial={{ opacity: 0, y: 15 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="flex flex-row gap-3 md:gap-8 pt-4 md:pt-10"
              >
                 <Button asChild className="h-12 md:h-18 px-8 md:px-14 bg-[#F97316] hover:bg-orange-600 text-white font-black uppercase text-[10px] md:text-[15px] tracking-[0.2em] rounded-xl md:rounded-2xl shadow-[0_20px_50px_rgba(249,115,22,0.3)] gap-3 md:gap-4 transition-all active:scale-95 border-none">
                    <Link href="/mocks" className="flex items-center">
                       Start Free Mock <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-1" />
                    </Link>
                 </Button>
                 <Button asChild variant="outline" className="h-12 md:h-18 px-8 md:px-14 border-white/20 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] md:text-[15px] tracking-[0.2em] rounded-xl md:rounded-2xl transition-all backdrop-blur-xl border-[2px]">
                    <Link href="/exams">
                       Explore Exams
                    </Link>
                 </Button>
              </motion.div>
           </div>
        </div>
      </div>

      {/* 2. INTEGRATED GLASSY STATS HUB (Pixel-Match to Screenshot) */}
      <div className="w-full bg-[#020817] pb-16 md:pb-32 relative z-30 -mt-10">
         <div className="container mx-auto px-4 md:px-12 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-10">
               <HeroStatCard 
                 icon={<BookOpen className="text-blue-400 h-5 w-5 md:h-8 md:w-8" />} 
                 val={liveStats.questions} 
                 label="Practice Questions" 
               />
               <HeroStatCard 
                 icon={<ClipboardList className="text-orange-400 h-5 w-5 md:h-8 md:w-8" />} 
                 val={liveStats.mocks} 
                 label="Mock Tests" 
               />
               <HeroStatCard 
                 icon={<ShieldCheck className="text-blue-500 h-5 w-5 md:h-8 md:w-8" />} 
                 val={liveStats.exams} 
                 label="Exams Covered" 
               />
               <HeroStatCard 
                 icon={<BarChart3 className="text-emerald-400 h-5 w-5 md:h-8 md:w-8" />} 
                 val={liveStats.analytics} 
                 label="Analytics" 
               />
            </div>
         </div>
      </div>
    </section>
  );
}

function HeroStatCard({ icon, val, label }: { icon: React.ReactNode, val: string, label: string }) {
  return (
    <Card className="bg-white/[0.04] backdrop-blur-3xl border border-white/5 p-5 md:p-10 rounded-2xl md:rounded-[3rem] text-left flex items-center gap-4 md:gap-8 group hover:bg-white/[0.08] transition-all duration-700 shadow-5xl hover:border-white/10">
       <div className="h-12 w-12 md:h-20 md:w-20 rounded-xl md:rounded-3xl flex items-center justify-center shrink-0 bg-white/[0.03] shadow-2xl group-hover:scale-105 transition-transform">
          {icon}
       </div>
       <div className="min-w-0 space-y-1">
          <p className="text-xl md:text-[42px] font-black text-white leading-none tracking-tight tabular-nums">{val}</p>
          <p className="text-[7px] md:text-[13px] font-bold uppercase text-slate-500 tracking-[0.1em] truncate group-hover:text-slate-400 transition-colors">{label}</p>
       </div>
    </Card>
  )
}
