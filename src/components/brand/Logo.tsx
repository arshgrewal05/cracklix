'use client';

import React from 'react';
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  href?: string;
  imgClassName?: string;
}

/**
 * @fileOverview Official Cracklix Brand Hub v2.0.
 * UPDATED: Dual-variant engine for light/dark backgrounds using transparent PNGs.
 */
export default function Logo({ className = "", href = "/", variant = 'light', imgClassName = "" }: LogoProps) {
  // light variant = Dark text for light backgrounds (Header)
  // dark variant = White text for dark backgrounds (Footer/Sidebar)
  const logoSrc = variant === 'light' ? '/cracklix-logo-light.png' : '/cracklix-logo-dark.png';

  return (
    <Link href={href} className={cn("flex items-center group pointer-events-auto select-none shrink-0", className)}>
      <img 
        src={logoSrc} 
        alt="Cracklix" 
        className={cn(
          "w-auto object-contain transition-transform group-hover:scale-105",
          "h-[32px] md:h-[42px]", // User specified height logic
          imgClassName
        )}
        referrerPolicy="no-referrer"
      />
    </Link>
  );
}
