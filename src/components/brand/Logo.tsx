'use client';

import Link from "next/link";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark'; // 'light' means light text for dark backgrounds, 'dark' means dark text for light backgrounds
  showTagline?: boolean;
}

export default function Logo({ className = "", variant = 'light', showTagline = true }: LogoProps) {
  const isLightVariant = variant === 'light'; 
  
  return (
    <Link href="/" className={`flex items-center gap-[12px] group ${className}`}>
      {/* Premium Circular C-Tick Icon */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative w-12 h-12 flex items-center justify-center shrink-0"
      >
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Orange Circle */}
          <circle cx="26" cy="26" r="24" stroke="#F97316" strokeWidth="3"/>

          {/* C Shape - Color adjusts based on variant */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            d="M34 14 C22 10, 12 18, 12 26 C12 34, 22 42, 34 38"
            stroke={isLightVariant ? "#FFFFFF" : "#0F172A"}
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Tick */}
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            d="M18 27 L24 33 L36 20"
            stroke="#F97316"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </motion.div>

      <div className="flex flex-col">
        <div className="flex items-baseline leading-none">
          <span className={`text-[32px] font-extrabold tracking-tighter ${isLightVariant ? 'text-white' : 'text-[#0F172A]'}`}>
            Crack
          </span>
          <span className="text-[#F97316] text-[32px] font-extrabold tracking-tighter">
            lix
          </span>
        </div>
        {showTagline && (
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 ${isLightVariant ? 'text-white/40' : 'text-[#0F172A]/40'}`}>
            MOCK TEST DA NETFLIX
          </span>
        )}
      </div>
    </Link>
  );
}
