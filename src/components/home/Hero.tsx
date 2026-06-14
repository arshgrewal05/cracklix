'use client';

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, BookOpen, ClipboardList, ShieldCheck, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Final Hardened Scaling Hero Node v30.0.
 * UPDATED: Removed dark box background; headlines float directly over sky-blue shading.
 * UPDATED: High-lifted stats grid for full background integration.
 */

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const goldenTempleImg = "https://i.ibb.co/LXgcLVVq/Gemini-Generated-Image-n1so6on1so6on1so.png";
  const punjabMap = "https://www.mapsofindia.com/maps/punjab/punjab-map.jpg";

  if (!mounted) {
    return <section className="w-full aspect-video bg-[#020817]" />;
  }

  return (
    <section className="relative w-full overflow-hidden flex flex-col bg-[#020817]">
      
      {/* 1. RESPONSIVE BACKGROUND HUB - PROPORTIONAL SCALING */}
      <div className="relative w-full aspect-[14/9] md:aspect-[21/9] lg:aspect-[28/9] overflow-hidden">
         {/* BASE LAYER: GOLDEN TEMPLE (FULL VISIBILITY) */}
         <img 
            src={goldenTempleImg} 
            alt="Golden Temple" 
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
         />

         {/* SHADING LAYER: SKY BLUE MIX (LOCKED LEFT) */}
         <div className="absolute left-0 top-0 h-full w-full md:w-[60%] bg-gradient-to-r from-sky-200/90 via-sky-100/60 to-transparent z-10" />

         {/* TEXTURE LAYER: PUNJAB MAP (LOCKED LEFT) */}
         <div className="absolute left-0 top-0 h-full w-full md:w-[40%] z-20 pointer-events-none opacity-[0.1] mix-blend-multiply">
            <img 
               src={punjabMap} 
               className="w-full h-full object-contain object-left" 
               alt="Punjab Map watermark"
            />
         </div>

         {/* 2. CONTENT HUB - ULTRA COMPACT POSITIONING TOP-LEFT */}
         <div className="absolute inset-0 z-30 container mx-auto px-4 md:px-12 lg:px-16 max-w-7xl flex flex-col justify-start">
            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="pt-6 md:pt-14 lg:pt-20 max-w-[200px] sm:max-w-xs md:max-w-sm text-left space-y-3 md:space-y-5"
            >
               {/* BRAND BADGE */}
               <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/60 backdrop-blur-md border border-white/20 shadow-sm w-fit">
                  <Star className="h-2 md:h-2.5 w-2 md:w-2.5 text-[#F97316] fill-current" />
                  <span className="text-[6px] md:text-[8px] font-black text-[#0F172A] uppercase tracking-widest whitespace-nowrap">#1 Punjab Exam Hub</span>
               </div>

               {/* HEADLINES (Floating Style) */}
               <div className="space-y-0.5 md:space-y-1">
                  <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-6xl font-headline font-black text-[#0F172A] leading-[1.1] tracking-tighter uppercase drop-shadow-sm">
                     PREPARE <br/> SMARTER.
                  </h1>
                  <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-6xl font-headline font-black text-[#F97316] leading-[1.1] tracking-tighter uppercase drop-shadow-md">
                     SCORE <br/> HIGHER.
                  </h1>
               </div>

               <p className="text-[#0F172A]/80 font-black uppercase text-[7px] md:text-[10px] tracking-[0.1em] max-w-[150px] md:max-w-[200px] leading-tight antialiased">
                  Official CBT engine verified by <br/>
                  Arsh Grewal Management.
               </p>

               {/* ACTION BUTTONS (Compact Styling) */}
               <div className="flex flex-wrap gap-1.5 md:gap-3 pt-2">
                  <Button asChild className="h-8 md:h-12 px-4 md:px-7 bg-[#F97316] hover:bg-orange-600 text-white font-black uppercase text-[8px] md:text-[10px] tracking-widest rounded-lg md:rounded-2xl shadow-xl border-none transition-all active:scale-95">
                     <Link href="/mocks">Start Mock <ArrowRight className="h-3 w-3 ml-1.5" /></Link>
                  </Button>
                  <Button asChild variant="outline" className="h-8 md:h-12 px-4 md:px-7 border-[#0F172A]/10 bg-white/30 backdrop-blur-md text-[#0F172A] hover:bg-white/50 font-black uppercase text-[8px] md:text-[10px] tracking-widest rounded-lg md:rounded-2xl shadow-md transition-all active:scale-95">
                     <Link href="/exams">Explore Hub</Link>
                  </Button>
               </div>
            </motion.div>
         </div>
      </div>

      {/* 3. BOTTOM STATS HUB - HIGH-LIFT OVER BACKGROUND */}
      <div className="container mx-auto px-4 md:px-12 lg:px-16 max-w-7xl -mt-16 md:-mt-32 lg:-mt-48 relative z-40 pb-8">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            <StatCard icon={<BookOpen />} label="QUESTIONS" val="50k+" color="text-blue-600" />
            <StatCard icon={<ClipboardList />} label="MOCK TESTS" val="500+" color="text-[#F97316]" />
            <StatCard icon={<ShieldCheck />} label="ASPIRANTS" val="15k+" color="text-emerald-600" />
            <StatCard icon={<BarChart3 />} label="ACCURACY" val="94%" color="text-indigo-600" />
         </div>
      </div>
    </section>
  );
}

function StatCard({ icon, label, val, color }: any) {
   return (
      <div className="p-3 md:p-5 bg-white/85 backdrop-blur-xl shadow-2xl border border-white/40 rounded-[0.8rem] md:rounded-[1.5rem] space-y-0.5 group hover:bg-white transition-all text-left">
         <div className={cn("h-6 w-6 md:h-10 md:w-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner mb-2 md:mb-3", color)}>
            {React.cloneElement(icon, { className: "h-3.5 w-3.5 md:h-5 md:w-5" })}
         </div>
         <div className="space-y-0">
            <p className="text-sm md:text-3xl lg:text-4xl font-headline font-black text-[#0F172A] leading-none tracking-tighter">{val}</p>
            <p className="text-[6px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{label}</p>
         </div>
      </div>
   )
}
