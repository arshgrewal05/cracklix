import Navbar from "@/components/layout/Navbar"
import { EXAMS, SAMPLE_MOCK } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, BookOpen, Trophy, ArrowRight, ShieldCheck, Map } from "lucide-react"
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
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary text-white px-4 py-1.5 rounded-lg border-none uppercase tracking-widest text-[10px] font-black">
                {exam.board} Official
              </Badge>
              <Badge variant="outline" className="border-secondary/20 text-secondary font-bold">
                {exam.category} Series
              </Badge>
            </div>
            <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary">
              {exam.name}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {exam.description}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-8 border-y border-border/50">
              <InfoPill icon={<Clock className="h-5 w-5 text-secondary" />} title="Duration" desc={`${exam.duration} Minutes`} />
              <InfoPill icon={<BookOpen className="h-5 w-5 text-secondary" />} title="Questions" desc={`${exam.totalQuestions} Pattern Based`} />
              <InfoPill icon={<ShieldCheck className="h-5 w-5 text-secondary" />} title="Board" desc={exam.board} />
            </div>

            <div className="bg-secondary/5 rounded-2xl p-8 border border-secondary/10 space-y-4">
              <div className="flex items-center gap-3 text-secondary font-black uppercase tracking-widest text-xs">
                <Map className="h-4 w-4" /> Syllabus & Exam Pattern
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                The {exam.name} exam follows the latest notification issued by {exam.board}. Mocks include dedicated sections for Punjabi Language (Qualifying), Punjab GK, Reasoning, and Quantitative Aptitude.
              </p>
            </div>
          </div>

          {/* Right: Featured Card */}
          <div className="space-y-6">
            <div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={placeholder?.imageUrl || "https://picsum.photos/seed/punjab-edu/600/400"}
                alt={exam.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-8">
                <div className="text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Published By</p>
                  <p className="text-xl font-bold">Cracklix Trust System</p>
                </div>
              </div>
            </div>
            
            <Card className="border-primary/10 bg-primary/5">
              <CardContent className="p-8 text-center space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Series Status</p>
                  <p className="text-4xl font-black text-primary">{exam.totalMocks}</p>
                  <p className="text-sm font-bold text-secondary">Active Mock Series</p>
                </div>
                <Button asChild className="w-full h-14 bg-secondary hover:bg-secondary/90 text-white font-bold text-lg rounded-2xl shadow-xl shadow-blue-200">
                   <Link href={`/mocks/${SAMPLE_MOCK.id}`}>Start First Mock Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-headline font-bold text-primary mb-2">Available Practice Tests</h2>
          <p className="text-muted-foreground">High-fidelity mocks based on {exam.board} recruitment history.</p>
        </div>

        <div className="grid gap-6">
          {[1, 2, 3, 4, 5].map((num) => (
            <Card key={num} className="hover:border-secondary/50 transition-all group border-gray-100 bg-white/50">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-8">
                  <div className="h-16 w-16 rounded-2xl bg-primary/5 border flex items-center justify-center font-headline text-2xl font-black text-primary group-hover:bg-secondary/10 transition-colors">
                    {num}
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-xl group-hover:text-secondary transition-colors">
                      Full Length Assessment #{num}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {exam.duration}m
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-3 w-3" /> {exam.totalQuestions} Questions
                      </span>
                    </div>
                  </div>
                </div>
                <Button asChild className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold px-8 h-12 rounded-xl">
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

function InfoPill({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-xl bg-background border flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{title}</p>
        <p className="text-base font-bold text-primary">{desc}</p>
      </div>
    </div>
  )
}
