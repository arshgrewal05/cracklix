
"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Input } from "@/components/ui/input"
import { Search as SearchIcon, Zap, BookOpen, Newspaper, Bell, ChevronRight, Sparkles, ShieldCheck, FileText, LayoutGrid, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useCollection, useFirestore } from "@/firebase"
import { collection } from "firebase/firestore"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Elite Global Search Hub.
 * Simplified Language: Replaced 'Node Not Found' with 'No Hub Found'.
 */

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  )
}

function SearchContent() {
  const db = useFirestore()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState("")

  useEffect(() => {
    const q = searchParams.get("q")
    if (q) setQuery(q)
  }, [searchParams])

  const { data: mocks, loading: mLoading } = useCollection<any>(useMemo(() => (db ? collection(db, "mocks") : null), [db]))
  const { data: exams, loading: eLoading } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))
  const { data: notes, loading: nLoading } = useCollection<any>(useMemo(() => (db ? collection(db, "notes") : null), [db]))

  const isLoading = mLoading || eLoading || nLoading;

  const results = useMemo(() => {
    if (query.trim().length < 2) return []
    const term = query.toLowerCase().trim()
    
    const examMatches = (exams || []).filter(e => 
      e.name?.toLowerCase().includes(term) || 
      e.boardId?.toLowerCase().includes(term)
    ).map(e => ({ title: e.name, type: "Exam Hub", href: `/exams/${e.id}`, icon: <ShieldCheck className="text-primary" /> }))

    const mockMatches = (mocks || []).filter(m => 
      m.title?.toLowerCase().includes(term) || 
      m.boardId?.toLowerCase().includes(term)
    ).map(m => ({ title: m.title, type: "Practice Test", href: `/mocks/${m.id}`, icon: <Zap className="text-orange-500" /> }))

    const notesMatches = (notes || []).filter(n => 
       n.title?.toLowerCase().includes(term) || 
       n.subjectId?.toLowerCase().includes(term)
    ).map(n => ({ title: n.title, type: "Study PDF", href: `/notes`, icon: <FileText className="text-blue-500" /> }))

    return [...examMatches, ...mockMatches, ...notesMatches]
  }, [query, exams, mocks, notes])

  return (
    <div className="min-h-screen bg-slate-50/30 font-body">
      <Navbar />
      <main className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-5xl text-left">
        <div className="space-y-12">
           
           <div className="text-center space-y-8">
              <div className="space-y-3">
                 <h1 className="text-4xl md:text-7xl font-headline font-black text-[#0F172A] uppercase tracking-tighter leading-none">Global <span className="text-primary">Search</span></h1>
                 <p className="text-slate-400 font-bold uppercase text-[10px] md:text-xs tracking-[0.4em]">Find your preparation hub instantly</p>
              </div>
              
              <div className="relative max-w-3xl mx-auto group">
                 <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-400 rounded-[2rem] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
                 <div className="relative">
                    <SearchIcon className={cn("absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 transition-colors", isLoading ? "text-primary animate-pulse" : "text-slate-400")} />
                    <Input 
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                      autoFocus
                      className="h-16 md:h-24 pl-16 pr-8 text-lg md:text-3xl rounded-[2rem] border-none shadow-3xl bg-white focus-visible:ring-primary text-[#0F172A] font-bold" 
                      placeholder="Search exams, tests, or notes..." 
                    />
                    {isLoading && <Loader2 className="absolute right-8 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-100 animate-spin" />}
                 </div>
              </div>
           </div>

           {query.length >= 2 ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">RESULTS: {results.length}</h3>
                    <Badge className="bg-primary/5 text-primary border-none text-[10px] font-black px-4 py-1 rounded-lg uppercase">Live Index</Badge>
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                    {results.length > 0 ? results.map((res, i) => (
                      <SearchResultItem key={i} icon={res.icon} title={res.title} category={res.type} href={res.href} />
                    )) : !isLoading && (
                      <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner">
                        <div className="space-y-4 opacity-20 flex flex-col items-center">
                           <SearchIcon className="h-12 w-12" />
                           <p className="font-headline font-black uppercase text-xl">No Results Found</p>
                           <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Try searching "Patwari", "Police" or "English"</p>
                        </div>
                      </div>
                    )}
                 </div>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                 <Card className="border-none shadow-4xl rounded-[3rem] p-10 bg-[#0B1528] text-white overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform"><LayoutGrid className="h-40 w-40" /></div>
                    <div className="relative z-10 space-y-8">
                       <h4 className="font-headline font-black text-xs text-primary uppercase tracking-[0.3em]">Quick Search</h4>
                       <ul className="space-y-5">
                          <TrendingItem text="PSSSB Patwari Hub" onSelect={setQuery} />
                          <TrendingItem text="Punjab Police SI Prep" onSelect={setQuery} />
                          <TrendingItem text="Mental Ability Tests" onSelect={setQuery} />
                          <TrendingItem text="Official Previous Papers" onSelect={setQuery} />
                       </ul>
                    </div>
                 </Card>
                 <Card className="border-none shadow-4xl rounded-[3rem] p-10 bg-white group overflow-hidden border border-slate-100">
                    <div className="relative z-10 space-y-8">
                       <h4 className="font-headline font-black text-xs text-slate-400 uppercase tracking-[0.3em]">Preparation Hubs</h4>
                       <div className="flex flex-wrap gap-3">
                          <SearchBadge label="Army Hub" />
                          <SearchBadge label="Teaching" />
                          <SearchBadge label="Elite Pass" />
                          <SearchBadge label="Leaderboard" />
                       </div>
                    </div>
                 </Card>
              </div>
           )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function SearchResultItem({ icon, title, category, href }: any) {
   return (
      <Link href={href} className="block active:scale-[0.98] transition-all">
         <div className="bg-white p-5 md:p-8 rounded-[2.5rem] shadow-sm hover:shadow-4xl flex items-center justify-between group border border-slate-100 transition-all duration-300">
            <div className="flex items-center gap-6 min-w-0 flex-1">
               <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/5 transition-all shrink-0 shadow-inner">
                  {icon}
               </div>
               <div className="text-left min-w-0 flex-1 space-y-1.5">
                  <p className="font-black text-[#0F172A] group-hover:text-primary transition-colors text-base md:text-2xl uppercase leading-tight line-clamp-2 truncate">{title}</p>
                  <div className="flex items-center gap-3">
                     <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{category}</span>
                     <div className="h-1 w-1 rounded-full bg-slate-200" />
                     <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary">Live</span>
                  </div>
               </div>
            </div>
            <ChevronRight className="h-6 w-6 text-slate-200 group-hover:text-primary transition-all group-hover:translate-x-2 shrink-0 ml-4" />
         </div>
      </Link>
   )
}

function TrendingItem({ text, onSelect }: { text: string, onSelect: (v: string) => void }) {
   return (
      <li 
         onClick={() => onSelect(text)}
         className="flex items-center gap-4 text-slate-400 text-sm font-bold hover:text-white cursor-pointer transition-colors group active:scale-95"
      >
         <Sparkles className="h-4 w-4 text-primary group-hover:animate-pulse" /> 
         <span className="uppercase tracking-tight truncate">{text}</span>
      </li>
   )
}

function SearchBadge({ label }: { label: string }) {
   return (
      <Badge variant="outline" className="rounded-xl px-5 py-2.5 border-slate-200 bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all cursor-pointer active:scale-95 shadow-sm">
         {label}
      </Badge>
   )
}
