
'use client';

import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export default function Logo({ className = "", variant = 'light' }: LogoProps) {
  const isLight = variant === 'light';
  
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-2 border-[#F97316] flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
        <span className="text-[#F97316] font-black text-xl lg:text-2xl">✓</span>
      </div>

      <div className="flex flex-col">
        <h1 className="text-2xl lg:text-3xl font-black leading-none tracking-tight">
          <span className={isLight ? 'text-white' : 'text-[#0F172A]'}>Crack</span>
          <span className="text-[#F97316]">lix</span>
        </h1>
        <p className={`text-[8px] lg:text-[10px] uppercase tracking-[2px] lg:tracking-[3px] font-black mt-1 ${isLight ? 'text-white/60' : 'text-gray-400'}`}>
          Punjab Exam Preparation
        </p>
      </div>
    </Link>
  );
}
