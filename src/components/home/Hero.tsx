'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  Play,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Original High-Fidelity Hero Hub v1.0 (Restored).
 * Features: Split-screen architecture with institutional illustration.
 */

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-20 md:pt-20 md:pb-32">
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 md:gap-20">
          
          {/* TEXT CONTENT */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 md:space-y-10"
          >
            <div className="space-y-6">
              <div className="flex flex-col items-center lg:items-start gap-4">
                <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-sm">
                   Official Preparation Node
                </Badge>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-8xl font-black tracking-tight text-[#0F172A] leading-[0.9] antialiased">
                Crack Punjab <br/>
                <span className="text-primary font-black">Govt Exams</span>
              </h1>

              <p className="text-base md:text-xl lg:text-2xl text-slate-500 font-medium max-w-2xl leading-tight tracking-tight">
                Prepare for PSSSB, PPSC, and Punjab Police with high-fidelity bilingual mock tests and verified patterns.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Button
                asChild
                className="w-full sm:w-auto h-16 md:h-20 px-10 md:px-14 bg-[#0B1528] hover:bg-black text-white font-black uppercase text-[11px] md:text-[13px] tracking-widest rounded-2xl shadow-4xl border-none transition-all active:scale-95 group/btn"
              >
                <Link href="/mocks" className="flex items-center justify-center gap-4">
                  <Play className="h-5 w-5 fill-primary text-primary" /> Start Free Mock Test
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full sm:w-auto h-16 md:h-20 px-10 border-2 border-slate-100 bg-white text-[#0B1528] font-black uppercase text-[11px] md:text-[13px] tracking-widest rounded-2xl shadow-sm hover:bg-slate-50 transition-all active:scale-95 group/btn"
              >
                <Link href="/exams" className="flex items-center justify-center gap-3">
                   Browse Exams <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
               <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" /> Verified Pattern
               </div>
               <div className="w-px h-4 bg-slate-200" />
               <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                  <Zap className="h-4 w-4 text-primary" /> Live Ranking
               </div>
            </div>
          </motion.div>

          {/* HERO IMAGE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:flex justify-end"
          >
            <div className="relative h-[500px] md:h-[650px] w-full max-w-[600px]">
               <div className="absolute inset-0 bg-primary/5 rounded-[4rem] rotate-3 -z-10" />
               <div className="absolute inset-0 bg-slate-50 rounded-[4rem] -rotate-2 -z-20 border border-slate-100 shadow-inner" />
               
               <Image 
                 src="/images/hero-student.png" 
                 alt="Punjab Student Preparation" 
                 fill 
                 priority
                 className="object-contain drop-shadow-3xl"
                 sizes="600px"
               />

               {/* Floating elements */}
               <div className="absolute top-20 -left-10 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 animate-bounce duration-[3000ms]">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                        <ShieldCheck className="h-6 w-6" />
                     </div>
                     <div className="text-left">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Patterns</p>
                        <p className="text-xs font-bold text-[#0F172A]">Verified Node</p>
                     </div>
                  </div>
               </div>

               <div className="absolute bottom-20 -right-4 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 animate-pulse">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <GraduationCap className="h-6 w-6" />
                     </div>
                     <div className="text-left">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Success</p>
                        <p className="text-xs font-bold text-[#0F172A]">15K+ Learners</p>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
