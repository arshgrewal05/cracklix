
'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import SidebarHeader from './SidebarHeader';
import SidebarNav from './SidebarNav';
import SidebarFooter from './SidebarFooter';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onCloseMobile: () => void;
  profile: any;
  handleLogout: () => void;
  pathname: string;
}

/**
 * @fileOverview Custom Rebuilt Admin Sidebar v1.0.
 * Standardized Desktop widths: 96px (collapsed) / 320px (expanded).
 */
export default function AdminSidebar({ 
  isOpen, 
  onToggle, 
  onCloseMobile,
  profile,
  handleLogout,
  pathname
}: AdminSidebarProps) {
  
  return (
    <>
      {/* MOBILE OVERLAY */}
      <div 
        className={cn(
          "fixed inset-0 bg-[#0F172A]/60 backdrop-blur-sm z-[100] transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onCloseMobile}
      />

      {/* SIDEBAR CONTAINER */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-screen bg-[#0F172A] text-white z-[110] transition-all duration-300 ease-in-out flex flex-col border-r border-[#1E293B]",
          isOpen ? "w-[320px]" : "w-[96px]",
          // Mobile state
          "max-md:w-[280px] max-md:-translate-x-full",
          isOpen && "max-md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full bg-gradient-to-b from-[#0F172A] to-[#111827]">
          
          {/* 1. HEADER (Logo + Toggle) */}
          <SidebarHeader isOpen={isOpen} onToggle={onToggle} />

          {/* 2. NAVIGATION HUB */}
          <SidebarNav isOpen={isOpen} pathname={pathname} />

          {/* 3. FOOTER HUB (Logout) */}
          <SidebarFooter 
            isOpen={isOpen} 
            profile={profile} 
            handleLogout={handleLogout} 
          />

        </div>
      </aside>
    </>
  );
}
