
"use client"

import { useMemo, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useDoc, useFirestore, useUser, useCollection } from "@/firebase"
import { doc, collection, query, where, getDocs, limit } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Clock, 
  BookOpen, 
  ShieldCheck, 
  ArrowRight, 
  ChevronLeft,
  Info,
  Lock,
  Zap,
  Gem
} from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Institutional Mock Node with Authentication Guards.
 * Optimized: Horizontal back button layout and high-density UI.
 */

export default function MockOverviewPage() {
  const params = useParams()
  const router = useRouter()
  const db = useFirestore()
  const { user, profile, loading: userLoading } = useUser()
  const mockId = params.id as string
  
  const { data: mock, loading: mockLoading } = useDoc<any>(useMemo(() => (db && mockId ? doc(db, "mocks", mockId) : null), [db, mockId]))
  const { data: passes } = useCollection<any>(useMemo(() => (db ? collection(db, "passes") : null), [db]))

  const [isLocked, setIsLocked] = useState(true);
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      if (mockLoading || !mock || !db) return;

      if (mock.accessType === 'FREE') {
        setIsLocked(false);
        setAccessChecked(true);
        return;
      }

      if (profile?.role === 'ADMIN' || profile?.role === 'SUPER_ADMIN') {
        setIsLocked(false);
        setAccessChecked(true);
        return;
      }

      if (!user) {
        setIsLocked(true);
        setAccessChecked(true);
        return;
      }

      try {
        const subQuery = query(
          collection(db, "subscriptions"), 
          where("userId", "==", user.uid),
          where("status", "==", "active"),
          limit(1)
        );
        const subSnap = await getDocs(subQuery);
        
        if (!subSnap.empty) {
          const subData = subSnap.docs[0].data();
          const expiry = new Date(subData.expiryDate);
          if (expiry > new Date()) setIsLocked(false);
        }
      } catch (e) {
        console.error("Access Audit Error:", e);
      }
      setAccessChecked(true);
    }
    checkAccess();
  }, [mock, mockLoading, user, profile, db]);

  const handleStart = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      router.push(`/login?returnUrl=/mocks/${mockId}`);
      return;
    }
  };

  if (mockLoading || userLoading || (user && !accessChecked)) return <div className="h-screen flex items-center justify-center bg-white"><Skeleton className="h-16 w-16 rounded-full animate-pulse" /></div>
  if (!mock) return <div className="h-screen flex items-center justify-center text-slate-400 font-black uppercase tracking-widest text-xs">Registry node missing</div>

  return (
    <div className="min-h-screen bg-white flex flex-col font-body">
      <Navbar />
      
      <main className="flex-1">
        <section className="bg-slate-50 border-b border-slate-100 py-6 md:py-12">
          <div className="container mx-auto px-4 max-w-6xl text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-start gap-4 flex-1">
                <Button variant="ghost" onClick={() => router.back()} className="rounded-full h-10 w-10 border border-slate-200 bg-white flex items-center justify-center text-slate-400 p-0">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-orange-50 text-primary border-none px-3 py-0.5 rounded font-black uppercase text-[8px] tracking-widest">OFFICIAL SERIES</Badge>
                      {isLocked && <Badge className="bg-amber-100 text-amber-600 border-none px-3 py-0.5 rounded font-black uppercase text-[8px] tracking-widest flex items-center gap-1"><Lock className="h-3 w-3" /> PASS REQUIRED</Badge>}
                  </div>
                  <h1 className="text-xl md:text-4xl font-headline font-black text-[#0F172A] uppercase leading-tight tracking-tight">{mock.title}</h1>
                  <div className="flex items-center gap-6 pt-1 text-slate-500 font-bold text-[10px] md:text-sm uppercase tracking-widest">
                      <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {mock.duration} Mins</span>
                      <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" /> {mock.totalQuestions} Qs</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto">
                 {isLocked ? (
                    <Button asChild className="w-full h-14 md:h-16 px-10 bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-xl gap-3">
                      <Link href="/pass"><Lock className="h-4 w-4" /> Unlock with Pass</Link>
                    </Button>
                 ) : (
                    <Button asChild onClick={handleStart} className="w-full h-14 md:h-16 px-10 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-xl gap-3 group">
                      <Link href={`/mocks/${mockId}/instructions`}>Start Practice <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
                    </Button>
                 )}
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 max-w-6xl text-left">
           <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-6">
              <h3 className="text-lg font-headline font-black uppercase text-[#0F172A] flex items-center gap-3"><Info className="h-5 w-5 text-primary" /> Institutional Guidelines</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <GuidelineItem text="Authentication node required for evaluation." />
                 <GuidelineItem text="Negative marking (-0.25) active for mismatched nodes." />
                 <GuidelineItem text="Real-time audit generated post-submission." />
                 <GuidelineItem text="Official 2026 marking scheme applied." />
              </ul>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function GuidelineItem({ text }: { text: string }) {
   return (
      <li className="flex gap-3 items-start">
         <ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
         <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{text}</span>
      </li>
   )
}
