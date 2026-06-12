'use client';

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  showTagline?: boolean;
  href?: string;
}

/**
 * @fileOverview Refactored Brand Identity Node v2.0.
 * UPDATED: Now uses physical image assets (cracklix-logo.png) for high-fidelity branding.
 */
export default function Logo({ className = "", variant = 'light', showTagline = true, href = "/" }: LogoProps) {
  // Use 'large' logo for areas where tagline is needed or for footer, otherwise use header logo
  const logoSrc = showTagline ? "/logo/cracklix-logo-large.png" : "/logo/cracklix-logo.png";
  
  return (
    <Link href={href} className={`flex items-center group pointer-events-auto select-none ${className}`}>
      <div className="relative h-10 w-auto flex items-center shrink-0">
        <img 
          src={logoSrc} 
          alt="Cracklix Punjab Exam Hub" 
          className={showTagline ? "h-10 md:h-12 w-auto object-contain" : "h-8 md:h-10 w-auto object-contain"}
          loading="eager"
        />
      </div>
    </Link>
  );
}
