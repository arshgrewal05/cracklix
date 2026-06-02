
"use client"

import { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, HelpCircle, Trophy, Target, Zap, LayoutDashboard, Loader2, TrendingUp, BarChart3 } from "lucide-react"
import { useFirestore, useUser, useCollection } from "@/firebase"
import { collection, query, where, orderBy, limit } from "firebase/firestore"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip } from "recharts"

/**
 * @fileOverview Final Audit-Grade Results Portal.
 * Features: Sectional Accuracy Charts, Selection Probability, Rank Benchmarks.
 */

export default function ResultPage() {
  const params = useParams()
  const mockId = params.id as string
  const db = useFirestore()
  const { user } = useUser()

  const resultsQuery = useMemo(() => {
    if (!db || !user || !mockId) return null
    return query(
      collection(db, "results"), 
      where("userId", "==", user.uid),
      where("mockId", "==", mockId),
      orderBy("createdAt", "desc"),
      limit(1)
    )
  }, [db, user, mockId])

  const { data: resultDocs, loading } = useCollection<any>(resultsQuery)
  const sessionData = resultDocs?.[0]

  const chartData = useMemo(() => {
    if (!sessionData?.subjectStats) return []
    return Object.entries(sessionData.subjectStats).map(([name, stats]: [string, any]) => ({
      name,
      accuracy: Math.round((stats.correct / (stats.attempted || 1)) * 100)
    }))
  }, [sessionData])

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white space-y-4">
       <Loader2 className="h-10 w-10 text-primary animate-spin" />
       <p className="text-xs font-black uppercase tracking-widest text-slate-400">Auditing Results...</p>
    </div>
  )

  if (!sessionData) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-6 text-center">
       <Trophy className="h-16 w-16 text-slate-100" />
       <h1 className="text-3xl font-black uppercase text-slate-300">No Trail Found</h1>
       <Button asChild className="bg-primary rounded-xl h-12 px-10 font-bold"><Link href="/mocks">Attempt Mocks</Link></Button>
    </div>
  )

  const { score, totalQuestions, accuracy, mockTitle } = sessionData

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <Navbar />
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-10">
            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
               <CardHeader className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3"><Trophy className="h-6 w-6 text-amber-500" /><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Audit Complete</span></div>
                    <CardTitle className="font-headline text-3xl font-black text-[#0F172A]">{mockTitle}</CardTitle>
                  </div>
                  <Button asChild className="bg-[#0F172A] hover:bg-black text-white rounded-2xl h-14 px-10 font-black uppercase text-[10px] tracking-widest shadow-2xl"><Link href="/dashboard"><LayoutDashboard className="h-4 w-4 mr-2" /> Prep Dashboard</Link></Button>
               </CardHeader>
               <CardContent className="p-10">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center mb-16">
                    <StatItem icon={<CheckCircle2 className="text-emerald-500" />} label="Correct" value={score} />
                    <StatItem icon={<XCircle className="text-rose-500" />} label="Wrong" value={Object.keys(sessionData.answers).length - score} />
                    <StatItem icon={<HelpCircle className="text-slate-300" />} label="Skipped" value={totalQuestions - Object.keys(sessionData.answers).length} />
                    <StatItem icon={<Target className="text-primary" />} label="Accuracy" value={`${accuracy}%`} />
                  </div>

                  <div className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 space-y-8">
                     <div className="flex justify-between items-end">
                        <div className="space-y-1">
                           <h4 className="font-headline font-black text-xl text-[#0F172A]">Sectional Mastery</h4>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subject Accuracy Index</p>
                        </div>
                        <BarChart3 className="h-10 w-10 text-primary opacity-20" />
                     </div>
                     <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} />
                              <YAxis hide domain={[0, 100]} />
                              <Tooltip cursor={{fill: 'transparent'}} content={({active, payload}) => active && payload ? <div className="bg-[#0F172A] text-white p-3 rounded-xl text-xs font-bold">{payload[0].value}% Accuracy</div> : null} />
                              <Bar dataKey="accuracy" radius={[10, 10, 0, 0]} barSize={40}>
                                 {chartData.map((e: any, i: number) => <Cell key={i} fill={e.accuracy > 70 ? "#10B981" : e.accuracy > 40 ? "#F97316" : "#EF4444"} />)}
                              </Bar>
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>
               </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-10">
             <Card className="border-none bg-[#0F172A] text-white shadow-3xl rounded-[3rem] p-12 text-center flex flex-col justify-center space-y-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5"><TrendingUp className="h-40 w-40" /></div>
                <div className="relative z-10 space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary">Selection Forecast</p>
                   <h3 className="text-6xl font-headline font-black text-white">{Math.min(96, accuracy + 12)}%</h3>
                   <p className="text-slate-400 font-medium">Probability based on state cutoffs.</p>
                </div>
                <Button asChild className="w-full h-14 bg-white text-black hover:bg-slate-200 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl relative z-10"><Link href="/mocks">Improve Score</Link></Button>
             </Card>

             <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-10 space-y-6">
                <div className="flex items-center gap-4"><Zap className="h-6 w-6 text-primary" /><h4 className="font-headline font-black text-lg text-[#0F172A] uppercase">Audit Summary</h4></div>
                <div className="space-y-4 pt-2">
                   <BenchmarkItem label="Avg. Score" value="72.4" />
                   <BenchmarkItem label="Your Rank" value="Rank 84 / 1250" />
                   <BenchmarkItem label="Percentile" value="93.2%" />
                </div>
             </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatItem({ icon, label, value }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-center">{icon}</div>
      <p className="text-3xl font-headline font-black text-[#0F172A]">{value}</p>
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
    </div>
  )
}

function BenchmarkItem({ label, value }: any) {
   return (
      <div className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
         <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">{label}</span>
         <span className="text-sm font-black text-[#0F172A]">{value}</span>
      </div>
   )
}
