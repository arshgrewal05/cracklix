'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Official Master Logo Hub v8.0.
 * RESTORED: Full asset with text and tagline as per original screenshot.
 */
export function LogoIcon({ className = "" }: { className?: string }) {
  return (
    <div className={cn("relative shrink-0 flex flex-col items-center gap-0", className)}>
      <img 
        src="https://i.ibb.co/5WjGyLhn/1000110132-removebg-preview.png" 
        alt="Cracklix Logo" 
        className="h-10 md:h-14 w-auto object-contain"
        referrerPolicy="no-referrer"
      />
      <div className="flex items-center gap-2 mt-[-4px]">
         <div className="h-[1px] w-4 bg-primary/40" />
         <span className="text-[7px] md:text-[9px] font-black uppercase text-primary tracking-[0.2em] whitespace-nowrap">
            Punjab's No.1 Study Hub
         </span>
         <div className="h-[1px] w-4 bg-primary/40" />
      </div>
    </div>
  );
}

export default function Logo({ className = "", href = "/" }: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center group pointer-events-auto select-none shrink-0", className)}>
      <LogoIcon />
    </Link>
  );
}

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  href?: string;
}
