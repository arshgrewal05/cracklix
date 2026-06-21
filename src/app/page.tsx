import React from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import GlobalSearch from "@/components/home/GlobalSearch";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import PopularExams from "@/components/home/PopularExams";
import LatestMocks from "@/components/home/LatestMocks";
import ContinueLearning from "@/components/home/ContinueLearning";
import CurrentAffairsPreview from "@/components/home/CurrentAffairsPreview";
import MeritPreview from "@/components/home/MeritPreview";
import AppPreview from "@/components/home/AppPreview";
import MeetFounder from "@/components/home/MeetFounder";
import Footer from "@/components/layout/Footer";

/**
 * @fileOverview Official Home Page v182.1.
 * UPDATED: Simplified section references.
 */

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white font-body pb-safe text-left">
      <Navbar />
      
      {/* 1. Hero Section */}
      <Hero />

      {/* 1.5 Global Search */}
      <div className="relative z-40 py-8 md:py-12 bg-white">
        <GlobalSearch />
      </div>

      {/* 2. Exam Categories */}
      <FeaturedCategories />

      {/* 3. Popular Exams */}
      <PopularExams />

      {/* 4. Latest Mock Tests */}
      <LatestMocks />

      {/* 5. Personal Progress */}
      <ContinueLearning />

      {/* 6. Knowledge Hub */}
      <CurrentAffairsPreview />

      {/* 7. Merit Rankings */}
      <MeritPreview />

      {/* 8. Mobile App */}
      <AppPreview />

      {/* 9. Leadership Section */}
      <MeetFounder />
      
      <Footer />
    </main>
  );
}
