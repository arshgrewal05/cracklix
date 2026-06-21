'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  ShieldCheck,
  Users,
  Zap,
  ChevronRight,
  Gem
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";

/**
 * @fileOverview High-Fidelity Hero Restoration v25.0.
 * Recreated to exactly match the provided user screenshot.
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
      icon: <Zap className="h-5 w-5 text-blue-500 fill-current" />,
      val: statsLoading ? "..." : `${formatCompact(stats?.totalQuestions || 439)}+`,
      label: "QUESTIONS",
      bgColor: "bg-blue-50"
    },
    {
      id: "m",
      icon: <ClipboardList className="h-5 w-5 text-indigo-500" />,
      val: statsLoading ? "..." : `${formatCompact(stats?.totalMocks || 8)}+`,
      label: "MOCK TESTS",
      bgColor: "bg-indigo-50"
    },
    {
      id: "e",
      icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
      val: statsLoading ? "..." : `${formatCompact(stats?.totalCategories || 100)}+`,
      label: "EXAMS",
      bgColor: "bg-emerald-50"
    },
    {
      id: "u",
      icon: <Users className="h-5 w-5 text-orange-400" />,
      val: statsLoading ? "..." : `${formatCompact(stats?.totalUsers || 6)}+`,
      label: "ASPIRANTS",
      bgColor: "bg-orange-50"
    }
  ], [stats, statsLoading]);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden bg-white pt-8 pb-16 md:pt-12 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">

          {/* LEFT: Content Hub */}
          <div className="text-left space-y-8 md:space-y-10 pt-4">
            <div className="space-y-6">
              <h1 className="text-2xl md:text-4xl lg:text-[42px] font-medium tracking-tight text-slate-600 leading-[1.3] max-w-2xl antialiased">
                Practice with bilingual mock tests, previous papers and exam-focused preparation verified by official patterns.
              </h1>

              <div className="flex flex-wrap gap-2.5">
                {["PSSSB", "Police", "PSTET", "PSPCL", "PPSC"].map((item) => (
                  <span
                    key={item}
                    className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-400 tracking-tight uppercase"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 pt-2">
              <Button asChild className="h-14 md:h-16 px-10 rounded-full bg-primary hover:bg-blue-600 shadow-2xl shadow-primary/20 text-white font-black uppercase text-[10px] md:text-[11px] tracking-widest gap-3 transition-all active:scale-95 border-none group">
                <Link href="/mocks">
                  START FREE MOCK TEST 
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-14 md:h-16 px-10 rounded-full border border-slate-200 bg-white font-black text-slate-700 uppercase text-[10px] md:text-[11px] tracking-widest gap-3 shadow-sm transition-all active:scale-95">
                <Link href="/pass">
                  <Gem className="h-4 w-4 text-primary" /> ELITE PASS
                </Link>
              </Button>
            </div>
          </div>

          {/* RIGHT: Hero Image */}
          <div className="relative hidden lg:flex justify-end items-start pt-2">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.6 }}
               className="relative h-[300px] xl:h-[350px] w-full max-w-[500px] z-10"
             >
               {heroImageData && (
                 <Image 
                   src={heroImageData.imageUrl} 
                   alt={heroImageData.description}
                   fill
                   priority
                   className="object-contain"
                   sizes="500px"
                 />
               )}
             </motion.div>
          </div>
        </div>

        {/* STATS BAR: MATCHED TO SCREENSHOT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-16 md:mt-24">
          {liveStats.map((stat) => (
            <motion.div 
              key={stat.id} 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 md:p-8 rounded-[2rem] bg-white border border-slate-50 shadow-[0_10px_40px_rgba(0,0,0,0.04)] flex items-center gap-6 group transition-all hover:shadow-xl hover:translate-y-[-4px]"
            >
              <div className={cn("h-12 w-12 md:h-14 md:w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner", stat.bgColor)}>
                {stat.icon}
              </div>
              <div className="text-left min-w-0">
                <p className="text-2xl md:text-4xl font-black text-[#0F172A] leading-none tabular-nums tracking-tighter">
                  {stat.val}
                </p>
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2.5 leading-none">
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
