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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDoc, useFirestore } from '@/firebase';
import { doc } from "firebase/firestore";

/**
 * @fileOverview Final "Same to Same" Hero v110.0.
 * FIXED: No more uppercase.
 * FIXED: No more overlapping.
 * FIXED: Reduced overall size for professional high-density look.
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
      { id: 'q', icon: <BookOpen className="text-blue-400 h-4 w-4 md:h-5 md:w-5" />, val: formatNumber(stats?.totalQuestions, "10,000+"), label: "Practice Questions" },
      { id: 'm', icon: <ClipboardList className="text-orange-400 h-4 w-4 md:h-5 md:w-5" />, val: formatNumber(stats?.totalMocks, "500+"), label: "Mock Tests" },
      { id: 'e', icon: <ShieldCheck className="text-blue-500 h-4 w-4 md:h-5 md:w-5" />, val: formatNumber(stats?.totalBoards, "50+"), label: "Exams Covered" },
      { id: 'u', icon: <Users className="text-emerald-400 h-4 w-4 md:h-5 md:w-5" />, val: formatNumber(stats?.totalUsers, "15,000+"), label: "Registered Students" }
    ];
  }, [stats]);

  if (!mounted) return null;

  return (
    <section className="relative w-full bg-[#050B19] overflow-hidden h-[500px] md:h-[600px] flex flex-col justify-center text-left">
      
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
        
        {/* SHADING OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050B19] via-[#050B19]/80 to-transparent z-[10]" />
        
        {/* PUNJAB MAP WATERMARK */}
        <div className="absolute inset-0 z-[11] pointer-events-none opacity-[0.06]">
           <div className="absolute top-[40%] left-[22%] -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ea/Outline_Map_of_Punjab_India.svg')] bg-contain bg-no-repeat grayscale invert" />
        </div>
      </div>

      {/* 2. MAIN CONTENT HUB */}
      <div className="container mx-auto px-6 md:px-12 max-w-7xl relative z-20">
         <div className="max-w-3xl space-y-4 md:space-y-6">
            
            {/* PILL BADGE */}
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-2"
            >
               <Star className="h-3.5 w-3.5 text-[#F97316] fill-current" />
               <span className="text-[9px] md:text-[11px] font-bold text-white tracking-widest uppercase">#1 Punjab Exam Platform</span>
            </motion.div>

            {/* HEADINGS - TITLE CASE (STRICT) */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
            >
               <h1 className="text-4xl md:text-7xl font-black text-white leading-tight tracking-tight antialiased">
                  Prepare Smarter.<br/>
                  <span className="text-[#F97316]">Score Higher.</span>
               </h1>
            </motion.div>

            {/* SUBTEXT - SENTENCE CASE */}
            <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="text-sm md:text-xl text-slate-300 font-medium max-w-xl leading-relaxed"
            >
               Punjab Government Exams di Complete<br className="hidden md:block" /> Preparation ik hi Platform te.
            </motion.p>

            {/* BUTTONS */}
            <motion.div
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="flex flex-row gap-4 pt-4 md:pt-6"
            >
               <Button asChild className="h-12 md:h-14 px-6 md:px-10 bg-[#F97316] hover:bg-orange-600 text-white font-black text-[11px] md:text-xs tracking-wider rounded-xl shadow-xl transition-all active:scale-95 border-none">
                  <Link href="/mocks" className="flex items-center">
                     Start Free Mock <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
               </Button>
               <Button asChild variant="outline" className="h-12 md:h-14 px-6 md:px-10 border-white/30 bg-white/5 text-white font-black text-[11px] md:text-xs tracking-wider rounded-xl transition-all backdrop-blur-md hover:bg-white/10">
                  <Link href="/exams">
                     Explore Exams
                  </Link>
               </Button>
            </motion.div>
         </div>
      </div>

      {/* 3. INTEGRATED BOTTOM DATA BAR (NO OVERLAP) */}
      <div className="absolute bottom-6 md:bottom-8 left-0 right-0 z-30">
         <div className="container mx-auto px-4 md:px-12 max-w-7xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
               {liveStats.map((stat, idx) => (
                  <motion.div
                     key={stat.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.4 + (idx * 0.1) }}
                  >
                     <Card className="bg-white/[0.04] backdrop-blur-xl border border-white/10 p-3 md:p-5 rounded-2xl md:rounded-[1.5rem] text-left flex items-center gap-4 group hover:bg-white/[0.08] transition-all duration-300 shadow-2xl overflow-hidden">
                        <div className="shrink-0 h-9 w-9 md:h-11 md:w-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-transform group-hover:scale-110">
                           {stat.icon}
                        </div>
                        <div className="min-w-0 flex flex-col justify-center">
                           <p className="text-lg md:text-2xl font-black text-white leading-none tracking-tight tabular-nums">{stat.val}</p>
                           <p className="text-[7px] md:text-[10px] font-bold text-slate-400 tracking-wider mt-1 truncate">
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
