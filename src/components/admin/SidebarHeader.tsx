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
 * Cracklix Admin Sidebar Header v35.0 (High Density).
 * UPDATED: Significantly increased logo height for boldest branding.
 */
export default function SidebarHeader({
  isOpen,
  onToggle,
}: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        "h-[112px] md:h-[130px] border-b border-slate-50 px-4 shrink-0 flex items-center transition-all duration-300",
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
          isOpen ? "h-[100px] md:h-[118px]" : "h-16 md:h-20"
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
