'use client';

import React from 'react';
import { PanelLeft, PanelRight, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * @fileOverview Refined Internal Sidebar Toggle.
 * Positioned within the flow of the sidebar header to prevent border overlap.
 */
export default function SidebarToggle({ isOpen, onToggle }: SidebarToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "h-10 w-10 flex items-center justify-center rounded-xl bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white transition-all active:scale-90 border border-blue-500/20",
        !isOpen && "mx-auto"
      )}
      aria-label={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
    >
      {isOpen ? (
        <PanelLeft className="h-5 w-5" />
      ) : (
        <PanelRight className="h-5 w-5" />
      )}
    </button>
  );
}
