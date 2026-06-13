'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  BookOpen, 
  ArrowRight,
  ClipboardList,
  ShieldCheck,
  Star,
  Users,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDoc, useFirestore } from '@/firebase';
import { doc } from "firebase/firestore";

/**
 * @fileOverview Final High-Fidelity Hero Section v100.0.
 * MATCHED: Pixel-perfect replica of the provided reference image.
 * STRICT: Title case typography (Prepare Smarter. Score Higher.)
 * DATA: Real-time Firestore statistics integration.
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
      { id: 'q', icon: <BookOpen className="text-blue-400 h-5 w-5 md:h-6 md:w-6" />, val: formatNumber(stats?.totalQuestions, "10,000+"), label: "Practice Questions" },
      { id: 'm', icon: <ClipboardList className="text-orange-400 h-5 w-5 md:h-6 md:w-6" />, val: formatNumber(stats?.totalMocks, "500+"), label: "Mock Tests" },
      { id: 'e', icon: <ShieldCheck className="text-blue-500 h-5 w-5 md:h-6 md:w-6" />, val: formatNumber(stats?.totalBoards, "50+"), label: "Exams Covered" },
      { id: 'u', icon: <Users className="text-emerald-400 h-5 w-5 md:h-6 md:w-6" />, val: formatNumber(stats?.totalUsers, "15,000+"), label: "Registered Students" }
    ];
  }, [stats]);

  if (!mounted) return null;

  return (
    <section className="relative w-full bg-[#050B19] overflow-hidden h-[500px] md:h-[650px] flex flex-col justify-center text-left">
      
      {/* 1. BACKGROUND ENGINE */}
      <div className="absolute inset-0 z-0">
        {/* GOLDEN TEMPLE BASE */}
        <motion.img 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          src="https://i.ibb.co/fYJttX5d/Gemini-Generated-Image-n1so6on1so6on1so.png" 
          alt="Official Punjab Prep Hub" 
          className="w-full h-full object-cover object-[center_30%] md:object-right"
          referrerPolicy="no-referrer"
        />
        
        {/* PUNJAB MAP WATERMARK */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.08]">
           <div className="absolute top-[45%] left-[22%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ea/Outline_Map_of_Punjab_India.svg')] bg-contain bg-no-repeat grayscale invert" />
        </div>

        {/* BLUE SHADING & READABILITY OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050B19] via-[#050B19]/80 to-transparent z-[15]" />
        
        {/* GLOWING POINTS (SUBTLE TECH FEEL) */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary rounded-full blur-[4px] opacity-20 animate-pulse z-[16]" />
        <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-blue-500 rounded-full blur-[4px] opacity-20 animate-pulse z-[16]" />
      </div>

      {/* 2. MAIN CONTENT HUB */}
      <div className="container mx-auto px-6 md:px-16 max-w-7xl relative z-20">
         <div className="max-w-4xl space-y-6 md:space-y-8">
            
            {/* TOP PILL BADGE */}
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-2 md:mb-4"
            >
               <Star className="h-4 w-4 text-[#F97316] fill-current" />
               <span className="text-[10px] md:text-[12px] font-bold text-white tracking-wide">#1 Punjab Exam Preparation Platform</span>
            </motion.div>

            {/* HEADINGS - STRICT CASE (PIXEL PERFECT MATCH) */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="space-y-1 md:space-y-2"
            >
               <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white leading-[1.05] tracking-tight antialiased">
                  Prepare Smarter.<br/>
                  <span className="text-[#F97316]">Score Higher.</span>
               </h1>
            </motion.div>

            {/* SUBTEXT */}
            <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="text-base md:text-2xl text-slate-300 font-medium max-w-2xl leading-relaxed pt-2"
            >
               Punjab Government Exams di Complete<br className="hidden md:block" /> Preparation ik hi Platform te.
            </motion.p>

            {/* TACTICAL BUTTONS */}
            <motion.div
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-4 md:pt-10"
            >
               <Button asChild className="h-14 md:h-18 px-10 md:px-14 bg-[#F97316] hover:bg-orange-600 text-white font-black text-[12px] md:text-[14px] tracking-[0.1em] rounded-2xl shadow-3xl transition-all active:scale-95 border-none">
                  <Link href="/mocks" className="flex items-center">
                     Start Free Mock <ArrowRight className="h-5 w-5 ml-3" />
                  </Link>
               </Button>
               <Button asChild variant="outline" className="h-14 md:h-18 px-10 md:px-14 border-white/30 bg-white/5 text-white font-black text-[12px] md:text-[14px] tracking-[0.1em] rounded-2xl transition-all backdrop-blur-md hover:bg-white/10">
                  <Link href="/exams">
                     Explore Exams
                  </Link>
               </Button>
            </motion.div>
         </div>
      </div>

      {/* 3. INTEGRATED BOTTOM DATA CARDS */}
      <div className="absolute bottom-6 md:bottom-12 left-0 right-0 z-30">
         <div className="container mx-auto px-6 md:px-16 max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
               {liveStats.map((stat, idx) => (
                  <motion.div
                     key={stat.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.4 + (idx * 0.1) }}
                  >
                     <Card className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-5 md:p-8 rounded-[2rem] text-left flex items-center gap-6 group hover:bg-white/[0.06] transition-all duration-500 shadow-2xl overflow-hidden">
                        <div className="shrink-0 h-12 w-12 md:h-16 md:w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110">
                           {stat.icon}
                        </div>
                        <div className="min-w-0 flex flex-col justify-center">
                           <p className="text-xl md:text-4xl font-black text-white leading-none tracking-tight tabular-nums">{stat.val}</p>
                           <p className="text-[9px] md:text-[12px] font-bold text-slate-400 tracking-wider mt-2 truncate">
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
