
'use client';

import { motion } from "framer-motion"
import { ShieldCheck, Target, Trophy, Clock } from "lucide-react"

const features = [
  { 
    icon: <ShieldCheck className="h-8 w-8 text-[#F97316]" />, 
    title: "Real Exam Pattern Based Mocks", 
    desc: "Mocks designed exactly as per the latest exam pattern and syllabus issued by PSSSB, PPSC, and other boards."
  },
  { 
    icon: <Target className="h-8 w-8 text-[#F97316]" />, 
    title: "Detailed Solutions", 
    desc: "Step-by-step solutions with core concept explanations to clear your doubts and improve fundamental knowledge."
  },
  { 
    icon: <Trophy className="h-8 w-8 text-[#F97316]" />, 
    title: "Performance Analytics", 
    desc: "Track your progress with in-depth analytics, subject-wise heatmaps, and personalized ranking insights."
  },
  { 
    icon: <Clock className="h-8 w-8 text-[#F97316]" />, 
    title: "Study Anytime Anywhere", 
    desc: "Learn on the go with our mobile app. Access all your mocks, notes, and pyqs from any device, anytime."
  },
]

export default function Features() {
  return (
    <section className="py-24 bg-[#0F172A]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-headline font-bold text-white"
          >
            Why Choose <span className="text-[#F97316]">Cracklix</span>?
          </motion.h2>
          <p className="text-white/50 mt-4 max-w-2xl mx-auto text-lg">We provide high-authority tools designed specifically for government job aspirants.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-10 rounded-[2.5rem] space-y-6 text-left border-white/5 hover:border-[#F97316]/30 transition-all group"
            >
              <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-[#F97316]/10 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-[#F97316] transition-colors">{feature.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
