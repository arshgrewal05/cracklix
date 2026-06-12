
"use client"

import React, { useMemo, useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import ContinueLearning from "@/components/home/ContinueLearning";
import TrendingExams from "@/components/home/TrendingExams";
import LatestMocks from "@/components/home/LatestMocks";
import Features from "@/components/home/Features";
import StatsBar from "@/components/home/StatsBar";
import AppPreview from "@/components/home/AppPreview";
import MeetFounder from "@/components/home/MeetFounder";
import Footer from "@/components/layout/Footer";

/**
 * @fileOverview Official Home Hub v100.0.
 * UPDATED: Optimized Sectional Hierarchy to match wireframe.
 * Hero -> Trending -> Stats -> Why Cracklix -> Anchor Zone (Continue Learning/Categories).
 */

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-white font-body pb-safe overflow-x-hidden text-left">
      <Navbar />
      
      {/* 1. PRIMARY HERO HUB */}
      <Hero />

      {/* 2. TRENDING EXAMS ROW */}
      <TrendingExams />

      {/* 3. LIVE PLATFORM STATS */}
      <StatsBar />

      {/* 4. WHY CRACKLIX (Features) */}
      <Features />

      <div className="container mx-auto px-4 py-12 md:py-24 max-w-7xl space-y-16 md:space-y-32">
         {/* --- ANCHOR ZONE: NO CHANGE BELOW THIS --- */}
         <ContinueLearning />
         <FeaturedCategories />
         
         <LatestMocks />
      </div>

      <AppPreview />
      <MeetFounder />
      <Footer />
    </main>
  );
}
