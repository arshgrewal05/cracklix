
"use client"

import React, { useMemo } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ContinueLearning from "@/components/home/ContinueLearning";
import TrendingExams from "@/components/home/TrendingExams";
import LatestMocks from "@/components/home/LatestMocks";
import Features from "@/components/home/Features";
import AppPreview from "@/components/home/AppPreview";
import MeetFounder from "@/components/home/MeetFounder";
import Footer from "@/components/layout/Footer";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { BookOpen, Zap, Users, Target, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/**
 * @fileOverview Optimized Institutional Landing Hub v57.1.
 * UPDATED: Added safety check to prevent blank page on slow stats load.
 */

export default function HomePage() {
  const db = useFirestore();

  // STABILIZED DATA LISTENERS
  const statsRef = useMemo(() => (db ? doc(db, "settings", "stats") : null), [db]);
  const { data: stats, loading: statsLoading } = useDoc<any>(statsRef);

  const liveStats = useMemo(() => {
    // 1. Audit Registry Values (Absolute Reality from stats node)
    const qCount = stats?.totalQuestions || 0;
    const mCount = stats?.totalMocks || 0;
    const uCount = stats?.totalUsers || 0;
    const avgAcc = stats?.averageAccuracy || 0;

    // 2. High-Fidelity Formatting
    const formatNumber = (num: number) => {
       if (num >= 1000) return (num / 1000).toFixed(1) + 'k+';
       return num.toString();
    }

    return {
      mcqs: formatNumber(qCount),
      mocks: mCount.toLocaleString(),
      users: uCount.toLocaleString(),
      accuracy: `${avgAcc}%`
    };
  }, [stats]);

  return (
    <main className="min-h-screen bg-white font-body pb-safe overflow-x-hidden text-left">
      <Navbar />
      <Hero />

      {/* Trust Stats Bar - High-Fidelity Boxed Layout */}
      <section className="bg-white py-12 md:py-24 border-b border-slate-50 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
         <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
               <TrustCard 
                  loading={statsLoading}
                  icon={<BookOpen className="text-primary h-5 w-5 md:h-8 md:w-8" />} 
                  label="MCQ BANK" 
                  val={liveStats.mcqs} 
               />
               <TrustCard 
                  loading={statsLoading}
                  icon={<Zap className="text-blue-500 h-5 w-5 md:h-8 md:w-8" />} 
                  label="MOCKS LIVE" 
                  val={liveStats.mocks} 
               />
               <TrustCard 
                  loading={statsLoading}
                  icon={<Users className="text-emerald-500 h-5 w-5 md:h-8 md:w-8" />} 
                  label="ASPIRANTS" 
                  val={liveStats.users} 
                  isLive
               />
               <TrustCard 
                  loading={statsLoading}
                  icon={<Target className="text-amber-500 h-5 w-5 md:h-8 md:w-8" />} 
                  label="AVG ACCURACY" 
                  val={liveStats.accuracy} 
               />
            </div>
         </div>
      </section>

      {/* Main Persistent Discovery Hub */}
      <div className="container mx-auto px-4 py-12 md:py-24 max-w-7xl space-y-16 md:space-y-32">
         <ContinueLearning />
         <FeaturedCategories />
         <TrendingExams />
         <LatestMocks />
      </div>

      <AppPreview />
      <Features />
      
      <MeetFounder />

      <Footer />
    </main>
  );
}

function TrustCard({ icon, label, val, loading, isLive }: any) {
   return (
      <div className="bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 group relative flex flex-col items-center text-center space-y-4">
         {isLive && (
            <div className="absolute top-6 right-8 flex items-center gap-1.5">
               <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest">Live</span>
            </div>
         )}
         
         <div className="h-14 w-14 md:h-18 md:w-18 rounded-[1.2rem] md:rounded-[1.5rem] bg-slate-50 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
            {icon}
         </div>
         
         <div className="space-y-1">
            {loading ? (
               <Skeleton className="h-8 w-24 bg-slate-100 mx-auto" />
            ) : (
               <p className="text-3xl md:text-5xl font-headline font-black text-[#0F172A] leading-none tracking-tighter tabular-nums">{val}</p>
            )}
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">{label}</p>
         </div>
      </div>
   )
}
