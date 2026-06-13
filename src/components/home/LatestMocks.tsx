'use client';

import { useMemo, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen, Clock, ChevronRight, Zap, Lock, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useCollection, useFirestore, useUser } from "@/firebase"
import { collection, query, where, limit } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

/**
 * @fileOverview Screenshot Matched Latest Mocks v30.0.
 * MATCHED: Clean white vertical cards with center aligned branding.
 */

export default function LatestMocks() {
  const db = useFirestore()
  const { user, profile } = useUser()
  const router = useRouter()
  
  const mocksQuery = useMemo(() => (db ? query(collection(db, "mocks"), where("published", "==", true), limit(5)) : null), [db])
  const { data: rawMocks, loading } = useCollection<any>(mocksQuery)
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))

  const mocks = useMemo(() => {
    if (!rawMocks) return []
    return [...rawMocks].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
  }, [rawMocks])

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 text-left">
           <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-headline font-black text-[#0F172A] uppercase tracking-tight">Latest Mock Tests</h2>
           </div>
           <Link href="/mocks" className="text-orange-500 font-bold uppercase text-[10px] md:text-sm hover:underline">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {loading ? (
             Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-2xl" />)
          ) : mocks.map((mock, i) => {
            const board = boards?.find((b: any) => b.id === (mock.boardIds?.[0] || mock.boardId));
            const difficulty = mock.difficulty || "Medium";
            
            return (
              <motion.div key={mock.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <Card className="border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] bg-white p-6 text-center flex flex-col h-full group">
                  
                  {/* HUB LOGO */}
                  <div className="h-16 w-16 mx-auto rounded-full bg-slate-50 flex items-center justify-center p-3 shadow-inner group-hover:scale-105 transition-transform mb-6">
                     {board?.iconUrl ? (
                       <img src={board.iconUrl} className="h-full w-full object-contain" alt="Logo" referrerPolicy="no-referrer" />
                     ) : (
                       <Zap className="h-6 w-6 text-primary" />
                     )}
                  </div>

                  <div className="flex-1 space-y-4">
                     <h3 className="font-black text-sm md:text-base text-[#0F172A] leading-tight uppercase line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
                        {mock.title}
                     </h3>

                     <div className="flex items-center justify-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                        <span className="flex items-center gap-1.5"><BookOpen className="h-3 w-3 text-slate-300" /> {mock.totalQuestions} Questions</span>
                        <div className="h-3 w-px bg-slate-100" />
                        <span className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-slate-300" /> {mock.duration} min</span>
                     </div>

                     <Badge className={cn(
                        "border-none text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded shadow-sm",
                        difficulty === 'Hard' ? "bg-rose-50 text-rose-500" :
                        difficulty === 'Easy' ? "bg-emerald-50 text-emerald-500" :
                        "bg-orange-50 text-orange-500"
                     )}>
                        {difficulty}
                     </Badge>
                  </div>

                  <div className="mt-8 pt-4">
                     <Button asChild className="w-full h-11 bg-white border border-slate-200 text-[#0F172A] hover:bg-[#0F172A] hover:text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95">
                        <Link href={`/mocks/${mock.id}`}>Attempt Now</Link>
                     </Button>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
