
"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, Gem, Loader2, Sparkles, Star, Lock, Gift } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useUser, useFirestore } from "@/firebase"
import { doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { useMemo, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const PAID_PLANS = [
  {
    id: "monthly",
    name: "Monthly PASS",
    price: 99,
    duration: "30 Days",
    planType: "MONTHLY",
    desc: "Start your targeted subject mastery.",
    features: [
      "All Premium Mock Access",
      "Premium Subject Tests",
      "Premium Sectional Tests",
      "All Official PYQ Papers",
      "Regional Rank Index",
      "AI Rationalization Tutors"
    ]
  },
  {
    id: "quarterly",
    name: "Quarterly PASS",
    price: 249,
    duration: "90 Days",
    planType: "QUARTERLY",
    recommended: true,
    desc: "Our most popular institutional tier.",
    features: [
      "Everything in Monthly",
      "Advance AI Tutors",
      "Readiness Score Index",
      "Revision Vault Access",
      "Priority Alerts Hub"
    ]
  },
  {
    id: "yearly",
    name: "Yearly PASS",
    price: 799,
    duration: "365 Days",
    planType: "YEARLY",
    desc: "Total platform mastery for a year.",
    features: [
      "Everything in Quarterly",
      "One-on-One Mentorship",
      "Exclusive Video Courses",
      "Priority Support Node",
      "Ad-Free CBT Engine"
    ]
  }
];

export default function PassPage() {
  const { user, profile, loading } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  const [claiming, setClaiming] = useState(false)

  const activePassLabel = useMemo(() => {
     if (!profile?.pass?.active) return null;
     const expiry = new Date(profile.pass.expiryDate);
     if (expiry < new Date()) return "PASS EXPIRED";
     return `ACTIVE: Expires ${expiry.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  }, [profile]);

  const handleClaimFreePass = async () => {
    if (!user || !db) return
    if (profile?.pass?.freePassClaimed) {
      toast({ variant: "destructive", title: "Audit Blocked", description: "Free pass has already been claimed for this account." })
      return
    }

    setClaiming(true)
    try {
      const expiry = new Date()
      expiry.setDate(expiry.getDate() + 7)
      
      await updateDoc(doc(db, "users", user.uid), {
        pass: {
          active: true,
          plan: 'FREE_PASS',
          purchaseDate: new Date().toISOString(),
          expiryDate: expiry.toISOString(),
          freePassClaimed: true
        },
        updatedAt: serverTimestamp()
      })

      toast({ title: "Free Pass Activated", description: "Your 7-day preparation node is now live." })
    } catch (e: any) {
      toast({ variant: "destructive", title: "Claim Failed" })
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020817] font-body pb-safe overflow-x-hidden text-white">
      <Navbar />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="container mx-auto px-4 py-16 md:py-24 max-w-7xl relative z-10">
        <div className="text-center space-y-6 mb-16 md:mb-24">
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className={cn(
                 "px-6 py-2 rounded-full font-black uppercase text-[10px] tracking-[0.2em] mb-8 shadow-2xl",
                 activePassLabel === 'PASS EXPIRED' ? "bg-rose-500/20 text-rose-400 border-rose-500/30" :
                 activePassLabel ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-primary/20 text-primary border-primary/30"
              )}>
                 {activePassLabel || "Elite Preparation Registry 2026"}
              </Badge>
              <h1 className="text-4xl md:text-8xl font-headline font-black tracking-tight uppercase leading-[0.9]">
                 UNLOCK THE <br/> <span className="text-primary">MASTER PASS</span>
              </h1>
              <p className="text-sm md:text-xl text-slate-400 font-medium max-w-2xl mx-auto mt-8 leading-relaxed">
                 Invest in precision. Unlock verified mocks, subject hubs, and AI-powered rationalizations designed for final selection.
              </p>
           </motion.div>
        </div>

        {/* Phase 4: Free Pass Node */}
        {!profile?.pass?.freePassClaimed && (
           <div className="max-w-xl mx-auto mb-24">
              <Card className="bg-emerald-500/10 border-2 border-emerald-500/20 rounded-[3rem] p-10 md:p-12 text-center space-y-8 shadow-3xl shadow-emerald-500/5 group hover:border-emerald-500/40 transition-all">
                 <div className="h-16 w-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-2xl transition-transform group-hover:scale-110">
                    <Gift className="h-8 w-8" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-3xl font-headline font-black uppercase text-emerald-400">Claim Free Pass</h3>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">7 DAYS UNRESTRICTED AUDIT</p>
                 </div>
                 <p className="text-sm text-slate-300 font-medium">New aspirants can claim a one-time 7-day trial pass to experience all premium content.</p>
                 <Button 
                   onClick={handleClaimFreePass}
                   disabled={claiming}
                   className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl shadow-xl transition-all active:scale-95"
                 >
                    {claiming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-5 w-5 mr-3" />}
                    Claim FREE Pass
                 </Button>
              </Card>
           </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch justify-center">
           {PAID_PLANS.map((plan, idx) => (
             <motion.div 
               key={plan.id} 
               initial={{ opacity: 0, y: 30 }} 
               animate={{ opacity: 1, y: 0 }} 
               transition={{ delay: idx * 0.1 }}
               className="h-full"
             >
                <Card className={cn(
                  "h-full border-none shadow-5xl rounded-[3.5rem] overflow-hidden flex flex-col transition-all duration-500 hover:shadow-primary/10 hover:translate-y-[-8px]",
                  plan.recommended ? "bg-[#0B1528] ring-2 ring-primary/40" : "bg-white/5 border border-white/10"
                )}>
                   {plan.recommended && (
                     <div className="bg-primary text-white py-3 text-center text-[10px] font-black uppercase tracking-[0.4em]">Management Recommendation</div>
                   )}
                   <CardHeader className="p-10 md:p-12 pb-6 md:pb-8 text-center space-y-8">
                      <div className={cn(
                        "h-20 w-20 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl transition-transform",
                        plan.recommended ? "bg-primary text-white" : "bg-white/10 text-primary"
                      )}>
                         <Gem className="h-10 w-10 fill-current" />
                      </div>
                      <div className="space-y-2">
                        <CardTitle className="font-headline font-black text-2xl md:text-3xl uppercase tracking-tight text-white leading-tight">
                           {plan.name}
                        </CardTitle>
                        <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed text-slate-500 px-4">
                           {plan.desc}
                        </p>
                      </div>
                      <div className="pt-4">
                         <div className="flex items-baseline justify-center gap-1">
                            <span className="text-6xl md:text-7xl font-headline font-black text-white tracking-tighter">₹{plan.price}</span>
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">/ {plan.duration}</span>
                         </div>
                      </div>
                   </CardHeader>

                   <CardContent className="px-10 md:px-12 pb-8 md:pb-10 flex-1">
                      <div className="h-px w-full bg-white/5 mb-10" />
                      <ul className="space-y-5">
                         {plan.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-4 text-left group/feat">
                               <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                               <span className="text-xs md:text-sm font-bold uppercase leading-tight text-slate-300 group-hover/feat:text-white transition-colors">{feat}</span>
                             </li>
                         ))}
                      </ul>
                   </CardContent>

                   <CardFooter className="p-10 md:p-12 pt-0">
                      <Button asChild className="w-full h-16 md:h-20 rounded-[2rem] bg-primary hover:bg-orange-600 text-white font-black uppercase text-[11px] tracking-[0.2em] shadow-3xl transition-all active:scale-95 border-none">
                         <Link href={`/checkout?plan=${plan.id}`}>
                            BUY NOW <ArrowRight className="ml-3 h-5 w-5" />
                         </Link>
                      </Button>
                   </CardFooter>
                </Card>
             </motion.div>
           ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
