'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  ArrowRight,
  ClipboardList,
  ShieldCheck,
  Star,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDoc, useFirestore } from '@/firebase';
import { doc } from "firebase/firestore";

/**
 * @fileOverview Final Calibrated Mobile-First Hero v225.0.
 * UPDATED: Precise responsive typography for all mobile ranges (320px+).
 * FIXED: Optimized card visibility for standalone PWA mode.
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
      { id: 'q', icon: <BookOpen className="text-blue-400 h-3 w-3 md:h-5 md:w-5" />, val: formatNumber(stats?.totalQuestions, "439+"), label: "Practice Questions" },
      { id: 'm', icon: <ClipboardList className="text-orange-400 h-3 w-3 md:h-5 md:w-5" />, val: formatNumber(stats?.totalMocks, "8+"), label: "Mock Tests" },
      { id: 'e', icon: <ShieldCheck className="text-blue-500 h-3 w-3 md:h-5 md:w-5" />, val: formatNumber(stats?.totalBoards, "92+"), label: "Exams Covered" },
      { id: 'u', icon: <Users className="text-emerald-400 h-3 w-3 md:h-5 md:w-5" />, val: formatNumber(stats?.totalUsers, "5+"), label: "Live Aspirants" }
    ];
  }, [stats]);

  if (!mounted) return null;

  return (
    <section className="relative w-full bg-[#050B19] overflow-hidden min-h-[300px] md:h-[550px] flex flex-col justify-start text-left border-b border-white/5 pb-16 md:pb-0">
      
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
        
        {/* Shading strictly for left text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050B19] via-[#050B19]/80 to-transparent z-[10]" />
        
        {/* TARGETED STAR ARTIFACT MASK */}
        <div className="absolute top-[15%] left-[35%] w-[100px] h-[100px] bg-[#050B19] blur-[80px] z-[11] opacity-95 rounded-full pointer-events-none" />

        {/* PUNJAB MAP WATERMARK */}
        <div className="absolute inset-0 z-[12] pointer-events-none opacity-[0.03]">
           <div className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[600px] md:h-[600px] bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ea/Outline_Map_of_Punjab_India.svg')] bg-contain bg-no-repeat grayscale invert" />
        </div>
      </div>

      {/* 2. CONTENT HUB */}
      <div className="container mx-auto px-4 md:px-12 max-w-7xl relative z-[30] pt-6 md:pt-14">
         <div className="max-w-2xl space-y-2 md:space-y-4">
            
            {/* TOP PILL BADGE */}
            <motion.div
               initial={{ opacity: 0, y: 5 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-1 md:mb-1.5"
            >
               <Star className="h-3 w-3 md:h-4 md:w-4 text-[#F97316] fill-current" />
               <span className="text-[8px] md:text-[10px] font-[900] text-white tracking-[0.2em] uppercase">#1 PUNJAB PREP PLATFORM</span>
            </motion.div>

            {/* HEADINGS - RESPONSIVE SCALING */}
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="space-y-0.5 md:space-y-0"
            >
               <h1 className="text-[26px] xs:text-[32px] sm:text-4xl md:text-5xl lg:text-7xl font-headline font-black text-white leading-[1.1] tracking-tight uppercase">
                  Prepare smarter.
               </h1>
               <h1 className="text-[26px] xs:text-[32px] sm:text-4xl md:text-5xl lg:text-7xl font-headline font-black text-[#F97316] leading-[1.1] tracking-tight uppercase">
                  Score higher.
               </h1>
            </motion.div>

            {/* DESCRIPTION */}
            <motion.p
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="text-[11px] xs:text-[13px] md:text-lg text-slate-300 font-medium max-w-lg leading-snug antialiased"
            >
               Punjab Government Exams di Complete <br className="hidden xs:block" />
               Preparation ik hi Hub te, Latest Patterns de Naal.
            </motion.p>

            {/* TACTICAL BUTTONS */}
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="flex flex-row gap-3 pt-4 md:pt-10"
            >
               <Button asChild className="h-11 md:h-16 px-6 md:px-12 bg-[#F97316] hover:bg-orange-600 text-white font-black text-[10px] md:text-xs tracking-[0.1em] rounded-xl md:rounded-[2rem] shadow-2xl transition-all border-none uppercase">
                  <Link href="/mocks" className="flex items-center">
                     Free Mock <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
               </Button>
               <Button asChild variant="outline" className="h-11 md:h-16 px-6 md:px-12 border-white/20 bg-white/5 text-white font-black text-[10px] md:text-xs tracking-[0.1em] rounded-xl md:rounded-[2rem] transition-all backdrop-blur-md hover:bg-white/10 uppercase">
                  <Link href="/exams">
                     Explore Exams
                  </Link>
               </Button>
            </motion.div>
         </div>
      </div>

      {/* 3. INTEGRATED BOTTOM DATA BAR - PILL STYLE */}
      <div className="mt-8 md:absolute md:bottom-8 md:left-0 md:right-0 z-[40]">
         <div className="container mx-auto px-4 md:px-12 max-w-7xl overflow-hidden">
            <div className="flex flex-row md:grid md:grid-cols-4 gap-2 md:gap-4 overflow-x-auto no-scrollbar pb-4 md:pb-0">
               {liveStats.map((stat, idx) => (
                  <motion.div
                     key={stat.id}
                     initial={{ opacity: 0, y: 5 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.4 + (idx * 0.1) }}
                     className="shrink-0 flex-1 md:flex-none min-w-[120px] md:min-w-0"
                  >
                     <Card className="bg-[#0B1528]/60 backdrop-blur-3xl border border-white/10 p-2.5 md:p-5 rounded-2xl md:rounded-[2.5rem] text-left flex items-center gap-3 md:gap-5 group hover:bg-[#0B1528] transition-all duration-300 shadow-2xl overflow-hidden h-14 md:h-24 w-full">
                        <div className="shrink-0 h-9 w-9 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-transform group-hover:scale-105 shadow-inner">
                           {stat.icon}
                        </div>
                        <div className="min-w-0 flex flex-col justify-center leading-tight">
                           <p className="text-sm md:text-3xl font-headline font-black text-white tabular-nums leading-none mb-0.5 md:mb-1">{stat.val}</p>
                           <p className="text-[7px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">
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
