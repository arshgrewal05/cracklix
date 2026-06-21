'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  ShieldCheck,
  Users,
  Zap,
  ChevronRight,
  Star,
  Gem
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useDoc, useFirestore, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";

/**
 * @fileOverview Official Hero Section v22.1.
 * UPDATED: Simplified stats labels.
 */

const formatCompact = (num: number) => {
  if (num === undefined || num === null) return "...";
  if (num === 0) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export default function Hero() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  const heroImageData = PlaceHolderImages.find(img => img.id === 'hero-student');

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats, loading: statsLoading } = useDoc<any>(statsRef);

  const liveStats = useMemo(() => [
    {
      id: "q",
      icon: <Zap className="h-4 w-4 text-blue-600 fill-current" />,
      val: statsLoading ? "..." : `${formatCompact(stats?.totalQuestions)}+`,
      label: "QUESTIONS",
      bgColor: "bg-blue-50"
    },
    {
      id: "m",
      icon: <ClipboardList className="h-4 w-4 text-indigo-600" />,
      val: statsLoading ? "..." : `${formatCompact(stats?.totalMocks)}+`,
      label: "MOCK TESTS",
      bgColor: "bg-indigo-50"
    },
    {
      id: "e",
      icon: <ShieldCheck className="h-4 w-4 text-emerald-600" />,
      val: statsLoading ? "..." : `${formatCompact(stats?.totalCategories)}+`,
      label: "EXAMS",
      bgColor: "bg-emerald-50"
    },
    {
      id: "u",
      icon: <Users className="h-4 w-4 text-orange-500" />,
      val: statsLoading ? "..." : `${formatCompact(stats?.totalUsers)}+`,
      label: "ASPIRANTS",
      bgColor: "bg-orange-50"
    }
  ], [stats, statsLoading]);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-blue-50 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT: Text Hub */}
          <div className="text-left space-y-6 md:space-y-8">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm"
            >
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 animate-pulse" />
              <span className="text-[10px] md:text-[11px] font-black text-slate-700 tracking-tight uppercase">
                {statsLoading ? "..." : (stats?.totalUsers || 0).toLocaleString()} ASPIRANTS TRUST CRACKLIX
              </span>
            </motion.div>

            <div className="space-y-4 md:space-y-6">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#0F172A] leading-[1.05]">
                Crack Punjab <br/>
                <span className="block text-primary">
                  Government Exams
                </span>
                With Confidence
              </h1>

              <p className="text-base md:text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
                Practice with bilingual mock tests, previous papers and exam-focused preparation verified by official patterns.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {["PSSSB", "Police", "PSTET", "PSPCL", "PPSC"].map(
                  (item) => (
                    <span
                      key={item}
                      className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-500 tracking-tight"
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild className="h-14 md:h-16 px-10 rounded-2xl bg-primary hover:bg-blue-700 shadow-xl text-white font-black uppercase text-[11px] tracking-widest gap-2 transition-all active:scale-95 border-none">
                <Link href="/mocks">Start Free Mock Test <ChevronRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="h-14 md:h-16 px-10 rounded-2xl border-2 border-slate-200 bg-white font-black text-slate-700 uppercase text-[11px] tracking-widest gap-2 shadow-sm transition-all active:scale-95">
                <Link href="/pass"><Gem className="h-4 w-4 text-primary" /> Elite Pass</Link>
              </Button>
            </div>
          </div>

          {/* RIGHT: Hero Image */}
          <div className="relative hidden lg:flex justify-end">
             <div className="absolute -inset-10 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.6 }}
               className="relative h-[400px] xl:h-[500px] w-full max-w-[550px] z-10"
             >
               {heroImageData && (
                 <Image 
                   src={heroImageData.imageUrl} 
                   alt={heroImageData.description}
                   fill
                   priority
                   className="object-contain drop-shadow-3xl"
                   sizes="550px"
                   data-ai-hint={heroImageData.imageHint}
                 />
               )}
             </motion.div>
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12 md:mt-20">
          {liveStats.map((stat) => (
            <motion.div 
              key={stat.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 md:p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm flex items-center gap-4 group transition-all hover:shadow-xl hover:translate-y-[-4px]"
            >
              <div className={cn("h-12 w-12 md:h-14 md:w-14 rounded-full flex items-center justify-center shrink-0 shadow-inner", stat.bgColor)}>
                {stat.icon}
              </div>
              <div className="text-left min-w-0">
                <p className="text-2xl md:text-3xl font-black text-[#0F172A] leading-none tabular-nums truncate">
                  {stat.val}
                </p>
                <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 leading-none">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
