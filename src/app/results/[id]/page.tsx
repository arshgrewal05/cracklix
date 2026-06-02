"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/layout/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, BrainCircuit, ChevronRight, HelpCircle, Trophy, Timer, Target } from "lucide-react"
import { MOCK_QUESTIONS } from "@/lib/mock-data"
import { rationalizeMockQuestion, RationalizeMockQuestionOutput } from "@/ai/flows/rationalize-mock-question"
import Link from "next/link"

export default function ResultPage() {
  const [rationalizing, setRationalizing] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, RationalizeMockQuestionOutput>>({})
  const [sessionData, setSessionData] = useState<any>(null)

  useEffect(() => {
    const saved = localStorage.getItem(`last_result_mock-punjab-1`)
    if (saved) {
      setSessionData(JSON.parse(saved))
    }
  }, [])

  const handleRationalize = async (qId: string, qText: string, options: string[], correct: string, userAns: string) => {
    setRationalizing(qId)
    try {
      const result = await rationalizeMockQuestion({
        questionText: qText,
        options,
        correctAnswer: correct,
        userAnswer: userAns || "No answer provided"
      })
      setResults(prev => ({ ...prev, [qId]: result }))
    } catch (error) {
      console.error("Rationalization failed", error)
    } finally {
      setRationalizing(null)
    }
  }

  if (!sessionData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
          <Trophy className="h-16 w-16 text-muted-foreground opacity-20" />
          <h1 className="text-2xl font-headline font-bold">No recent results found</h1>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/mocks">Browse Mock Tests</Link>
          </Button>
        </main>
      </div>
    )
  }

  const { correctCount, incorrectCount, totalQuestions, answers } = sessionData
  const skippedCount = totalQuestions - (correctCount + incorrectCount)
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / (correctCount + incorrectCount || 1)) * 100) : 0
  const scorePercent = Math.round((correctCount / totalQuestions) * 100)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Summary Card */}
          <Card className="lg:col-span-2 border-primary/20 bg-primary/5 overflow-hidden">
            <CardHeader className="bg-primary/10 border-b border-primary/10">
              <CardTitle className="font-headline text-3xl flex items-center gap-3">
                <Trophy className="text-primary h-8 w-8" />
                Scorecard & Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
                <Stat icon={<CheckCircle2 className="text-green-500" />} label="Correct" value={correctCount} />
                <Stat icon={<XCircle className="text-destructive" />} label="Incorrect" value={incorrectCount} />
                <Stat icon={<HelpCircle className="text-muted-foreground" />} label="Skipped" value={skippedCount} />
                <Stat icon={<Target className="text-secondary" />} label="Accuracy" value={`${accuracy}%`} />
              </div>
              <div className="mt-12 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Overall Performance</span>
                  <span className={`text-sm font-black uppercase tracking-widest ${scorePercent > 70 ? 'text-green-500' : 'text-primary'}`}>
                    {scorePercent > 70 ? 'Distinguished' : 'Competent'}
                  </span>
                </div>
                <Progress value={scorePercent} className="h-4 rounded-full bg-primary/10" />
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="border-secondary/20 bg-secondary/5">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Timer className="h-5 w-5 text-secondary" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Based on your attempt, your speed is <span className="text-secondary font-bold">Good</span>, but accuracy in <span className="text-primary font-bold">Punjab GK</span> can be improved.
              </p>
              <div className="space-y-3">
                <RecommendationItem text="Focus on Medieval Punjab history." />
                <RecommendationItem text="Practice 15 more Reasoning sets." />
                <RecommendationItem text="Review skipped questions today." />
              </div>
              <div className="pt-4 flex flex-col gap-3">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold h-12">
                  Retake Mock Test
                </Button>
                <Button variant="outline" asChild className="w-full border-secondary/20 hover:bg-secondary/5 h-12">
                  <Link href="/exams">Next Challenge</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-headline font-bold">Detailed Analysis</h2>
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
               <div className="h-3 w-3 rounded-full bg-green-500" />
               <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Correct</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="h-3 w-3 rounded-full bg-destructive" />
               <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Incorrect</span>
             </div>
          </div>
        </div>

        <div className="space-y-8">
          {MOCK_QUESTIONS.map((q, idx) => {
            const userAns = answers[idx]
            const isCorrect = userAns === q.correctAnswer
            const isSkipped = !userAns

            return (
              <Card key={q.id} className={`overflow-hidden transition-all ${isSkipped ? 'border-muted opacity-80' : isCorrect ? 'border-green-500/30' : 'border-destructive/30'}`}>
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-3 items-center">
                      <div className="h-8 w-8 rounded-lg bg-card border flex items-center justify-center font-headline font-bold text-xs">
                        Q{idx + 1}
                      </div>
                      <Badge className={`${
                        isSkipped ? 'bg-muted text-muted-foreground' : 
                        isCorrect ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'
                      } border-none font-bold uppercase tracking-widest text-[10px]`}>
                        {isSkipped ? 'Skipped' : isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{q.subject} • {q.difficulty}</span>
                  </div>

                  <p className="text-lg sm:text-xl font-medium mb-8 text-foreground/90">{q.text}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {q.options.map((opt, i) => {
                      const isOptionCorrect = opt === q.correctAnswer
                      const isOptionUserChoice = opt === userAns
                      
                      let variantClasses = "border-border"
                      if (isOptionCorrect) variantClasses = "border-green-500 bg-green-500/10 text-green-700"
                      else if (isOptionUserChoice && !isCorrect) variantClasses = "border-destructive bg-destructive/10 text-destructive"

                      return (
                        <div key={i} className={`p-4 rounded-xl border-2 text-sm font-medium flex items-center justify-between ${variantClasses}`}>
                          <span className="flex items-center gap-3">
                             <span className="font-headline font-black text-xs opacity-40">{String.fromCharCode(65 + i)}</span>
                             {opt}
                          </span>
                          {isOptionCorrect && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          {isOptionUserChoice && !isCorrect && <XCircle className="h-4 w-4 text-destructive" />}
                        </div>
                      )
                    })}
                  </div>

                  {results[q.id] ? (
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 mt-6 animate-in slide-in-from-bottom-2 duration-500">
                      <div className="flex items-center gap-2 mb-6 text-primary">
                        <BrainCircuit className="h-6 w-6" />
                        <h4 className="font-headline text-xl font-bold">Smart Rationalization</h4>
                      </div>
                      <p className="text-base leading-relaxed mb-8 whitespace-pre-line text-foreground/80">
                        {results[q.id].rationalization}
                      </p>
                      <div className="space-y-4">
                        <h5 className="text-xs font-black uppercase text-muted-foreground tracking-widest">Mastery Points</h5>
                        <div className="flex flex-wrap gap-2">
                          {results[q.id].keyLearningPoints.map((point, pi) => (
                            <Badge key={pi} variant="secondary" className="bg-secondary/10 hover:bg-secondary/20 text-secondary border-none px-4 py-1 font-bold">
                              {point}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="ghost" 
                      className="text-primary hover:text-primary hover:bg-primary/5 w-full justify-between h-14 rounded-xl border border-dashed border-primary/20 group"
                      onClick={() => handleRationalize(q.id, q.text, q.options, q.correctAnswer, userAns)}
                      disabled={rationalizing === q.id}
                    >
                      <span className="flex items-center gap-3">
                        <BrainCircuit className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                        <span className="font-bold">
                          {rationalizing === q.id ? "Consulting AI Tutor..." : "Analyze this question with AI Logic"}
                        </span>
                      </span>
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode, label: string, value: any }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-center">{icon}</div>
      <p className="text-3xl font-headline font-black text-foreground">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  )
}

function RecommendationItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
      <span className="text-xs font-bold text-muted-foreground leading-relaxed">{text}</span>
    </div>
  )
}
