import Navbar from "@/components/layout/Navbar"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, BarChart3, Target, ShieldCheck, Star, Users, Trophy, BookOpen, Clock, ChartColumn, CircleCheckBig, Smartphone } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { EXAMS, SAMPLE_MOCK } from "@/lib/mock-data"
import Image from "next/image"
import Logo from "@/components/brand/Logo"
import { PsssbIcon, PoliceIcon, PpscIcon, TeachingIcon, PowerIcon, JusticeIcon, MedIcon, BankIcon } from "@/lib/exam-icons"

export default function Home() {
  const recruitmentBoards = [
    { name: "PSSSB", icon: <PsssbIcon /> },
    { name: "PPSC", icon: <PpscIcon /> },
    { name: "Punjab Police", icon: <PoliceIcon /> },
    { name: "PSTET", icon: <TeachingIcon /> },
    { name: "PSPCL", icon: <PowerIcon /> },
    { name: "High Court", icon: <JusticeIcon /> },
    { name: "BFUHS", icon: <MedIcon /> },
    { name: "Cooperative Bank", icon: <BankIcon /> }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-24 px-4 overflow-hidden hero-gradient">
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                <ShieldCheck className="h-3 w-3" />
                Punjab's Most Trusted Platform
              </div>
              <h1 className="text-6xl md:text-7xl font-black font-headline leading-tight text-white">
                Prepare Smarter.<br />
                <span className="text-primary">Score Higher.</span>
              </h1>
              <p className="text-xl text-white/70 max-w-xl leading-relaxed">
                Punjab Government Exams di Complete Preparation ik hi Platform te.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <HeroStat icon={<BookOpen className="h-4 w-4" />} value="10,000+" label="Practice Questions" />
                <HeroStat icon={<Clock className="h-4 w-4" />} value="500+" label="Mock Tests" />
                <HeroStat icon={<Target className="h-4 w-4" />} value="50+" label="Exams Covered" />
                <HeroStat icon={<ChartColumn className="h-4 w-4" />} value="Detailed" label="Analytics" />
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild size="lg" className="h-14 px-10 bg-primary hover:bg-primary/90 text-white font-black rounded-xl gap-2">
                  <Link href="/mocks">Start Free Mock <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="h-14 px-10 border-white/20 text-white hover:bg-white/10 rounded-xl font-bold">
                  <Link href="/exams">Explore Exams</Link>
                </Button>
              </div>
            </div>

            <div className="relative hidden lg:block">
              {/* Dashboard Preview UI */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-[16/10]">
                <Image
                  src="https://picsum.photos/seed/punjab/1200/800"
                  alt="Golden Temple"
                  fill
                  className="object-cover"
                  data-ai-hint="golden temple"
                />
                <div className="absolute inset-0 bg-secondary/30" />
                
                {/* Floating Realistic UI Card */}
                <div className="absolute bottom-6 right-6 bg-[#0F172A]/80 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-3">
                   <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                     <ShieldCheck className="h-4 w-4 text-primary" />
                   </div>
                   <div>
                     <p className="text-xs font-black text-white uppercase tracking-tighter">Punjab Focused</p>
                     <p className="text-[10px] text-white/60">100% Real Exam Level</p>
                   </div>
                </div>
              </div>

              {/* Map Watermark Decor */}
              <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
                 <svg viewBox="0 0 100 100" className="h-64 w-64 text-white">
                  <path d="M50 5 L70 15 L85 40 L80 70 L50 95 L20 70 L15 40 L30 15 Z" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST STRIP */}
      <section className="py-8 bg-[#0B1F3A] border-y border-white/5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            Trusted by Punjab Aspirants Preparing for Government Jobs
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            {recruitmentBoards.map(board => (
              <div key={board.name} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors cursor-default">
                <span className="h-5 w-5 opacity-50">{board.icon}</span>
                <span className="text-sm font-bold tracking-tight">{board.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. POPULAR EXAMS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-black font-headline text-secondary">Popular Exams</h2>
            <Link href="/exams" className="text-primary font-bold text-sm flex items-center hover:underline">
              View All Exams <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXAMS.slice(0, 8).map(exam => (
              <Link key={exam.id} href={`/exams/${exam.id}`}>
                <Card className="group border-none bg-[#F8FAFC] hover:shadow-xl transition-all duration-300 rounded-2xl p-6 text-center h-full">
                  <CardContent className="p-0 flex flex-col items-center">
                    <div className="h-16 w-16 mb-4 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      {getCategoryIcon(exam.category)}
                    </div>
                    <h3 className="font-headline text-xl font-black mb-1 text-secondary">{exam.title}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{exam.totalMocks}+ Mocks</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{exam.activeQuestions}+ MCQs</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LATEST MOCK TESTS */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-black font-headline text-secondary">Latest Mock Tests</h2>
            <Link href="/mocks" className="text-primary font-bold text-sm flex items-center hover:underline">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MockCard examId="psssb-patwari" title="Patwari Full Length Mock 01" icon={<PsssbIcon />} />
            <MockCard examId="punjab-police-si" title="Punjab Police SI Paper 01" icon={<PoliceIcon />} />
            <MockCard examId="ppsc-pcs" title="PPSC PCS Prelims Set 04" icon={<PpscIcon />} />
            <MockCard examId="pstet" title="PSTET Paper 2 (SS) Mock 08" icon={<TeachingIcon />} />
          </div>
        </div>
      </section>

      {/* 5. WHY CRACKLIX */}
      <section className="py-24 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black font-headline text-secondary">Built for Serious Aspirants</h2>
            <p className="text-muted-foreground font-medium">Not casual learners. We focus on real patterns and real results.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <WhyItem 
              icon={<Target className="text-primary" />} 
              title="Exam-Focused Content" 
              desc="Every question is aligned with actual government exam patterns and latest notifications." 
            />
            <WhyItem 
              icon={<BarChart3 className="text-primary" />} 
              title="Real Performance Analytics" 
              desc="Track your accuracy, speed, and identify specific weak areas with AI insights." 
            />
            <WhyItem 
              icon={<Users className="text-primary" />} 
              title="Structured Learning Path" 
              desc="Navigate from basics to sectional mocks to final full-length revision series." 
            />
          </div>
        </div>
      </section>

      {/* 6. FEATURES BAR */}
      <section className="py-12 bg-secondary border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureItem icon={<CircleCheckBig />} title="Real Exam Pattern" desc="Based Mocks" />
            <FeatureItem icon={<BookOpen />} title="Detailed Solutions" desc="for Every Question" />
            <FeatureItem icon={<ChartColumn />} title="Performance" desc="Analytics" />
            <FeatureItem icon={<Smartphone />} title="Study Anytime" desc="Anywhere" />
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-12 border-t bg-white">
        <div className="container mx-auto px-4 text-center space-y-6">
          <div className="flex justify-center">
            <Logo variant="dark" />
          </div>
          <div className="flex justify-center gap-8 text-sm font-bold text-muted-foreground uppercase tracking-widest">
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
          </div>
          <div className="pt-8 border-t text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">
            © 2026 CRACKLIX • Punjab Government Exam Preparation Platform
          </div>
        </div>
      </footer>
    </div>
  )
}

function HeroStat({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
      <div className="flex items-center gap-2 mb-1 text-white/60">
        {icon}
        <span className="text-xs font-black text-white">{value}</span>
      </div>
      <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold whitespace-nowrap">{label}</p>
    </div>
  )
}

function MockCard({ examId, title, icon }: { examId: string, title: string, icon: React.ReactNode }) {
  return (
    <Card className="bg-white border-foreground/5 hover:border-primary/20 transition-all rounded-[2rem] p-8 group overflow-hidden">
      <div className="h-12 w-12 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        {icon}
      </div>
      <span className="text-[10px] font-black uppercase text-primary tracking-widest">Live Now</span>
      <h3 className="text-lg font-black font-headline mt-2 mb-6 text-secondary group-hover:text-primary transition-colors line-clamp-2">
        {title}
      </h3>
      <Button asChild variant="outline" className="w-full rounded-xl border-foreground/5 hover:bg-primary hover:text-white hover:border-primary font-bold">
        <Link href={`/mocks/${SAMPLE_MOCK.id}`}>Attempt Free</Link>
      </Button>
    </Card>
  )
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-center gap-4 text-white group">
      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-primary shrink-0 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="leading-tight">
        <p className="text-sm font-black uppercase tracking-tighter">{title}</p>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{desc}</p>
      </div>
    </div>
  )
}

function WhyItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="space-y-4 p-8 rounded-[2rem] hover:bg-[#F8FAFC] transition-colors border border-transparent hover:border-foreground/5">
      <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <h4 className="text-xl font-black font-headline text-secondary">{title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function getCategoryIcon(category: string) {
  switch (category) {
    case 'PSSSB': return <PsssbIcon />
    case 'PPSC': return <PpscIcon />
    case 'Punjab Police': return <PoliceIcon />
    case 'Teaching Exams': return <TeachingIcon />
    case 'PSPCL & PSTCL': return <PowerIcon />
    case 'High Court': return <JusticeIcon />
    case 'BFUHS': return <MedIcon />
    case 'Banking & Cooperative': return <BankIcon />
    default: return <BookOpen />
  }
}
