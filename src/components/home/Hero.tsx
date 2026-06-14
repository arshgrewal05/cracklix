'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight,
  BookOpen,
  ClipboardList,
  ShieldCheck,
  BarChart3,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useDoc, useFirestore } from '@/firebase';
import { doc } from "firebase/firestore";

/**
 * @fileOverview High-Fidelity Unified Hero v600.0 (No Divisions).
 * MATCHED: Smooth left-to-right fade, faint map texture, bold screenshot typography.
 * FIXED: Removed all background lines and container divisions.
 */

export default function Hero() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats } = useDoc<any>(statsRef);

  const statsItems = useMemo(() => [
    { 
      icon: <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />, 
      val: stats?.totalQuestions ? (stats.totalQuestions >= 1000 ? `${(stats.totalQuestions/1000).toFixed(0)}k+` : `${stats.totalQuestions}+`) : "10,000+", 
      label: "Questions" 
    },
    { 
      icon: <ClipboardList className="h-5 w-5 md:h-6 md:w-6 text-orange-400" />, 
      val: stats?.totalMocks ? `${stats.totalMocks}+` : "500+", 
      label: "Mock Tests" 
    },
    { 
      icon: <ShieldCheck className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />, 
      val: stats?.totalBoards ? `${stats.totalBoards}+` : "50+", 
      label: "Exams Covered" 
    },
    { 
      icon: <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-emerald-400" />, 
      val: "Detailed", 
      label: "Analytics" 
    }
  ], [stats]);

  if (!mounted) return null;

  return (
    <section className="relative w-full bg-[#050B19] overflow-hidden min-h-[550px] lg:min-h-[750px] flex flex-col justify-center text-left pt-16 md:pt-0">
      
      {/* 1. UNIFIED BACKGROUND LAYER - NO DIVISIONS */}
      <div className="absolute inset-0 z-0">
         {/* GOLDEN TEMPLE ASSET */}
         <div className="absolute inset-0 lg:left-1/3">
            <motion.img 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ duration: 1.2 }}
              src="https://i.ibb.co/LXgcLVVq/Gemini-Generated-Image-n1so6on1so6on1so.png" 
              alt="Golden Temple" 
              className="w-full h-full object-cover object-center lg:object-right"
              referrerPolicy="no-referrer"
            />
            {/* Smooth gradient to blend into dark background on the left */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050B19] via-[#050B19]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050B19] via-transparent to-transparent" />
         </div>

         {/* PUNJAB MAP TEXTURE - SUBTLE OVERLAY */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay">
            <img 
              src="https://www.mapsofindia.com/maps/punjab/punjab-map.jpg" 
              className="w-full h-full object-cover grayscale invert" 
              alt="Punjab Map Texture"
            />
         </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-[1440px] relative z-[20]">
        <div className="max-w-4xl space-y-6 md:space-y-10">
           
           {/* SCREENSHOT MATCHED BADGE */}
           <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
           >
              <div className="h-4 w-4 md:h-5 md:w-5 rounded-full bg-primary/20 flex items-center justify-center">
                <Star className="h-2.5 w-2.5 md:h-3 md:w-3 text-primary fill-current" />
              </div>
              <span className="text-[9px] md:text-xs font-black text-white uppercase tracking-[0.15em]">#1 Punjab Exam Preparation Platform</span>
           </motion.div>

           {/* SCREENSHOT MATCHED HEADLINES */}
           <div className="space-y-1">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-[42px] sm:text-6xl md:text-8xl lg:text-[100px] font-headline font-black text-white leading-[1] tracking-tighter uppercase"
              >
                 Prepare Smarter.
              </motion.h1>
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[42px] sm:text-6xl md:text-8xl lg:text-[100px] font-headline font-black text-primary leading-[1] tracking-tighter uppercase"
              >
                 Score Higher.
              </motion.h1>
           </div>

           <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-xl md:text-2xl text-slate-300 font-medium max-w-2xl leading-relaxed antialiased"
           >
              Punjab Government Exams di Complete <br className="hidden md:block" />
              Preparation ik hi Platform te.
           </motion.p>

           {/* SCREENSHOT MATCHED BUTTONS */}
           <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-4"
           >
              <Button asChild className="h-14 md:h-16 px-10 md:px-14 bg-primary hover:bg-orange-600 text-white font-black text-xs md:text-sm tracking-widest rounded-2xl shadow-3xl shadow-primary/20 transition-all border-none uppercase active:scale-95">
                 <Link href="/mocks" className="flex items-center gap-3">
                    Start Free Mock <ArrowRight className="h-5 w-5" />
                 </Link>
              </Button>
              <Button asChild variant="outline" className="h-14 md:h-16 px-10 md:px-14 bg-white/5 border-white/20 text-white hover:bg-white/10 font-black text-xs md:text-sm tracking-widest rounded-2xl transition-all backdrop-blur-md uppercase border-[1.5px] shadow-2xl">
                 <Link href="/exams">Explore Exams</Link>
              </Button>
           </motion.div>

           {/* STATS HUB */}
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pt-12 md:pt-20">
              {statsItems.map((item, idx) => (
                 <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + (idx * 0.1) }}
                    className="group"
                 >
                    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-left space-y-4 hover:bg-white/[0.06] transition-all duration-300 shadow-2xl">
                       <div className="flex items-center gap-4 md:gap-5">
                          <div className="shrink-0 h-10 w-10 md:h-12 md:w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                             {item.icon}
                          </div>
                          <div className="min-w-0">
                             <p className="text-xl md:text-3xl font-headline font-black text-white tabular-nums leading-none mb-1">{item.val}</p>
                             <p className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] truncate">{item.label}</p>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              ))}
           </div>

        </div>
      </div>
    </section>
  );
}
