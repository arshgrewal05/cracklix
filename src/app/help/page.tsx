
"use client"

import React, { useState, useMemo } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { 
  HelpCircle, 
  Search, 
  ChevronRight, 
  Zap, 
  CreditCard, 
  Smartphone, 
  Lock, 
  BookOpen,
  ShieldCheck,
  MessageCircle,
  Loader2,
  LucideIcon,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, where } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { HelpArticle } from "@/types"

/**
 * @fileOverview Official Institutional Help Hub v4.0.
 * FIXED: Category filtering and search integration made fully functional.
 */

const HELP_CATEGORIES = [
  { id: "PAYMENTS", label: "Payments", icon: CreditCard, desc: "UPI, Cards, and Refunds" },
  { id: "PASS", label: "Premium Pass", icon: Zap, desc: "Plans and Benefits" },
  { id: "PWA", label: "App Setup", icon: Smartphone, desc: "Install Cracklix PWA" },
  { id: "TECHNICAL", label: "CBT Issues", icon: ShieldCheck, desc: "Test engine help" },
  { id: "ACCOUNT", label: "Account Hub", icon: Lock, desc: "Security and Profile" }
]

export default function HelpCenterPage() {
  const db = useFirestore()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const helpQuery = useMemo(() => (db ? query(
    collection(db, "help_articles"), 
    where("published", "==", true)
  ) : null), [db])

  const { data: rawArticles, loading } = useCollection<HelpArticle>(helpQuery as any)

  const articles = useMemo(() => {
    if (!rawArticles) return [];
    return [...rawArticles].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [rawArticles]);

  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      const matchesSearch = !searchTerm || 
        a.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.content?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || a.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
  }, [articles, searchTerm, selectedCategory])

  return (
    <div className="min-h-screen bg-slate-50/50 text-left font-body">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-6xl space-y-12 md:space-y-16 pb-40">
        <div className="text-center space-y-8">
           <div className="space-y-4">
              <div className="h-16 w-16 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto text-primary shadow-2xl">
                 <HelpCircle className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-7xl font-headline font-black text-[#0F172A] uppercase tracking-tighter leading-none">Help <span className="text-primary">Center</span></h1>
              <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto leading-relaxed">Search through our verified guides to fix issues instantly.</p>
           </div>

           <div className="relative max-w-2xl mx-auto group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-400 rounded-2xl blur opacity-5 group-focus-within:opacity-15 transition duration-1000"></div>
              <div className="relative">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
                 <Input 
                   className="h-16 pl-16 rounded-[1.5rem] bg-white border-none shadow-xl text-lg font-bold text-[#0F172A]" 
                   placeholder="Search common issues..." 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
              </div>
           </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
           {HELP_CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <Card 
                  key={cat.id} 
                  onClick={() => setSelectedCategory(isActive ? null : cat.id)}
                  className={cn(
                    "border-none shadow-xl rounded-[2.5rem] bg-white group hover:translate-y-[-6px] transition-all duration-500 border-2 cursor-pointer",
                    isActive ? "border-primary ring-4 ring-primary/5" : "border-transparent"
                  )}
                >
                  <CardContent className="p-6 md:p-8 text-center space-y-4">
                      <div className={cn(
                        "h-12 w-12 md:h-14 md:w-14 rounded-2xl flex items-center justify-center mx-auto shadow-inner transition-all text-primary",
                        isActive ? "bg-primary text-white" : "bg-slate-50 group-hover:scale-110 group-hover:bg-primary/5"
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-headline font-black text-xs md:text-sm uppercase text-[#0F172A]">{cat.label}</h3>
                        <p className="text-[8px] md:text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest leading-tight">{cat.desc}</p>
                      </div>
                  </CardContent>
                </Card>
              )
           })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           <div className="lg:col-span-7 space-y-8 text-left">
              <div className="flex items-center justify-between">
                 <h3 className="text-2xl font-headline font-black uppercase flex items-center gap-4 text-[#0F172A]">
                    <BookOpen className="h-6 w-6 text-primary" /> 
                    {selectedCategory ? `${selectedCategory} Guides` : "Common Fixes"}
                 </h3>
                 {selectedCategory && (
                    <button onClick={() => setSelectedCategory(null)} className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1 hover:text-primary transition-colors">
                       <X className="h-3 w-3" /> Clear Filter
                    </button>
                 )}
              </div>
              
              <div className="space-y-4">
                 {loading ? (
                    Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-[2rem]" />)
                 ) : filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                      <Card key={article.id} className="border-none shadow-lg rounded-[2rem] bg-white group border border-slate-100 overflow-hidden">
                         <CardContent className="p-8 space-y-3">
                            <div className="flex items-center gap-3">
                               <Badge variant="outline" className="bg-slate-50 border-slate-100 text-[8px] font-black uppercase px-2">{article.category}</Badge>
                            </div>
                            <p className="text-lg font-black text-[#0F172A] uppercase leading-tight group-hover:text-primary transition-colors">{article.title}</p>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">{article.content}</p>
                         </CardContent>
                      </Card>
                    ))
                 ) : (
                    <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 opacity-20 italic">No matching articles found.</div>
                 )}
              </div>
           </div>

           <div className="lg:col-span-5 space-y-8">
              <Card className="border-none shadow-3xl rounded-[3rem] bg-[#0F172A] text-white p-10 md:p-12 space-y-8 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-1000"><MessageCircle className="h-64 w-64" /></div>
                 <div className="relative z-10 space-y-6 text-left">
                    <h3 className="text-3xl font-headline font-black uppercase text-primary leading-tight">Need more <br/> help?</h3>
                    <p className="text-slate-400 text-lg font-medium leading-relaxed">Raise a support ticket and our team will audit your issue within 24 hours.</p>
                    <Button asChild className="w-full h-16 bg-primary hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl gap-3 border-none transition-all active:scale-95">
                       <Link href="/support">Open Support Center <ChevronRight className="h-4 w-4" /></Link>
                    </Button>
                 </div>
              </Card>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
