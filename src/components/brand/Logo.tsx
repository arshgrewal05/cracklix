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
 * @fileOverview Official Cracklix Brand Hub v17.0.
 * SIZING: Final Production Standard (34px Mobile / 52px Desktop).
 * ALIGNMENT: Always left-aligned as per institutional requirements.
 */
export default function Logo({ className = "", href = "/", variant = 'light', imgClassName = "" }: LogoProps) {
  const logoSrc = variant === 'light' ? '/logo/cracklix-logo-dark.png' : '/logo/cracklix-logo-light.png';

  return (
    <Link href={href} className={cn("flex items-center group pointer-events-auto select-none shrink-0", className)}>
      <Image 
        src={logoSrc} 
        alt="Cracklix" 
        width={180}
        height={52}
        priority
        className={cn(
          "h-[34px] sm:h-[38px] md:h-[42px] lg:h-[52px] w-auto object-contain transition-transform group-hover:scale-105 shrink-0",
          imgClassName
        )}
        style={{ width: 'auto' }}
      />
    </Link>
  );
}
