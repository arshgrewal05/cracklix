
'use client';

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  Trophy,
  ChevronRight, 
  ClipboardList,
  Users,
  Sparkles,
  Layers,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

/**
 * @fileOverview Definitive Cracklix "Command Center" Hero v35.0.
 * FIXED: Hardened icon imports and hydration state for total stability.
 */

function FloatingCard({ icon, label, val, pos, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={cn(
        "absolute z-20 bg-[#13223C]/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 group hover:bg-[#1A2E50]/90 transition-all duration-300", 
        pos
      )}
    >
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5" }) : icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">{label}</p>
        <p className="text-xl font-extrabold text-white leading-none tabular-nums">{val}</p>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats } = useDoc<any>(statsRef);

  const displayStats = useMemo(() => {
    const qCount = stats?.totalQuestions || 50000;
    const mCount = stats?.totalMocks || 500;
    const uCount = stats?.totalUsers || 15000;
    const accuracy = stats?.averageAccuracy || 94;

    const format = (n: number) => n >= 1000 ? `${(n/1000).toFixed(0)}k+` : n.toString();

    return [
      { label: "Practice Questions", val: format(qCount), icon: <Zap className="h-5 w-5 text-primary" /> },
      { label: "Mock Tests", val: format(mCount), icon: <ClipboardList className="h-5 w-5 text-blue-400" /> },
      { label: "Active Aspirants", val: format(uCount), icon: <Users className="h-5 w-5 text-emerald-400" /> },
      { label: "Success Rate", val: `${accuracy}%`, icon: <Target className="h-5 w-5 text-rose-400" /> }
    ];
  }, [stats]);

  if (!mounted) {
    return (
      <section className="relative min-h-[90vh] bg-[#070D19] flex flex-col justify-center items-center w-full">
         <Zap className="h-10 w-10 text-primary animate-pulse" />
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-[#070D19] overflow-hidden text-left pt-24 pb-16">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-primary/10 to-transparent blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md"
            >
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-[10px] md:text-xs font-semibold uppercase tracking-[0.15em] text-slate-300">
                Punjab's Most Trusted Mock Platform
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight uppercase">
                CRACK PUNJAB <br />
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">GOVT EXAMS</span>
              </h1>
              <p className="text-base md:text-lg text-slate-400 font-normal max-w-xl leading-relaxed">
                Prepare smarter for PSSSB, Punjab Police, PPSC, PSPCL, PSTET and other state exams with real exam-level mock tests, official PYQs, and curated study material.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button asChild className="h-14 px-8 bg-primary hover:bg-orange-600 text-white font-bold uppercase text-xs tracking-wider rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-98 border-none gap-2">
                <Link href="/mocks">
                  Start Free Mock <Zap className="h-4 w-4 fill-current" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-14 px-8 border-white/10 bg-white/[0.02] hover:bg-white/[0.08] text-white font-bold uppercase text-xs tracking-wider rounded-xl transition-all active:scale-98 gap-2">
                <Link href="/exams">
                  Explore Exams <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2.5 pt-2"
            >
              {["PSSSB", "Punjab Police", "PPSC", "PSPCL", "PSTET", "Master Cadre"].map((chip) => (
                <Badge key={chip} variant="outline" className="px-3.5 py-1.5 border-white/5 bg-white/[0.02] text-slate-400 font-medium uppercase text-[10px] tracking-wider rounded-md hover:border-primary/50 hover:text-white transition-all cursor-default">
                  {chip}
                </Badge>
              ))}
            </motion.div>
          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-5 relative hidden lg:block justify-self-center w-full max-w-[420px]">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
               className="relative w-full"
             >
                <div className="relative aspect-[4/5] rounded-[2.5rem] bg-gradient-to-tr from-primary/10 to-blue-500/5 border border-white/10 overflow-hidden shadow-2xl group">
                   <img 
                     src="https://i.ibb.co/gZCGMQNJ/IMG-20260612-WA0010.jpg" 
                     alt="Punjab Government Exam Preparation Hub"
                     className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition-transform duration-700"
                     referrerPolicy="no-referrer"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#070D19] via-transparent to-transparent" />
                </div>

                <FloatingCard 
                    icon={<Target className="text-emerald-400" />} 
                    label="Accuracy" 
                    val="94%" 
                    pos="-top-6 -left-8" 
                    delay={0.6}
                />
                <FloatingCard 
                    icon={<Trophy className="text-amber-400" />} 
                    label="Punjab Rank" 
                    val="#245" 
                    pos="top-1/3 -right-8" 
                    delay={0.8}
                />
                <FloatingCard 
                    icon={<Zap className="text-primary" />} 
                    label="Readiness" 
                    val="82%" 
                    pos="bottom-10 -left-8" 
                    delay={1}
                />
             </motion.div>
          </div>
        </div>

        {/* Bottom Statistics Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 lg:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {displayStats.map((s, i) => (
            <Card key={i} className="border border-white/[0.05] bg-white/[0.02] backdrop-blur-md rounded-2xl p-5 md:p-6 flex flex-col items-center md:items-start text-center md:text-left gap-3 group hover:bg-white/[0.05] transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-white/[0.04] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                {s.icon}
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight">{s.val}</p>
                <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{s.label}</p>
              </div>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
