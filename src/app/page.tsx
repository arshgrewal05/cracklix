import Navbar from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { Shield, Zap, BookOpen, Trophy } from "lucide-react"
import Link from "next/link"
import ExamCard from "@/components/exams/ExamCard"
import { EXAMS } from "@/lib/mock-data"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-bold font-headline mb-6 max-w-4xl mx-auto leading-tight">
            Master Competitive Exams with <span className="text-primary italic">Precision</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Experience high-stakes mock environments, AI-powered rationalizations, and deep performance insights.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="text-lg h-14 px-8 bg-primary hover:bg-primary/90">
              <Link href="/exams">Browse Catalog</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg h-14 px-8 border-primary/20 hover:bg-primary/10">
              Free Mock Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Shield className="h-6 w-6 text-primary" />}
              title="Proctored Mocks"
              description="Simulated testing environments with real-time timers and adaptive palette."
            />
            <FeatureCard 
              icon={<Zap className="h-6 w-6 text-secondary" />}
              title="AI Rationalization"
              description="Get step-by-step logical explanations for every complex question."
            />
            <FeatureCard 
              icon={<Trophy className="h-6 w-6 text-primary" />}
              title="Detailed Analysis"
              description="Topic-wise and difficulty-based breakdown of your performance."
            />
            <FeatureCard 
              icon={<BookOpen className="h-6 w-6 text-secondary" />}
              title="Curated Content"
              description="High-quality question banks curated by top subject matter experts."
            />
          </div>
        </div>
      </section>

      {/* Featured Exams */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-headline font-bold mb-2">Featured Exams</h2>
              <p className="text-muted-foreground">Start your preparation with our most popular catalogs.</p>
            </div>
            <Link href="/exams" className="text-primary hover:underline font-medium">View All Exams</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {EXAMS.map(exam => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        </div>
      </section>

      <footer className="mt-auto py-12 border-t bg-card/20">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>© 2024 PrepStation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-xl border bg-card/50 hover:bg-card transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-headline font-bold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}