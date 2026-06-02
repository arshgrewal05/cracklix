"use client";

import { Bell, Menu } from "lucide-react";
import Logo from "./Logo";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-[#08152d] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-20 flex items-center justify-between">
          <Logo />

          <nav className="hidden lg:flex gap-10 text-white font-medium text-sm">
            <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <Link href="/exams" className="hover:text-orange-500 transition-colors">Exams</Link>
            <Link href="/mocks" className="hover:text-orange-500 transition-colors">Mocks</Link>
            <Link href="/pyqs" className="hover:text-orange-500 transition-colors">PYQs</Link>
            <Link href="/current-affairs" className="hover:text-orange-500 transition-colors">Current Affairs</Link>
          </nav>

          <div className="flex items-center gap-6">
            <button className="relative text-white hover:text-orange-500 transition-colors p-2">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500 border-2 border-[#08152d]" />
            </button>

            <Link href="/login">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20">
                Login
              </button>
            </Link>

            <button className="lg:hidden text-white p-2">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
