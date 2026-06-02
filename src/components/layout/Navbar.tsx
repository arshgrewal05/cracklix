"use client"

import Link from "next/link"
import { Search, Bell, Menu, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/brand/Logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const boards = [
    "PSSSB", "PPSC", "Punjab Police", "Teaching Exams", "High Court", "PSPCL & PSTCL", "BFUHS", "Banking & Cooperative"
  ]

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 py-3">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Logo variant="dark" />

        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link href="/exams" className="hover:text-primary transition-colors">Exams</Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="hover:text-primary transition-colors flex items-center gap-1.5 outline-none group">
              Boards <ChevronDown className="h-4 w-4 group-data-[state=open]:rotate-180 transition-transform" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-gray-200 min-w-[200px] mt-2 p-1 rounded-lg shadow-xl">
              {boards.map(board => (
                <DropdownMenuItem key={board} asChild>
                  <Link href={`/exams?board=${encodeURIComponent(board)}`} className="cursor-pointer hover:bg-gray-50 rounded-md py-2 px-3 text-xs font-semibold">
                    {board}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/mocks" className="hover:text-primary transition-colors">Mock Tests</Link>
          <Link href="/results" className="hover:text-primary transition-colors">Results</Link>
          <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-gray-600 transition-colors p-2">
            <Search className="h-5 w-5" />
          </button>
          <div className="h-6 w-[1px] bg-gray-200 hidden sm:block" />
          <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors px-2">
            Login
          </Link>
          <Button asChild size="sm" className="bg-[#1E5EFF] hover:bg-[#1E5EFF]/90 text-white font-bold px-6 shadow-sm">
            <Link href="/mocks">Start Free Mock</Link>
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden text-gray-600">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  )
}