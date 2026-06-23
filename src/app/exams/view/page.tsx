
"use client"

import React, { Suspense } from "react"
import ExamHubClient from "@/components/exams/ExamHubClient"
import { Loader2 } from "lucide-react"

/**
 * @fileOverview Universal Exam Hub Viewer.
 * Optimized for Static Export: Uses query params (?id=...) to bypass path pre-rendering limitations.
 */

export default function ExamViewPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-primary" /></div>}>
      <ExamHubClient />
    </Suspense>
  )
}
