'use client';

import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, Zap, ShieldCheck, Download, Award, BookOpen, Users, PlayCircle, Target, Sparkles, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useDoc, useFirestore, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import Image from "next/image";

/**
 * @fileOverview Redesigned Academy-Style Hero Section v102.0.
 * STYLE: High-fidelity classroom aesthetic with Punjabi banner and institutional stats.
 * FUNCTION: Includes PWA install trigger and Login Gating for all action nodes.
 */

export default function Hero() {
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // PWA Install Prompt Capture
    if (typeof window !== 'undefined' && (window as any).deferredPrompt) {
      setCanInstall(true);
    }

    const handleInstallable = () => setCanInstall(true);
    window.addEventListener('pwa-installable', handleInstallable);
    return () => window.removeEventListener('pwa-installable', handleInstallable);
  }, []);
  
  const academyImg = PlaceHolderImages.find(img => img.id === 'hero-academy');

  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats } = useDoc<any>(statsRef);

  const liveStudentCount = useMemo(() => {
    if (!mounted || !stats) return "15,000+";
    const count = stats?.totalUsers || 15000;
    if (count > 999) return `${(count / 1000).toFixed(1)}k+`;
    return count.toLocaleString();
  }, [stats, mounted]);

  const handleActionClick = (path: string) => {
    if (!user) {
      router.push(`/login?returnUrl=${encodeURIComponent(path)}`);
      return;
    }
    router.push(path);
  };

  const handleInstallApp = async () => {
    const prompt = (window as any).deferredPrompt;
    if (prompt) {
      prompt.prompt();
    }
  };

  return (
    <section className="relative pt-8 pb-16 md:pt-20 md:pb-32 bg-slate-50/30 overflow-hidden border-b border-slate-100">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
         <div className="h-full w-full bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <div className="container mx-auto px-4 relative z-20 max-w-7xl text-left">
        
        {/* 1. TOP BILINGUAL FLOATING BANNER */}
        <motion.div 
           initial={{ y: -30, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="max-w-5xl mx-auto mb-16 md:mb-24 text-center"
        >
           <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-5xl p-8 md:p-14 border border-slate-100 relative group overflow-hidden ring-8 ring-slate-50/50">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-1000" />
              <div className="flex flex-col items-center gap-4 relative z-10">
                 <div className="flex items-center gap-3 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                    <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">State Level Preparation</span>
                 </div>
                 <h2 className="text-3xl sm:text-4xl md:text-7xl font-black text-primary leading-[0.95] uppercase tracking-tighter mb-2 italic">
                    ਤਿਆਰੀ ਪੰਜਾਬ ਦੀ, ਸੁਪਨਾ ਸਰਕਾਰੀ ਅਫ਼ਸਰ ਦਾ!
                 </h2>
                 <p className="text-sm md:text-2xl font-black text-[#0F172A] uppercase tracking-[0.2em] opacity-80">
                    Prepare for Punjab, Dream of a Govt. Officer!
                 </p>
              </div>
           </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-center">
          
          {/* 2. LEFT CONTENT NODE */}
          <div className="lg:col-span-6 space-y-10 md:space-y-14">
            <div className="space-y-6 md:space-y-8">
               <div className="flex items-center gap-3">
                  <div className="h-px w-10 bg-primary" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Official Evaluation Engine</span>
               </div>
               <h1 className="text-4xl sm:text-6xl lg:text-[5.5rem] font-headline font-black leading-[0.9] text-[#000000] uppercase tracking-tighter">
                  CRACK PSSSB, <br />
                  <span className="text-primary italic">POLICE & PATWARI</span>
               </h1>

               <p className="text-base md:text-2xl text-slate-500 font-medium max-w-xl leading-relaxed antialiased">
                  Master your preparation with official pattern mocks, bilingual tutors, and Punjab's largest student merit hub.
               </p>
            </div>

            <div className="flex flex-col sm:row items-center gap-5">
              <div className="flex flex-wrap gap-4 w-full justify-start">
                <Button 
                  onClick={() => handleActionClick('/mocks')}
                  className="bg-primary hover:bg-orange-600 text-white px-10 md:px-14 rounded-2xl font-black uppercase tracking-[0.1em] text-[11px] md:text-sm h-16 md:h-20 shadow-4xl transition-all active:scale-95 border-none cursor-pointer group"
                >
                   START FREE MOCK <Zap className="ml-3 h-4 w-4 fill-current group-hover:scale-125 transition-transform" />
                </Button>

                <Button 
                  onClick={() => handleActionClick('/pass')}
                  className="bg-[#1E5EFF] hover:bg-blue-700 text-white px-10 md:px-14 rounded-2xl font-black uppercase tracking-[0.1em] text-[11px] md:text-sm h-16 md:h-20 shadow-4xl transition-all active:scale-95 border-none cursor-pointer"
                >
                   GET ELITE PASS
                </Button>
              </div>

              {mounted && canInstall && (
                <div className="w-full pt-4">
                  <Button 
                    onClick={handleInstallApp}
                    className="w-full h-16 md:h-20 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-3xl transition-all active:scale-95 border-none animate-in fade-in zoom-in-95 duration-500 flex items-center justify-center gap-4 group"
                  >
                     <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-white/20 flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
                        <Download className="h-5 w-5 md:h-6 md:w-6" />
                     </div>
                     <div className="text-left">
                        <p className="text-[9px] md:text-[10px] font-black uppercase opacity-60 leading-none">HIGH SPEED ACCESS</p>
                        <p className="text-lg md:text-2xl font-black uppercase tracking-tight leading-none mt-1">INSTALL MOBILE APP</p>
                     </div>
                  </Button>
                </div>
              )}
            </div>

            {/* 3. TRUST STATS ROW */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-12 pt-10 border-t border-slate-100">
               <StatItem icon={<Users className="text-primary" />} val={liveStudentCount} label="SELECTIONS" />
               <StatItem icon={<ShieldCheck className="text-emerald-500" />} val="LATEST 2026" label="PATTERN" />
               <StatItem icon={<Award className="text-amber-500" />} val="OFFICIAL" label="HUBS" />
               <StatItem icon={<PlayCircle className="text-blue-500" />} val="DAILY LIVE" label="QUIZZES" />
            </div>
          </div>

          {/* 4. RIGHT IMAGE NODE (ACADEMY THEME) */}
          <div className="lg:col-span-6 relative h-full">
            <div className="relative aspect-square sm:aspect-[4/3] w-full max-w-[650px] mx-auto lg:ml-auto">
               <div className="absolute -inset-10 bg-primary/5 blur-[120px] rounded-full opacity-40" />
               
               <div className="relative h-full w-full rounded-[3rem] md:rounded-[4.5rem] overflow-hidden border-[10px] md:border-[16px] border-white shadow-6xl bg-slate-100 group">
                  {mounted && academyImg && (
                    <Image 
                      src={academyImg.imageUrl} 
                      alt="Cracklix Preparation Hub" 
                      fill
                      priority
                      className="object-cover transition-transform duration-[2.5s] group-hover:scale-105"
                      data-ai-hint={academyImg.imageHint}
                      sizes="(max-width: 768px) 100vw, 650px"
                    />
                  )}
                  
                  {/* Floating Live Badge */}
                  <div className="absolute top-8 right-8">
                     <div className="bg-[#0B1528] px-6 py-4 rounded-[1.5rem] shadow-5xl border border-white/10 flex flex-col items-center gap-1.5 animate-bounce">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">MOCK TESTS</span>
                        <Badge className="bg-rose-500 text-white border-none text-[9px] font-black uppercase px-3 py-0.5 rounded shadow-lg shadow-rose-500/30">LIVE NOW</Badge>
                     </div>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8">
                     <div className="bg-white/95 backdrop-blur-xl px-6 py-5 rounded-[2rem] border border-slate-100 shadow-5xl inline-flex items-center gap-5 transition-all hover:translate-y-[-4px]">
                        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
                           <ShieldCheck className="h-7 w-7 text-white" />
                        </div>
                        <div className="text-left">
                           <p className="text-[11px] font-black text-[#0F172A] leading-none mb-1 uppercase tracking-tight">Official Content Hub</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Management Verified</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Achievement Bubble */}
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 transition={{ delay: 1, duration: 0.5 }}
                 className="absolute -bottom-6 -left-6 bg-white p-5 rounded-[2rem] shadow-4xl border border-slate-50 flex items-center gap-4"
               >
                  <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-inner">
                     <Star className="h-5 w-5 fill-current" />
                  </div>
                  <div className="text-left">
                     <p className="text-[14px] font-black text-[#0F172A] leading-none">4.9/5</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Student Rating</p>
                  </div>
               </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function StatItem({ icon, val, label }: { icon: React.ReactNode, val: string, label: string }) {
  return (
    <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3 group cursor-default">
       <div className="h-11 w-11 md:h-14 md:w-14 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner mb-1 group-hover:bg-white group-hover:shadow-xl transition-all duration-300">
          {icon}
       </div>
       <div className="space-y-0.5">
          <p className="text-base md:text-2xl font-black text-[#0F172A] leading-none uppercase tracking-tight">{val}</p>
          <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5">{label}</p>
       </div>
    </div>
  );
}
