"use client"

import { useMemo, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useCollection, useFirestore, useUser } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { ShieldCheck, Landmark, ChevronRight, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * @fileOverview Institutional Exam List Landing v14.1.
 * UPDATED: Simplified terminology for categories and hubs.
 */

const CATEGORY_ICONS: Record<string, any> = {
  "punjab-govt": <img src="https://sssb.punjab.gov.in/wp-content/themes/ssbtheme/images/punjab-gov.svg" className="h-full w-full object-contain p-2" />,
  "punjab-teaching": <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbNnoge6pNWx1HZYrUJKM58qWk1dDw85xvKPBoG-O4ew&s=10" className="h-full w-full object-contain p-2" />,
  "punjab-technical": <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0ZK9JI5KMfg9RoNdIwcsNlpx5IcPBWuKZw&s" className="h-full w-full object-contain p-2" />,
  "banking": <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7McWqZqOgKy-BakccvR02WQdEQFrwuvmHBG5rYJzuEg&s=10" className="h-full w-full object-contain p-2" />,
  "central-govt": <img src="https://alchetron.com/cdn/government-of-india-973b74d1-e25f-41f2-ba2b-51595702248-resize-750.jpeg" className="h-full w-full object-contain p-2" />
};

export default function ExamsEntryPage() {
  const db = useFirestore();
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?returnUrl=${encodeURIComponent('/exams')}`);
    }
  }, [user, authLoading, router]);

  const catQuery = useMemo(() => (db ? query(collection(db, "categories"), orderBy("displayOrder", "asc")) : null), [db]);
  const boardsQuery = useMemo(() => (db ? collection(db, "boards") : null), [db]);

  const { data: categories, loading: catLoading } = useCollection<any>(catQuery);
  const { data: boards, loading: boardsLoading } = useCollection<any>(boardsQuery);

  const loading = catLoading || boardsLoading || authLoading;

  if (authLoading || !user) return <div className="h-screen w-full flex items-center justify-center bg-white"><Zap className="h-10 w-10 text-primary animate-pulse" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 font-body text-left">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 max-w-7xl">
        <div className="text-left mb-10 md:mb-14 space-y-3">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                <Landmark className="h-4 w-4" />
             </div>
             <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Official Exam List</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#0F172A] leading-[1.05]">
            Choose Your <br/> <span className="text-primary">Exam Category</span>
          </h1>
          <p className="text-slate-600 font-medium text-sm md:text-lg max-w-2xl leading-relaxed">
            Select a category to browse official recruitment exams and preparation materials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
           {loading ? (
             Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-[2.5rem]" />)
           ) : categories && categories.length > 0 ? (
             categories.map((cat) => {
                const hubCount = (boards || []).filter((b: any) => b.categoryId === cat.id).length;
                return (
                  <Link key={cat.id} href={`/exams/category/${cat.id}`}>
                     <Card className="border-none shadow-xl hover:shadow-4xl hover:translate-y-[-4px] transition-all duration-700 rounded-[2rem] bg-white group overflow-hidden h-full flex flex-col border border-slate-100">
                        <CardContent className="p-6 md:p-8 flex flex-col h-full">
                           <div className="flex justify-between items-start mb-6 md:mb-8">
                              <div className={cn("h-12 w-12 md:h-14 md:w-14 rounded-xl flex items-center justify-center transition-all group-hover:shadow-lg shadow-inner relative overflow-hidden shrink-0 bg-slate-50 text-slate-300")}>
                                 {CATEGORY_ICONS[cat.id] || <ShieldCheck className="h-6 w-6" />}
                              </div>
                              <Badge className="bg-[#0F172A] text-white border-none text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-md">
                                 {cat.highlight || "VERTICAL"}
                              </Badge>
                           </div>
                           
                           <div className="space-y-2 flex-1">
                              <h3 className="text-xl md:text-2xl font-black leading-tight text-[#0F172A] group-hover:text-primary transition-colors line-clamp-2 uppercase">
                                 {cat.title}
                              </h3>
                              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 font-medium">
                                 {cat.description}
                              </p>
                           </div>

                           <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{hubCount} Exam Groups</span>
                              <Button variant="ghost" className="h-10 px-6 rounded-xl bg-[#0F172A] text-white group-hover:bg-primary transition-all font-bold text-[10px] tracking-widest uppercase border-none">
                                 Open Category <ChevronRight className="ml-2 h-3.5 w-3.5" />
                              </Button>
                           </div>
                        </CardContent>
                     </Card>
                  </Link>
                )
             })
           ) : (
             <div className="col-span-full py-20 text-center opacity-20 italic uppercase font-black tracking-widest">Awaiting Data...</div>
           )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
