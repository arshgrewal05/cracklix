'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Star, 
  ArrowRight,
  BookOpen,
  ClipboardList,
  Tv,
  FileText as FileTextIcon,
  Users,
  CheckCheck,
  Trophy,
  Play,
  MonitorPlay,
  FileSearch,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useDoc, useFirestore } from '@/firebase';
import { doc } from "firebase/firestore";
import Logo from "@/components/brand/Logo";

// Card for the floating features around the student
const FloatingCard = ({ icon, label, href, className, colorClass }: { icon: React.ReactNode, label: string, href: string, className: string, colorClass: string }) => (
  <motion.div 
    className={cn(
      "absolute bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-3 flex items-center gap-3 border border-slate-50 group cursor-pointer z-20",
      className
    )}
    whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
  >
    <div className={cn("p-2 rounded-lg", colorClass)}>
      {icon}
    </div>
    <span className="text-[11px] md:text-sm font-black text-slate-700 uppercase tracking-tight">{label}</span>
  </motion.div>
);

// Stat card for the base bar
const StatCard = ({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => (
  <div className="bg-white rounded-3xl p-4 md:p-6 flex flex-col items-center text-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-50 transition-all hover:border-primary/20 group">
    <div className="mb-3 h-12 w-12 flex items-center justify-center bg-slate-50 rounded-2xl text-primary transition-colors group-hover:bg-primary/10">
      {icon}
    </div>
    <p className="text-xl md:text-2xl font-black text-slate-900 tabular-nums">{value}</p>
    <p className="text-[9px] md:text-xs text-slate-400 font-black uppercase tracking-widest mt-1">{label}</p>
  </div>
);

export default function Hero() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats } = useDoc<any>(statsRef);
  
  const formatStat = (num: number, fallback: string) => {
      if (!num || !mounted) return fallback;
      if (num >= 1000) return (num / 1000).toFixed(0) + 'k+';
      return num.toString() + '+';
  };

  const totalQuestions = formatStat(stats?.totalQuestions, "10,000+");
  const totalMocks = formatStat(stats?.totalMocks, "100+");

  if (!mounted) {
    return <section className="w-full bg-[#F8FAFC] py-12 md:py-24 min-h-screen"></section>;
  }

  return (
    <section className="relative w-full bg-[#F8FAFC] pt-6 pb-20 md:pt-12 md:pb-32 overflow-hidden text-left">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-blue-50/50 blur-[120px] rounded-full -z-0" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-blue-50/50 blur-[100px] rounded-full -z-0" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="flex flex-col items-center">

          {/* Top Bar Navigation Nodes */}
          <div className="w-full flex justify-between items-center mb-10 md:mb-16">
            <Logo variant="dark" />
            <div className="bg-white rounded-2xl shadow-xl shadow-blue-900/5 px-4 py-2.5 flex items-center gap-3 border border-slate-50">
              <div className="h-8 w-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-400">
                <Star className="h-5 w-5 fill-current" />
              </div>
              <div className="text-left">
                <p className="text-xs md:text-sm font-black text-[#0F172A] leading-none uppercase tracking-tight">10,000+</p>
                <p className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Students Trust Us</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
            
            {/* Left Column: Content */}
            <div className="space-y-8 md:space-y-12">
               <div className="space-y-6">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight uppercase"
                  >
                    Your Journey to <br/>
                    <span className="text-primary">Government Job</span> <br/>
                    Starts Here!
                  </motion.h1>

                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-xl text-slate-500 text-base md:text-xl font-medium leading-relaxed"
                  >
                    Best preparation platform for all major <br className="hidden md:block" /> Punjab Government Exams.
                  </motion.p>
               </div>

               {/* Exam Category Pills */}
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="flex flex-wrap items-center gap-3"
               >
                  {["PSSSB", "PCS", "PSPCL", "CTET", "PSTET"].map((tag) => (
                    <div key={tag} className="px-5 py-2 bg-white rounded-full text-[10px] md:text-xs font-black text-slate-600 uppercase tracking-widest shadow-sm border border-slate-100 hover:border-primary/30 transition-all cursor-default">
                      {tag}
                    </div>
                  ))}
               </motion.div>

               {/* Large CTA Buttons */}
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.3 }}
                 className="flex flex-col sm:flex-row gap-4"
               >
                  <Button asChild className="h-14 md:h-16 px-10 bg-primary hover:bg-blue-700 text-white rounded-2xl shadow-2xl shadow-blue-900/20 font-black uppercase text-xs md:text-sm tracking-widest gap-4 border-none group transition-all active:scale-95">
                    <Link href="/mocks" className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" /> Start Learning 
                      <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform ml-2">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-14 md:h-16 px-10 rounded-2xl border-2 border-primary text-primary hover:bg-blue-50 font-black uppercase text-xs md:text-sm tracking-widest gap-4 group transition-all active:scale-95">
                    <Link href="/mocks" className="flex items-center gap-2">
                      <ClipboardList className="h-5 w-5" /> Take Free Mock Test
                      <div className="h-8 w-8 bg-primary/5 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform ml-2">
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </Link>
                  </Button>
               </motion.div>
            </div>

            {/* Right Column: Student Illustration Hub */}
            <div className="relative flex items-center justify-center py-10 lg:py-0">
               {/* Floating Cards (Desktop only) */}
               <div className="hidden md:block">
                  <FloatingCard 
                    icon={<MonitorPlay className="h-4 w-4" />} 
                    label="Live Classes" 
                    href="#" 
                    className="top-[10%] left-[-10%]" 
                    colorClass="bg-blue-50 text-blue-600"
                  />
                  <FloatingCard 
                    icon={<FileTextIcon className="h-4 w-4" />} 
                    label="Study Material" 
                    href="/notes" 
                    className="top-[10%] right-[-10%]" 
                    colorClass="bg-purple-50 text-purple-600"
                  />
                  <FloatingCard 
                    icon={<Zap className="h-4 w-4" />} 
                    label="Mock Tests" 
                    href="/mocks" 
                    className="bottom-[35%] left-[-15%]" 
                    colorClass="bg-emerald-50 text-emerald-600"
                  />
                  <FloatingCard 
                    icon={<FileSearch className="h-4 w-4" />} 
                    label="Previous Papers" 
                    href="/pyqs" 
                    className="bottom-[35%] right-[-15%]" 
                    colorClass="bg-orange-50 text-orange-600"
                  />
               </div>

               {/* The Student Image - Zoomed / Increased Size */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.7 }}
                 className="relative w-full max-w-[420px] sm:max-w-[520px] lg:max-w-[620px] xl:max-w-[700px] z-10"
               >
                  <img
                    src="/images/hero-student.png"
                    alt="Cracklix Student"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
               </motion.div>

               {/* Background Decorative patterns */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(37,99,235,0.05)_1px,transparent_1px)] bg-[size:30px_30px] opacity-50" />
            </div>

          </div>

          {/* Stats Section Bar */}
          <div className="mt-16 md:mt-24 w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <StatCard icon={<Tv className="h-6 w-6"/>} value="500+" label="Live Classes" />
              <StatCard icon={<FileTextIcon className="h-6 w-6"/>} value={totalQuestions} label="Practice Questions" />
              <StatCard icon={<CheckCheck className="h-6 w-6"/>} value={totalMocks} label="Mock Tests" />
              <StatCard icon={<Trophy className="h-6 w-6"/>} value="Top Faculty" label="Expert Guidance" />
            </div>
          </div>

          {/* Bottom Trust Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 w-full max-w-2xl"
          >
            <div className="bg-gradient-to-r from-primary to-blue-700 rounded-3xl p-5 md:p-6 flex items-center justify-between gap-6 shadow-2xl shadow-blue-900/20 text-white">
              <div className="flex items-center gap-4">
                 <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <img key={i} className="inline-block h-10 w-10 md:h-12 md:w-12 rounded-full ring-2 ring-primary bg-slate-200 border border-white" src={`https://picsum.photos/seed/avatar${i}/100`} alt="student"/>
                   ))}
                 </div>
                 <p className="text-xs md:text-base font-black uppercase tracking-tight">Join 10,000+ Successful Aspirants Today!</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                 <Trophy className="h-5 w-5 text-amber-300" />
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
