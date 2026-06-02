"use client"

import Link from "next/link"
import { ShieldCheck, LayoutDashboard, BookOpen, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl font-bold tracking-tight text-foreground">
            Prep<span className="text-primary">Station</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/exams" className="flex items-center gap-2 hover:text-primary transition-colors">
            <BookOpen className="h-4 w-4" />
            Exams
          </Link>
          <Link href="/admin" className="flex items-center gap-2 hover:text-primary transition-colors">
            <LayoutDashboard className="h-4 w-4" />
            Admin
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
          <Button className="hidden sm:inline-flex bg-primary hover:bg-primary/90">
            Sign In
          </Button>
        </div>
      </div>
    </nav>
  )
}