
'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  href?: string;
  iconOnly?: boolean;
}

/**
 * @fileOverview High-Fidelity Cracklix "C-Check" Icon Reconstruction v5.0.
 * MATCHES: Provided image with glowing arcs, bold C, and integrated checkmark.
 * UPDATED: Branding text changed to mixed-case "Cracklix".
 */
export function LogoIcon({ className = "", isDark = false }: { className?: string, isDark?: boolean }) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>

        {/* Squircle Background (Only for large icon views) */}
        {className.includes('h-24') || className.includes('h-32') ? (
           <rect x="5" y="5" width="90" height="90" rx="25" fill="#0B1528" />
        ) : null}

        {/* Glowing Orange Outer Arc */}
        <path 
          d="M30 85C20 78 14 65 14 50C14 30 28 14 50 14C65 14 78 20 85 30" 
          stroke="#F97316" 
          strokeWidth="6" 
          strokeLinecap="round"
          filter="url(#glow)"
          opacity="0.9"
        />

        {/* Main Bold White 'C' */}
        <path 
          d="M75 40C72 30 62 24 50 24C36 24 26 36 26 50C26 64 36 76 50 76C62 76 72 70 75 60" 
          stroke={isDark ? "#0F172A" : "white"} 
          strokeWidth="12" 
          strokeLinecap="round"
          className="drop-shadow-md"
        />

        {/* Sharp Integrated Orange Checkmark */}
        <path 
          d="M40 50L52 62L86 32" 
          stroke="url(#orangeGrad)" 
          strokeWidth="12" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          filter="url(#glow)"
        />
        
        {/* Shine highlight on checkmark */}
        <path 
          d="M42 50L52 60L84 34" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          opacity="0.3"
        />
      </svg>
    </div>
  );
}

export default function Logo({ className = "", variant = 'light', showTagline = true, href = "/", iconOnly = false }: LogoProps) {
  const isDark = variant === 'dark';

  return (
    <Link href={href} className={cn("flex items-center gap-3 group pointer-events-auto select-none shrink-0", className)}>
      <LogoIcon isDark={isDark} className="w-10 h-10 md:w-12 md:h-12" />

      {!iconOnly && (
        <div className="flex flex-col items-start justify-center leading-none">
          <div className="flex items-baseline">
            <span className={cn(
              "text-2xl md:text-3xl font-headline font-[900] tracking-tight",
              isDark ? "text-[#0F172A]" : "text-white"
            )}>
              Crack
            </span>
            <span className="text-2xl md:text-3xl font-headline font-[900] tracking-tight text-primary">
              lix
            </span>
          </div>
          
          {showTagline && (
            <div className="flex items-center gap-1.5 w-full mt-1">
              <div className="h-[1px] flex-1 bg-primary/40" />
              <span className="text-[6px] md:text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap">
                PUNJAB'S <span className="text-primary">NO.1</span> STUDY HUB
              </span>
              <div className="h-[1px] flex-1 bg-primary/40" />
            </div>
          )}
        </div>
      )}
    </Link>
  );
}
