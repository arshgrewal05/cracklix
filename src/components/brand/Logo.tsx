'use client';

import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  href?: string;
  imgClassName?: string;
}

/**
 * @fileOverview Official Cracklix Brand Hub v20.0.
 * HARDENED: Locked responsive scaling to prevent shrinking.
 * DIMENSIONS: Mobile 56px (h-14) / Desktop 72px (lg:h-[72px]).
 * MIN-WIDTH: 180px to protect brand identity and visibility.
 */
export default function Logo({ className = "", href = "/", variant = 'light', imgClassName = "" }: LogoProps) {
  // Use dark logo for light background, and light logo for dark background
  const logoSrc = variant === 'light' ? '/logo/cracklix-logo-dark.png' : '/logo/cracklix-logo-light.png';

  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center group pointer-events-auto select-none shrink-0 min-w-[180px]", 
        className
      )}
    >
      <Image 
        src={logoSrc} 
        alt="Cracklix" 
        width={220}
        height={60}
        priority
        className={cn(
          "h-14 w-auto lg:h-[72px] object-contain transition-transform group-hover:scale-105 shrink-0",
          imgClassName
        )}
      />
    </Link>
  );
}
