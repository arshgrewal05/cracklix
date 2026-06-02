"use client"

import { useState } from "react"
import { SAMPLE_MOCK } from "@/lib/mock-data"
import Timer from "@/components/mocks/Timer"
import QuestionPalette from "@/components/mocks/QuestionPalette"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, Flag, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MockAttempt() {
  const router = useRouter()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [flagged, setFlagged] = useState<number[]>([])
  
  const question = SAMPLE_MOCK.questions[currentIdx]

  const handleNext = () => {
    if (currentIdx < SAMPLE_MOCK.questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
    }
  }

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1)
    }
  }

  const toggleFlag = () => {
    setFlagged(prev => prev.includes(currentIdx) 
      ? prev.filter(i => i !== currentIdx)
      : [...prev, currentIdx]
    )
  }

  const submitMock = () => {
    // Navigate to a result page (mock for now)
    router.push('/results/sample-result')
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="h-16 border-b flex items-center justify-between px-6 bg-card">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h1 className="font-headline font-bold text-lg hidden sm:block">
            {SAMPLE_MOCK.title}
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <Timer initialMinutes={SAMPLE_MOCK.durationInMinutes} onTimeUp={submitMock} />
          <Button variant="destructive" onClick={submitMock}>Submit Exam</Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Side: Question Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                Question {currentIdx + 1} of {SAMPLE_MOCK.questions.length}
              </span>
              <span className="text-xs text-muted-foreground">Subject: {question.subject}</span>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-medium leading-relaxed">
                {question.text}
              </h2>

              <RadioGroup 
                value={answers[currentIdx] || ""} 
                onValueChange={(val) => setAnswers(prev => ({ ...prev, [currentIdx]: val }))}
                className="space-y-4"
              >
                {question.options.map((opt, i) => (
                  <div key={i} className={`flex items-center space-x-3 p-4 border rounded-xl transition-colors cursor-pointer hover:bg-card ${answers[currentIdx] === opt ? 'border-primary bg-primary/5' : 'border-border'}`}>
                    <RadioGroupItem value={opt} id={`opt-${i}`} className="text-primary border-primary" />
                    <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer text-base">{opt}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-12 border-t">
              <div className="flex gap-4">
                <Button variant="outline" size="lg" onClick={handlePrev} disabled={currentIdx === 0}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button variant="outline" size="lg" onClick={handleNext} disabled={currentIdx === SAMPLE_MOCK.questions.length - 1}>
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" className={flagged.includes(currentIdx) ? "text-yellow-500 hover:text-yellow-600" : ""} onClick={toggleFlag}>
                <Flag className={`mr-2 h-4 w-4 ${flagged.includes(currentIdx) ? "fill-current" : ""}`} />
                {flagged.includes(currentIdx) ? "Flagged for Review" : "Flag for Review"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side: Palette/Meta */}
        <aside className="w-80 border-l bg-card/50 overflow-y-auto hidden lg:block p-6">
          <QuestionPalette 
            totalQuestions={SAMPLE_MOCK.questions.length}
            currentIndex={currentIdx}
            answeredIndices={Object.keys(answers).map(Number)}
            flaggedIndices={flagged}
            onSelect={setCurrentIdx}
          />
          
          <div className="mt-8 p-4 border rounded-xl bg-card">
            <h4 className="text-xs font-bold uppercase text-muted-foreground mb-4">Instructions</h4>
            <ul className="text-xs space-y-2 text-muted-foreground list-disc pl-4">
              <li>Each question carries equal marks.</li>
              <li>There is no negative marking in this mock.</li>
              <li>You can navigate back and forth between questions.</li>
              <li>Click Submit when you have completed all sections.</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  )
}