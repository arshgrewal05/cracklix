
'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  href?: string;
}

/**
 * @fileOverview Official Cracklix Master Logo Hub.
 * UPDATED: Integrated high-fidelity "Pura Logo" (Full Branding) node.
 * Scaling: Calibrated for professional education hub aspect ratios.
 */
export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 flex items-center justify-center", className)}>
      <img 
        src="https://i.ibb.co/5WjGyLhn/1000110132-removebg-preview.png" 
        alt="Cracklix" 
        className="w-full h-full object-contain"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export default function Logo({ className = "", variant = 'light', href = "/" }: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center group pointer-events-auto select-none shrink-0", className)}>
      {/* 
         Professional Scale for Full Branding:
         Mobile: w-36 (Approx 144px)
         Desktop: w-52 (Approx 208px)
      */}
      <LogoIcon className="w-36 h-10 md:w-52 md:h-14" />
    </Link>
  );
}
