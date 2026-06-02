'use client';

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/brand/Logo";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  const links = [
    { label: "Home", href: "/", active: true },
    { label: "Exams", href: "/exams" },
    { label: "Mocks", href: "/mocks" },
    { label: "PYQs", href: "/pyqs" },
    { label: "Current Affairs", href: "/current-affairs" },
  ];

  return (
    <nav className="sticky top-0 z-[1000] w-full bg-[#0B1528] border-b border-white/5 py-4">
      <div className="container mx-auto max-w-[90%] flex items-center justify-between px-4">
        <Logo variant="light" />

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-[30px] text-[15px] font-medium text-[#7A8B9E]">
          {links.map(link => (
            <Link 
              key={link.label} 
              href={link.href} 
              className={`transition-colors hover:text-[#F97316] ${link.active ? 'text-white' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <Button asChild className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-6 py-2.5 rounded-lg h-auto hidden sm:flex border-none transition-all hover:-translate-y-0.5 shadow-lg shadow-orange-500/20">
            <Link href="/login">Login</Link>
          </Button>
          
          <button 
            className="lg:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-[#0B1528] border-b border-white/10 lg:hidden flex flex-col p-6 gap-4"
          >
            {links.map(link => (
              <Link 
                key={link.label} 
                href={link.href} 
                className="text-[#7A8B9E] hover:text-[#F97316] font-bold text-sm uppercase tracking-widest"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="bg-[#F97316] hover:bg-[#EA580C] text-white font-bold w-full h-12 rounded-lg">
              <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
