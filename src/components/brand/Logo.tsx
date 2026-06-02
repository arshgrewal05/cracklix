'use client';

import Link from "next/link";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  showTagline?: boolean;
}

export default function Logo({ className = "", variant = 'light', showTagline = true }: LogoProps) {
  const isLight = variant === 'light'; // variant 'light' means it's on a dark background (text should be light)
  
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      {/* SaaS Style Icon: Punjab Map + Checkmark */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-11 h-11 flex items-center justify-center bg-[#F97316] rounded-xl shadow-lg shadow-orange-500/20 shrink-0 overflow-hidden"
      >
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-7 h-7"
        >
          {/* Simplified Geometric Punjab Map Outline */}
          <path 
            d="M30 20 L70 15 L85 40 L80 75 L45 85 L20 65 L15 35 Z" 
            fill="white" 
            fillOpacity="0.2"
          />
          {/* Clean Integrated Checkmark */}
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            d="M35 52 L48 65 L72 38" 
            stroke="white" 
            strokeWidth="10" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </motion.div>

      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span className={`text-2xl font-black tracking-tighter ${isLight ? 'text-white' : 'text-[#0F172A]'}`}>
            Crack
          </span>
          <span className="text-[#F97316] text-2xl font-black tracking-tighter">
            lix
          </span>
        </div>
        {showTagline && (
          <span className={`text-[9px] font-bold uppercase tracking-[0.2em] -mt-1 ${isLight ? 'text-white/40' : 'text-[#0F172A]/40'}`}>
            Punjab Exam Preparation
          </span>
        )}
      </div>
    </Link>
  );
}
