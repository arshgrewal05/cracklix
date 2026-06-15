'use client';

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Search, User, LogOut, Menu, X } from "lucide-react";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StudentAvatar from "@/components/brand/StudentAvatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import MobileSidebar from "./MobileSidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/brand/Logo";

const SUPER_ADMIN_WHITELIST = ['arshdeepgrewal1122@gmail.com'];

/**
 * @fileOverview Official Master Navbar Hub (Restored).
 * FIXED: Restored original logo node and institutional navigation registry.
 */
export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, profile } = useUser();
  const auth = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("[NAVBAR_LOGOUT_FAILURE]:", error);
    }
  };

  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN' || (user?.email && SUPER_ADMIN_WHITELIST.includes(user.email.toLowerCase()));

  if (!mounted) return null;

  return (
    <div className="w-full sticky top-0 z-[1000] font-body">
      {/* 1. ANNOUNCEMENT TICKER (Exam Gazette) */}
      <div className="w-full bg-gradient-to-r from-orange-600 to-amber-600 py-2 px-4 text-center text-[10px] md:text-xs font-black uppercase tracking-wider text-white shadow-md">
          🔥 Live Now: PSSSB Patwari, Clerk, & PSTET 2026 Free Mega Mock Drills! <Link href="/exams" className="underline ml-2">Select Your Exam ↓</Link>
      </div>

      {/* 2. NAVIGATION BAR */}
      <nav className="w-full border-b border-white/5 bg-[#0A0E1A]/95 backdrop-blur-md h-16 md:h-20 px-4 md:px-8 shadow-2xl flex items-center">
        <div className="container mx-auto max-w-7xl flex items-center justify-between h-full gap-4">
          
          {/* Brand Identity - Original Logo Restoration */}
          <div className="flex items-center gap-3 lg:gap-4 shrink-0 h-full">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden w-8 h-8 bg-white/5 text-white rounded-lg border border-white/10 flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
            >
              <Menu className="h-4 w-4" />
            </button>
            <Logo imgClassName="h-10 md:h-12" />
          </div>

          {/* Authentication Portal Gateway */}
          <div className="flex items-center gap-3">
             <Link href="/search" className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-inner">
                <Search className="h-4 w-4" />
             </Link>

             {user ? (
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <button className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white/10 overflow-hidden shadow-xl cursor-pointer bg-white active:scale-95 transition-transform">
                      <StudentAvatar profile={profile} className="h-full w-full border-none" />
                   </button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent align="end" className="w-64 bg-[#0F172A] border-white/10 text-white rounded-2xl p-2 shadow-5xl z-[2001] mt-2">
                    <DropdownMenuItem asChild className="px-4 py-3 cursor-pointer rounded-xl focus:bg-white/5">
                       <Link href="/profile" className="flex items-center gap-4">
                          <User className="h-5 w-5 text-blue-400" />
                          <span className="font-bold text-sm uppercase tracking-tight">My Profile</span>
                       </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild className="px-4 py-3 cursor-pointer rounded-xl focus:bg-white/10 mt-1 border border-white/5">
                        <Link href="/admin" className="flex items-center gap-4 text-white">
                          <User className="h-5 w-5 text-rose-500" />
                          <span className="font-bold text-sm uppercase tracking-tight text-rose-500">Admin Hub</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-white/5 my-2" />
                    <DropdownMenuItem onClick={handleLogout} className="px-4 py-3 cursor-pointer rounded-xl focus:bg-rose-50/10 text-rose-500">
                       <LogOut className="h-5 w-5 shrink-0" />
                       <span className="font-bold text-sm uppercase tracking-tight">Log Out</span>
                    </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>
             ) : (
               <Button asChild className="px-4 md:px-6 h-10 md:h-12 bg-[#111827] hover:bg-[#1f2937] text-white font-black text-[10px] md:text-xs rounded-xl border border-white/10 transition-all uppercase tracking-widest shadow-xl">
                 <Link href="/login">Student Login</Link>
               </Button>
             )}
          </div>
        </div>
      </nav>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="p-0 border-none w-[300px] bg-[#0A0E1A] z-[2001]">
          <SheetHeader className="sr-only">
             <SheetTitle>Navigation Sidebar</SheetTitle>
             <SheetDescription>Access institutional preparation resources and exam verticals.</SheetDescription>
          </SheetHeader>
          <MobileSidebar onClose={() => setIsSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
