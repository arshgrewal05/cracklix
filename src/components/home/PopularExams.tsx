'use client';

import React from "react"
import { motion } from "framer-motion"
import { 
  ChevronRight, 
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { AuthorityLogo } from "@/lib/exam-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview Popular Punjab Exams Hub v74.0 (Premium Upgrade).
 * UI UPGRADE: Large board logos and availability markers.
 * UI FIX: Removed uppercase from headings and titles.
 */

const POPULAR_LIST = [
  { name: "PCS", id: "pcs", boardId: "ppsc", hasMocks: true, hasPyqs: true },
  { name: "Constable", id: "constable", boardId: "punjab-police", hasMocks: true, hasPyqs: true },
  { name: "Patwari", id: "patwari", boardId: "psssb", hasMocks: true, hasPyqs: true },
  { name: "Clerk", id: "clerk", boardId: "psssb", hasMocks: true, hasPyqs: true },
  { name: "PSTET", id: "pstet-paper-1", boardId: "pstet", hasMocks: true, hasPyqs: true },
  { name: "ALM", id: "alm", boardId: "pspcl", hasMocks: true, hasPyqs: true },
  { name: "Staff Nurse", id: "staff-nurse", boardId: "bfuhs", hasMocks: true, hasPyqs: true },
  { name: "SSC CGL", id: "ssc-cgl", boardId: "ssc", hasMocks: true, hasPyqs: true }
];

export default function PopularExams() {
  return (
    <section className="py-16 md:py-24 bg-slate-50/50">
      <div className="container mx-auto px-4 max-w-7xl text-left">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4">
            <div className="space-y-1">
               <h2 className="text-3xl md:text-5xl font-black text-[#04102B] tracking-tight leading-none">Popular Exams</h2>
               <p className="text-[#94A3B8] font-bold text-xs md:text-sm tracking-tight uppercase">Most Targeted Preparation Hubs</p>
            </div>
            <Link href="/exams" className="text-primary font-black uppercase text-[10px] md:text-xs tracking-widest hover:underline flex items-center gap-2 group">
               View All Exams <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {POPULAR_LIST.map((p, idx) => (
               <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} viewport={{ once: true }}>
                  <Link href={`/exams/${p.id}`}>
                     <Card className="border border-[#E5E7EB] shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] bg-white p-8 md:p-10 text-left h-full group flex flex-col">
                        <div className="mb-8 flex justify-center">
                           <AuthorityLogo boardId={p.boardId} size="xl" className="bg-slate-50 rounded-[1.5rem] group-hover:scale-110 transition-transform" />
                        </div>
                        
                        <div className="flex-1 space-y-5">
                           <h3 className="text-xl md:text-2xl font-black text-[#04102B] leading-tight group-hover:text-primary transition-colors">
                              {p.name}
                           </h3>
                           
                           <div className="flex flex-wrap gap-2">
                              {p.hasMocks && <MiniChip emoji="📚" label="Mocks" />}
                              {p.hasPyqs && <MiniChip emoji="📝" label="PYQs" />}
                              <MiniChip emoji="⚡" label="Live" />
                           </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-slate-50">
                           <Button className="w-full h-12 rounded-xl bg-[#0F172A] hover:bg-primary text-white font-black uppercase text-[10px] tracking-widest gap-2 border-none shadow-md">
                              Open Exam <ArrowRight className="h-3.5 w-3.5" />
                           </Button>
                        </div>
                     </Card>
                  </Link>
               </motion.div>
            ))}
         </div>
      </div>
    </section>
  );
}

function MiniChip({ emoji, label }: { emoji: string, label: string }) {
   return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[9px] font-black uppercase text-slate-500">
         <span>{emoji}</span> {label}
      </span>
   )
}
