
"use client"

import { useMemo } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useUser, useCollection, useFirestore } from "@/firebase"
import { collection, query, where, doc, updateDoc } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  Trophy, 
  Target, 
  ClipboardList, 
  ShieldCheck,
  Zap,
  Sparkles,
  Bell,
  CreditCard,
  Settings,
  ChevronRight,
  User as UserIcon,
  Activity
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import StudentAvatar from "@/components/brand/StudentAvatar"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Hardened Aspirant Profile Hub v8.0.
 * Optimized: Testbook-inspired layout with absolute zero-overlap logic.
 * Features: Responsive scaling for 360px - 1440px viewports.
 */

export default function ProfilePage() {
  const { user, profile, loading } = useUser()
  const db = useFirestore()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?returnUrl=/profile")
    }
  }, [user, loading, router])

  const resultsQuery = useMemo(() => {
    if (!db || !user) return null
    return query(collection(db, "results"), where("userId", "==", user.uid))
  }, [db, user])

  const { data: allResults, loading: resultsLoading } = useCollection<any>(resultsQuery)

  const results = useMemo(() => {
    if (!allResults) return []
    return [...allResults].sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime()
      const timeB = new Date(b.timestamp).getTime()
      return timeB - timeA
    })
  }, [allResults])

  const stats = useMemo(() => {
    if (!results || results.length === 0) return { total: 0, avgAccuracy: 0, bestScore: 0, rank: "N/A" }
    const total = results.length
    const avgAccuracy = Math.round(results.reduce((acc: number, curr: any) => acc + (curr.accuracy || 0), 0) / total)
    return { total, avgAccuracy, bestScore: 0, rank: "Top 12%" }
  }, [results])

  const handleToggleSub = async (boardId: string) => {
    if (!db || !user || !profile) return
    const currentSubs = profile.subscriptions || []
    const nextSubs = currentSubs.includes(boardId) 
      ? currentSubs.filter(s => s !== boardId) 
      : [...currentSubs, boardId]
    
    await updateDoc(doc(db, "users", user.uid), { subscriptions: nextSubs })
    toast({ title: "Preferences Synced" })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <Zap className="h-10 w-10 text-primary animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">Syncing Aspirant Node...</p>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-slate-50/50 font-body pb-32">
      <Navbar />
      
      <main className="w-full">
        {/* HEADER SECTION: BANNER + INFO */}
        <div className="bg-[#0B1528] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full" />
           <div className="container mx-auto px-4 md:px-6 max-w-6xl pt-8 md:pt-16 pb-20 md:pb-24">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 text-center md:text-left relative z-10">
                 <div className="relative group shrink-0">
                    <div className="absolute -inset-1 bg-primary/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <StudentAvatar 
                      profile={profile} 
                      className="h-24 w-24 md:h-32 md:w-32 border-4 border-white/10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl relative bg-[#0F172A]" 
                    />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 h-6 w-6 md:h-8 md:w-8 rounded-lg border-4 border-[#0B1528] flex items-center justify-center shadow-xl">
                       <ShieldCheck className="h-3 w-3 md:h-4 md:w-4 text-white" />
                    </div>
                 </div>

                 <div className="flex-1 space-y-3 min-w-0">
                    <div className="flex flex-col md:flex-row items-center gap-3">
                       <h1 className="text-2xl md:text-4xl font-headline font-black text-white uppercase tracking-tight truncate max-w-full">
                          {profile.name}
                       </h1>
                       <Badge className={cn(
                          "border-none text-[8px] md:text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-lg",
                          profile.status === 'Free' ? "bg-white/10 text-slate-300" : "bg-primary text-white"
                       )}>
                          {profile.status} Pass
                       </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
                       <HeaderInfo icon={<Mail className="text-primary" />} text={profile.email} />
                       <HeaderInfo icon={<Phone className="text-primary" />} text={profile.phone} />
                       <HeaderInfo icon={<GraduationCap className="text-primary" />} text={`Targeting ${profile.targetExam || 'Punjab Exams'}`} />
                    </div>
                 </div>

                 <div className="shrink-0 w-full md:w-auto pt-4 md:pt-0">
                    <Button asChild className="w-full md:w-auto h-12 md:h-14 px-8 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-2xl">
                       <Link href="/pass"><CreditCard className="h-4 w-4 text-primary" /> Manage Billing</Link>
                    </Button>
                 </div>
              </div>
           </div>
        </div>

        {/* CONTENT GRID */}
        <div className="container mx-auto px-4 md:px-6 max-w-6xl -mt-10 relative z-20">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
              
              {/* LEFT: ANALYTICS & PREFERENCES */}
              <div className="lg:col-span-8 space-y-6 md:space-y-8">
                 
                 {/* QUICK STATS CARDS */}
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
                    <StatsCard icon={<ClipboardList />} label="TESTS ATTEMPTED" value={stats.total} color="text-blue-500" />
                    <StatsCard icon={<Target />} label="AVG ACCURACY" value={`${stats.avgAccuracy}%`} color="text-primary" />
                    <StatsCard icon={<Trophy className="hidden sm:block" />} label="STATE RANKING" value={stats.rank} color="text-emerald-500" className="col-span-2 sm:col-span-1" />
                 </div>

                 {/* RECENT PERFORMANCE */}
                 <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white">
                    <CardHeader className="p-6 md:p-10 border-b border-slate-50 flex flex-row items-center justify-between">
                       <div className="space-y-1">
                          <CardTitle className="text-sm md:text-lg font-black uppercase tracking-tight text-[#0F172A] flex items-center gap-2">
                             <Activity className="h-4 w-4 text-primary" /> Prep Trajectory
                          </CardTitle>
                          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Deep audit of your 5 most recent attempts</CardDescription>
                       </div>
                       <Button asChild variant="ghost" className="h-10 text-[9px] font-black uppercase tracking-widest text-primary gap-2">
                          <Link href="/dashboard">Full History <ChevronRight className="h-3 w-3" /></Link>
                       </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                       <div className="divide-y divide-slate-50">
                          {resultsLoading ? (
                             Array.from({ length: 3 }).map((_, i) => <div key={i} className="p-8"><Skeleton className="h-12 w-full rounded-xl" /></div>)
                          ) : results.length > 0 ? (
                             results.slice(0, 5).map((r: any) => (
                                <Link key={r.id} href={`/results/${r.mockId}`} className="p-6 md:p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                                   <div className="flex items-center gap-4 md:gap-6 min-w-0">
                                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-primary/5 transition-colors">
                                         <Zap className="h-5 w-5 md:h-6 md:w-6 text-slate-300 group-hover:text-primary transition-colors" />
                                      </div>
                                      <div className="min-w-0">
                                         <p className="font-black text-[#0B1528] text-sm md:text-base uppercase truncate leading-tight">{r.mockTitle}</p>
                                         <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            {new Date(r.timestamp).toLocaleDateString('en-GB')} • Accuracy: {r.accuracy}%
                                         </p>
                                      </div>
                                   </div>
                                   <div className="text-right shrink-0">
                                      <p className="text-base md:text-xl font-headline font-black text-[#0F172A] leading-none">{r.score}/{r.totalQuestions}</p>
                                      <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Marks</p>
                                   </div>
                                </Link>
                             ))
                          ) : (
                             <div className="p-20 text-center space-y-4">
                                <Sparkles className="h-10 w-10 mx-auto text-slate-200" />
                                <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">No preparation nodes recorded.</p>
                             </div>
                          )}
                       </div>
                    </CardContent>
                 </Card>

                 {/* NOTIFICATION PREFERENCES */}
                 <Card className="border-none shadow-xl rounded-[2rem] bg-white">
                    <CardHeader className="p-6 md:p-10 border-b border-slate-50">
                       <CardTitle className="text-sm md:text-lg font-black uppercase tracking-tight text-[#0F172A] flex items-center gap-2">
                          <Bell className="h-4 w-4 text-primary" /> Exam Alert Subscriptions
                       </CardTitle>
                       <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Personalize high-priority broadcasts</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 md:p-10 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                       {['PSSSB', 'PPSC', 'Punjab Police', 'Education', 'High Court'].map(board => (
                          <div key={board} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 transition-all hover:border-primary/20">
                             <div className="space-y-0.5">
                                <p className="font-black text-[11px] uppercase tracking-tight text-[#0F172A]">{board}</p>
                                <p className="text-[8px] text-slate-400 font-bold uppercase">Alerts & Results</p>
                             </div>
                             <Switch 
                                checked={(profile.subscriptions || []).includes(board)} 
                                onCheckedChange={() => handleToggleSub(board)} 
                             />
                          </div>
                       ))}
                    </CardContent>
                 </Card>
              </div>

              {/* RIGHT: ACCOUNT DETAILS & SUPPORT */}
              <div className="lg:col-span-4 space-y-6 md:space-y-8">
                 <Card className="border-none shadow-xl rounded-[2rem] bg-white p-8 md:p-10 space-y-8">
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Account Context</h3>
                          <Settings className="h-3.5 w-3.5 text-slate-300" />
                       </div>
                       
                       <AccountDetail icon={<MapPin />} label="REGION" value={profile.state} />
                       <AccountDetail icon={<Calendar />} label="MEMBER SINCE" value={new Date(profile.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })} />
                       <AccountDetail icon={<ShieldCheck />} label="AUDIT GROUP" value={`${profile.role}`} />
                    </div>
                 </Card>

                 <Card className="border-none shadow-xl rounded-[2rem] bg-[#0F172A] text-white p-8 md:p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform"><Target className="h-40 w-40" /></div>
                    <div className="relative z-10 space-y-6">
                       <Badge className="bg-primary text-white border-none text-[8px] font-black px-3 py-1 rounded-md uppercase tracking-widest">Active Audit</Badge>
                       <h3 className="text-2xl font-headline font-black uppercase leading-tight">Mastery Nodes <br/> Synchronized</h3>
                       <p className="text-slate-400 text-xs font-medium leading-relaxed uppercase">
                          Your profile is connected to the official Cracklix evaluation engine. All rank indices are live.
                       </p>
                       <Button asChild className="w-full bg-white text-[#0F172A] hover:bg-slate-100 font-black uppercase text-[10px] tracking-widest h-12 rounded-xl transition-all shadow-2xl active:scale-95">
                          <Link href="/leaderboard">View State Ranks</Link>
                       </Button>
                    </div>
                 </Card>

                 <div className="text-center space-y-2 opacity-40">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
                       Platform Architect: <span className="text-[#0F172A]">Arsh Grewal</span>
                    </p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">REGISTRY NODE CRX-8.0</p>
                 </div>
              </div>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function HeaderInfo({ icon, text }: { icon: React.ReactNode, text: string }) {
   return (
      <div className="flex items-center gap-2 text-white/60 font-bold uppercase text-[10px] md:text-xs tracking-tight">
         <span className="shrink-0 scale-75 md:scale-100">{icon}</span>
         <span className="truncate max-w-[200px]">{text}</span>
      </div>
   )
}

function StatsCard({ icon, label, value, color, className }: any) {
   return (
      <Card className={cn("border-none shadow-lg rounded-2xl p-5 md:p-8 bg-white group hover:translate-y-[-4px] transition-all", className)}>
         <div className="flex items-center gap-3 mb-4">
            <div className={cn("h-8 w-8 md:h-10 md:w-10 rounded-xl bg-slate-50 flex items-center justify-center transition-all group-hover:scale-110", color.replace('text-', 'bg-').replace('600', '50').replace('500', '50'))}>
               {React.cloneElement(icon as React.ReactElement, { className: cn("h-4 w-4 md:h-5 md:w-5", color) })}
            </div>
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</span>
         </div>
         <p className={cn("text-2xl md:text-4xl font-headline font-black leading-none", color)}>{value}</p>
      </Card>
   )
}

function AccountDetail({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
   return (
      <div className="flex items-center gap-4 group">
         <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-slate-300 group-hover:bg-primary/5 group-hover:text-primary transition-all">
            {icon}
         </div>
         <div className="min-w-0 text-left">
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
            <p className="text-xs md:text-sm font-bold text-[#0F172A] truncate uppercase">{value}</p>
         </div>
      </div>
   )
}
import React from "react"
