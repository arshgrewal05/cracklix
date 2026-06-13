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
  BookOpen,
  Layers,
  Search,
  Newspaper,
  ShieldCheck,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

/**
 * @fileOverview Definitive Cracklix "Command Center" Hero v30.0.
 * STABILITY: Guaranteed hydration consistency and explicit icon imports.
 */

function FloatingCard({ icon, label, val, pos, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className={cn(
        "absolute z-20 bg-white/10 backdrop-blur-2xl border border-white/10 p-5 rounded-[2rem] shadow-5xl flex items-center gap-4 group hover:bg-white/20 transition-all",
        pos
      )}
    >
      <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6" }) : icon}
      </div>
      <div className="text-left">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className="text-2xl font-black text-white leading-none tabular-nums">{val}</p>
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
      { label: "Questions", val: format(qCount), icon: <Zap className="h-4 w-4 text-primary" /> },
      { label: "Mock Tests", val: format(mCount), icon: <ClipboardList className="h-4 w-4 text-blue-400" /> },
      { label: "Aspirants", val: format(uCount), icon: <Users className="h-4 w-4 text-emerald-400" /> },
      { label: "Accuracy", val: `${accuracy}%`, icon: <Target className="h-4 w-4 text-rose-400" /> }
    ];
  }, [stats]);

  if (!mounted) {
    return (
      <section className="relative min-h-[90vh] bg-[#0B1528] flex flex-col justify-center items-center w-full">
         <Zap className="h-10 w-10 text-primary animate-pulse" />
      </section>
    );
  }

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen flex flex-col justify-center bg-[#0B1528] overflow-hidden text-left">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 py-12 md:py-20">
        <div className="grid lg:grid-cols-12 gap-12 md:gap-20 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-10 md:space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h1 className="text-5xl md:text-8xl lg:text-[100px] font-headline font-black text-white leading-[0.9] tracking-tighter uppercase">
                CRACK <br />
                PUNJAB <br />
                <span className="text-primary italic">GOVT EXAMS</span>
              </h1>
              <p className="text-base md:text-2xl text-slate-400 font-medium max-w-2xl leading-relaxed">
                Prepare for PSSSB, Punjab Police, PPSC, PSPCL, PSTET and more through real exam-level mock tests, official PYQs, and daily current affairs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Button asChild className="h-16 md:h-20 px-10 md:px-14 bg-primary hover:bg-orange-600 text-white font-black uppercase text-[10px] md:text-xs tracking-[0.2em] rounded-2xl md:rounded-3xl shadow-4xl transition-all active:scale-95 border-none gap-4">
                <Link href="/mocks">
                  START FREE MOCK <Zap className="h-5 w-5 fill-current" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-16 md:h-20 px-10 md:px-14 border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] md:text-xs tracking-[0.2em] rounded-2xl md:rounded-3xl transition-all active:scale-95 gap-4">
                <Link href="/exams">
                  EXPLORE EXAMS <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            {/* Official Recruitment Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2.5 pt-2"
            >
              {["PSSSB", "Punjab Police", "PPSC", "PSPCL", "PSTET", "Master Cadre"].map((chip) => (
                <Badge key={chip} variant="outline" className="px-4 py-2 border-white/5 bg-white/5 text-slate-400 font-black uppercase text-[9px] tracking-widest rounded-lg hover:border-primary/50 hover:text-white transition-all cursor-default">
                  {chip}
                </Badge>
              ))}
            </motion.div>
          </div>

          {/* Right Visual Column (With High-Fidelity Custom Image) */}
          <div className="lg:col-span-5 relative hidden lg:block">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
               className="relative"
             >
                <div className="relative aspect-square rounded-[4rem] md:rounded-[5rem] bg-gradient-to-tr from-primary/20 to-blue-500/10 border border-white/10 overflow-hidden shadow-5xl group">
                   <img 
                     src="https://i.ibb.co/gZCGMQNJ/IMG-20260612-WA0010.jpg" 
                     alt="Punjab Selection Prep"
                     className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-1000"
                     referrerPolicy="no-referrer"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528] via-transparent to-transparent" />
                </div>

                <FloatingCard 
                   icon={<Target className="text-white fill-current" />} 
                   label="ACCURACY" 
                   val="94%" 
                   pos="-top-6 -left-8" 
                   delay={0.6}
                />
                <FloatingCard 
                   icon={<Trophy className="text-white" />} 
                   label="PUNJAB RANK" 
                   val="#245" 
                   pos="top-1/3 -right-8" 
                   delay={0.8}
                />
                <FloatingCard 
                   icon={<Zap className="text-white fill-current" />} 
                   label="READINESS" 
                   val="82%" 
                   pos="bottom-10 -left-8" 
                   delay={1}
                />
             </motion.div>
          </div>
        </div>

        {/* Integrated Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
        >
          {displayStats.map((s, i) => (
            <Card key={i} className="border-none bg-white/5 backdrop-blur-xl rounded-2xl md:rounded-[2rem] p-6 md:p-8 flex flex-col items-center md:items-start text-center md:text-left gap-3 group hover:bg-white/10 transition-all border border-white/5">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-white/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <div className="space-y-1">
                <p className="text-xl md:text-3xl font-headline font-black text-white leading-none tracking-tight">{s.val}</p>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">{s.label}</p>
              </div>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}