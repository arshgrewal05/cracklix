'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  ArrowRight,
  ClipboardList,
  ShieldCheck,
  Star,
  Users,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDoc, useFirestore } from '@/firebase';
import { doc } from "firebase/firestore";

/**
 * @fileOverview FINAL ABSOLUTE FIDELITY HERO v140.0.
 * MATCHED: Background Shading, Punjab Map Silhouette, Missing Bilingual Text.
 * INTEGRATED: Real-time Stats Overlay (Glassy Cards).
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

    return [
      { id: 'q', icon: <BookOpen className="text-blue-400 h-3.5 w-3.5 md:h-5 md:w-5" />, val: formatNumber(stats?.totalQuestions, "10,000+"), label: "Total Practice Questions" },
      { id: 'm', icon: <ClipboardList className="text-orange-400 h-3.5 w-3.5 md:h-5 md:w-5" />, val: formatNumber(stats?.totalMocks, "500+"), label: "Total Mock Tests" },
      { id: 'e', icon: <ShieldCheck className="text-blue-500 h-3.5 w-3.5 md:h-5 md:w-5" />, val: formatNumber(stats?.totalBoards, "50+"), label: "Total Exams Covered" },
      { id: 'u', icon: <Users className="text-emerald-400 h-3.5 w-3.5 md:h-5 md:w-5" />, val: formatNumber(stats?.totalUsers, "15,000+"), label: "Registered Students" }
    ];
  }, [stats]);

  if (!mounted) return null;

  return (
    <section className="relative w-full bg-[#050B19] overflow-hidden h-[260px] md:h-[650px] flex flex-col justify-center text-left border-b border-white/5">
      
      {/* 1. BACKGROUND ENGINE */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          src="https://i.ibb.co/fYJttX5d/Gemini-Generated-Image-n1so6on1so6on1so.png" 
          alt="Official Punjab Prep Hub" 
          className="w-full h-full object-cover object-right"
          referrerPolicy="no-referrer"
        />
        
        {/* SHADING OVERLAY - Deep Navy Readability Shield */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050B19] via-[#050B19]/80 to-transparent z-[10]" />
        
        {/* PUNJAB MAP SILHOUETTE - Subtle Regional Watermark */}
        <div className="absolute inset-0 z-[11] pointer-events-none opacity-[0.15]">
           <div className="absolute top-[40%] left-[28%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[700px] md:h-[700px] bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ea/Outline_Map_of_Punjab_India.svg')] bg-contain bg-no-repeat grayscale invert" />
        </div>

        {/* GLOWING NODES (TECH FEEL) */}
        <div className="absolute top-1/4 left-[20%] w-1 h-1 bg-primary rounded-full shadow-[0_0_15px_rgba(249,115,22,0.8)] z-[12] animate-pulse" />
        <div className="absolute top-1/2 left-[35%] w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_15px_rgba(96,165,250,0.8)] z-[12] animate-pulse" />
      </div>

      {/* 2. MAIN CONTENT HUB */}
      <div className="container mx-auto px-4 md:px-12 max-w-7xl relative z-20">
         <div className="max-w-3xl space-y-1 md:space-y-6 -mt-10 md:mt-0">
            
            {/* TOP PILL BADGE */}
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/5 border border-white/20 backdrop-blur-md mb-2"
            >
               <Star className="h-3 w-3 md:h-3.5 md:w-3.5 text-[#F97316] fill-current" />
               <span className="text-[7px] md:text-[11px] font-black text-white tracking-widest uppercase">#1 Punjab Exam Preparation Platform</span>
            </motion.div>

            {/* HEADINGS */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
            >
               <h1 className="text-2xl md:text-7xl font-headline font-black text-white leading-[1.1] tracking-tight antialiased">
                  Prepare Smarter.<br/>
                  <span className="text-[#F97316]">Score Higher.</span>
               </h1>
            </motion.div>

            {/* MISSING BILINGUAL DESCRIPTION */}
            <motion.p
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="text-[10px] md:text-xl text-slate-300 font-medium max-w-lg leading-relaxed antialiased"
            >
               Punjab Government Exams di Complete Preparation ik hi Platform te.
            </motion.p>

            {/* BUTTONS */}
            <motion.div
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="flex flex-row gap-3 md:gap-6 pt-2 md:pt-4"
            >
               <Button asChild className="h-9 md:h-16 px-5 md:px-10 bg-[#F97316] hover:bg-orange-600 text-white font-black text-[9px] md:text-xs tracking-tight rounded-xl shadow-3xl transition-all active:scale-95 border-none">
                  <Link href="/mocks" className="flex items-center">
                     Start Free Mock <ArrowRight className="h-3 w-3 md:h-4 md:w-4 ml-1.5 md:ml-2" />
                  </Link>
               </Button>
               <Button asChild variant="outline" className="h-9 md:h-16 px-5 md:px-10 border-white/30 bg-transparent text-white font-black text-[9px] md:text-xs tracking-tight rounded-xl transition-all backdrop-blur-md hover:bg-white/10">
                  <Link href="/exams">
                     Explore Exams
                  </Link>
               </Button>
            </motion.div>
         </div>
      </div>

      {/* 3. INTEGRATED BOTTOM DATA BAR (GLASSY OVERLAY) */}
      <div className="absolute bottom-2 md:bottom-8 left-0 right-0 z-30">
         <div className="container mx-auto px-4 md:px-12 max-w-7xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 max-w-6xl">
               {liveStats.map((stat, idx) => (
                  <motion.div
                     key={stat.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.4 + (idx * 0.1) }}
                  >
                     <Card className="bg-[#0B1528]/40 backdrop-blur-3xl border border-white/10 p-2 md:p-5 rounded-xl md:rounded-[2rem] text-left flex items-center gap-3 md:gap-6 group hover:bg-[#0B1528]/60 transition-all duration-300 shadow-2xl overflow-hidden h-12 md:h-24">
                        <div className="shrink-0 h-7 w-7 md:h-14 md:w-14 rounded-lg md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-transform group-hover:scale-105 shadow-inner">
                           {stat.icon}
                        </div>
                        <div className="min-w-0 flex flex-col justify-center leading-none">
                           <p className="text-xs md:text-3xl font-headline font-black text-white tabular-nums leading-none mb-1 md:mb-1.5">{stat.val}</p>
                           <p className="text-[6.5px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest truncate">
                              {stat.label}
                           </p>
                        </div>
                     </Card>
                  </motion.div>
               ))}
            </div>
         </div>
      </div>
    </section>
  );
}
