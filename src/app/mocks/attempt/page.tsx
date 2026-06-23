
"use client"

import React, { Suspense } from "react"
import AttemptClient from "@/components/mocks/AttemptClient"
import { Loader2 } from "lucide-react"

/**
 * @fileOverview Official Mock Attempt Hub.
 * Optimized for Static Export: Uses query params (?id=...) to bypass path pre-rendering limitations.
 */

export default function MockAttemptPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#0B1528]"><Loader2 className="animate-spin text-primary" /></div>}>
      <AttemptClient />
    </Suspense>
  )
}
