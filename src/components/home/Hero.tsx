'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  ShieldCheck,
  Users,
  Zap,
  Star,
  Target,
  FileStack,
  ArrowRight,
  Trophy,
  Landmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Majestic Hero Hub v25.0 (Hardened).
 * FIXED: Badge import resolved.
 * FIXED: Standardized icon sizing and vertical downward shift.
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
      if (num >= 1000) return (num / 1000).toFixed(0) + 'K+';
      return num + "+";
    };

    return [
      { 
        id: "q", 
        icon: <Zap className="h-6 w-6 text-blue-600 fill-current" />, 
        circleBg: "bg-blue-50",
        valColor: "text-blue-600",
        val: formatNumber(stats?.totalQuestions, "50K+"), 
        label: "Questions", 
        sub: "High quality practice questions" 
      },
      { 
        id: "m", 
        icon: <ClipboardCheck className="h-6 w-6 text-blue-700" />, 
        circleBg: "bg-blue-50",
        valColor: "text-blue-700",
        val: formatNumber(stats?.totalMocks, "500+"), 
        label: "Mock Tests", 
        sub: "Topic wise & full length mocks" 
      },
      { 
        id: "e", 
        icon: <ShieldCheck className="h-6 w-6 text-blue-600" />, 
        circleBg: "bg-blue-50",
        valColor: "text-blue-600",
        val: formatNumber(stats?.totalBoards, "50+"), 
        label: "Exams", 
        sub: "All major Punjab exams" 
      },
      { 
        id: "u", 
        icon: <Users className="h-6 w-6 text-blue-500" />, 
        circleBg: "bg-blue-50",
        valColor: "text-blue-500",
        val: formatNumber(stats?.totalUsers, "15K+"), 
        label: "Aspirants", 
        sub: "Trust Cracklix for preparation" 
      }
    ];
  }, [stats]);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] pb-12 md:pb-24 border-b border-slate-100 text-left">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50/50 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 pt-10 md:pt-16 space-y-12">
         
         <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* LEFT CONTENT HUB */}
            <div className="space-y-10">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">
                  <div className="bg-blue-600 rounded-full p-0.5"><Star className="h-3 w-3 text-white fill-current" /></div>
                  <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">10,000+ Aspirants Trust Us</span>
               </div>
               
               <div className="space-y-4">
                  <h1 className="text-[28px] xs:text-[34px] sm:text-4xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] uppercase">
                    Prepare smarter. <br />
                    <span className="text-blue-600">Score higher.</span>
                  </h1>
                  <p className="text-base md:text-lg text-slate-500 font-medium max-w-xl leading-relaxed">
                    Punjab Government Exams di Complete Preparation ik hi Center te, Latest Official Patterns de Naal.
                  </p>
               </div>

               <div className="flex flex-wrap gap-3">
                  {["PSSSB", "Punjab Police", "PSTET", "PSPCL", "PPSC"].map((item) => (
                    <Badge key={item} variant="outline" className="px-5 py-2 rounded-full bg-white border-slate-200 text-blue-600 font-bold text-xs shadow-sm uppercase tracking-widest">
                       {item}
                    </Badge>
                  ))}
               </div>

               <div className="flex flex-wrap gap-4 pt-4">
                  <Button asChild className="h-16 px-10 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 gap-3 border-none transition-all active:scale-95">
                     <Link href="/mocks" className="flex items-center gap-2">Start Free Mock Test <ArrowRight className="h-5 w-5" /></Link>
                  </Button>
                  <Button asChild variant="outline" className="h-16 px-10 border-2 border-blue-600 bg-white text-blue-600 font-black text-sm tracking-widest rounded-2xl hover:bg-blue-50 transition-all gap-3">
                     <Link href="/exams" className="flex items-center gap-2">Browse Exams <ArrowRight className="h-5 w-5" /></Link>
                  </Button>
               </div>
            </div>

            {/* RIGHT ILLUSTRATION HUB */}
            <div className="relative flex justify-center lg:pl-12 pt-20 lg:pt-0">
               {/* Floating Visual Nodes - Standardized and Symmetrical */}
               <FloatingNode 
                 icon={<ClipboardCheck className="text-blue-600 h-6 w-6" />} 
                 label="MOCK TESTS" 
                 className="top-[18%] left-[2%] md:left-[5%]" 
               />
               <FloatingNode 
                 icon={<Landmark className="text-orange-500 h-6 w-6" />} 
                 label="PUNJAB EXAMS" 
                 className="top-[18%] right-[2%] md:right-[5%]" 
               />
               <FloatingNode 
                 icon={<FileStack className="text-emerald-500 h-6 w-6" />} 
                 label="PREVIOUS PAPERS" 
                 className="bottom-[2%] left-[2%] md:left-[5%]" 
               />
               <FloatingNode 
                 icon={<Target className="text-blue-500 h-6 w-6" />} 
                 label="DAILY PRACTICE" 
                 className="bottom-[2%] right-[2%] md:right-[5%]" 
               />

               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-blue-100/40 rounded-full blur-3xl -z-10" />
               
               <motion.img 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  src="/images/hero-student.png" 
                  className="w-full max-w-md h-auto object-contain relative z-10"
                  alt="Cracklix Student"
               />
            </div>
         </div>

         {/* FINAL STATS REGISTRY */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-24">
            {liveStats.map((stat) => (
               <Card key={stat.id} className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-xl flex items-center gap-6 group hover:shadow-2xl hover:translate-y-[-4px] transition-all text-left">
                  <div className={cn("h-14 w-14 rounded-full flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform", stat.circleBg)}>
                     {stat.icon}
                  </div>
                  <div className="text-left space-y-0.5">
                     <p className={cn("text-3xl font-black leading-none tracking-tighter", stat.valColor)}>{stat.val}</p>
                     <p className="text-base font-bold text-slate-900 tracking-tight">{stat.label}</p>
                     <p className="text-[10px] font-medium text-slate-400 leading-tight uppercase tracking-widest">{stat.sub}</p>
                  </div>
               </Card>
            ))}
         </div>

      </div>
    </section>
  );
}

function FloatingNode({ icon, label, className }: { icon: React.ReactNode, label: string, className: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        "absolute z-20 bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col items-center gap-3 cursor-pointer transition-all hover:border-blue-200 min-w-[120px] md:min-w-[160px]",
        className
      )}
    >
       <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
          {icon}
       </div>
       <span className="text-[10px] md:text-xs font-black text-[#0F172A] tracking-tighter uppercase whitespace-nowrap">{label}</span>
    </motion.div>
  );
}
