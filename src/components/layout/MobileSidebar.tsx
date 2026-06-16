'use client';

import React, { useState, useEffect } from "react";
import { 
  Home, 
  Zap, 
  FileText, 
  Target, 
  ChevronRight,
  LogOut,
  ShieldCheck,
  Gem,
  Newspaper,
  User,
  Trophy,
  Landmark,
  BookOpen,
  HelpCircle,
  MessageCircle,
  Instagram,
  Settings,
  X
} from "lucide-react";
import Link from "next/link";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/brand/Logo";
import StudentAvatar from "@/components/brand/StudentAvatar";
import { TELEGRAM_GROUP, INSTAGRAM_PROFILE } from "@/lib/constants";

/**
 * @fileOverview Premium Sidebar Hub v7.0.
 * UPDATED: Sidebar uses variant="light" (Navy text) to match clean white aesthetic.
 */
export default function MobileSidebar({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const { user, profile } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
      router.push('/');
    } catch (e) {}
  };

  const mainItems = [
    { label: "Home Page", href: "/", icon: Home },
    { label: "My Hub", href: "/my-exams", icon: Target },
    { label: "Exam List", href: "/exams", icon: Landmark },
    { label: "Practice Bank", href: "/mocks", icon: Zap },
    { label: "Study Updates", href: "/current-affairs", icon: Newspaper },
    { label: "Study Notes", href: "/notes", icon: BookOpen },
    { label: "Punjab Merit", href: "/leaderboard", icon: Trophy },
  ];

  const supportItems = [
    { label: "Support Center", href: "/support", icon: MessageCircle },
    { label: "Help Center", href: "/help", icon: HelpCircle },
  ];

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full bg-white font-body select-none text-left relative overflow-hidden">
      
      {/* 1. BRAND HEADER */}
      <div className="h-24 px-6 flex items-center justify-start shrink-0 border-b border-slate-50">
         <Logo variant="light" imgClassName="w-[140px] h-auto" />
      </div>

      {/* 2. NAVIGATION HUB */}
      <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar py-6">
        
        {/* PROFILE MINI-CARD */}
        <div className="px-6 mb-8">
           <Link href="/profile" onClick={onClose} className="block active:scale-[0.98] transition-all">
              <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-5 flex items-center gap-4 shadow-sm hover:border-primary/20">
                 <StudentAvatar profile={profile} className="h-12 w-12 rounded-xl border-2 border-white shadow-md bg-white" />
                 <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-black text-[#0F172A] truncate uppercase tracking-tight leading-none">{profile?.name || "Aspirant"}</h2>
                    <Badge className="bg-primary text-white border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 mt-2 rounded-lg shadow-sm">
                       {profile?.pass?.active ? (profile.pass.plan || 'ELITE') : 'FREE NODE'}
                    </Badge>
                 </div>
                 <ChevronRight className="h-4 w-4 text-slate-300" />
              </div>
           </Link>
        </div>

        {/* GROUPS */}
        <NavGroup label="Personalized Prep" items={[{ label: "My Profile", href: "/profile", icon: User }]} pathname={pathname} onClose={onClose} />
        <NavGroup label="Management Hub" items={mainItems} pathname={pathname} onClose={onClose} />
        <NavGroup label="Resolution Hub" items={supportItems} pathname={pathname} onClose={onClose} />

        {/* SOCIAL NODE */}
        <div className="px-8 mt-4 mb-2">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Community Nodes</p>
        </div>
        <div className="px-4 mb-10 space-y-1">
           <SocialItem href={TELEGRAM_GROUP} icon={<MessageCircle />} label="Telegram Center" sub="15k+ Aspirants" />
           <SocialItem href={INSTAGRAM_PROFILE} icon={<Instagram />} label="Follow Hub" sub="@arshgrewal_official" />
        </div>
      </div>

      {/* 3. SYSTEM FOOTER */}
      <div className="p-6 border-t border-slate-100 bg-white mt-auto pb-[env(safe-area-inset-bottom)]">
         <button onClick={handleLogout} className="h-14 w-full flex items-center justify-center gap-3 px-4 rounded-2xl bg-slate-900 text-white hover:bg-black transition-all font-black uppercase text-[11px] tracking-widest active:scale-95 shadow-xl shadow-slate-900/10">
           <LogOut className="h-4 w-4 text-primary" />
           <span>Log Out Session</span>
         </button>
      </div>
    </div>
  );
}

function NavGroup({ label, items, pathname, onClose }: any) {
   return (
      <div className="mb-8">
         <div className="px-8 mb-3">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{label}</p>
         </div>
         <div className="flex flex-col gap-1 px-4">
            {items.map((item: any) => {
               const isActive = pathname === item.href;
               return (
                  <Link key={item.label} href={item.href} onClick={onClose} className={cn(
                    "h-12 flex items-center gap-3 px-4 rounded-xl transition-all duration-200 group active:scale-[0.98]",
                    isActive ? "bg-blue-50 text-primary shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                  )}>
                    <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-primary" : "text-slate-400 group-hover:text-primary")} />
                    <span className={cn("text-[14px] font-bold uppercase tracking-tight", isActive ? "text-primary" : "text-slate-600")}>{item.label}</span>
                  </Link>
               )
            })}
         </div>
      </div>
   )
}

function SocialItem({ href, icon, label, sub }: any) {
   return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="h-14 flex items-center gap-4 px-4 rounded-xl text-slate-600 hover:bg-slate-50 transition-all group active:scale-[0.98]">
         <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 shadow-inner text-slate-400 group-hover:text-primary transition-colors">
            {React.cloneElement(icon, { className: "h-5 w-5" })}
         </div>
         <div className="min-w-0">
            <p className="text-[13px] font-bold uppercase tracking-tight text-[#0F172A] leading-none">{label}</p>
            <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-1.5">{sub}</p>
         </div>
      </a>
   )
}
