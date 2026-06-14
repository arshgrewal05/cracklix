'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Star
} from "lucide-react";
import { useDoc, useFirestore } from '@/firebase';
import { doc } from "firebase/firestore";

/**
 * @fileOverview High-Fidelity Unified Hero v702.0 (No Shading).
 * FIXED: Removed gradient overlays from the Golden Temple to ensure it is clearly visible.
 * FIXED: Background image set to object-top to prevent top-clipping.
 * SIZING: Strictly 200px height on mobile for the background hub.
 */

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative w-full bg-[#050B19] overflow-hidden flex flex-col text-left">
      
      {/* 1. BACKGROUND HUB - 200PX MOBILE HEIGHT - CLEAN VIEW */}
      <div className="relative w-full h-[200px] md:h-[400px] overflow-hidden">
         {/* GOLDEN TEMPLE IMAGE - NO SHADING OVERLAYS */}
         <div className="absolute inset-0 z-0">
            <img 
              src="https://i.ibb.co/LXgcLVVq/Gemini-Generated-Image-n1so6on1so6on1so.png" 
              alt="Golden Temple" 
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
            {/* SUBTLE BOTTOM FADE ONLY FOR SMOOTH TRANSITION TO DARK BODY */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050B19] via-transparent to-transparent opacity-60" />
         </div>

         {/* PUNJAB MAP WATERMARK - REDUCED OPACITY OVER TEMPLE */}
         <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.02] mix-blend-overlay">
            <img 
              src="https://www.mapsofindia.com/maps/punjab/punjab-map.jpg" 
              className="w-full h-full object-cover grayscale invert" 
              alt="Punjab Map Texture"
            />
         </div>

         {/* TOP BADGE - INSIDE IMAGE HUB */}
         <div className="absolute bottom-4 left-4 md:left-12 z-20">
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md"
            >
               <div className="h-3.5 w-3.5 md:h-5 md:w-5 rounded-full bg-primary/20 flex items-center justify-center">
                 <Star className="h-2 w-2 md:h-3 md:w-3 text-primary fill-current" />
               </div>
               <span className="text-[7px] md:text-xs font-black text-white uppercase tracking-widest">#1 Punjab Exam Preparation Platform</span>
            </motion.div>
         </div>
      </div>

      {/* 2. TYPOGRAPHY HUB - ON SOLID DARK BACK */}
      <div className="bg-[#050B19] relative z-20 pb-16 md:pb-32 -mt-0.5">
         {/* MAP WATERMARK CONTINUATION FOR TEXT AREA */}
         <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay">
            <img 
              src="https://www.mapsofindia.com/maps/punjab/punjab-map.jpg" 
              className="w-full h-full object-cover grayscale invert" 
              alt="Punjab Map Texture"
            />
         </div>

         <div className="container mx-auto px-4 md:px-12 lg:px-16 max-w-[1440px] relative z-10">
            <div className="pt-6 md:pt-12 space-y-1.5 md:space-y-4">
               <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[26px] sm:text-5xl md:text-7xl lg:text-[100px] font-headline font-black text-white leading-[0.95] tracking-tighter uppercase"
               >
                  Prepare Smarter.
               </motion.h1>
               <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-[26px] sm:text-5xl md:text-7xl lg:text-[100px] font-headline font-black text-primary leading-[0.95] tracking-tighter uppercase"
               >
                  Score Higher.
               </motion.h1>
            </div>

            <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="text-slate-400 font-bold uppercase text-[9px] md:text-lg tracking-[0.2em] mt-6 md:mt-8 max-w-xl"
            >
               Punjab's most advanced CBT engine. <br/>
               Verified by Arsh Grewal Management.
            </motion.p>
         </div>
      </div>
    </section>
  );
}
