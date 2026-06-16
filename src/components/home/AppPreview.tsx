'use client';

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Smartphone, CheckCircle2, ShieldCheck, Download, Apple, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { cn } from "@/lib/utils";

/**
 * @fileOverview Redesigned Mobile App Hub v14.0.
 * UPDATED: Removed maps, added smartphone mockup and checkmark benefits.
 */

export default function AppPreview() {
  const db = useFirestore();
  const phoneMockup = "https://picsum.photos/seed/phone/600/1200"; // Placeholder for app mockup

  const { data: settings } = useDoc<any>(useMemo(() => (db ? doc(db, 'settings', 'global') : null), [db]));

  const playStoreLink = settings?.playStoreUrl || "#";
  const appStoreLink = settings?.appStoreUrl || "#";

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden border-t border-slate-50">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-10 text-left order-2 lg:order-1"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                    <Smartphone className="h-5 w-5" />
                 </div>
                 <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-500">Official Mobile Node</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-headline font-black text-[#0F172A] leading-tight md:leading-[0.95] tracking-tight uppercase">
                Study Anywhere. <br />
                <span className="text-primary">Anytime.</span>
              </h2>
              <p className="text-base md:text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                Download the official <span className="text-[#0F172A] font-bold">Cracklix App</span> to access high-quality preparation resources on the go.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <BenefitItem text="500+ Mock Tests" />
               <BenefitItem text="Daily Study Notes" />
               <BenefitItem text="Bilingual Updates" />
               <BenefitItem text="Real-time Alerts" />
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
               <a href={playStoreLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                 <Button className="w-full h-16 px-10 bg-[#0F172A] hover:bg-black text-white rounded-2xl shadow-xl gap-4 font-black uppercase text-[11px] tracking-widest border-none transition-all active:scale-95">
                    <Play className="h-5 w-5 text-primary fill-current" /> Download Android
                 </Button>
               </a>
               <a href={appStoreLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto opacity-50 cursor-not-allowed">
                 <Button variant="outline" className="w-full h-16 px-10 border-2 border-slate-100 bg-white text-slate-400 rounded-2xl gap-4 font-black uppercase text-[11px] tracking-widest transition-all">
                    <Apple className="h-5 w-5" /> iOS Coming Soon
                 </Button>
               </a>
            </div>
          </motion.div>

          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
             <div className="absolute -inset-20 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
             
             <motion.div 
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="relative w-full max-w-[320px] md:max-w-[400px] z-10"
             >
                {/* DEVICE MOCKUP FRAME */}
                <div className="relative aspect-[9/18.5] bg-[#0F172A] rounded-[3.5rem] p-3 shadow-5xl border-[8px] border-[#1E293B] ring-1 ring-white/10">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1E293B] rounded-b-2xl z-20" />
                   <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-white relative">
                      <img 
                        src={phoneMockup} 
                        className="w-full h-full object-cover" 
                        alt="App Screenshot" 
                        data-ai-hint="app mockup"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/20 to-transparent pointer-events-none" />
                   </div>
                </div>

                {/* DECORATIVE BADGE */}
                <motion.div 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute -right-8 top-1/4 bg-white p-4 rounded-2xl shadow-4xl border border-slate-100 flex items-center gap-3 z-30"
                >
                   <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner">
                      <ShieldCheck className="h-5 w-5" />
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] font-black text-[#0F172A] uppercase leading-none">Safe Registry</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified App</p>
                   </div>
                </motion.div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-[#0F172A] font-bold uppercase text-[10px] md:text-xs tracking-tight">
       <div className="h-6 w-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
       </div>
       {text}
    </div>
  );
}
