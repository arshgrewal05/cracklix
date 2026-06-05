'use client';

import { 
  FileText, 
  FileStack, 
  Newspaper, 
  CalendarDays, 
  Bell, 
  Settings, 
  Phone, 
  Shield, 
  ChevronRight, 
  Gem,
  Trophy,
  Zap,
  GraduationCap,
  BarChart3,
  X,
  Home
} from "lucide-react";
import Link from "next/link";
import { useUser } from "@/firebase";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import StudentAvatar from "@/components/brand/StudentAvatar";

export default function MobileSidebar({ onClose }: { onClose: () => void }) {
  const { user, profile } = useUser();

  const mainPrepItems = [
    { label: "Home Hub", href: "/", icon: Home, color: "text-primary" },
    { label: "My Mocks", href: "/mocks", icon: Zap, color: "text-orange-500" },
    { label: "Exam Hubs", href: "/exams", icon: GraduationCap, color: "text-blue-500" },
    { label: "Study Notes", href: "/notes", icon: FileText, color: "text-emerald-500" },
    { label: "Results Registry", href: "/dashboard", icon: BarChart3, color: "text-amber-500" },
    { label: "Hall of Rankers", href: "/leaderboard", icon: Trophy, color: "text-indigo-500" },
    { label: "PYQ Archives", href: "/pyqs", icon: FileStack, color: "text-slate-400" },
  ];

  const secondaryItems = [
    { label: "Daily Analysis", href: "/current-affairs", icon: Newspaper, color: "text-slate-500" },
    { label: "Exam Calendar", href: "/exam-calendar", icon: CalendarDays, color: "text-slate-500" },
    { label: "Notifications", href: "/notifications", icon: Bell, color: "text-slate-500" },
    { label: "Profile Settings", href: "/profile", icon: Settings, color: "text-slate-500" },
    { label: "Institutional Contact", href: "/contact", icon: Phone, color: "text-slate-500" },
    { label: "Privacy Protocol", href: "/privacy", icon: Shield, color: "text-slate-500" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0F172A] text-white pt-[env(safe-area-inset-top)]">
      {/* Header Profile Section */}
      <div className="px-4 py-6 bg-gradient-to-br from-[#0B1528] to-[#0F172A] border-b border-white/5 relative shrink-0">
        <div className="flex items-center gap-3">
          <StudentAvatar profile={profile} className="h-12 w-12 border-2 border-[#F97316] rounded-2xl shadow-xl shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-headline font-black text-base truncate uppercase tracking-tight">{profile?.name || "Aspirant"}</p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">{profile?.role || "STUDENT"}</span>
               <div className="h-0.5 w-0.5 rounded-full bg-slate-700 hidden xs:block" />
               <span className="text-[9px] font-black text-primary uppercase tracking-widest whitespace-nowrap">{profile?.status?.replace('_', ' ') || "FREE"}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors shrink-0"
          >
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Navigation Nodes */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1">
          {mainPrepItems.map((item) => (
            <SidebarLink key={item.href} item={item} onClick={onClose} />
          ))}
          
          <div className="px-1 py-4">
            <Button asChild className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl h-12 font-black uppercase text-[10px] tracking-widest gap-2 shadow-2xl shadow-orange-900/20">
              <Link href="/pass" onClick={onClose}>
                <Gem className="h-3.5 w-3.5" /> Upgrade Pass
              </Link>
            </Button>
          </div>

          <div className="h-px w-full bg-white/5 mx-2 my-2" />

          {secondaryItems.map((item) => (
            <SidebarLink key={item.href} item={item} onClick={onClose} />
          ))}
        </div>
      </ScrollArea>

      {/* Footer Info */}
      <div className="p-6 border-t border-white/5 opacity-40 shrink-0">
         <div className="space-y-0.5">
            <p className="text-[8px] font-black uppercase tracking-[0.3em]">Cracklix v1.1</p>
            <p className="text-[7px] font-bold uppercase tracking-[0.1em] text-slate-500">Punjab Registry Secure</p>
         </div>
      </div>
    </div>
  );
}

function SidebarLink({ item, onClick }: { item: any, onClick: () => void }) {
  return (
    <Link 
      href={item.href} 
      onClick={onClick}
      className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/5 h-[56px]"
    >
      <div className="flex items-center gap-3">
        <div className={`h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center transition-all group-hover:scale-110 shadow-inner shrink-0`}>
          <item.icon className={`h-4.5 w-4.5 ${item.color}`} />
        </div>
        <span className="font-bold text-sm text-slate-300 group-hover:text-white transition-colors truncate">{item.label}</span>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-slate-700 group-hover:text-primary transition-all shrink-0" />
    </Link>
  );
}
