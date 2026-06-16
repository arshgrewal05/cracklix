
'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import StudentAvatar from '@/components/brand/StudentAvatar';

interface SidebarFooterProps {
  isOpen: boolean;
  profile: any;
  handleLogout: () => void;
}

export default function SidebarFooter({ isOpen, profile, handleLogout }: SidebarFooterProps) {
  return (
    <div className="p-4 mt-auto border-t border-white/5 bg-[#020617]/40">
      <div className={cn(
        "flex items-center gap-4 transition-all duration-300",
        isOpen ? "px-2" : "justify-center"
      )}>
        <StudentAvatar 
          profile={profile} 
          className="h-10 w-10 rounded-xl bg-white/5 border border-white/10" 
        />
        {isOpen && (
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-black text-white truncate leading-none mb-1">
              {profile?.name || 'ADMIN'}
            </p>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest truncate">
              {profile?.role || 'SUPER_ADMIN'}
            </p>
          </div>
        )}
      </div>

      <button 
        onClick={handleLogout}
        className={cn(
          "w-full flex items-center justify-center gap-3 h-12 mt-4 rounded-xl transition-all duration-200 active:scale-95 group",
          isOpen 
            ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white" 
            : "text-slate-500 hover:text-red-500"
        )}
      >
        <LogOut className="h-5 w-5 shrink-0" />
        {isOpen && (
          <span className="text-[12px] font-bold uppercase tracking-widest">
            Log Out Session
          </span>
        )}
      </button>
    </div>
  );
}
