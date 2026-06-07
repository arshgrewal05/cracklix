
'use client';

import { 
  FileText, 
  CalendarDays, 
  Bell, 
  Phone, 
  ChevronRight, 
  Gem,
  Zap,
  BarChart3,
  Home,
  LogOut,
  ChevronDown,
  Target,
  User as UserIcon,
  X
} from "lucide-react";
import Link from "next/link";
import { useUser, useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import StudentAvatar from "@/components/brand/StudentAvatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import ShareButton from "@/components/navigation/ShareButton";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * @fileOverview Institutional Mobile Sidebar v2.1.
 * FIXED: Resolved text truncation and Badge overflow in the profile header.
 */

export default function MobileSidebar({ onClose }: { onClose: () => void }) {
  const { profile } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    onClose();
    router.push('/login');
  };

  const primaryMenu = [
    { label: "HOME", href: "/", icon: Home },
    { label: "MY EXAMS", href: "/my-exams", icon: Target },
    { label: "PRACTICE SERIES", href: "/mocks", icon: Zap },
    { label: "EXAM CALENDAR", href: "/exam-calendar", icon: CalendarDays },
    { label: "STUDY NOTES", href: "/notes", icon: FileText },
    { label: "PERFORMANCE", href: "/dashboard", icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col h-full bg-white text-[#0F172A] overflow-hidden font-body w-full">
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col min-h-full">
          
          {/* 1. HIGH-FIDELITY PROFILE HEADER */}
          <div className="px-6 md:px-8 pt-12 pb-10 bg-[#0B1528] relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all active:scale-90 z-20"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col gap-6 md:gap-8 relative z-10">
              <StudentAvatar 
                profile={profile} 
                className="h-16 w-16 md:h-20 md:w-20 border-4 border-white/10 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl bg-[#0F172A]" 
              />
              
              <div className="space-y-4 text-left">
                <div className="flex flex-col gap-2">
                  <h2 className="font-headline font-black text-2xl md:text-3xl text-white uppercase tracking-tight break-words">
                    {profile?.name || "Student Node"}
                  </h2>
                  <Badge className="bg-primary text-white border-none text-[8px] font-black uppercase px-3 py-1 rounded shadow-xl w-fit">
                    {(profile?.status || 'Free').toUpperCase()} PASS
                  </Badge>
                </div>
                
                <Link 
                  href="/profile" 
                  onClick={onClose}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-white transition-colors flex items-center gap-2"
                >
                  VIEW PROFILE <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* 2. MENU LIST */}
          <div className="flex-1 py-6">
            <div className="space-y-1">
              {primaryMenu.map((item) => (
                <MenuLink 
                  key={item.href} 
                  item={item} 
                  active={pathname === item.href}
                  onClick={onClose} 
                />
              ))}

              <div className="my-8 border-t border-slate-50 mx-10" />

              <CollapsibleGroup 
                label="MY ACCOUNT" 
                isOpen={isAccountOpen} 
                onToggle={setIsAccountOpen}
              >
                <MenuLink item={{ label: "PASS HUB", href: "/pass", icon: Gem }} active={pathname === '/pass'} onClick={onClose} indent />
                <MenuLink item={{ label: "NOTIFICATIONS", href: "/notifications", icon: Bell }} active={pathname === '/notifications'} onClick={onClose} indent />
                <MenuLink item={{ label: "CONTACT US", href: "/contact", icon: Phone }} active={pathname === '/contact'} onClick={onClose} indent />
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-5 px-14 h-14 text-rose-500 hover:bg-rose-50 transition-all group"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span className="text-[13px] font-[900] uppercase tracking-tighter">Logout</span>
                </button>
              </CollapsibleGroup>

              <div className="px-10 mt-6 pb-12">
                 <ShareButton 
                   className="w-full h-16 bg-slate-50 border-none shadow-none text-slate-500 hover:bg-primary hover:text-white rounded-[1.5rem]" 
                   variant="ghost" 
                 />
              </div>
            </div>
          </div>

          {/* 3. SIGNATURE FOOTER */}
          <div className="px-8 py-10 border-t border-slate-50 bg-slate-50/30 flex flex-col items-center gap-1.5 mt-auto">
             <div className="flex items-center gap-2 text-[10px] font-black text-[#0F172A] uppercase tracking-[0.25em]">
                <UserIcon className="h-3.5 w-3.5 text-primary" /> 
                DEVELOPED BY ARSH GREWAL
             </div>
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.4em]">
                OFFICIAL PLATFORM 2026
             </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function MenuLink({ item, active, onClick, indent = false }: any) {
  return (
    <Link 
      href={item.href} 
      onClick={onClick}
      className={cn(
        "flex items-center justify-between px-10 h-16 transition-all group w-full",
        active ? "bg-primary/5 text-primary border-r-[6px] border-primary" : "hover:bg-slate-50 text-slate-500",
        indent && "pl-14"
      )}
    >
      <div className="flex items-center gap-6 min-w-0 flex-1">
        <item.icon className={cn("h-6 w-6 shrink-0 transition-transform group-active:scale-90", active ? "text-primary" : "text-slate-400 group-hover:text-primary")} />
        <span className={cn(
          "text-[14px] font-[900] uppercase tracking-tighter transition-colors truncate",
          active ? "text-[#0F172A]" : "group-hover:text-[#0F172A]"
        )}>
          {item.label}
        </span>
      </div>
      <ChevronRight className={cn(
        "h-4 w-4 transition-all",
        active ? "opacity-100 text-primary translate-x-1" : "opacity-0 group-hover:opacity-100 text-slate-200"
      )} />
    </Link>
  );
}

function CollapsibleGroup({ label, children, isOpen, onToggle }: any) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle} className="w-full">
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full px-10 h-14 hover:bg-slate-50 transition-all text-slate-400 group">
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">{label}</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-0.5 overflow-hidden transition-all">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
