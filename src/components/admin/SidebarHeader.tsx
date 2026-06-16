
'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import SidebarToggle from './SidebarToggle';
import Logo from '@/components/brand/Logo';

interface SidebarHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function SidebarHeader({ isOpen, onToggle }: SidebarHeaderProps) {
  return (
    <div className="h-24 px-6 flex items-center justify-between shrink-0 relative border-b border-white/5">
      {/* LOGO NODE */}
      <div className={cn(
        "transition-all duration-300 flex items-center overflow-hidden",
        isOpen ? "w-auto opacity-100" : "w-10 opacity-100 mx-auto justify-center"
      )}>
        {isOpen ? (
          <Logo href="/admin" variant="light" imgClassName="h-10 w-auto" />
        ) : (
          <img src="/logo/cracklix-logo.png" className="h-8 w-auto min-w-[32px] object-contain" alt="C" />
        )}
      </div>

      {/* TOGGLE BUTTON - ONLY VISIBLE ON DESKTOP/TABLET */}
      <div className={cn(
        "hidden md:block transition-all duration-300",
        isOpen ? "relative" : "absolute -right-4 bg-[#0F172A] rounded-full border border-white/10 p-0.5"
      )}>
        <SidebarToggle isOpen={isOpen} onToggle={onToggle} />
      </div>
    </div>
  );
}
