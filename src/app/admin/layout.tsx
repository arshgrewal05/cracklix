
'use client';

import React, { useEffect, useState } from "react";
import { useUser, useAuth } from "@/firebase";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview Hardened Admin Hub Layout v6.0.
 * Manages global sidebar state and synchronized content area.
 */

const SUPER_ADMIN_WHITELIST = ['arshdeepgrewal1122@gmail.com'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useUser();
  const authInstance = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize state from LocalStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedState = localStorage.getItem('admin-sidebar-state');
    if (savedState) {
      setIsSidebarOpen(savedState === 'expanded');
    } else {
      // Default behavior: Expanded on desktop, Collapsed on tablet/mobile
      setIsSidebarOpen(window.innerWidth >= 1024);
    }
  }, []);

  // Sync state changes to LocalStorage
  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem('admin-sidebar-state', newState ? 'expanded' : 'collapsed');
  };

  const userEmail = user?.email?.toLowerCase();
  const isFounder = userEmail && SUPER_ADMIN_WHITELIST.includes(userEmail);
  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN' || isFounder;

  useEffect(() => {
    if (!loading && mounted) {
      if (!user) {
        router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      } else if (!isAdmin) {
        router.push('/dashboard');
      }
    }
  }, [user, profile, loading, router, isAdmin, mounted, pathname]);

  const handleLogout = async () => {
    await signOut(authInstance);
    router.push('/login');
  };

  if (!mounted || loading) return (
    <div className="h-screen w-full bg-[#0F172A] flex flex-col items-center justify-center space-y-6">
       <ShieldCheck className="h-12 w-12 text-blue-600 animate-pulse" />
       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Securing Registry Center...</p>
    </div>
  );
  
  if (!user || !isAdmin) return null;

  // Synchronization Widths
  const sidebarWidth = isSidebarOpen ? 320 : 96;

  return (
    <div className="min-h-screen w-full bg-white font-body overflow-x-hidden relative flex">
      
      {/* 1. MASTER SIDEBAR HUB */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onToggle={toggleSidebar} 
        onCloseMobile={() => setIsSidebarOpen(false)}
        profile={profile}
        handleLogout={handleLogout}
        pathname={pathname}
      />

      {/* 2. SYNCHRONIZED CONTENT AREA */}
      <div 
        className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out"
        style={{ 
          marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? sidebarWidth : 0 
        }}
      >
        {/* STICKY HEADER */}
        <header className="h-20 border-b border-slate-100 flex items-center px-4 md:px-10 justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4">
            {/* Mobile Trigger Only */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden bg-blue-600 text-white h-11 w-11 rounded-xl shadow-lg flex items-center justify-center active:scale-95 transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex flex-col text-left">
               <span className="text-[11px] font-black uppercase text-blue-600 tracking-[0.2em] leading-none">ADMIN HUB</span>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 hidden xs:block">REGISTRY AUDIT ACTIVE</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <Button asChild variant="outline" className="h-11 px-7 rounded-xl border-slate-200 font-black uppercase text-[10px] tracking-widest gap-2 hover:bg-slate-50 transition-all active:scale-95">
                <Link href="/">VIEW SITE</Link>
             </Button>
             <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <div className="text-right hidden sm:block">
                   <p className="text-[10px] font-black text-slate-900 leading-none">{profile?.name || 'ADMIN'}</p>
                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">SUPER_ADMIN</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-lg">
                  {profile?.name?.[0] || 'A'}
                </div>
             </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 md:p-12 max-w-full">
           {children}
        </main>
      </div>
    </div>
  );
}

import Link from "next/link";
