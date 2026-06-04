"use client"

import { useMemo, useState } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, Trophy, ArrowRight, Filter, ShieldCheck, Zap, Layers, Sparkles, AlertCircle, FileText, Newspaper, Target } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * @fileOverview Final Mock Hub (Modular Overhaul).
 * Categorized sections for Full, Subject, Sectional, Chapter, PYQ, and CA.
 */

export default function MocksPage() {
  const db = useFirestore()
  const [activeTab, setActiveTab] = useState("FULL")
  
  const mocksQuery = useMemo(() => {
    if (!db) return null
    return query(collection(db, "mocks"))
  }, [db])

  const boardsQuery = useMemo(() => {
    if (!db) return null
    return query(collection(db, "boards"))
  }, [db])

  const { data: allMocks, loading: mocksLoading } = useCollection<any>(mocksQuery)
  const { data: boards } = useCollection<any>(boardsQuery)

  const mocks = useMemo(() => {
    if (!allMocks) return []
    return [...allMocks]
      .filter(m => m.published === true)
      .sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0
        const dateB = b.createdAt?.seconds || 0
        return dateB - dateA
      })
  }, [allMocks])

  const filteredMocks = useMemo(() => {
    return mocks.filter(m => m.mockType === activeTab)
  }, [mocks, activeTab])

  const categories = [
    { id: "FULL", label: "Full Mocks", icon: <Zap /> },
    { id: "SUBJECT", label: "Subject Tests", icon: <Layers /> },
    { id: "SECTIONAL", label: "Sectionals", icon: <Target /> },
    { id: "CHAPTER", label: "Chapter Wise", icon: <ShieldCheck /> },
    { id: "PYQ", label: "PYQ Papers", icon: <FileText /> },
    { id: "CA_QUIZ", label: "CA Quizzes", icon: <Newspaper /> },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30 font-body">
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-3">
               <ShieldCheck className="h-5 w-5 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Institutional Practice Hub</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-headline font-black text-[#0F172A] uppercase tracking-tight">Mock <span className="text-primary">Series</span></h1>
            <p className="text-slate-500 font-medium text-lg">Modular assessments audited for the 2026 recruitment cycle.</p>
          </div>
          <div className="flex gap-4">
             <Button variant="outline" className="rounded-2xl h-14 px-8 border-slate-200 bg-white font-bold gap-3 shadow-sm">
                <Filter className="h-5 w-5 text-slate-400" /> Filter Authority
             </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
           <div className="bg-white p-2 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center overflow-x-auto custom-scrollbar no-scrollbar">
              <TabsList className="bg-transparent border-none p-0 flex gap-2 h-auto">
                 {categories.map(cat => (
                    <TabsTrigger 
                       key={cat.id} 
                       value={cat.id} 
                       className="rounded-2xl px-8 h-14 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-[#0F172A] data-[state=active]:text-white flex items-center gap-3 shrink-0"
                    >
                       <span className="h-4 w-4 shrink-0">{cat.icon}</span>
                       {cat.label}
                       <Badge className="ml-2 bg-primary/10 text-primary border-none text-[8px]">{mocks.filter(m => m.mockType === cat.id).length}</Badge>
                    </TabsTrigger>
                 ))}
              </TabsList>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-8">
             {mocksLoading ? (
               Array.from({ length: 6 }).map((_, i) => (
                 <Skeleton key={i} className="h-[400px] w-full rounded-[3.5rem]" />
               ))
             ) : filteredMocks.length > 0 ? (
               filteredMocks.map((mock: any) => {
                 const board = boards?.find(b => b.id === mock.boardId)
                 return (
                   <Card key={mock.id} className="border-none shadow-2xl shadow-slate-200/40 hover:shadow-4xl hover:translate-y-[-10px] transition-all duration-500 group rounded-[3.5rem] overflow-hidden bg-white flex flex-col text-center">
                     <CardContent className="p-12 space-y-8 flex-1 flex flex-col items-center">
                       <div className="h-24 w-24 rounded-[2.5rem] bg-[#0F172A] flex items-center justify-center relative overflow-hidden shadow-2xl group-hover:scale-110 transition-transform duration-500">
                         {board?.iconUrl ? (
                            <Image src={board.iconUrl} fill alt={board.abbreviation} className="object-contain p-6" />
                         ) : (
                            <Zap className="h-10 w-10 text-primary fill-current" />
                         )}
                       </div>
                       
                       <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">{board?.abbreviation || 'PSSSB'} {activeTab}</p>
                          <h3 className="font-headline text-2xl font-black text-[#0F172A] leading-tight px-4 line-clamp-2 uppercase">
                           {mock.title}
                          </h3>
                       </div>

                       <div className="flex items-center justify-center gap-10 pt-4">
                          <div className="flex items-center gap-2.5 text-slate-400">
                             <BookOpen className="h-4 w-4" />
                             <span className="text-[11px] font-black uppercase tracking-widest">{mock.totalQuestions} Qs</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-slate-400">
                             <Clock className="h-4 w-4" />
                             <span className="text-[11px] font-black uppercase tracking-widest">{mock.duration}m</span>
                          </div>
                       </div>

                       <div className="w-full pt-6">
                         <Button asChild className="w-full h-16 bg-[#0B1528] hover:bg-black text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-[1.5rem] shadow-3xl shadow-slate-300 transition-all active:scale-95">
                           <Link href={`/mocks/${mock.id}`}>
                             Start Series <ArrowRight className="h-4 w-4 ml-2" />
                           </Link>
                         </Button>
                       </div>
                     </CardContent>
                   </Card>
                 )
               })
             ) : (
               <div className="col-span-full py-40 text-center space-y-6 bg-white/50 rounded-[4rem] border-2 border-dashed border-slate-200">
                  <ShieldCheck className="h-20 w-20 text-slate-200 mx-auto" />
                  <div className="space-y-1 text-center">
                     <p className="font-headline font-black text-2xl text-slate-300 uppercase">Category Node Empty</p>
                     <p className="text-slate-400 font-medium">No published series found for {activeTab} yet.</p>
                  </div>
               </div>
             )}
           </div>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
