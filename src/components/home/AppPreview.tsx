
'use client';

import { motion } from "framer-motion";
import { Apple, Play, Smartphone, CheckCircle2, Map as MapIcon, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @fileOverview Final App Preview Hub v2.0.
 * Replaced phone boxes with high-fidelity Punjab and India maps for geographic clarity.
 */

export default function AppPreview() {
  const punjabMap = "https://www.mapsofindia.com/maps/punjab/punjab-map.jpg";
  const indiaMap = "https://www.mapsofindia.com/images2/india-map.jpg";

  return (
    <section className="py-32 bg-white overflow-hidden border-t border-slate-50">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 text-left"
          >
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
               <Smartphone className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-5xl lg:text-7xl font-headline font-black text-[#0F172A] leading-[0.95] tracking-tight uppercase">
              CRACKLIX IN <br/>
              <span className="text-primary">YOUR POCKET</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
              Download the official mobile node to access high-fidelity mocks and AI rationalizations anywhere in Punjab.
            </p>

            <ul className="space-y-5 pt-4">
               <FeatureItem text="Bilingual CBT Interface (PA/EN)" />
               <FeatureItem text="AI-Powered Audit Rationalizations" />
               <FeatureItem text="All Punjab State Ranking Index" />
            </ul>

            <div className="flex flex-wrap gap-4 pt-8">
              <Button className="h-16 px-8 bg-[#0F172A] hover:bg-black text-white rounded-2xl flex items-center gap-4 shadow-xl transition-all active:scale-95">
                <Apple className="h-8 w-8" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold opacity-50 leading-none">Download on</p>
                  <p className="text-xl font-bold mt-1 leading-none">App Store</p>
                </div>
              </Button>
              <Button className="h-16 px-8 bg-[#0F172A] hover:bg-black text-white rounded-2xl flex items-center gap-4 shadow-xl transition-all active:scale-95">
                <Play className="h-8 w-8" />
                <div className="text-left">
                  <p className="text-[10px] uppercase font-bold opacity-50 leading-none">Get it on</p>
                  <p className="text-xl font-bold mt-1 leading-none">Google Play</p>
                </div>
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
             <div className="absolute -inset-10 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
             
             {/* Punjab Coverage Node */}
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="group relative rounded-[3rem] bg-[#0F172A] border-[10px] border-[#0F172A] shadow-5xl overflow-hidden aspect-[4/5] hover:-translate-y-2 transition-all duration-500"
             >
                <img 
                   src={punjabMap} 
                   className="w-full h-full object-cover grayscale brightness-125 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2s]" 
                   referrerPolicy="no-referrer"
                   alt="Punjab Hub"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <MapIcon className="h-5 w-5 text-primary" />
                      <span className="text-[10px] font-black uppercase text-white tracking-widest">Punjab Hub</span>
                   </div>
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
             </motion.div>

             {/* National Coverage Node */}
             <motion.div 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="group relative rounded-[3rem] bg-[#0F172A] border-[10px] border-[#0F172A] shadow-5xl overflow-hidden aspect-[4/5] md:mt-12 hover:-translate-y-2 transition-all duration-500"
             >
                <img 
                   src={indiaMap} 
                   className="w-full h-full object-cover grayscale brightness-125 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[2s]" 
                   referrerPolicy="no-referrer"
                   alt="National Hub"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-400" />
                      <span className="text-[10px] font-black uppercase text-white tracking-widest">National Hub</span>
                   </div>
                   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-4 text-[#0F172A] font-bold uppercase text-xs tracking-tight">
       <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
       </div>
       {text}
    </li>
  );
}
