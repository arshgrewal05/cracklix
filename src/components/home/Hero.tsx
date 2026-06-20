'use client';

import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  ShieldCheck,
  Users,
  Zap,
  ChevronRight,
  BookOpen,
  FileText,
  BarChart3,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";

/**
 * @fileOverview Official Restored Hero Hub.
 * Features: Feature Matrix, Split-Screen Layout, and Integrated Live Stats.
 */

export default function Hero() {
  const db = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statsRef = useMemo(
    () => (db ? doc(db, "settings", "stats") : null),
    [db]
  );

  const { data: stats } = useDoc<any>(statsRef);

  const liveStats = useMemo(() => {
    const formatNumber = (num: number, fallback: string) => {
      if (!num) return fallback;
      if (num >= 1000) return Math.floor(num / 1000) + "k+";
      return num + "+";
    };

    return [
      {
        id: "q",
        icon: <Zap className="h-5 w-5 text-blue-600" />,
        val: formatNumber(stats?.totalQuestions, "50k+"),
        label: "Questions"
      },
      {
        id: "m",
        icon: <ClipboardList className="h-5 w-5 text-indigo-600" />,
        val: formatNumber(stats?.totalMocks, "500+"),
        label: "Mock Tests"
      },
      {
        id: "e",
        icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
        val: formatNumber(stats?.totalBoards, "50+"),
        label: "Exams"
      },
      {
        id: "u",
        icon: <Users className="h-5 w-5 text-orange-500" />,
        val: formatNumber(stats?.totalUsers, "15k+"),
        label: "Aspirants"
      }
    ];
  }, [stats]);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-blue-50 py-12 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT: Content Hub */}
          <div className="text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border shadow-sm mb-6"
            >
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-slate-700">
                10,000+ Aspirants Trust Cracklix
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-tight">
              Crack Punjab
              <span className="block text-blue-600">
                Government Exams
              </span>
              With Confidence
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl">
              Practice with bilingual mock tests, previous papers and
              exam-focused preparation for PSSSB, Punjab Police,
              PSTET, PSPCL and more.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              {["PSSSB", "Punjab Police", "PSTET", "PSPCL", "PPSC"].map(
                (item) => (
                  <span
                    key={item}
                    className="px-4 py-2 rounded-full bg-white border text-sm font-medium text-slate-700"
                  >
                    {item}
                  </span>
                )
              )}
            </div>

            {/* Feature Matrix */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <FeatureCard icon={<ClipboardList className="text-blue-600" />} label="Mock Tests" />
              <FeatureCard icon={<BookOpen className="text-indigo-600" />} label="Study Material" />
              <FeatureCard icon={<FileText className="text-emerald-600" />} label="Previous Papers" />
              <FeatureCard icon={<BarChart3 className="text-orange-500" />} label="Performance Analytics" />
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <Button
                asChild
                className="h-12 md:h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 border-none text-white font-bold"
              >
                <Link href="/mocks">
                  Start Free Mock Test
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-12 md:h-14 px-8 rounded-2xl border-slate-200 bg-white font-bold text-slate-700"
              >
                <Link href="/exams">
                  Browse Exams
                </Link>
              </Button>
            </div>
          </div>

          {/* RIGHT: Illustration */}
          <div className="relative flex justify-center lg:justify-end">
            <motion.img
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              src="/images/hero-student.png"
              alt="Cracklix Student"
              className="w-full max-w-md drop-shadow-2xl"
            />
          </div>
        </div>

        {/* STATS: Bottom Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 text-left">
          {liveStats.map((stat) => (
            <Card
              key={stat.id}
              className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm group hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 leading-none">
                    {stat.val}
                  </p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {stat.label}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}

function FeatureCard({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <Card className="p-4 rounded-3xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors">
      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center mb-3">
        {React.cloneElement(icon as React.ReactElement, { className: "h-6 w-6" })}
      </div>
      <p className="font-bold text-slate-900 text-sm">{label}</p>
    </Card>
  );
}
