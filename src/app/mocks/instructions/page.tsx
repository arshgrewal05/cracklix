
"use client"

import React, { Suspense } from "react"
import InstructionsClient from "@/components/mocks/InstructionsClient"
import { Loader2 } from "lucide-react"

/**
 * @fileOverview Official Mock Instructions Hub.
 * Optimized for Static Export: Uses query params (?id=...) to bypass path pre-rendering limitations.
 */

export default function MockInstructionsPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-primary" /></div>}>
      <InstructionsClient mockId={""} />
    </Suspense>
  )
}
