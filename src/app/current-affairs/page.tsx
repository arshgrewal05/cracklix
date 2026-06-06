
"use client"

import { useMemo, useState } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  ArrowRight, 
  Zap, 
  FileText, 
  FileStack, 
  TrendingUp, 
  Download, 
  ExternalLink,
  MessageCircle,
  Sparkles,
  Trophy,
  Globe,
  Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import Link from "next/link"

/**
 * @fileOverview Institutional Free Hub v3.0 - "Gagan Pratap" Professional Aesthetic.
 * Features: Native App-style Category Grid, Telegram Integration, and High-Contrast Action Cards.
 */

const CATEGORIES = [
  { id: "all", label: "All Hubs", icon: <Globe className="h-6 w-6" />, color: "bg-blue-50 text-blue-600" },
  { id: "mock", label: "Mocks", icon: <Zap className="h-6 w-6" />, color: "bg-orange-50 text-primary" },
  { id: "pdf", label: "PDF Notes", icon: <FileText className="h-6 w-6" />, color: "bg-emerald-50 text-emerald-600" },
  { id: "current", label: "Analysis", icon: <TrendingUp className="h-6 w-6" />, color: "bg-purple-50 text-purple-600" },
  { id: "pyq", label: "PYQ Papers", icon: <FileStack className="h-6 w-6" />, color: "bg-rose-50 text-rose-600" }
]

export default function FreeContentHub() {
  const db = useFirestore()
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const contentQuery = useMemo(() => {
    if (!db) return null
    return query(collection(db, "free_content"), orderBy("updatedAt", "desc"))
  }, [db])

  const { data: content, loading } = useCollection<any>(contentQuery)

  const filteredItems = useMemo(() => {
    if (!content) return []
    return content.filter(item => {
      const matchesType = activeFilter === "all" || item.type === activeFilter
      const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesType && matchesSearch
    })
  }, [content, activeFilter, searchTerm])

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 font-body">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-6xl">
        <div className="space-y-10 md:space-y-16">
          
          {/* 1. INSTITUTIONAL HERO HUB */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-left bg-[#0B1528] p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] text-white relative overflow-hidden shadow-4xl group">
            <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-1000"><Trophy className="h-64 w-64" /></div>
            <div className="space-y-6 relative z-10 max-w-2xl">
              <Badge className="bg-primary text-white border-none px-4 py-1 rounded-full font-black uppercase text-[9px] tracking-[0.2em] shadow-xl">
                 Official Free Repository
              </Badge>
              <h1 className="text-4xl md:text-7xl font-headline font-black tracking-tight uppercase leading-[0.9]">
                STUDY <span className="text-primary">GURU</span> <br/>
                <span className="text-white/40">COLLECTION</span>
              </h1>
              <p className="text-slate-400 font-medium text-base md:text-lg max-w-lg leading-relaxed">
                Access 100% free high-fidelity mocks and official PDF blueprints verified for 2026 recruitments.
              </p>
            </div>
            
            <div className="relative w-full md:w-96 z-10">
               <div className="absolute -inset-1 bg-primary/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="relative">
                 <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                 <Input 
                   className="h-16 pl-14 rounded-2xl bg-white/10 border-white/10 text-white placeholder:text-slate-500 text-lg font-medium backdrop-blur-md focus-visible:ring-primary" 
                   placeholder="Search all free nodes..." 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                 />
               </div>
            </div>
          </div>

          {/* 2. APP-STYLE CATEGORY GRID */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6">
             {CATEGORIES.map(cat => (
               <button 
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={cn(
                  "p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] transition-all flex flex-col items-center justify-center gap-3 md:gap-5 shadow-sm hover:shadow-2xl border-2",
                  activeFilter === cat.id ? 'bg-[#0B1528] border-[#0B1528] text-white scale-[1.02]' : 'bg-white border-white text-slate-400 hover:border-primary/20'
                )}
               >
                 <div className={cn(
                   "h-12 w-12 md:h-20 md:w-20 rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-inner transition-transform group-hover:scale-110",
                   activeFilter === cat.id ? 'bg-white/10 text-primary' : cat.color
                 )}>
                   {cat.icon}
                 </div>
                 <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{cat.label}</span>
               </button>
             ))}
          </div>

          {/* 3. DYNAMIC CONTENT GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 pb-20">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-60 w-full rounded-[2.5rem] md:rounded-[3.5rem]" />
              ))
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <Card key={item.id} className="bg-white border-none shadow-xl hover:shadow-4xl transition-all duration-500 rounded-[2rem] md:rounded-[3.5rem] overflow-hidden group text-left flex flex-col">
                  <CardContent className="p-8 md:p-12 flex-1 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6 md:mb-8">
                       <div className={cn(
                          "h-12 w-12 md:h-16 md:w-16 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-6 transition-transform",
                          item.type === 'mock' ? 'bg-orange-50 text-primary' : 'bg-blue-50 text-blue-600'
                       )}>
                          {item.type === 'mock' ? <Zap className="h-6 w-6 md:h-8 md:w-8" /> : 
                           item.type === 'pdf' ? <FileText className="h-6 w-6 md:h-8 md:w-8" /> : 
                           item.type === 'pyq' ? <FileStack className="h-6 w-6 md:h-8 md:w-8" /> : <TrendingUp className="h-6 w-6 md:h-8 md:w-8" />}
                       </div>
                       <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-50 text-emerald-600 border-none px-3 py-1 font-black uppercase text-[8px] tracking-widest">
                             NEW
                          </Badge>
                          <Badge className="bg-slate-50 text-slate-400 border-none px-3 py-1 font-black uppercase text-[8px] tracking-widest">
                             {CATEGORIES.find(c => c.id === item.type)?.label || 'FREE HUB'}
                          </Badge>
                       </div>
                    </div>

                    <div className="space-y-3 flex-1">
                      <h2 className="text-xl md:text-3xl font-headline font-black leading-[1.1] text-[#0F172A] group-hover:text-primary transition-colors uppercase">
                        {item.title}
                      </h2>
                      <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed line-clamp-2 md:line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                       <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          <Bell className="h-3.5 w-3.5 text-primary" /> 
                          {item.updatedAt?.seconds ? new Date(item.updatedAt.seconds * 1000).toLocaleDateString('en-GB') : "Recently Updated"}
                       </div>
                       <Button asChild className="bg-[#0F172A] hover:bg-primary text-white font-black uppercase text-[9px] md:text-[11px] tracking-[0.2em] h-12 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl shadow-xl transition-all active:scale-95">
                          <a href={item.link || "#"} target="_blank" rel="noopener noreferrer">
                             {item.type === 'mock' ? 'Attempt' : 'Open PDF'} <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full h-80 flex flex-col items-center justify-center text-slate-300 bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-inner">
                <Sparkles className="h-16 w-16 mb-6 opacity-10" />
                <p className="font-headline font-black text-2xl uppercase text-[#0F172A]">No Content Synced</p>
                <p className="text-[10px] font-bold opacity-50 mt-1 uppercase tracking-widest">Awaiting official data push to this category.</p>
              </div>
            )}
          </div>

          {/* 4. TELEGRAM HUB (GAGAN PRATAP STYLE) */}
          <div className="bg-primary rounded-[3rem] md:rounded-[4rem] p-10 md:p-16 text-white relative overflow-hidden shadow-4xl group">
             <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-white/10 blur-[120px] rounded-full" />
             <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                <div className="space-y-6 text-center md:text-left max-w-xl">
                   <div className="h-16 w-16 bg-white rounded-[2rem] flex items-center justify-center mx-auto md:mx-0 shadow-2xl">
                      <MessageCircle className="h-8 w-8 text-primary fill-current" />
                   </div>
                   <h2 className="text-3xl md:text-5xl font-headline font-black uppercase leading-tight">Join Official <br/> Telegram Hub</h2>
                   <p className="text-white/80 text-base md:text-xl font-medium">
                      Get daily PDFs, Exam updates, and Quiz links directly from Arsh Grewal Management.
                   </p>
                </div>
                <Button asChild className="h-20 px-12 md:px-16 bg-white text-[#0B1528] hover:bg-slate-100 font-black uppercase tracking-[0.2em] text-xs md:text-sm rounded-3xl shadow-4xl transition-all active:scale-95 shrink-0">
                   <a href="https://t.me/cracklixapp" target="_blank" rel="noopener noreferrer">
                      Join Community Node <ChevronRight className="ml-3 h-6 w-6" />
                   </a>
                </Button>
             </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
