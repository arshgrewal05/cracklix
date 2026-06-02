
'use client';

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Apple, Play } from "lucide-react"
import Image from "next/image"

export default function AppPreview() {
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <Badge className="bg-[#1E3A8A]/10 text-[#1E3A8A] border-none px-4 py-1.5 rounded-lg font-bold">
              Learn. Practice. Succeed.
            </Badge>
            <h2 className="text-5xl md:text-6xl font-headline font-bold text-[#0F172A] leading-tight">
              Cracklix in Your <br />
              <span className="text-[#F97316]">Pocket</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              Punjab&apos;s most trusted exam preparation app. Download now and carry your complete study material and mock tests wherever you go.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="h-16 px-8 bg-[#0F172A] hover:bg-[#1E3A8A] text-white rounded-2xl flex items-center gap-4 transition-all hover:scale-105">
                <Apple className="h-8 w-8" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold leading-none opacity-70">Download on the</p>
                  <p className="text-xl font-bold leading-none mt-1">App Store</p>
                </div>
              </Button>
              <Button className="h-16 px-8 bg-[#0F172A] hover:bg-[#1E3A8A] text-white rounded-2xl flex items-center gap-4 transition-all hover:scale-105">
                <Play className="h-8 w-8" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold leading-none opacity-70">GET IT ON</p>
                  <p className="text-xl font-bold leading-none mt-1">Google Play</p>
                </div>
              </Button>
            </div>
          </motion.div>

          <div className="relative flex justify-center items-center gap-6 lg:gap-10">
             <motion.div 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               viewport={{ once: true }}
               className="relative h-[450px] w-[210px] rounded-[3rem] border-[6px] border-[#0F172A] bg-white overflow-hidden shadow-2xl"
             >
               <Image src="https://picsum.photos/seed/mockup1/400/800" fill alt="Exam Categories" className="object-cover" />
             </motion.div>
             
             <motion.div 
               initial={{ opacity: 0, y: -50 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               viewport={{ once: true }}
               className="relative h-[500px] w-[240px] rounded-[3.5rem] border-[8px] border-[#0F172A] bg-white overflow-hidden shadow-2xl z-10"
             >
               <Image src="https://picsum.photos/seed/mockup2/400/800" fill alt="Student Dashboard" className="object-cover" />
             </motion.div>
             
             <motion.div 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               viewport={{ once: true }}
               className="relative h-[450px] w-[210px] rounded-[3rem] border-[6px] border-[#0F172A] bg-white overflow-hidden shadow-2xl"
             >
               <Image src="https://picsum.photos/seed/mockup1/400/801" fill alt="Mock Analysis" className="object-cover" />
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
