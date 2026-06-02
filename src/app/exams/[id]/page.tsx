import Navbar from "@/components/layout/Navbar"
import { EXAMS, SAMPLE_MOCK } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, BookOpen, Trophy, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { notFound } from "next/navigation"

export default function ExamDetails({ params }: { params: { id: string } }) {
  const exam = EXAMS.find(e => e.id === params.id)
  if (!exam) return notFound()

  const placeholder = PlaceHolderImages.find(p => p.id === exam.thumbnail)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Left: Exam Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <Badge className="bg-secondary text-secondary-foreground">{exam.category}</Badge>
              <Badge variant="outline">{exam.totalMocks} Mock Sessions</Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-headline font-bold">{exam.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {exam.description}
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-6 border-y border-border/50">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-bold">Timed</p>
                  <p className="text-xs text-muted-foreground">Standardized</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-sm font-bold">1k+ MCQs</p>
                  <p className="text-xs text-muted-foreground">Syllabus-aligned</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-bold">Leaderboard</p>
                  <p className="text-xs text-muted-foreground">Compete live</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Featured Thumbnail */}
          <div className="relative h-64 lg:h-full rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
            <Image
              src={placeholder?.imageUrl || "https://picsum.photos/seed/default/600/400"}
              alt={exam.title}
              fill
              className="object-cover"
              data-ai-hint="education student"
            />
          </div>
        </div>

        <h2 className="text-2xl font-headline font-bold mb-8">Available Mock Tests</h2>
        <div className="grid gap-4">
          {[1, 2, 3].map((num) => (
            <Card key={num} className="hover:border-primary/50 transition-colors group cursor-pointer">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="h-14 w-14 rounded-xl bg-card border flex items-center justify-center font-headline text-2xl font-bold text-primary">
                    {num}
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-lg group-hover:text-primary transition-colors">
                      Full Length Mock Assessment #{num}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Covers full syllabus • 180 Questions • 3 Hours
                    </p>
                  </div>
                </div>
                <Button asChild className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  <Link href={`/mocks/${SAMPLE_MOCK.id}`}>
                    Start Mock <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}