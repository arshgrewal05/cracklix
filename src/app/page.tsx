
'use client';

import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import PopularExams from "@/components/home/PopularExams";
import LatestMocks from "@/components/home/LatestMocks";
import Features from "@/components/home/Features";
import AppPreview from "@/components/home/AppPreview";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />
      
      <main>
        {/* Hero Section with dark navy gradient */}
        <Hero />
        
        {/* Statistics Floating Row */}
        <Stats />
        
        {/* Popular Exams Grid */}
        <PopularExams />
        
        {/* Latest Mock Tests */}
        <LatestMocks />
        
        {/* Feature Highlights with Dark Background */}
        <Features />
        
        {/* Mobile App Promotion Section */}
        <AppPreview />
      </main>
      
      {/* Comprehensive Footer */}
      <Footer />
    </div>
  );
}
