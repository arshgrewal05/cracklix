
"use client";

import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { Send, MapPin, ShieldCheck, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Premium Institutional Footer Redesign v3.0.
 * STYLE: Professional SaaS (inspired by Stripe/Linear).
 * LAYOUT: 4-Column responsive grid.
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#001A4D] text-white border-t border-white/5 font-body text-left">
      <div className="container mx-auto px-6 max-w-[1280px] pt-[80px] pb-[50px]">
        
        {/* 1. MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 items-start mb-16">
          
          {/* COLUMN 1: BRAND */}
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <Logo imgClassName="h-10 md:h-12 w-auto origin-left" />
              <p className="text-[16px] font-bold text-white tracking-tight leading-tight">
                Punjab&apos;s Smartest Exam Platform
              </p>
            </div>
            <p className="text-[14px] leading-relaxed font-medium text-white/75 max-w-[280px]">
              Prepare for Punjab Government Exams with AI-powered mock tests, previous papers, study notes and detailed analytics.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2.5 text-white/75">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span className="text-[13px] font-medium uppercase tracking-tight">Bathinda, Punjab</span>
              </div>
              <div className="flex items-center gap-2.5 text-emerald-400/90">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span className="text-[13px] font-black uppercase tracking-widest">Institutionally Registered</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: EXAMS */}
          <div className="space-y-8">
            <h4 className="text-[12px] font-black uppercase tracking-[4px] text-[#64748B]">EXAMS</h4>
            <ul className="flex flex-col gap-[14px]">
              <FooterLink href="/exams">PSSSB Boards</FooterLink>
              <FooterLink href="/exams">PPSC Gazetted</FooterLink>
              <FooterLink href="/exams">Punjab Police</FooterLink>
              <FooterLink href="/exams">Teaching Cadre</FooterLink>
              <FooterLink href="/exams">Punjab Patwari</FooterLink>
              <FooterLink href="/exams">Punjab Clerk</FooterLink>
            </ul>
          </div>

          {/* COLUMN 3: RESOURCES */}
          <div className="space-y-8">
            <h4 className="text-[12px] font-black uppercase tracking-[4px] text-[#64748B]">RESOURCES</h4>
            <ul className="flex flex-col gap-[14px]">
              <FooterLink href="/mocks">Free Mock Tests</FooterLink>
              <FooterLink href="/pyqs">Previous Year Papers</FooterLink>
              <FooterLink href="/notes">Study Notes</FooterLink>
              <FooterLink href="/current-affairs">Current Affairs</FooterLink>
              <FooterLink href="/exam-calendar">Exam Calendar</FooterLink>
              <FooterLink href="/success-stories">Success Stories</FooterLink>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT */}
          <div className="space-y-8">
            <h4 className="text-[12px] font-black uppercase tracking-[4px] text-[#64748B]">CONNECT</h4>
            <div className="space-y-6">
              <Link 
                href="https://t.me/cracklixapp" 
                target="_blank"
                className="h-[52px] w-[52px] rounded-[16px] bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary transition-all duration-300 shadow-xl"
              >
                <Send className="h-6 w-6 fill-current text-white" />
              </Link>
              
              <div className="space-y-1">
                <p className="text-[20px] font-bold text-[#F97316] leading-none tracking-tight whitespace-nowrap">
                  +91 98881 88602
                </p>
                <p className="text-[14px] font-medium text-white/70">
                  support@cracklix.com
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 2. BOTTOM BAR */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
            
            {/* Copyright */}
            <div className="text-[13px] font-medium text-white/55 text-center md:text-left">
              © {currentYear} Cracklix. All Rights Reserved.
            </div>

            {/* Utility Links */}
            <div className="flex items-center gap-6 md:gap-10">
              <Link href="/privacy" className="text-[13px] font-medium text-white/55 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-[13px] font-medium text-white/55 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/refund" className="text-[13px] font-medium text-white/55 hover:text-white transition-colors">Refund Policy</Link>
            </div>

            {/* Credit */}
            <div className="text-[13px] font-black text-white/55 uppercase tracking-widest flex items-center gap-1.5">
              Made in Punjab <span className="text-white">🇮🇳</span>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-[15px] font-medium text-white/75 hover:text-primary transition-all duration-200 uppercase tracking-tight"
      >
        {children}
      </Link>
    </li>
  );
}
