
"use client"

import { useMemo, useState } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, Filter, ShieldCheck, Zap, Layers, FileText, Newspaper, Target, ArrowRight, Award } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * @fileOverview Refined Institutional Mock Hub (Testbook Style).
 * Features: High-fidelity exam badges, absolute black typography, and modular metadata.
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
    { id: "FULL", label: "Full Mocks", icon: <Zap className="h-3 w-3" /> },
    { id: "SUBJECT", label: "Subject", icon: <Layers className="h-3 w-3" /> },
    { id: "SECTIONAL", label: "Section", icon: <Target className="h-3 w-3" /> },
    { id: "PYQ", label: "PYQs", icon: <FileText className="h-3 w-3" /> },
    { id: "CA_QUIZ", label: "Current Affairs", icon: <Newspaper className="h-3 w-3" /> },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 font-body">
      <Navbar />
      <main className="container mx-auto px-4 py-6 md:py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-12">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2">
               <ShieldCheck className="h-4 w-4 text-primary" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Institutional Exam Hub</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-headline font-black text-[#000000] uppercase tracking-tight leading-none">Test <span className="text-primary">Series</span></h1>
            <p className="text-slate-500 font-medium text-xs md:text-sm">High-fidelity mocks optimized for 2026 patterns.</p>
          </div>
          <Button variant="outline" className="rounded-xl h-10 px-5 border-slate-200 bg-white font-black uppercase text-[9px] tracking-widest gap-2 shadow-sm">
             <Filter className="h-3.5 w-3.5 text-slate-400" /> Filter Authority
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-10">
           <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex items-center overflow-x-auto no-scrollbar">
              <TabsList className="bg-transparent border-none p-0 flex gap-1 h-auto">
                 {categories.map(cat => (
                    <TabsTrigger 
                       key={cat.id} 
                       value={cat.id} 
                       className="rounded-xl px-4 md:px-8 h-10 md:h-12 font-black uppercase text-[9px] md:text-[10px] tracking-widest data-[state=active]:bg-[#0F172A] data-[state=active]:text-white flex items-center gap-2 shrink-0 transition-all"
                    >
                       {cat.icon}
                       {cat.label}
                       <span className="ml-1 text-[8px] opacity-40">({mocks.filter(m => m.mockType === cat.id).length})</span>
                    </TabsTrigger>
                 ))}
              </TabsList>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {mocksLoading ? (
               Array.from({ length: 6 }).map((_, i) => (
                 <Skeleton key={i} className="h-64 w-full rounded-[2rem]" />
               ))
             ) : filteredMocks.length > 0 ? (
               filteredMocks.map((mock: any) => {
                 const board = boards?.find(b => b.id === mock.boardId)
                 return (
                   <Card key={mock.id} className="border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden bg-white flex flex-col group border border-slate-50">
                     <CardContent className="p-0 flex flex-col h-full">
                        <div className="p-8 pb-4 space-y-6">
                           <div className="flex justify-between items-start">
                              <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-500">
                                 {board?.iconUrl ? (
                                     <Image src={board.iconUrl} fill alt={board.abbreviation} className="object-contain p-4" />
                                 ) : (
                                     <Zap className="h-8 w-8 text-primary fill-current" />
                                 )}
                              </div>
                              <div className="text-right space-y-1">
                                 <Badge className="bg-orange-50 text-primary border-none text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                                    {board?.abbreviation || 'PSSSB'} {activeTab}
                                 </Badge>
                                 <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Official Pattern</p>
                              </div>
                           </div>

                           <div className="space-y-3">
                              <h3 className="font-headline text-lg md:text-2xl font-black text-[#000000] leading-tight uppercase group-hover:text-primary transition-colors">
                               {mock.title}
                              </h3>
                              <div className="flex items-center gap-4 flex-wrap">
                                 <div className="flex items-center gap-1.5 text-slate-400">
                                    <BookOpen className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{mock.totalQuestions} Qs</span>
                                 </div>
                                 <div className="h-1 w-1 rounded-full bg-slate-200" />
                                 <div className="flex items-center gap-1.5 text-slate-400">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{mock.duration} Mins</span>
                                 </div>
                                 <div className="h-1 w-1 rounded-full bg-slate-200" />
                                 <div className="flex items-center gap-1.5 text-slate-400">
                                    <Award className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{mock.totalQuestions * 1} Marks</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="mt-auto p-6 pt-0">
                           <Button asChild className="w-full h-12 md:h-14 bg-[#0B1528] hover:bg-primary text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl transition-all active:scale-95 group">
                              <Link href={`/mocks/${mock.id}`} className="flex items-center justify-center gap-3">
                                 Start Test <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                              </Link>
                           </Button>
                        </div>
                     </CardContent>
                   </Card>
                 )
               })
             ) : (
               <div className="col-span-full py-40 text-center space-y-6 bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                  <ShieldCheck className="h-16 w-16 text-slate-100 mx-auto" />
                  <div className="space-y-1">
                     <p className="font-headline font-black text-xl text-slate-300 uppercase tracking-widest">No Series Structured</p>
                     <p className="text-sm font-bold text-slate-200 uppercase tracking-widest">Select a different category above.</p>
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
