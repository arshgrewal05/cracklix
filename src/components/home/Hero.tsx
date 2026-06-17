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
import Image from "next/image";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Official Hero Hub v95.0.
 * RESTORED: High-Fidelity Original Layout with 4-Card Feature Grid.
 * OPTIMIZED: Applied 'sizes' to student image to resolve Next.js warnings.
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

          {/* LEFT CONTENT */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border shadow-sm mb-6">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-slate-700">
                10,000+ Aspirants Trust Cracklix
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-tight">
              Crack Punjab
              <span className="block text-blue-600">
                Government Exams
              </span>
              With Confidence
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Practice with bilingual mock tests, previous papers and
              exam-focused preparation for PSSSB, Punjab Police,
              PSTET, PSPCL and more.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              {["PSSSB", "Punjab Police", "PSTET", "PSPCL", "PPSC"].map(
                (item) => (
                  <span
                    key={item}
                    className="px-4 py-2 rounded-full bg-white border text-[11px] font-bold uppercase tracking-tight text-slate-700"
                  >
                    {item}
                  </span>
                )
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <FeatureCard icon={<ClipboardList className="h-6 w-6 text-blue-600" />} label="Mock Tests" />
              <FeatureCard icon={<BookOpen className="h-6 w-6 text-indigo-600" />} label="Study Material" />
              <FeatureCard icon={<FileText className="h-6 w-6 text-emerald-600" />} label="Previous Papers" />
              <FeatureCard icon={<BarChart3 className="h-6 w-6 text-orange-500" />} label="Performance Analytics" />
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
              <Button
                asChild
                className="h-14 md:h-16 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold border-none shadow-2xl active:scale-95 transition-all text-white"
              >
                <Link href="/mocks">
                  Start Free Mock Test
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-14 md:h-16 px-10 rounded-2xl font-bold border-2 border-slate-200 active:scale-95 transition-all bg-white"
              >
                <Link href="/exams">
                  Browse Exams
                </Link>
              </Button>
            </div>
          </div>

          {/* RIGHT ILLUSTRATION */}
          <div className="relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative w-full max-w-md aspect-square"
            >
              <Image 
                src="/images/hero-student.png" 
                alt="Cracklix Student"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </motion.div>
          </div>
        </div>

        {/* STATS HUB */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 md:mt-24">
          {liveStats.map((stat) => (
            <Card
              key={stat.id}
              className="p-6 md:p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 text-left group hover:translate-y-[-4px] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-black text-slate-900 tabular-nums leading-none">
                    {stat.val}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">
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
    <Card className="p-5 rounded-[2rem] border bg-white shadow-sm border-slate-100 group hover:shadow-lg transition-all text-left">
      <div className="mb-3 transform group-hover:scale-110 transition-transform">{icon}</div>
      <p className="font-bold text-[#0F172A] text-sm md:text-base leading-tight">{label}</p>
    </Card>
  )
}
