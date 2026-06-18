"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Quote, Star, GraduationCap, ShieldCheck, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useDoc, useFirestore } from "@/firebase"
import { doc } from "firebase/firestore"
import { useMemo, useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * @fileOverview Institutional Success Stories Hub v4.1.
 * REALITY AUDIT: Connected to master registry stats for dynamic student counts.
 */

const STORIES = [
  {
    name: "Amrit Grewal",
    exam: "Excise & Taxation Inspector",
    year: "2025",
    rank: "Rank 12",
    quote: "The bilingual CBT engine and official pattern mocks at Cracklix were game-changers for my preparation.",
    image: "https://picsum.photos/seed/amrit/400/500"
  },
  {
    name: "Harpreet Singh",
    exam: "Punjab Police Sub-Inspector",
    year: "2025",
    rank: "Rank 02",
    quote: "Institutional accuracy and daily current affairs helped me master the Punjab GK section completely.",
    image: "https://picsum.photos/seed/harpreet/400/500"
  },
  {
    name: "Kiran Kaur",
    exam: "PSSSB Patwari",
    year: "2024",
    rank: "Qualified",
    quote: "I especially loved the AI rationalizations for my wrong attempts. It helped me fix my logic gaps.",
    image: "https://picsum.photos/seed/kiran/400/500"
  }
]

export default function SuccessStoriesPage() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats, loading } = useDoc<any>(statsRef);

  const liveAspirantCount = useMemo(() => {
    if (!stats) return "0";
    const count = stats.totalUsers || 0;
    return count.toLocaleString();
  }, [stats]);

  return (
    <div className="min-h-screen bg-slate-50/50 text-left">
      <Navbar />
      <main className="container mx-auto px-6 py-24 max-w-6xl">
        <div className="space-y-24">
          <div className="text-center space-y-6">
             <div className="h-16 w-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary shadow-2xl">
                <Trophy className="h-8 w-8" />
             </div>
             <h1 className="text-6xl md:text-8xl font-headline font-black text-[#0F172A] uppercase tracking-tight">Hall of <span className="text-primary">Rankers</span></h1>
             <p className="text-slate-500 font-medium text-xl max-w-2xl mx-auto italic">
                "Preparation starts with inspiration. Success stories from fellow Punjab aspirants using the Cracklix platform."
             </p>
          </div>

          <div className="grid grid-cols-1 gap-20">
            {STORIES.map((story, idx) => (
              <div key={idx} className={`flex flex-col md:flex-row items-center gap-16 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                 <div className="md:w-2/5">
                    <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-4xl group">
                       <Image src={story.image} fill alt={story.name} className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                       <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60" />
                       <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between">
                          <Badge className="bg-emerald-50 text-white border-none px-6 py-2 rounded-2xl font-black">{story.rank}</Badge>
                       </div>
                    </div>
                 </div>
                 <div className="md:w-3/5 space-y-10 text-left">
                    <div className="flex gap-1.5 text-amber-500">
                       {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="fill-current h-8 w-8" />)}
                    </div>
                    <div className="space-y-4">
                       <Quote className="h-12 w-12 text-primary opacity-20" />
                       <blockquote className="text-4xl md:text-5xl font-headline font-medium italic text-[#0F172A] leading-tight">
                          "{story.quote}"
                       </blockquote>
                    </div>
                    <div className="space-y-2">
                       <p className="text-3xl font-black text-[#0F172A] uppercase tracking-tight">{story.name}</p>
                       <div className="flex items-center gap-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                          <span className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-primary" /> {story.exam}</span>
                          <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Batch {story.year}</span>
                       </div>
                    </div>
                 </div>
              </div>
            ))}
          </div>

          <div className="bg-[#0F172A] rounded-[5rem] p-20 text-center space-y-10 text-white relative overflow-hidden shadow-4xl">
             <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12"><Trophy className="h-64 w-64" /></div>
             <h2 className="text-5xl md:text-7xl font-headline font-black uppercase leading-tight relative z-10">Your Success <br/> <span className="text-primary">Is Next.</span></h2>
             <p className="text-slate-400 text-xl max-w-xl mx-auto font-medium relative z-10">
                Join {loading ? <Skeleton className="h-6 w-16 inline-block" /> : liveAspirantCount} aspirants already preparing with institutional grade mocks.
             </p>
             <Button asChild className="h-20 px-20 bg-white text-black hover:bg-slate-100 font-black uppercase text-sm tracking-widest rounded-3xl gap-4 shadow-4xl relative z-10 group">
                <Link href="/login">Create My Account <ChevronRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" /></Link>
             </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
