'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import SidebarToggle from './SidebarToggle';
import Logo from '@/components/brand/Logo';

interface SidebarHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * @fileOverview High-Fidelity Sidebar Header v2.0.
 * UPDATED: Toggle button is now strictly internal to the sidebar layout.
 */
export default function SidebarHeader({ isOpen, onToggle }: SidebarHeaderProps) {
  return (
    <div className={cn(
      "h-28 px-6 flex flex-col shrink-0 relative border-b border-white/5",
      isOpen ? "items-stretch justify-center" : "items-center justify-center gap-4"
    )}>
      <div className={cn(
        "flex items-center transition-all duration-300",
        isOpen ? "justify-between" : "justify-center"
      )}>
        {/* LOGO NODE */}
        <div className={cn(
          "transition-all duration-300 flex items-center overflow-hidden shrink-0",
          isOpen ? "w-[160px]" : "w-[44px]"
        )}>
          {isOpen ? (
            <Logo href="/admin" variant="light" imgClassName="h-8 w-auto" />
          ) : (
            <img src="/logo/cracklix-logo.png" className="h-8 w-auto min-w-[32px] object-contain" alt="C" />
          )}
        </div>

        {/* TOGGLE BUTTON - INTERNAL IN EXPANDED MODE */}
        {isOpen && (
          <SidebarToggle isOpen={isOpen} onToggle={onToggle} />
        )}
      </div>

      {/* TOGGLE BUTTON - STACKED IN COLLAPSED MODE */}
      {!isOpen && (
        <SidebarToggle isOpen={isOpen} onToggle={onToggle} />
      )}
    </div>
  );
}
