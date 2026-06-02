
'use client';

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export default function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-punjab')?.imageUrl || "https://picsum.photos/seed/punjab-hero/1200/800"

  return (
    <section className="relative pt-20 pb-32 lg:pt-32 lg:pb-48 overflow-hidden hero-gradient">
      {/* Punjab Map Watermark */}
      <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-[1000px] h-[1000px] text-white">
          <path d="M40 35 L55 40 L60 60 L45 70 L35 55 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-[#F97316]/20 text-[#F97316] px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border border-[#F97316]/30">
              <ShieldCheck className="h-4 w-4" />
              #1 Punjab Exam Preparation Platform
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold text-white leading-[1.1]">
              Prepare Smarter.<br />
              <span className="text-[#F97316]">Score Higher.</span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Punjab Government Exams di Complete Preparation ik hi Platform te. Trust Cracklix for your career success.
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <Button asChild size="lg" className="h-14 px-10 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold rounded-xl gap-2 shadow-2xl shadow-[#F97316]/20">
                <Link href="/mocks">Start Free Mock <ArrowRight className="h-5 w-5" /></Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="h-14 px-10 border-white/20 text-white hover:bg-white/10 rounded-xl font-bold bg-transparent">
                <Link href="/exams">Explore Exams</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative lg:ml-auto w-full max-w-[600px] aspect-[4/3] group"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/10">
              <Image 
                src={heroImage}
                alt="Golden Temple at Night"
                fill
                className="object-cover"
                data-ai-hint="golden temple"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-10 left-10">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                  <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Success Guaranteed</p>
                  <p className="text-white text-2xl font-bold">15,000+ Aspirants</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
