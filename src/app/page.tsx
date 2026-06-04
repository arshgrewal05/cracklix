"use client"

import React, { useMemo, ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import PopularExams from "@/components/home/PopularExams";
import LatestMocks from "@/components/home/LatestMocks";
import Features from "@/components/home/Features";
import AppPreview from "@/components/home/AppPreview";
import Footer from "@/components/layout/Footer";
import { useCollection, useFirestore, useUser } from "@/firebase";
import { collection, query, limit, where } from "firebase/firestore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  ClipboardList,
  Users,
  ArrowRight,
  PlayCircle,
  Timer,
  BrainCircuit,
  ChevronRight,
  Bell,
  Layers,
  FileText,
  Newspaper
} from "lucide-react";
import Link from "next/link";

/**
 * @fileOverview Final Dynamic Homepage Module.
 * Updated: Modular Latest Section with Categories (Phase 165).
 */

export default function HomePage() {
  const db = useFirestore();
  const { user } = useUser();
  
  const noticeQuery = useMemo(() => (db ? query(collection(db, "notifications"), limit(10)) : null), [db]);
  const { data: allNotices } = useCollection<any>(noticeQuery);

  const notices = useMemo(() => {
    if (!allNotices) return []
    return [...allNotices].sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0
      const timeB = b.createdAt?.seconds || 0
      return timeB - timeA
    }).slice(0, 5)
  }, [allNotices])

  const sessionQuery = useMemo(() => {
    if (!db || !user) return null
    return query(collection(db, "test_sessions"), where("userId", "==", user.uid), where("status", "==", "IN_PROGRESS"))
  }, [db, user])
  
  const { data: activeSessions } = useCollection<any>(sessionQuery)
  
  const lastSession = useMemo(() => {
    if (!activeSessions || activeSessions.length === 0) return null
    return [...activeSessions].sort((a, b) => {
      const timeA = a.updatedAt?.seconds || 0
      const timeB = b.updatedAt?.seconds || 0
      return timeB - timeA
    })[0]
  }, [activeSessions])

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <Hero />

      {/* Resume Mock Node - High Priority Mobile */}
      {user && lastSession && (
         <div className="bg-slate-50 border-b border-slate-100 py-6">
            <div className="container mx-auto px-6 max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
               <div className="flex items-center gap-6">
                  <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center shadow-sm">
                     <PlayCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-left">
                     <p className="text-[9px] font-black uppercase text-orange-600 tracking-widest">Incomplete Audit</p>
                     <h2 className="text-xl font-headline font-black text-[#0F172A]">Resume {lastSession.mockId.split('-')[1] || 'Practice'} Series</h2>
                  </div>
               </div>
               <Button asChild className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-[10px] tracking-widest h-12 px-8 shadow-xl shadow-orange-900/20">
                  <Link href={`/mocks/${lastSession.mockId}/attempt`}>
                     Continue Mock <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
               </Button>
            </div>
         </div>
      )}

      {/* Trust Bar */}
      <section className="bg-[#08152D] py-8 lg:py-12 relative overflow-hidden">
         <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-center items-center">
               <TrustMetric icon={<BookOpen className="text-primary h-5 w-5 lg:h-8 lg:w-8" />} label="Verified MCQs" value="10k+" />
               <TrustMetric icon={<ClipboardList className="text-blue-400 h-5 w-5 lg:h-8 lg:w-8" />} label="Institutional Mocks" value="500+" />
               <TrustMetric icon={<Users className="text-emerald-400 h-5 w-5 lg:h-8 lg:w-8" />} label="Active Aspirants" value="15k+" />
               <TrustMetric icon={<ShieldCheck className="text-amber-400 h-5 w-5 lg:h-8 lg:w-8" />} label="2026 Patterns" value="Verified" />
            </div>
         </div>
      </section>

      {/* Modular Content Nodes (Phase 165) */}
      <LatestMocks />
      
      <section className="py-24 bg-[#F8FAFC]">
         <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16 space-y-3">
               <Badge className="bg-primary/10 text-primary border-none uppercase text-[10px] font-black px-6 py-2 rounded-full">Subject Mastery Hub</Badge>
               <h2 className="text-4xl lg:text-6xl font-headline font-black text-[#0F172A] uppercase">Modular <span className="text-primary">Practice</span></h2>
               <p className="text-slate-500 text-lg font-medium">Deep analysis across specific subject nodes.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <QuickCategory href="/mocks" icon={<Layers className="text-blue-500" />} label="Subject Tests" desc="Reasoning, Quant, GK" />
               <QuickCategory href="/mocks" icon={<Zap className="text-amber-500" />} label="Sectionals" desc="Topic-wise audits" />
               <QuickCategory href="/pyqs" icon={<FileText className="text-emerald-500" />} label="PYQ Archive" desc="Authentic Papers" />
               <QuickCategory href="/current-affairs" icon={<Newspaper className="text-rose-500" />} label="CA Quizzes" desc="Daily Analysis" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-32">
               <div className="lg:col-span-8">
                  <PopularExams />
               </div>

               <div className="lg:col-span-4 space-y-8">
                  <Card className="rounded-[3rem] border-none bg-[#0F172A] text-white p-12 overflow-hidden relative shadow-4xl group">
                     <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:scale-110 transition-transform"><Sparkles className="h-40 w-40" /></div>
                     <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-4">
                           <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl"><BrainCircuit className="h-7 w-7 text-white" /></div>
                           <div className="space-y-0.5">
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Aspirant Mastery</span>
                              <h4 className="text-xl font-headline font-black leading-tight uppercase text-left">Daily Fact</h4>
                           </div>
                        </div>
                        <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 shadow-inner">
                           <p className="text-slate-300 text-lg leading-relaxed font-medium italic text-left">"The name Punjab means 'Land of Five Rivers'. These are Sutlej, Beas, Ravi, Chenab, and Jhelum."</p>
                        </div>
                        <Button asChild className="w-full bg-white text-[#0F172A] hover:bg-slate-100 h-16 rounded-2xl font-black uppercase tracking-widest text-xs shadow-3xl">
                           <Link href="/dashboard">Attempt & Earn XP</Link>
                        </Button>
                     </div>
                  </Card>

                  <Card className="rounded-[3rem] border-none shadow-2xl bg-white p-12 overflow-hidden relative">
                     <div className="absolute top-0 right-0 p-8 opacity-5"><Bell className="h-24 w-24" /></div>
                     <div className="flex items-center justify-between mb-10 relative z-10">
                        <h3 className="font-headline font-black text-2xl flex items-center gap-4 text-[#0F172A]">
                           <Bell className="h-6 w-6 text-primary" /> Gazette
                        </h3>
                     </div>
                     <div className="space-y-8 relative z-10">
                        {notices && notices.length > 0 ? notices.map((n: any) => (
                           <Link key={n.id} href="/notifications" className="flex gap-6 group cursor-pointer border-b border-slate-50 pb-8 last:border-0 last:pb-0">
                              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                                n.category === 'Result' ? 'bg-emerald-50 text-emerald-500' : 
                                'bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary shadow-sm'
                              }`}>
                                 <Zap className="h-7 w-7" />
                              </div>
                              <div className="space-y-1.5 flex-1 min-w-0 text-left">
                                 <p className="text-base font-bold leading-snug group-hover:text-primary transition-colors truncate text-[#0F172A]">{n.title}</p>
                                 <div className="flex items-center gap-4">
                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{n.time}</span>
                                    <Badge variant="outline" className="border-slate-100 text-[9px] font-black px-2.5 py-0.5 uppercase text-slate-500 rounded-lg">{n.board}</Badge>
                                 </div>
                              </div>
                           </Link>
                        )) : (
                          <div className="py-10 text-center space-y-4 opacity-30 italic">
                             <Bell className="h-10 w-10 mx-auto" />
                             <p className="text-xs uppercase font-black tracking-widest text-[#0F172A]">Syncing feeds...</p>
                          </div>
                        )}
                        <Button asChild variant="ghost" className="w-full pt-8 text-[11px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary/5 rounded-2xl border-2 border-dashed border-primary/10 h-20">
                           <Link href="/notifications">Full Feed <ChevronRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                     </div>
                  </Card>
               </div>
            </div>
         </div>
      </section>

      <Features />
      <AppPreview />
      <Footer />
    </main>
  );
}

function TrustMetric({ icon, label, value }: { icon: ReactNode, label: string, value: string | number }) {
   return (
      <div className="space-y-2 group">
         <div className="flex justify-center transition-transform group-hover:scale-110">{icon}</div>
         <p className="text-2xl lg:text-4xl font-headline font-black text-white tracking-tight leading-none">{value}</p>
         <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none">{label}</p>
      </div>
   )
}

function QuickCategory({ icon, label, desc, href }: any) {
   return (
      <Link href={href}>
         <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex flex-col items-center gap-6 group hover:translate-y-[-8px] transition-all duration-500 text-center h-full">
            <div className="h-16 w-16 rounded-[2rem] bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors shadow-inner">
               <div className="h-8 w-8">{icon}</div>
            </div>
            <div className="space-y-2">
               <h4 className="font-headline font-black text-xl text-[#0F172A] uppercase">{label}</h4>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{desc}</p>
            </div>
         </div>
      </Link>
   )
}
