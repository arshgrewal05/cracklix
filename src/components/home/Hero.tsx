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
 * @fileOverview Restored Hero Hub v2.0.
 * Features: Two-column discovery layout, quick-access feature cards, and bottom stats grid.
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
        icon: <Zap className="h-5 v-5 text-blue-600" />,
        val: formatNumber(stats?.totalQuestions, "50k+"),
        label: "Questions"
      },
      {
        id: "m",
        icon: <ClipboardList className="h-5 v-5 text-indigo-600" />,
        val: formatNumber(stats?.totalMocks, "500+"),
        label: "Mock Tests"
      },
      {
        id: "e",
        icon: <ShieldCheck className="h-5 v-5 text-emerald-600" />,
        val: formatNumber(stats?.totalBoards, "50+"),
        label: "Exams"
      },
      {
        id: "u",
        icon: <Users className="h-5 v-5 text-orange-500" />,
        val: formatNumber(stats?.totalUsers, "15k+"),
        label: "Aspirants"
      }
    ];
  }, [stats]);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-blue-50 py-12 md:py-24 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border shadow-sm mb-6">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-slate-700">
                10,000+ Aspirants Trust Cracklix
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 leading-tight uppercase">
              Crack Punjab <br/>
              <span className="block text-blue-600">
                Government Exams
              </span>
              With Confidence
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl font-medium">
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

            <div className="grid grid-cols-2 gap-4 mt-8">
              <Card className="p-4 rounded-3xl border bg-white shadow-sm">
                <ClipboardList className="h-6 w-6 text-blue-600 mb-2" />
                <p className="font-bold">Mock Tests</p>
              </Card>

              <Card className="p-4 rounded-3xl border bg-white shadow-sm">
                <BookOpen className="h-6 w-6 text-indigo-600 mb-2" />
                <p className="font-bold">Study Material</p>
              </Card>

              <Card className="p-4 rounded-3xl border bg-white shadow-sm">
                <FileText className="h-6 w-6 text-emerald-600 mb-2" />
                <p className="font-bold">Previous Papers</p>
              </Card>

              <Card className="p-4 rounded-3xl border bg-white shadow-sm">
                <BarChart3 className="h-6 w-6 text-orange-500 mb-2" />
                <p className="font-bold">Performance Analytics</p>
              </Card>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <Button
                asChild
                className="h-12 md:h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                <Link href="/mocks">
                  Start Free Mock Test
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-12 md:h-14 px-8 rounded-2xl border-2 font-bold"
              >
                <Link href="/exams">
                  Browse Exams
                </Link>
              </Button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative flex justify-center">
            <motion.img
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              src="/images/hero-student.png"
              alt="Cracklix Student"
              className="w-full max-w-md object-contain"
            />
          </div>
        </div>

        {/* BOTTOM STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {liveStats.map((stat) => (
            <Card
              key={stat.id}
              className="p-6 rounded-3xl bg-white border shadow-sm group hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  {stat.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-2xl font-black text-slate-900 tabular-nums">
                    {stat.val}
                  </p>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">
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