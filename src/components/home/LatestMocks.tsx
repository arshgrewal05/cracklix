
'use client';

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { EXAMS, SAMPLE_MOCK } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen, ShieldCheck, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LatestMocks() {
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-headline font-bold text-[#0F172A]"
          >
            Latest Mock Tests
          </motion.h2>
          <Link href="/mocks" className="text-[#F97316] font-bold text-sm uppercase tracking-widest hover:underline">View All</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {EXAMS.slice(0, 5).map((exam, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-gray-100 rounded-2xl bg-white hover:shadow-xl transition-all overflow-hidden flex flex-col h-full border custom-shadow">
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-center mb-6">
                    <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="font-bold text-sm text-[#0F172A] mb-1">{exam.board} {exam.category}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Full Length Mock 0{i + 1}</p>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                       <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" /> 100 MCQs</span>
                       <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {exam.duration}m</span>
                    </div>
                    <div className="flex justify-center">
                       <Badge variant="outline" className="text-[10px] border-[#F97316]/30 text-[#F97316] bg-[#F97316]/5 uppercase font-black px-3">Medium</Badge>
                    </div>
                  </div>

                  <Button asChild className="w-full bg-white border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-all font-bold h-11 rounded-xl text-xs uppercase tracking-widest">
                    <Link href={`/mocks/${SAMPLE_MOCK.id}`}>Attempt Now</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
