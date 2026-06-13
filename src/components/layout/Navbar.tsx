'use client';

import Link from "next/link";
import { Menu, Search, Zap, LogOut, Download, User, Target, Newspaper, Gem, ChevronRight, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/brand/Logo";
import { useState, useMemo, useEffect } from "react";
import { useUser, useAuth, useFirestore } from "@/firebase";
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
import { doc, onSnapshot } from "firebase/firestore";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import MobileSidebar from "./MobileSidebar";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Original High-Fidelity Header v105.0.
 * RESTORED: All original functional nodes, sequence, and typography from the user screenshot.
 */
export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, profile, loading } = useUser();
  const auth = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const passStatus = useMemo(() => {
    if (!profile?.pass) return { active: false, label: "FREE PASS", expiry: "N/A" };
    const active = profile.pass.active;
    const expiryDate = new Date(profile.pass.expiryDate);
    const isExpired = expiryDate < new Date();
    
    return {
      active: active && !isExpired,
      label: isExpired ? "PASS EXPIRED" : "PASS ACTIVE",
      expiry: expiryDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
    };
  }, [profile]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN';

  return (
    <div className="sticky top-0 z-[1000] w-full pointer-events-auto">
      {/* 1. ORIGINAL ANNOUNCEMENT BAR */}
      <div className="bg-[#F97316] text-white py-2 flex items-center overflow-hidden relative shadow-lg h-9">
        <div className="flex items-center gap-3 animate-marquee whitespace-nowrap min-w-full">
          <Zap className="h-3.5 w-3.5 shrink-0 ml-4 fill-current" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">🔥 OFFICIAL PUNJAB 2026 RECRUITMENT CALENDAR LIVE.</p>
          <span className="mx-40 md:mx-80" />
          <Zap className="h-3.5 w-3.5 shrink-0 fill-current" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">🔥 OFFICIAL PUNJAB 2026 RECRUITMENT CALENDAR LIVE.</p>
          <span className="mx-40 md:mx-80" />
        </div>
      </div>

      {/* 2. MAIN HEADER (REPLICATED ORIGINAL) */}
      <nav className="w-full h-16 md:h-24 flex items-center bg-[#0B1528] border-b border-white/5 px-2 md:px-6 shadow-2xl">
        <div className="w-full flex items-center justify-between gap-2 md:gap-4 overflow-x-auto no-scrollbar">
          
          {/* LEFT: MENU & LOGO */}
          <div className="flex items-center gap-2 md:gap-6 shrink-0">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <button className="w-10 h-10 md:w-12 md:h-12 bg-white/5 text-white rounded-xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer active:scale-95">
                  <Menu className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 border-none w-[300px] bg-[#0F172A] z-[2001]">
                <SheetHeader className="sr-only"><SheetTitle>Menu</SheetTitle></SheetHeader>
                <MobileSidebar onClose={() => setIsSidebarOpen(false)} />
              </SheetContent>
            </Sheet>
            <Logo className="scale-90 md:scale-100 origin-left" />
          </div>

          {/* CENTER: ORIGINAL FUNCTIONAL NODES */}
          <div className="hidden xl:flex items-center gap-6 shrink-0">
             
             {/* MY EXAMS */}
             <Link href="/my-exams" className="flex items-center gap-3 group px-4 py-2 hover:bg-white/5 rounded-xl transition-all">
                <Target className="h-5 w-5 text-primary" />
                <div className="flex flex-col text-left leading-none">
                   <span className="text-[10px] font-black text-white uppercase tracking-tighter">MY</span>
                   <span className="text-[11px] font-black text-white uppercase tracking-widest">EXAMS</span>
                </div>
             </Link>

             {/* PRACTICE TESTS */}
             <Link href="/mocks" className="flex items-center gap-3 group px-4 py-2 hover:bg-white/5 rounded-xl transition-all">
                <Zap className="h-5 w-5 text-primary fill-current" />
                <div className="flex flex-col text-left leading-none">
                   <span className="text-[10px] font-black text-white uppercase tracking-tighter">PRACTICE</span>
                   <span className="text-[11px] font-black text-white uppercase tracking-widest">TESTS</span>
                </div>
             </Link>

             {/* GET PASS BUTTON */}
             <Link href="/pass">
                <button className="h-12 px-5 bg-white/5 border border-primary/40 rounded-xl flex items-center gap-3 group hover:bg-primary/10 transition-all">
                   <Gem className="h-4 w-4 text-primary" />
                   <span className="text-[10px] font-black text-primary uppercase tracking-widest">GET PASS</span>
                </button>
             </Link>

             {/* CURRENT AFFAIRS */}
             <Link href="/current-affairs" className="flex items-center gap-3 group px-4 py-2 hover:bg-white/5 rounded-xl transition-all">
                <Newspaper className="h-5 w-5 text-primary" />
                <div className="flex flex-col text-left leading-none">
                   <span className="text-[10px] font-black text-primary uppercase tracking-tighter">CURRENT</span>
                   <span className="text-[11px] font-black text-primary uppercase tracking-widest">AFFAIRS</span>
                </div>
             </Link>

             {/* INSTALL APP */}
             <button 
                onClick={() => (window as any).deferredPrompt?.prompt()}
                className="h-12 px-5 bg-white/5 border border-emerald-500/40 rounded-xl flex items-center gap-3 group hover:bg-emerald-500/10 transition-all"
             >
                <Download className="h-4 w-4 text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">INSTALL APP</span>
             </button>

             {/* PASS ACTIVE BOX */}
             {mounted && user && (
                <div className="h-12 px-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
                   <Gem className="h-5 w-5 text-emerald-500 fill-current opacity-40" />
                   <div className="flex flex-col items-start leading-none">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-tight",
                        passStatus.active ? "text-emerald-500" : "text-rose-500"
                      )}>
                         {passStatus.label}
                      </span>
                      <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                         EXP: {passStatus.expiry}
                      </span>
                   </div>
                </div>
             )}
          </div>

          {/* RIGHT: SEARCH & USER */}
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
             <Link href="/search" className="w-10 h-10 md:w-12 md:h-12 bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/10 transition-all flex items-center justify-center">
                <Search className="h-5 w-5" />
             </Link>

             <div className="relative">
                {!mounted || loading ? (
                  <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/5 animate-pulse" />
                ) : user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="h-10 w-10 md:h-12 md:w-12 rounded-full overflow-hidden border-2 border-white/10 hover:border-primary transition-all bg-[#0F172A] shadow-2xl focus:outline-none">
                        <StudentAvatar profile={profile} className="h-full w-full border-none" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-72 bg-[#0F172A] border-white/10 text-white rounded-[2.5rem] p-3 shadow-5xl z-[2001]" align="end">
                      <div className="px-5 py-6 flex items-center gap-4">
                         <StudentAvatar profile={profile} className="h-12 w-12" />
                         <div className="min-w-0">
                            <p className="text-[12px] font-black uppercase tracking-tight truncate leading-none mb-1.5">{profile?.name || "Aspirant"}</p>
                            <p className="text-[9px] font-bold text-slate-500 truncate">{user.email}</p>
                         </div>
                      </div>
                      
                      <DropdownMenuSeparator className="bg-white/5" />
                      <DropdownMenuItem asChild className="flex items-center gap-4 px-5 py-5 cursor-pointer rounded-xl transition-all focus:bg-white/5">
                        <Link href="/profile" className="w-full flex items-center gap-4">
                          <User className="h-5 w-5 text-primary" />
                          <span className="font-bold text-[14px] tracking-tight uppercase">My Profile Hub</span>
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild className="flex items-center gap-4 px-5 py-5 cursor-pointer rounded-xl transition-all focus:bg-white/5">
                          <Link href="/admin" className="w-full flex items-center gap-4 text-primary">
                            <Zap className="h-5 w-5 fill-current" />
                            <span className="font-bold text-[14px] tracking-tight uppercase">Master Admin</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-white/5" />
                      <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-4 px-5 py-5 cursor-pointer rounded-xl transition-all focus:bg-rose-500/10 focus:text-rose-500 text-rose-500/80">
                        <LogOut className="h-5 w-5 shrink-0" />
                        <span className="font-bold text-[14px] tracking-tight uppercase">Logout Registry</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button asChild className="bg-primary hover:bg-orange-600 text-white font-black px-6 h-11 uppercase text-[12px] tracking-widest shadow-xl border-none transition-all active:scale-95">
                    <Link href="/login">Login Hub</Link>
                  </Button>
                )}
             </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
