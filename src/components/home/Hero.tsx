'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  Landmark, 
  ArrowRight,
  Star,
  ShieldCheck,
  LayoutGrid,
  Users,
  FileStack,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

/**
 * @fileOverview Official Cracklix High-Fidelity Hero v45.0.
 * SIZING: Implemented user-specified dimensions (700-800px desktop / 300-400px mobile).
 * ORDERING: Trust -> Text -> Pills -> CTAs -> Image -> Stats (Mobile Stack).
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

  const liveStats = useMemo(() => {
    const format = (n: number, fallback: string) => {
      if (!n) return fallback;
      return n >= 1000 ? `${(n/1000).toFixed(0)}K+` : n.toString() + "+";
    };
    return [
      { label: "Questions", sub: "Verified MCQs", val: format(stats?.totalQuestions, "50K+"), icon: <Zap className="text-white fill-current" />, color: "bg-blue-600" },
      { label: "Mock Tests", sub: "Topic wise tests", val: format(stats?.totalMocks, "500+"), icon: <LayoutGrid className="text-white" />, color: "bg-indigo-600" },
      { label: "Exams", sub: "All state boards", val: format(stats?.totalBoards, "50+"), icon: <ShieldCheck className="text-white" />, color: "bg-emerald-600" },
      { label: "Aspirants", sub: "Preparing currently", val: format(stats?.totalUsers, "15K+"), icon: <Users className="text-white" />, color: "bg-orange-500" }
    ];
  }, [stats]);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] pt-10 pb-16 md:pt-20 md:pb-32 text-left w-full border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* 1. CONTENT HUB (LEFT) */}
          <div className="space-y-8 text-center lg:text-left order-1">
            <div className="space-y-6">
              {/* Trust Badge (Step 1) */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mx-auto lg:mx-0"
              >
                <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
                <span className="text-[10px] md:text-xs font-bold text-slate-600 tracking-widest">10,000+ Aspirants Trust Cracklix</span>
              </motion.div>

              {/* Heading (Step 2) */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.05] antialiased">
                Crack Punjab <br />
                <span className="text-blue-600">Government Exams</span> <br />
                With Confidence
              </h1>
              
              {/* Description (Step 3) */}
              <p className="text-base md:text-lg text-slate-500 font-medium max-w-xl leading-relaxed mx-auto lg:mx-0">
                Practice bilingual mock tests and prepare for Punjab Government Exams with confidence. 
                Access exam-focused practice, previous papers and performance tracking in one place.
              </p>

              {/* Exam Pills (Step 4) */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 pt-2">
                {["PSSSB", "Punjab Police", "PSTET", "PSPCL", "PPSC"].map((pill) => (
                  <div key={pill} className="bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded-full font-bold text-[10px] md:text-xs tracking-wide shadow-sm hover:border-blue-600 hover:text-blue-600 transition-all cursor-default">
                    {pill}
                  </div>
                ))}
              </div>

              {/* CTA Hub (Step 5) */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Button asChild className="h-12 md:h-16 px-10 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm tracking-widest rounded-2xl shadow-xl shadow-blue-600/20 gap-3 border-none transition-all active:scale-95">
                  <Link href="/mocks">Start Free Mock Test <ArrowRight className="h-5 w-5" /></Link>
                </Button>
                <Button asChild variant="outline" className="h-12 md:h-16 px-10 border-2 border-blue-600 bg-white text-blue-600 font-black text-sm tracking-widest rounded-2xl shadow-sm transition-all active:scale-95 hover:bg-blue-50">
                  <Link href="/exams">Browse Exams</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* 2. ILLUSTRATION HUB (RIGHT / Step 6 on Mobile) */}
          <div className="relative flex items-center justify-center lg:justify-end w-full order-2">
             <div className="relative w-full max-w-[350px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] xl:max-w-[800px] aspect-square flex items-center justify-center">
                
                {/* Responsive Large Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="relative z-10 w-full h-full"
                >
                   <Image 
                     src={heroImage}
                     alt="Cracklix Student" 
                     width={800}
                     height={800}
                     className="w-full h-auto drop-shadow-3xl object-contain"
                     priority
                   />
                </motion.div>

                {/* Floating Action Cards - Corner Positioned (Desktop Only) */}
                <div className="absolute inset-0 pointer-events-none hidden lg:block">
                  <FloatingNode 
                     position="top-[5%] left-[-5%]"
                     icon={<Zap className="h-4 w-4 text-blue-600 fill-current" />}
                     title="MOCK TESTS"
                     delay={0.3}
                     href="/mocks"
                  />
                  <FloatingNode 
                     position="top-[5%] right-[-5%]"
                     icon={<Landmark className="h-4 w-4 text-orange-500" />}
                     title="PUNJAB EXAMS"
                     delay={0.6}
                     href="/exams"
                  />
                  <FloatingNode 
                     position="bottom-[10%] left-[-8%]"
                     icon={<Target className="h-4 w-4 text-purple-600" />}
                     title="FREE PRACTICE"
                     delay={0.5}
                     href="/practice"
                  />
                  <FloatingNode 
                     position="bottom-[10%] right-[-8%]"
                     icon={<FileStack className="h-4 w-4 text-emerald-600" />}
                     title="PREVIOUS PAPERS"
                     delay={0.4}
                     href="/pyqs"
                  />
                </div>
             </div>
          </div>

          {/* 3. MOBILE FEATURE GRID (Step 6 Alternate) */}
          <div className="lg:hidden order-3 pt-4">
             <div className="grid grid-cols-2 gap-3">
                <MobileFeatureCard icon={<Zap className="text-blue-600" />} title="MOCK TESTS" href="/mocks" />
                <MobileFeatureCard icon={<Landmark className="text-orange-500" />} title="PUNJAB EXAMS" href="/exams" />
                <MobileFeatureCard icon={<Target className="text-purple-600" />} title="FREE PRACTICE" href="/practice" />
                <MobileFeatureCard icon={<FileStack className="text-emerald-600" />} title="PREVIOUS PAPERS" href="/pyqs" />
             </div>
          </div>
        </div>

        {/* BOTTOM STATS HUB (Step 7) */}
        <div className="mt-16 md:mt-24">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {liveStats.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-none shadow-xl rounded-3xl p-5 md:p-10 bg-white flex flex-col md:flex-row items-center gap-4 md:gap-8 hover:translate-y-[-4px] transition-all border border-slate-100 group text-center md:text-left">
                    <div className={cn("h-12 w-12 md:h-16 md:w-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform", stat.color)}>
                      {stat.icon}
                    </div>
                    <div className="space-y-1.5">
                      {statsLoading ? (
                        <Skeleton className="h-8 w-24 bg-slate-100" />
                      ) : (
                        <p className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter leading-none tabular-nums">{stat.val}</p>
                      )}
                      <p className="text-[10px] md:text-sm font-black text-slate-900 uppercase tracking-widest leading-none">{stat.label}</p>
                      <p className="text-[8px] md:text-[10px] font-medium text-slate-400 leading-tight hidden md:block uppercase tracking-wider">{stat.sub}</p>
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

function MobileFeatureCard({ icon, title, href }: { icon: React.ReactNode, title: string, href: string }) {
   return (
      <Link href={href} className="block w-full">
         <Card className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center gap-3 active:scale-95 transition-all">
            <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
               {icon}
            </div>
            <span className="text-[10px] font-black text-slate-900 tracking-tight leading-none uppercase">{title}</span>
         </Card>
      </Link>
   )
}

function FloatingNode({ position, icon, title, delay, href }: { position: string, icon: React.ReactNode, title: string, delay: number, href: string }) {
   return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay, duration: 0.8 }}
        className={cn("absolute z-20 w-[180px] xl:w-[220px]", position)}
      >
         <Link href={href}>
            <Card className="p-5 rounded-2xl md:rounded-3xl bg-white/95 backdrop-blur-xl border-none shadow-2xl flex items-center gap-4 group hover:shadow-primary/10 hover:translate-y-[-4px] transition-all cursor-pointer pointer-events-auto">
               <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-blue-50 transition-colors">
                  {icon}
               </div>
               <p className="text-[11px] font-black text-slate-900 tracking-widest truncate leading-none uppercase">{title}</p>
            </Card>
         </Link>
      </motion.div>
   )
}
