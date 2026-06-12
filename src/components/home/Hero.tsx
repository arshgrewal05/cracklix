'use client';

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Zap, 
  BookOpen, 
  ArrowRight, 
  Trophy, 
  Target, 
  Activity, 
  ShieldCheck,
  BarChart3,
  Search,
  LayoutGrid
} from "lucide-react";
import { useUser } from "@/firebase";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Official wireframe-aligned Hero Hub v3.0.
 * FIXED: Added missing 'cn' utility import to resolve ReferenceError.
 * MATCHED: Tagline -> Headline -> Vertical List -> CTAs -> Dashboard Preview.
 */
export default function Hero() {
  const router = useRouter();
  const { user } = useUser();

  const handleAction = (path: string) => {
    if (!user) {
      router.push(`/login?returnUrl=${encodeURIComponent(path)}`);
      return;
    }
    router.push(path);
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-24 md:pb-32 bg-white overflow-hidden text-left">
      <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-center">
          
          {/* LEFT: CONTENT HUB */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-3 bg-orange-50 border border-orange-100 px-5 py-2 rounded-full text-[10px] md:text-xs font-black tracking-tight text-primary shadow-sm"
            >
              <Trophy className="h-4 w-4" />
              🏆 Punjab&apos;s Smartest Exam Preparation Platform
            </motion.div>

            <div className="space-y-6">
               <h1 className="text-4xl md:text-7xl font-black leading-[0.95] tracking-tighter uppercase text-[#0F172A]">
                 ਤਿਆਰੀ ਪੰਜਾਬ ਦੀ, <br />
                 <span className="text-primary">ਸੁਪਨਾ ਸਰਕਾਰੀ ਅਫ਼ਸਰ ਦਾ!</span>
               </h1>
               <p className="text-lg md:text-2xl font-bold text-slate-400 uppercase tracking-tight">
                  Prepare for Punjab, Dream of a Govt. Officer!
               </p>
            </div>

            <div className="space-y-4 pt-2">
               <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Prepare for:</p>
               <div className="flex flex-wrap items-center gap-x-3 md:gap-x-5 gap-y-2 text-sm md:text-lg font-black text-[#0F172A] uppercase">
                  <span>PSSSB</span>
                  <span className="text-slate-200">•</span>
                  <span>Punjab Police</span>
                  <span className="text-slate-200">•</span>
                  <span>PPSC</span>
                  <span className="text-slate-200">•</span>
                  <span>PSTET</span>
                  <span className="text-slate-200">•</span>
                  <span>PSPCL</span>
                  <span className="text-slate-200">•</span>
                  <span>High Court</span>
               </div>
            </div>

            <p className="text-base md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
               Master Punjab Government Exams with Full-Length Mocks, PYQs, Current Affairs, Analytics & Detailed Solutions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={() => handleAction('/mocks')}
                className="bg-primary hover:bg-orange-600 transition-all font-black px-10 h-16 rounded-2xl text-white flex items-center justify-center gap-3 shadow-2xl uppercase text-[11px] tracking-[0.2em] border-none"
              >
                🚀 Start Free Mock
              </Button>
              <Button 
                onClick={() => handleAction('/exams')}
                className="border-2 border-slate-100 hover:border-primary/20 bg-white text-[#0F172A] font-black px-10 h-16 rounded-2xl transition-all uppercase text-[11px] tracking-[0.2em] shadow-xl gap-3"
              >
                📚 Explore Exams
              </Button>
            </div>
          </div>

          {/* RIGHT: DASHBOARD PREVIEW */}
          <div className="lg:col-span-5 relative">
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
             >
                <Card className="border-none shadow-5xl rounded-[3rem] bg-[#0F172A] text-white p-8 md:p-12 space-y-10 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12 group-hover:scale-110 transition-transform"><Activity className="h-64 w-64" /></div>
                   
                   <div className="relative z-10 space-y-8">
                      <div className="flex items-center justify-between border-b border-white/10 pb-6">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">📱 Dashboard Preview</p>
                            <h3 className="text-xl md:text-2xl font-black uppercase">PSSSB Excise Inspector</h3>
                         </div>
                         <ShieldCheck className="h-8 w-8 text-emerald-500" />
                      </div>

                      <div className="space-y-6">
                         <StatRow label="Readiness Score" value="82%" color="bg-primary" />
                         <StatRow label="Accuracy" value="88%" color="bg-emerald-500" />
                         
                         <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Mock Rank</p>
                               <p className="text-xl font-black text-white">#245</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Attempts</p>
                               <p className="text-xl font-black text-white">156</p>
                            </div>
                         </div>
                      </div>

                      <div className="pt-4">
                         <Button asChild variant="ghost" className="w-full h-14 rounded-xl bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-widest border border-white/5">
                            <Link href="/analytics">View Full Analytics <ArrowRight className="ml-2 h-4 w-4 text-primary" /></Link>
                         </Button>
                      </div>
                   </div>
                </Card>
             </motion.div>

             {/* Decorative Background Element */}
             <div className="absolute -inset-4 border-2 border-dashed border-slate-100 rounded-[4rem] -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
}

function StatRow({ label, value, color }: { label: string, value: string, color: string }) {
   return (
      <div className="space-y-2">
         <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            <span className="text-sm font-black text-white">{value}</span>
         </div>
         <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full transition-all duration-1000", color)} style={{ width: value }} />
         </div>
      </div>
   )
}
