
'use client';

import Link from "next/link"
import Logo from "@/components/brand/Logo"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="py-24 bg-[#0F172A] text-white/70 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-20">
          <div className="col-span-1 lg:col-span-2 space-y-8">
            <Logo variant="light" />
            <p className="text-base leading-relaxed max-w-sm">
              Your one-stop premium platform for complete preparation of all Punjab Government Exams. Built with trust and precision for serious aspirants.
            </p>
            <div className="flex gap-4">
              <SocialLink icon={<Facebook className="h-5 w-5" />} />
              <SocialLink icon={<Twitter className="h-5 w-5" />} />
              <SocialLink icon={<Instagram className="h-5 w-5" />} />
              <SocialLink icon={<Youtube className="h-5 w-5" />} />
            </div>
          </div>
          
          <div>
            <h4 className="font-headline font-bold text-white text-sm uppercase tracking-[0.2em] mb-8">Quick Links</h4>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-tight">
              <li><Link href="/" className="hover:text-[#F97316] transition-colors">Home</Link></li>
              <li><Link href="/exams" className="hover:text-[#F97316] transition-colors">Exams</Link></li>
              <li><Link href="/mocks" className="hover:text-[#F97316] transition-colors">Mocks</Link></li>
              <li><Link href="/pyqs" className="hover:text-[#F97316] transition-colors">PYQs</Link></li>
              <li><Link href="/current-affairs" className="hover:text-[#F97316] transition-colors">Current Affairs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-white text-sm uppercase tracking-[0.2em] mb-8">Company</h4>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-tight">
              <li><Link href="/about" className="hover:text-[#F97316] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#F97316] transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:text-[#F97316] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#F97316] transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-headline font-bold text-white text-sm uppercase tracking-[0.2em] mb-8">Contact</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-[#F97316]" /> support@cracklix.com</li>
              <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-[#F97316]" /> +91 98765 43210</li>
              <li className="flex items-start gap-3"><MapPin className="h-4 w-4 text-[#F97316] mt-1 shrink-0" /> Chandigarh, Punjab, India</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em]">
            © 2024 Cracklix. All rights reserved.
          </p>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
            Made with <span className="text-red-500">❤️</span> for Punjab Aspirants
          </p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ icon }: { icon: React.ReactNode }) {
  return (
    <Link href="#" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#F97316] hover:text-white transition-all">
      {icon}
    </Link>
  )
}
