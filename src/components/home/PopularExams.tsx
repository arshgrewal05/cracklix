
'use client';

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { EXAMS } from "@/lib/mock-data"
import { ShieldCheck, ArrowRight, BookOpen, Clock } from "lucide-react"
import Link from "next/link"

export default function PopularExams() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-headline font-bold text-[#0F172A]"
            >
              Popular Exams
            </motion.h2>
            <p className="text-muted-foreground mt-4 text-lg">Complete preparation for all major Punjab recruitment boards.</p>
          </div>
          <Link href="/exams" className="text-[#F97316] font-bold text-sm uppercase tracking-widest flex items-center hover:underline group">
            View All Exams <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {EXAMS.map((exam, idx) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <Link href={`/exams/${exam.id}`}>
                <Card className="hover:shadow-2xl transition-all duration-300 border-gray-100 rounded-[2rem] bg-white group h-full flex flex-col p-8 border custom-shadow overflow-hidden">
                  <div className="flex justify-between items-start mb-8">
                    <div className="h-16 w-16 rounded-2xl bg-[#F8FAFC] border flex items-center justify-center group-hover:bg-[#1E3A8A] transition-colors">
                       <ShieldCheck className="h-8 w-8 text-[#0F172A] group-hover:text-white" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{exam.board}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-headline font-bold text-[#0F172A] mb-2 group-hover:text-[#F97316] transition-colors">{exam.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-8 line-clamp-2">{exam.description}</p>
                  </div>
                  <div className="mt-auto flex flex-col gap-3 pt-6 border-t border-gray-50">
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#1E3A8A] uppercase tracking-widest">
                       <span className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5" /> {exam.totalMocks} Series</span>
                       <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {exam.duration} Min</span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
