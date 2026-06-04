
"use client"

import { useMemo } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useUser, useCollection, useFirestore } from "@/firebase"
import { collection, query, where } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Trophy, 
  Target, 
  ClipboardList, 
  Zap, 
  Clock, 
  ChevronRight, 
  Star,
  Bookmark,
  TrendingUp,
  BarChart3,
  BrainCircuit,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  PlayCircle,
  Timer,
  CheckCircle2,
  Medal,
  Award,
  CreditCard,
  History,
  FileText
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Final Advanced Selection Dashboard (Phase 156).
 * Redesigned for high information density and "Testbook" mobile aesthetics.
 */

export default function StudentDashboard() {
  const { user, profile, loading } = useUser()
  const db = useFirestore()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [user, loading, router])

  const resultsQuery = useMemo(() => {
    if (!db || !user) return null
    return query(collection(db, "results"), where("userId", "==", user.uid))
  }, [db, user])

  const sessionQuery = useMemo(() => {
    if (!db || !user) return null
    // Removed orderBy to avoid index errors, handling sorting client-side
    return query(collection(db, "test_sessions"), where("userId", "==", user.uid), where("status", "==", "IN_PROGRESS"))
  }, [db, user])

  const { data: allResults, loading: resultsLoading } = useCollection<any>(resultsQuery)
  const { data: activeSessions } = useCollection<any>(sessionQuery)
  
  const results = useMemo(() => {
    if (!allResults) return []
    return [...allResults].sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0
      const timeB = b.createdAt?.seconds || 0
      return timeB - timeA
    }).slice(0, 20)
  }, [allResults])

  const lastSession = useMemo(() => {
    if (!activeSessions || activeSessions.length === 0) return null
    return [...activeSessions].sort((a, b) => {
      const timeA = a.updatedAt?.seconds || 0
      const timeB = b.updatedAt?.seconds || 0
      return timeB - timeA
    })[0]
  }, [activeSessions])

  const analytics = useMemo(() => {
    if (!results || results.length === 0) return { 
      total: 0, 
      avgAccuracy: 0, 
      rank: "N/A", 
      selectionProb: 45, 
      weakSubject: "N/A",
      readinessScore: 35,
      streak: 4
    }
    
    const total = results.length
    const avgAcc = Math.round(results.reduce((acc: number, r: any) => acc + (r.accuracy || 0), 0) / total)
    const readiness = Math.min(100, Math.round(avgAcc * 1.1))

    return { 
      total, 
      avgAccuracy: avgAcc, 
      rank: avgAcc > 85 ? "Top 2%" : avgAcc > 70 ? "Top 12%" : "Top 45%", 
      selectionProb: Math.min(96, Math.max(30, avgAcc + 10)),
      readinessScore: readiness,
      streak: 4 
    }
  }, [results])

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Sparkles className="h-10 w-10 text-primary animate-pulse" /></div>

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 md:pb-0">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        {/* Compact Profile Header */}
        <section className="flex items-center justify-between bg-white p-6 rounded-[2rem] shadow-xl border border-slate-100">
          <div className="flex items-center gap-5">
            <Avatar className="h-16 w-16 border-4 border-slate-50 rounded-2xl shadow-sm">
              <AvatarImage src={user?.photoURL || ""} />
              <AvatarFallback className="bg-primary text-white font-black text-xl">{profile?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <h2 className="text-xl font-headline font-black text-[#0F172A] leading-tight">{profile?.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                 <Badge className={profile?.status === 'Free' ? "bg-slate-100 text-slate-500 border-none text-[8px] font-black uppercase" : "bg-amber-100 text-amber-600 border-none text-[8px] font-black uppercase"}>
                   {profile?.status || 'Free'} Plan
                 </Badge>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profile?.targetExam || 'Punjab Exams'}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 bg-slate-50 border border-slate-100" asChild>
            <Link href="/profile"><ChevronRight className="h-5 w-5" /></Link>
          </Button>
        </section>

        {/* Continue Mock Widget - High Priority */}
        {lastSession && (
          <section>
            <div className="bg-[#0F172A] text-white p-6 rounded-[2rem] shadow-2xl relative overflow-hidden flex items-center justify-between group cursor-pointer" onClick={() => router.push(`/mocks/${lastSession.mockId}/attempt`)}>
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform"><PlayCircle className="h-20 w-20" /></div>
               <div className="space-y-1 relative z-10 text-left">
                  <p className="text-[9px] font-black uppercase tracking-widest text-primary">Resume Prep</p>
                  <h3 className="text-lg font-headline font-black uppercase">{lastSession.mockId.split('-')[1] || 'Practice'} Series</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{Math.floor(lastSession.remainingTime / 60)}m Left • Q{lastSession.currentIdx + 1}</p>
               </div>
               <Button className="bg-primary hover:bg-primary/90 rounded-xl h-10 px-4 font-black uppercase text-[10px] shadow-xl relative z-10">Resume</Button>
            </div>
          </section>
        )}

        {/* Key Statistics Grid */}
        <section className="grid grid-cols-2 gap-4">
          <StatCard label="Attempted" value={analytics.total} sub="Total Tests" icon={<ClipboardList className="text-blue-500" />} />
          <StatCard label="Avg Score" value={`${analytics.avgAccuracy}%`} sub="Performance" icon={<Target className="text-primary" />} />
          <StatCard label="Accuracy" value={`${analytics.avgAccuracy}%`} sub="Precision" icon={<Zap className="text-emerald-500" />} />
          <StatCard label="State Rank" value={analytics.rank} sub="Benchmark" icon={<Trophy className="text-amber-500" />} />
        </section>

        {/* Quick Actions Grid */}
        <section className="space-y-4">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 text-left ml-2">Quick Access</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ActionNode icon={<Zap />} label="My Mocks" href="/mocks" color="bg-primary" />
              <ActionNode icon={<Bookmark />} label="Saved MCQs" href="/revision" color="bg-blue-600" />
              <ActionNode icon={<History />} label="Results" href="/dashboard" color="bg-emerald-600" />
              <ActionNode icon={<FileText />} label="Notes" href="/notes" color="bg-orange-600" />
           </div>
        </section>

        {/* Performance Insights */}
        <section>
          <Card className="border-none bg-white rounded-[2rem] shadow-xl overflow-hidden text-left">
             <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <BrainCircuit className="h-5 w-5 text-primary" />
                      <h4 className="font-headline font-black text-sm uppercase tracking-tight">Readiness Audit</h4>
                   </div>
                   <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-black uppercase">Active</Badge>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selection Probability</p>
                      <p className="text-2xl font-headline font-black text-[#0F172A]">{analytics.selectionProb}%</p>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary shadow-xl shadow-primary/20 transition-all duration-1000" style={{ width: `${analytics.selectionProb}%` }} />
                   </div>
                   <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic">
                      "Your accuracy in Punjab GK is high, but Numerical Ability needs an additional audit cycle."
                   </p>
                </div>
             </CardContent>
          </Card>
        </section>

        <Footer />
      </main>
    </div>
  )
}

function StatCard({ label, value, sub, icon }: any) {
  return (
    <Card className="border-none shadow-lg bg-white p-5 rounded-[1.5rem] group hover:translate-y-[-2px] transition-all text-left">
      <div className="flex items-center justify-between mb-3">
        <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center shadow-inner">{icon}</div>
        <span className="text-[8px] font-black uppercase text-slate-300 tracking-widest">{label}</span>
      </div>
      <p className="text-xl font-headline font-black text-[#0F172A]">{value}</p>
      <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">{sub}</p>
    </Card>
  )
}

function ActionNode({ icon, label, href, color }: any) {
   return (
      <Link href={href} className="block">
         <div className="bg-white p-4 rounded-[1.5rem] shadow-md border border-slate-50 flex flex-col items-center gap-3 active:scale-95 transition-all">
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg", color)}>
               {icon}
            </div>
            <span className="text-[9px] font-black uppercase tracking-tight text-[#0F172A]">{label}</span>
         </div>
      </Link>
   )
}
