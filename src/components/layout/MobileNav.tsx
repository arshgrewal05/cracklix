'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Home, BarChart3, Target, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Production PWA Bottom Navigation v10.0.
 * SIZING: Height 88px. Active Box: 92x76px with 28px rounding.
 * COLORS: Active #2563EB, Inactive #6B7280.
 */
export default function MobileNav() {
  const pathname = usePathname();

  // Guard: Hide navigation during live CBT attempts or in the Admin Portal
  if (!pathname || pathname.includes('/attempt') || pathname.startsWith('/admin')) return null;

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "My Hub", href: "/my-exams", icon: Target },
    { label: "Practice", href: "/mocks", icon: Zap },
    { label: "Stats", href: "/dashboard", icon: BarChart3 },
    { label: "Pass", href: "/pass", icon: Gem, isPremium: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1000] bg-white border-t border-[#E2E8F0] pb-[env(safe-area-inset-bottom)] md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.03)] pointer-events-auto h-[88px]">
      <div className="flex items-center justify-around h-full px-4 max-w-md mx-auto relative">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center justify-center h-full touch-manipulation focus:outline-none">
              <div className="flex flex-col items-center justify-center">
                <div className={cn(
                  "flex items-center justify-center transition-all duration-300 w-14 h-14",
                  isActive || item.isPremium
                    ? "bg-[#2563EB] text-white shadow-lg shadow-[#2563EB]/20 w-[92px] h-[76px] rounded-[28px]" 
                    : "bg-white text-slate-500 rounded-3xl"
                )}>
                  <Icon 
                    className="w-7 h-7" 
                    fill={isActive || item.isPremium ? "currentColor" : "none"}
                  />
                </div>
                {!(isActive || item.isPremium) && (
                  <span className={cn(
                    "text-[11px] uppercase transition-colors duration-300 mt-1 tracking-tight font-medium text-slate-500"
                  )}>
                    {item.label}
                  </span>
                )}
                {(isActive || item.isPremium) && (
                  <span className="text-[11px] uppercase text-[#2563EB] font-bold mt-1 tracking-tight">
                    {item.label}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
