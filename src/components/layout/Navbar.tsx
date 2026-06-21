'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from "next/link";
import {
  Search,
  User,
  LogOut,
  Menu,
  ShieldCheck,
  ChevronRight,
  Gem,
  ArrowRight,
  Settings,
  HelpCircle,
  CreditCard,
  Clock
} from "lucide-react";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StudentAvatar from "@/components/brand/StudentAvatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import MobileSidebar from "./MobileSidebar";
import { cn } from "@/lib/utils";
import Logo from "@/components/brand/Logo";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import PWAInstallButton from "@/components/PWAInstallButton";

const SUPER_ADMIN_WHITELIST = ['arshdeepgrewal1122@gmail.com'];

/**
 * @fileOverview Standardized Navbar v49.1.
 * UPDATED: Simplified terminology for Material and Dashboard.
 */
export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const { user, profile, loading } = useUser();
  const auth = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!profile?.passExpiresAt) return;
    
    const interval = setInterval(() => {
      const expiry = new Date(profile.passExpiresAt).getTime();
      const now = new Date().getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (d > 0) setTimeLeft(`${d}d ${h}h left`);
      else if (h > 0) setTimeLeft(`${h}h ${m}m left`);
      else setTimeLeft(`${m}m left`);
    }, 1000);

    return () => clearInterval(interval);
  }, [profile]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('[NAVBAR_LOGOUT_FAILURE]:', error);
    }
  };

  const isAdmin =
    profile?.role === 'ADMIN' ||
    profile?.role === 'SUPER_ADMIN' ||
    (user?.email &&
      SUPER_ADMIN_WHITELIST.includes(user.email.toLowerCase()));

  const passLabel = useMemo(() => {
    if (!profile?.pass?.plan) return 'Free Pass';
    const plan = profile.pass.plan;
    return plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase().replace('_pass', '');
  }, [profile]);

  if (!mounted) {
    return <nav className="w-full border-b border-slate-100 bg-white h-[72px] md:h-[88px]" />;
  }

  return (
    <div className="sticky top-0 z-50 w-full font-body">
      <nav className="w-full h-[72px] md:h-[88px] bg-white border-b border-slate-100 shadow-sm transition-all duration-300">
        <div className="w-full max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-2">

          <div className="flex items-center shrink-0 h-full">
            <button
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
              className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm active:scale-95 transition-all shrink-0 hover:border-primary/30 mr-1"
            >
              <Menu className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <Logo
              variant="light"
              className="flex-shrink-0"
              imgClassName="h-[68px] md:h-[84px]"
            />
          </div>

          <div className="hidden lg:flex items-center justify-center gap-8 flex-1">
            <NavLink href="/" label="Home" active={pathname === '/'} />
            <NavLink href="/mocks" label="Practice" active={pathname === '/mocks'} />
            <NavLink href="/pyqs" label="Previous Papers" active={pathname === '/pyqs'} />
            <NavLink href="/current-affairs" label="Study Material" active={pathname === '/current-affairs'} />
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {profile?.passStatus === 'active' && timeLeft && (
               <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="text-[8px] font-black uppercase text-emerald-600 tracking-widest leading-none">PREMIUM ACTIVE</span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 leading-none">{timeLeft}</span>
               </div>
            )}

            <PWAInstallButton 
              variant="outline"
              className="hidden md:flex h-10 px-4 text-[9px] rounded-xl border-slate-200"
            />

            <Link
              href="/search"
              className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center bg-slate-50 text-slate-600 hover:text-primary transition-all active:scale-95"
            >
              <Search className="w-5 h-5" />
            </Link>

            {loading ? (
              <Skeleton className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-slate-100" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-10 h-10 md:h-12 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center active:scale-95 transition-all">
                    <StudentAvatar
                      profile={profile}
                      className="w-full h-full border-none"
                      iconClassName="w-6 h-6"
                    />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  sideOffset={12}
                  className="w-[280px] xs:w-[320px] max-h-[85vh] overflow-y-auto custom-scrollbar rounded-[28px] p-4 xs:p-6 bg-white border border-[#EEF2F7] shadow-[0_12px_30px_rgba(15,23,42,0.08)] z-[2001]"
                >
                  <div className="flex flex-col items-center text-center space-y-6">
                    
                    <div className="flex flex-col items-center gap-4">
                       <div className="h-16 w-16 rounded-2xl bg-[#EEF4FF] flex items-center justify-center text-[#2563EB] shadow-sm border border-blue-50 relative">
                          <User className="h-8 w-8" />
                          <div className="absolute -top-1 -right-1 bg-emerald-500 h-5 w-5 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                             <ShieldCheck className="h-3 w-3 text-white" />
                          </div>
                       </div>
                       <div className="space-y-0.5">
                         <h3 className="text-lg xs:text-xl font-bold text-[#0F172A] tracking-tight leading-tight truncate max-w-[240px]">
                           {profile?.name || "Aspirant"}
                         </h3>
                         <Link 
                           href="/profile" 
                           className="text-[12px] xs:text-[13px] font-bold text-[#94A3B8] tracking-tight hover:text-primary transition-colors"
                         >
                           View Profile
                         </Link>
                       </div>
                    </div>

                    <div className="h-px w-full bg-slate-100" />

                    <div className={cn(
                      "w-full p-4 rounded-2xl border transition-all flex flex-col items-center text-center",
                      profile?.passStatus === 'active' ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-slate-50 text-slate-400 border-slate-100"
                    )}>
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest leading-none mb-2">
                          <Gem className="h-3 w-3" />
                          <span>{passLabel}</span>
                       </div>
                       {profile?.passStatus === 'active' && timeLeft ? (
                          <div className="flex items-center gap-2 text-[11px] font-bold">
                             <Clock className="h-3.5 w-3.5" />
                             <span>{timeLeft}</span>
                          </div>
                       ) : (
                          <p className="text-[9px] font-bold opacity-70">Prepare with Cracklix</p>
                       )}
                    </div>

                    <div className="w-full space-y-1 text-left">
                       <ProfileMenuItem href="/dashboard" icon={ShieldCheck} label="My Progress" />
                       <ProfileMenuItem href="/pass" icon={CreditCard} label="My Pass" />
                       <ProfileMenuItem href="/profile" icon={Settings} label="Settings" />
                       <ProfileMenuItem href="/help" icon={HelpCircle} label="Help Center" />
                       {isAdmin && (
                         <ProfileMenuItem href="/admin" icon={ShieldCheck} label="Admin Panel" highlight />
                       )}
                    </div>

                    <Button
                      onClick={handleLogout}
                      className="w-full h-12 bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#EF4444] font-bold text-[12px] tracking-tight rounded-xl transition-all border-none shadow-none group"
                    >
                       Log Out <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="px-6 h-12 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-primary/20">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-[300px] xs:w-[320px] p-0 border-none bg-white z-[2001] shadow-2xl [&>button]:hidden">
          <SheetHeader className="sr-only"><SheetTitle>Menu</SheetTitle><SheetDescription>Navigation</SheetDescription></SheetHeader>
          <MobileSidebar onClose={() => setIsSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active?: boolean; }) {
  return (
    <Link href={href} className={cn("text-sm font-bold tracking-tight transition-all", active ? "text-primary" : "text-slate-500 hover:text-[#04102B]")}>
      {label}
    </Link>
  );
}

function ProfileMenuItem({ href, icon: Icon, label, highlight }: { href: string, icon: any, label: string, highlight?: boolean }) {
  return (
    <Link href={href} className={cn(
      "flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-sm font-bold",
      highlight ? "bg-slate-900 text-white hover:bg-black" : "text-slate-600 hover:bg-slate-50"
    )}>
       <Icon className={cn("h-4 w-4 shrink-0", highlight ? "text-primary" : "text-slate-400")} />
       <span className="truncate">{label}</span>
    </Link>
  )
}
