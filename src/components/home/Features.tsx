
'use client';

import { motion } from "framer-motion";
import { Zap, BookOpen, Layers, FileStack, Newspaper, Activity, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

/**
 * @fileOverview Refined Features Grid aligned with 'Why Cracklix?' wireframe.
 */
const features = [
  { 
    icon: <Zap className="h-6 w-6" />, 
    title: "Full Mock Tests", 
    desc: "Complete patterns for major recruitments.",
    color: "text-orange-500",
    bgColor: "bg-orange-50"
  },
  { 
    icon: <BookOpen className="h-6 w-6" />, 
    title: "Subject Mocks", 
    desc: "Targeted practice for specific nodes.",
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  { 
    icon: <Layers className="h-6 w-6" />, 
    title: "Sectional Tests", 
    desc: "Gurmukhi, GK and Reasoning focus.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50"
  },
  { 
    icon: <FileStack className="h-6 w-6" />, 
    title: "Previous Year Papers", 
    desc: "Verified audit trail of official exams.",
    color: "text-amber-500",
    bgColor: "bg-amber-50"
  },
  { 
    icon: <Newspaper className="h-6 w-6" />, 
    title: "Current Affairs", 
    desc: "Daily bilingual updates verified.",
    color: "text-rose-500",
    bgColor: "bg-rose-50"
  },
  { 
    icon: <Activity className="h-6 w-6" />, 
    title: "Performance Analytics", 
    desc: "Detailed scoring and state ranking.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50"
  },
];

export default function Features() {
  return (
    <section className="bg-white py-12 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl text-left">
        <div className="flex items-center gap-4 mb-16">
           <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
              <Sparkles className="h-5 w-5" />
           </div>
           <h2 className="text-xl md:text-3xl font-headline font-black text-[#0F172A] uppercase tracking-tight">Why Cracklix?</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
               <Card className="border-none shadow-xl rounded-[2.5rem] p-8 md:p-10 group hover:translate-y-[-4px] transition-all bg-slate-50/50 border border-slate-100">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform", feature.bgColor, feature.color)}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-black mb-2 uppercase text-[#0F172A] group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    {feature.desc}
                  </p>
               </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
