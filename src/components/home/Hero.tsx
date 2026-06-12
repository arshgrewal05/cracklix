
'use client';

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck,
  Zap,
  Target,
  Trophy,
  Users,
  ArrowRight,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Globe,
  FileStack,
  CheckCircle2,
  Lock,
  Search,
  Star
} from "lucide-react";
import { useUser, useFirestore, useDoc } from "@/firebase";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { doc } from "firebase/firestore";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

/**
 * @fileOverview FINAL PERMANENT HERO v150.0 (Matched to Design Screenshot).
 * FEATURES: Institutional Image Hub, Floating Verified Badge, and Real-Time Stats.
 */
export default function Hero() {
  const router = useRouter();
  const { user } = useUser();
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats } = useDoc<any>(statsRef);

  const handleAction = (path: string) => {
    if (!user) {
      router.push(`/login?returnUrl=${encodeURIComponent(path)}`);
      return;
    }
    router.push(path);
  };

  if (!mounted) return null;

  const heroImageUrl = "https://i.ibb.co/gZCGMQNJ/IMG-20260612-WA0010.jpg";

  return (
    <section className="relative pt-12 pb-16 md:pt-24 md:pb-36 bg-[#0B1528] overflow-hidden text-left">
      {/* Background Subtle Gradient */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* LEFT: COMMAND CONTENT */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 md:space-y-8"
            >
              {/* Board Registry Header */}
              <div className="space-y-2">
                 <p className="text-primary font-black uppercase text-[10px] md:text-xs tracking-[0.4em] leading-none mb-4">
                    PREPARE FOR
                 </p>
                 <div className="flex flex-wrap items-center gap-2 md:gap-4 text-white/40 font-black text-[9px] md:text-[11px] uppercase tracking-widest">
                    <span className="text-primary">PSSSB</span>
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    <span className="text-primary">POLICE</span>
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    <span className="text-primary">PPSC</span>
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    <span className="text-primary">PSPCL</span>
                    <div className="h-1 w-1 rounded-full bg-white/20" />
                    <span className="text-primary">EXCISE</span>
                 </div>
              </div>

              {/* Master Headline */}
              <div className="space-y-4 md:space-y-6">
                 <h1 className="text-4xl md:text-7xl font-headline font-black leading-[0.95] tracking-tight text-white uppercase">
                    Master Punjab <br />
                    <span className="text-primary">Government Exams</span>
                 </h1>
                 <p className="text-slate-400 text-sm md:text-xl font-medium max-w-2xl leading-relaxed antialiased">
                    Punjab's smartest preparation platform. Unlock high-fidelity mocks, PYQs, current affairs and detailed AI logic rationalizations.
                 </p>
              </div>

              {/* Functional Feature Tags */}
              <div className="flex flex-wrap gap-3">
                 <FeatureTag icon={<Zap className="text-primary" />} label="500+ Mocks" />
                 <FeatureTag icon={<FileStack className="text-primary" />} label="Verified PYQs" />
                 <FeatureTag icon={<Globe className="text-primary" />} label="Bilingual Hub" />
              </div>
            </motion.div>

            {/* Tactical Action Nodes */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button 
                onClick={() => handleAction('/mocks')}
                className="w-full sm:w-auto h-16 md:h-20 px-12 bg-primary hover:bg-orange-600 text-white rounded-[1.5rem] md:rounded-[2.5rem] font-black uppercase text-[12px] md:text-[14px] tracking-[0.2em] shadow-3xl shadow-primary/20 border-none transition-all active:scale-95 gap-4"
              >
                Start Free Mock <ArrowRight className="h-5 w-5" />
              </Button>
              <Button 
                onClick={() => handleAction('/exams')}
                className="w-full sm:w-auto h-16 md:h-20 px-12 rounded-[1.5rem] md:rounded-[2.5rem] bg-white text-[#0B1528] hover:bg-slate-100 font-black uppercase text-[12px] md:text-[14px] tracking-[0.2em] transition-all active:scale-95 gap-4 border-none shadow-xl"
              >
                Explore Hubs <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Hot Exams Quick Links */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
               <span className="text-[10px] font-black uppercase text-primary tracking-widest">Trending:</span>
               {['PSSSB Patwari', 'Police SI', 'Excise Hub', 'PSTET'].map((t) => (
                  <Link key={t} href={`/search?q=${t}`}>
                    <Badge variant="outline" className="border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/30 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer shadow-sm">
                       {t}
                    </Badge>
                  </Link>
               ))}
            </div>
          </div>

          {/* RIGHT: INSTITUTIONAL IMAGE HUB (Matched to Screenshot) */}
          <div className="lg:col-span-5 relative">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative"
             >
                {/* Visual Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[3.5rem] blur-2xl opacity-50" />
                
                {/* Main Rounded Image Hub */}
                <div className="relative aspect-[4/5] rounded-[3.5rem] md:rounded-[4.5rem] overflow-hidden border-[6px] border-white/5 shadow-5xl bg-[#1A2333]">
                   <Image 
                      src={heroImageUrl}
                      alt="Punjab Police Prep"
                      fill
                      className="object-cover"
                      priority
                      data-ai-hint="punjab police"
                   />
                   
                   {/* 1. FLOATING VERIFIED CONTENT BADGE (Bottom Left) */}
                   <div className="absolute bottom-8 left-8 right-auto z-20 animate-in slide-in-from-left-4 duration-700">
                      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 flex items-center gap-4 shadow-2xl">
                         <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                            <ShieldCheck className="h-6 w-6" />
                         </div>
                         <div className="text-left">
                            <p className="text-[8px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">OFFICIAL HUB</p>
                            <h3 className="text-sm md:text-xl font-black text-white uppercase mt-1 leading-none">VERIFIED CONTENT</h3>
                         </div>
                      </div>
                   </div>

                   {/* 2. FLOATING LIVE STUDENTS NODE (Bottom Right - Peek) */}
                   <div className="absolute bottom-[-10px] right-[-10px] z-30">
                      <div className="bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-5xl flex flex-col items-center gap-2 border border-slate-100">
                         <div className="h-10 w-10 bg-orange-50 rounded-xl flex items-center justify-center text-primary shadow-inner">
                            <Users className="h-5 w-5" />
                         </div>
                         <div className="text-center">
                            <p className="text-xl md:text-3xl font-headline font-black text-[#0F172A] leading-none tabular-nums">
                               {stats?.totalUsers?.toLocaleString() || '15,000'}+
                            </p>
                            <p className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">LIVE STUDENTS</p>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        </div>

        {/* BOTTOM STATS STRIP (Integrated Authority) */}
        <div className="mt-20 md:mt-32 bg-[#0F172A] rounded-[2rem] md:rounded-[3.5rem] border border-white/5 shadow-5xl overflow-hidden p-6 md:p-12 relative">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12"><Trophy className="h-64 w-64" /></div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative z-10">
              <LegacyStatNode 
                label="Questions" 
                val={`${stats?.totalQuestions?.toLocaleString() || '50,000'}+`} 
                icon={<BookOpen />} 
                color="bg-blue-600" 
              />
              <LegacyStatNode 
                label="Mock Tests" 
                val={`${stats?.totalMocks || '500'}+`} 
                icon={<Zap />} 
                color="bg-emerald-600" 
              />
              <LegacyStatNode 
                label="State Rank" 
                val="94%" 
                icon={<Target />} 
                color="bg-orange-600" 
              />
              <LegacyStatNode 
                label="Accuracy" 
                val={`${stats?.averageAccuracy || '94'}%`} 
                icon={<ShieldCheck />} 
                color="bg-purple-600" 
              />
           </div>
        </div>
      </div>
    </section>
  );
}

function FeatureTag({ icon, label }: any) {
   return (
      <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-all hover:border-primary/40">
         {icon && Object.assign({}, icon, { props: { className: "h-3.5 w-3.5 text-primary" } })}
         <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
   )
}

function LegacyStatNode({ label, val, icon, color }: any) {
   return (
      <div className="flex items-center gap-4 md:gap-8 text-left group">
         <div className={cn("h-12 w-12 md:h-16 md:w-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner transition-transform group-hover:scale-110", color)}>
            {icon && Object.assign({}, icon, { props: { className: "h-6 w-6 md:h-8 md:w-8 text-white" } })}
         </div>
         <div>
            <p className="text-xl md:text-3xl font-headline font-black text-white tabular-nums leading-none tracking-tight">{val}</p>
            <p className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 tracking-widest mt-2">{label}</p>
         </div>
      </div>
   )
}
