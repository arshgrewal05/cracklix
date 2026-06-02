
'use client';

import { motion } from "framer-motion"
import { BookOpen, Clock, ShieldCheck, Target } from "lucide-react"

const stats = [
  { icon: <BookOpen />, value: "10,000+", label: "Practice Questions" },
  { icon: <Clock />, value: "500+", label: "Mock Tests" },
  { icon: <ShieldCheck />, value: "50+", label: "Exams Covered" },
  { icon: <Target />, value: "Detailed", label: "Analytics" },
]

export default function Stats() {
  return (
    <section className="relative -mt-20 z-20 pb-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-2xl flex flex-col items-center text-center space-y-3"
            >
              <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-[#F97316]">
                {stat.icon}
              </div>
              <p className="text-3xl font-headline font-black text-white">{stat.value}</p>
              <p className="text-[11px] text-white/50 font-black uppercase tracking-[0.2em]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
