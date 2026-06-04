
'use client';

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, ShieldCheck, ArrowRight, Zap, Award } from "lucide-react";
import Link from "next/link";
import { useCollection, useFirestore } from "@/firebase";
import { collection, query, limit } from "firebase/firestore";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

/**
 * @fileOverview Final Institutional Mock Carousel (Exam Badge Style).
 * Synchronized with Testbook aesthetic for high-fidelity preparation.
 */

export default function LatestMocks() {
  const db = useFirestore();
  
  const mocksQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "mocks"), limit(20));
  }, [db]);

  const boardsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, "boards"));
  }, [db]);

  const { data: allMocks, loading } = useCollection<any>(mocksQuery);
  const { data: boards } = useCollection<any>(boardsQuery);

  const mocks = useMemo(() => {
    if (!allMocks) return [];
    return [...allMocks]
      .filter(m => m.published === true)
      .sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [allMocks]);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <div className="flex items-center gap-3">
               <div className="h-1 w-8 bg-primary rounded-full" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Fresh Content</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-headline font-black text-[#0F172A] uppercase tracking-tight leading-none">
              Institutional <span className="text-primary">Registry</span>
            </h2>
            <p className="text-slate-400 text-lg font-medium">Newest high-fidelity series deployed for 2026 aspirants.</p>
          </motion.div>
          
          <Link 
            href="/mocks" 
            className="group flex items-center gap-4 bg-slate-50 hover:bg-[#0F172A] hover:text-white px-10 py-5 rounded-2xl transition-all duration-500 shadow-sm font-black uppercase text-[10px] tracking-widest"
          >
            View Repository <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {loading ? (
             Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-[3rem]" />)
          ) : mocks && mocks.length > 0 ? (
            mocks.map((mock, i) => {
              const board = boards?.find(b => b.id === mock.boardId)
              return (
                <motion.div
                  key={mock.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="h-full"
                >
                  <Card className="border-none rounded-[3.5rem] bg-white shadow-2xl shadow-slate-200/40 hover:shadow-4xl hover:-translate-y-2 transition-all duration-700 overflow-hidden flex flex-col h-full group">
                    <CardContent className="p-0 flex-1 flex flex-col h-full">
                      <div className="p-8 pb-4 space-y-8 flex-1">
                         <div className="flex justify-between items-start">
                            <div className="h-16 w-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden shadow-inner group-hover:scale-110 transition-transform duration-500">
                               {board?.iconUrl ? (
                                 <Image src={board.iconUrl} fill alt={board.abbreviation} className="object-contain p-4" />
                               ) : (
                                 <Zap className="h-7 w-7 text-primary fill-current" />
                               )}
                            </div>
                            <Badge className="bg-primary/5 text-primary border-none text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg">
                               {board?.abbreviation || 'PSSSB'}
                            </Badge>
                         </div>

                         <div className="space-y-4">
                            <h3 className="font-bold text-base md:text-lg text-[#000000] leading-tight uppercase line-clamp-2 min-h-[48px]">
                             {mock.title}
                            </h3>
                            <div className="flex flex-col gap-2.5">
                               <div className="flex items-center gap-2 text-slate-400 font-black uppercase text-[9px] tracking-widest">
                                  <BookOpen className="h-3.5 w-3.5 text-primary" /> {mock.totalQuestions} Questions
                               </div>
                               <div className="flex items-center gap-2 text-slate-400 font-black uppercase text-[9px] tracking-widest">
                                  <Clock className="h-3.5 w-3.5 text-primary" /> {mock.duration} Minutes
                               </div>
                               <div className="flex items-center gap-2 text-slate-400 font-black uppercase text-[9px] tracking-widest">
                                  <Award className="h-3.5 w-3.5 text-primary" /> {mock.totalQuestions * 1} Marks
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="p-6 pt-0">
                         <Button asChild className="w-full bg-[#0B1528] hover:bg-primary text-white font-black h-12 rounded-[1.25rem] text-[9px] uppercase tracking-[0.2em] shadow-xl transition-all group-hover:shadow-primary/30">
                           <Link href={`/mocks/${mock.id}`} className="flex items-center justify-center gap-2">
                              Start <ArrowRight className="h-3 w-3" />
                           </Link>
                         </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          ) : (
            <div className="col-span-full py-20 text-center opacity-10">
               <ShieldCheck className="h-20 w-20 mx-auto mb-4" />
               <p className="font-headline font-black uppercase tracking-[0.4em] text-xs">Registry Node Empty</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
