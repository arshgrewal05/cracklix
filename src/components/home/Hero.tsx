'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  Star, 
  BarChart3, 
  BookOpen, 
  ArrowRight,
  ClipboardList,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDoc, useFirestore } from '@/firebase';
import { doc } from "firebase/firestore";

/**
 * @fileOverview Final High-Fidelity Hero Section v90.0.
 * MATCHED: 1:1 match with user reference screenshot.
 * SCALE: Reduced overall section scale by ~30% for a professional finish.
 * CASING: Removed forced uppercase; follows "Prepare Smarter. Score Higher." format.
 * LAYOUT: Horizontal glassy stat cards at the bottom.
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
    <section className="relative w-full bg-[#050B19] overflow-hidden h-[580px] md:h-[620px] flex flex-col justify-center">
      
      {/* 1. BACKGROUND LAYER STACK */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          src="https://i.ibb.co/fYJttX5d/Gemini-Generated-Image-n1so6on1so6on1so.png" 
          alt="Golden Temple" 
          className="w-full h-full object-cover object-[center_35%] md:object-center"
          referrerPolicy="no-referrer"
        />
        
        {/* PUNJAB MAP WATERMARK - MATCHED POSITIONING */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.08]">
           <div className="absolute top-[40%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[750px] md:h-[750px] bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ea/Outline_Map_of_Punjab_India.svg')] bg-contain bg-no-repeat grayscale invert" />
        </div>

        {/* BLUE CINEMATIC SHADING OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050B19] via-[#050B19]/60 to-transparent z-[15]" />
        
        {/* BOTTOM BLENDING */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050B19]/60 to-transparent z-[15]" />
      </div>

      {/* 2. PRIMARY CONTENT HUB */}
      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-20">
         <div className="max-w-3xl space-y-4 md:space-y-6 text-left">
            
            {/* TOP PILL BADGE */}
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md mb-2"
            >
               <Star className="h-3 w-3 text-[#F97316] fill-current" />
               <span className="text-[9px] md:text-[11px] font-bold text-white tracking-wide">#1 Punjab Exam Preparation Platform</span>
            </motion.div>

            {/* HEADINGS - TITLE CASE MATCHED */}
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="space-y-0"
            >
               <h1 className="text-3xl sm:text-4xl md:text-[72px] font-black text-white leading-[1.05] tracking-tight antialiased">
                  Prepare Smarter.<br/>
                  <span className="text-[#F97316]">Score Higher.</span>
               </h1>
            </motion.div>

            <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="text-sm md:text-xl text-slate-200 font-medium max-w-xl leading-relaxed opacity-90"
            >
               Punjab Government Exams di Complete Preparation ik hi Platform te.
            </motion.p>

            {/* TACTICAL BUTTONS */}
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="flex flex-row gap-3 md:gap-4 pt-4"
            >
               <Button asChild className="h-10 md:h-12 px-6 md:px-10 bg-[#F97316] hover:bg-orange-600 text-white font-black uppercase text-[10px] md:text-[11px] tracking-widest rounded-lg shadow-2xl transition-all active:scale-95 border-none">
                  <Link href="/mocks" className="flex items-center">
                     Start Free Mock <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-2" />
                  </Link>
               </Button>
               <Button asChild variant="outline" className="h-10 md:h-12 px-6 md:px-10 border-white/30 bg-transparent text-white font-black uppercase text-[10px] md:text-[11px] tracking-widest rounded-lg transition-all backdrop-blur-md hover:bg-white/10">
                  <Link href="/exams">
                     Explore Exams
                  </Link>
               </Button>
            </motion.div>
         </div>
      </div>

      {/* 3. INTEGRATED BOTTOM STATS HUB */}
      <div className="absolute bottom-6 md:bottom-10 left-0 right-0 z-30">
         <div className="container mx-auto px-4 md:px-12 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
               <HeroStatCard 
                 icon={<BookOpen className="text-blue-400 h-4 w-4 md:h-6 md:w-6" />} 
                 val={liveStats.questions} 
                 label="Practice Questions" 
               />
               <HeroStatCard 
                 icon={<ClipboardList className="text-orange-400 h-4 w-4 md:h-6 md:w-6" />} 
                 val={liveStats.mocks} 
                 label="Mock Tests" 
               />
               <HeroStatCard 
                 icon={<ShieldCheck className="text-blue-500 h-4 w-4 md:h-6 md:w-6" />} 
                 val={liveStats.exams} 
                 label="Exams Covered" 
               />
               <HeroStatCard 
                 icon={<BarChart3 className="text-emerald-400 h-4 w-4 md:h-6 md:w-6" />} 
                 val={liveStats.analytics} 
                 label="Detailed Analytics" 
               />
            </div>
         </div>
      </div>
    </section>
  );
}

function HeroStatCard({ icon, val, label }: { icon: React.ReactNode, val: string, label: string }) {
  return (
    <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 p-3 md:p-6 rounded-xl md:rounded-2xl text-left flex items-center gap-3 md:gap-5 group hover:bg-white/10 transition-all duration-300 shadow-2xl overflow-hidden">
       <div className="shrink-0 transition-transform group-hover:scale-110">
          {icon}
       </div>
       <div className="min-w-0 flex flex-col justify-center">
          <p className="text-sm md:text-2xl font-black text-white leading-none tracking-tight tabular-nums">{val}</p>
          <p className="text-[7px] md:text-[10px] font-bold text-slate-400 tracking-wider mt-1 truncate uppercase">{label}</p>
       </div>
    </Card>
  )
}
