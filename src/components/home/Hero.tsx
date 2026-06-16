'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight,
  Star,
  Zap,
  LayoutGrid,
  ShieldCheck,
  Users,
  Landmark,
  BookOpen,
  Layers,
  ClipboardList,
  Files,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

/**
 * @fileOverview Native-Scaled Elite Hero Hub v69.0.
 * UPDATED: Restored feature grid with colors and content matching user screenshot.
 */

export default function Hero() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats, loading: statsLoading } = useDoc<any>(statsRef);

  const heroImage = "/images/hero-student.png";

  const featureStats = [
    { 
      label: "Mock Tests", 
      desc: "Exam-focused mock tests", 
      color: "text-blue-600", 
      bgColor: "bg-blue-50", 
      icon: <ClipboardList className="h-5 w-5 md:h-6 md:w-6" /> 
    },
    { 
      label: "Previous Papers", 
      desc: "Previous year question papers", 
      color: "text-emerald-500", 
      bgColor: "bg-emerald-50", 
      icon: <Files className="h-5 w-5 md:h-6 md:w-6" /> 
    },
    { 
      label: "Daily Practice", 
      desc: "Practice daily & stay ahead", 
      color: "text-purple-500", 
      bgColor: "bg-purple-50", 
      icon: <Target className="h-5 w-5 md:h-6 md:w-6" /> 
    },
    { 
      label: "Punjab Exams", 
      desc: "All major Punjab exams at one place", 
      color: "text-orange-500", 
      bgColor: "bg-orange-50", 
      icon: <Landmark className="h-5 w-5 md:h-6 md:w-6" /> 
    }
  ];

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden bg-white pt-6 pb-10 md:pt-20 md:pb-24 text-left w-full border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">
          
          <div className="space-y-4 md:space-y-8 text-center lg:text-left">
            <div className="space-y-3 md:space-y-6">
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm mx-auto lg:mx-0">
                <Star className="h-3 w-3 text-amber-500 fill-current" />
                <span className="text-[9px] md:text-xs font-black text-[#334155] tracking-widest uppercase">
                  {formatNumber(stats?.totalUsers || 15000)}+ ASPIRANTS TRUST CRACKLIX
                </span>
              </motion.div>

              <h1 className="text-[32px] sm:text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[0.95] tracking-tight antialiased uppercase">
                Crack Punjab <br />
                <span className="text-blue-600">Govt Exams</span> <br />
                With Confidence
              </h1>
              
              <p className="text-sm md:text-lg text-slate-500 font-medium max-w-xl leading-relaxed mx-auto lg:mx-0">
                Practice bilingual mock tests and prepare for Punjab Government Exams with verified patterns.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3">
              <Button asChild className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs tracking-widest rounded-2xl shadow-3xl shadow-blue-600/20 border-none transition-all active:scale-95">
                <Link href="/mocks" className="flex items-center gap-2">Start Free Mock Test <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="h-14 px-8 border-2 border-blue-600 bg-white text-blue-600 font-black text-xs tracking-widest rounded-2xl transition-all active:scale-95 hover:bg-blue-50">
                <Link href="/exams">Browse Exams <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end w-full mt-4 lg:mt-0">
             <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative z-10 w-full max-w-[280px] md:max-w-[440px]">
                <img src={heroImage} alt="Cracklix Prep" className="w-full h-auto object-contain drop-shadow-3xl" />
             </motion.div>
          </div>
        </div>

        {/* FEATURE GRID - RECOVERED FROM SCREENSHOT */}
        <div className="mt-8 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
           {featureStats.map((stat, idx) => (
             <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }}>
               <Card className="border-none shadow-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 bg-white hover:translate-y-[-4px] transition-all border border-slate-100 flex items-center gap-4">
                 <div className={cn("h-12 w-12 md:h-14 md:w-14 rounded-xl flex items-center justify-center shrink-0 shadow-inner", stat.bgColor, stat.color)}>
                    {stat.icon}
                 </div>
                 <div className="min-w-0 text-left">
                   <p className="text-sm md:text-lg font-black text-slate-900 tracking-tight leading-none">{stat.label}</p>
                   <p className="text-[10px] md:text-[11px] font-medium text-slate-400 mt-1 leading-tight">{stat.desc}</p>
                 </div>
               </Card>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}

function formatNumber(n: number) {
  if (!n) return "15,000";
  return n.toLocaleString();
}
