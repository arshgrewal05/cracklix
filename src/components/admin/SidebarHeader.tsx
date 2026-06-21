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
 * Cracklix Admin Sidebar Header v32.0 (High Density).
 * UPDATED: Further increased Logo scale for maximum brand visibility in admin hub.
 */
export default function SidebarHeader({
  isOpen,
  onToggle,
}: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "h-[88px] md:h-[100px] border-b border-slate-50 px-4 shrink-0 flex items-center transition-all duration-300",
        isOpen ? "justify-between gap-2" : "justify-center p-0"
      )}
    >
      <Logo
        href="/admin"
        variant="light"
        iconOnly={!isOpen}
        align={isOpen ? "left" : "center"}
        className="transition-all duration-300"
        imgClassName={cn(
          isOpen ? "h-[76px] md:h-[92px]" : "h-14 md:h-18"
        )}
      />

      {isOpen && (
        <SidebarToggle
          isOpen={isOpen}
          onToggle={onToggle}
        />
      )}
    </div>
  );
}
