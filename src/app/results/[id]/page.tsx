"use client"

import { useState } from "react"
import Navbar from "@/components/layout/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, BrainCircuit, ChevronRight, HelpCircle } from "lucide-react"
import { MOCK_QUESTIONS } from "@/lib/mock-data"
import { rationalizeMockQuestion, RationalizeMockQuestionOutput } from "@/ai/flows/rationalize-mock-question"

export default function ResultPage() {
  const [rationalizing, setRationalizing] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, RationalizeMockQuestionOutput>>({})

  const handleRationalize = async (qId: string, qText: string, options: string[], correct: string) => {
    setRationalizing(qId)
    try {
      const result = await rationalizeMockQuestion({
        questionText: qText,
        options,
        correctAnswer: correct,
        userAnswer: "Unknown" // In a real app, this would be the actual user answer
      })
      setResults(prev => ({ ...prev, [qId]: result }))
    } catch (error) {
      console.error("Rationalization failed", error)
    } finally {
      setRationalizing(null)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Summary Card */}
          <Card className="lg:col-span-2 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Performance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                <Stat icon={<CheckCircle2 className="text-green-500" />} label="Correct" value="12" />
                <Stat icon={<XCircle className="text-destructive" />} label="Incorrect" value="3" />
                <Stat icon={<HelpCircle className="text-muted-foreground" />} label="Skipped" value="5" />
                <Stat icon={<BrainCircuit className="text-secondary" />} label="Accuracy" value="80%" />
              </div>
              <div className="mt-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-primary font-bold">Excellent</span>
                </div>
                <Progress value={80} className="h-3" />
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Expert Advice</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p className="text-muted-foreground">You excelled in <span className="text-primary font-bold">Biology</span>, but need focus on <span className="text-secondary font-bold">Chemical Equations</span>.</p>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>Review Thermodynamics concepts.</span>
                </li>
                <li className="flex gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  <span>Practice 20 more hard questions this week.</span>
                </li>
              </ul>
              <Button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-bold">
                Retake Mock
              </Button>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-headline font-bold mb-6">Review Questions</h2>
        <div className="space-y-6">
          {MOCK_QUESTIONS.map((q, idx) => (
            <Card key={q.id} className="overflow-hidden border-border/50">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2 items-center">
                    <Badge variant="outline" className="rounded-md">Q{idx + 1}</Badge>
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Correct</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{q.subject} • {q.difficulty}</span>
                </div>

                <p className="text-lg font-medium mb-6">{q.text}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {q.options.map((opt, i) => (
                    <div key={i} className={`p-3 rounded-lg border text-sm ${opt === q.correctAnswer ? 'border-green-500 bg-green-500/10' : 'border-border'}`}>
                      {opt}
                    </div>
                  ))}
                </div>

                {results[q.id] ? (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-4">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                      <BrainCircuit className="h-5 w-5" />
                      <h4 className="font-headline font-bold">AI Rationalization</h4>
                    </div>
                    <p className="text-sm leading-relaxed mb-6 whitespace-pre-line text-foreground/90">
                      {results[q.id].rationalization}
                    </p>
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold uppercase text-muted-foreground">Key Learnings</h5>
                      <div className="flex flex-wrap gap-2">
                        {results[q.id].keyLearningPoints.map((point, pi) => (
                          <Badge key={pi} variant="secondary" className="bg-secondary/20 hover:bg-secondary/30 text-secondary border-none">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="ghost" 
                    className="text-primary hover:text-primary hover:bg-primary/10 w-full justify-between"
                    onClick={() => handleRationalize(q.id, q.text, q.options, q.correctAnswer)}
                    disabled={rationalizing === q.id}
                  >
                    <span className="flex items-center gap-2">
                      <BrainCircuit className="h-4 w-4" />
                      {rationalizing === q.id ? "Analyzing logical steps..." : "Get AI Logic Explanation"}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="text-2xl font-headline font-bold">{value}</p>
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  )
}