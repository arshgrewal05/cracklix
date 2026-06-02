import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, BarChart3, Target, ShieldCheck, Trophy, Landmark } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { EXAMS } from "@/lib/mock-data";
import Logo from "@/components/brand/Logo";

export default function Home() {
  const boards = [
    "PSSSB", "PPSC", "Punjab Police", "Education", "High Court", "Power Sector", "Health", "Cooperative"
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />

      {/* 1. HERO SECTION (Institutional Trust) */}
      <section className="relative pt-24 pb-32 px-6 trust-gradient overflow-hidden border-b">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 bg-secondary/5 text-secondary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-secondary/10">
                <ShieldCheck className="h-4 w-4" />
                Punjab’s Most Trusted Government Exam Platform
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-primary leading-[1.05]">
                Prepare Smarter.<br />
                <span className="text-secondary">Score Higher.</span>
              </h1>
              <p className="text-xl text-gray-500 max-w-xl leading-relaxed">
                Comprehensive preparation for PSSSB, PPSC, Police and all major Punjab Recruitment Boards with structured mocks.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="h-16 px-10 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl gap-2 shadow-xl shadow-blue-200">
                  <Link href="/mocks">Start Free Mock <ArrowRight className="h-5 w-5" /></Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="h-16 px-10 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-bold">
                  <Link href="/exams">Explore Catalog</Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> 50,000+ MCQs</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> 1000+ Mocks</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-accent" /> 8 Boards</div>
              </div>
            </div>

            {/* DASHBOARD PREVIEW */}
            <div className="relative">
              <div className="dashboard-preview-card p-10 space-y-10 border-2">
                <div className="flex justify-between items-center border-b pb-6">
                   <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Latest Attempt Analysis</p>
                     <h3 className="text-xl font-bold text-primary">PSSSB Patwari Mock #01</h3>
                   </div>
                   <div className="h-14 w-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/10">
                     <BarChart3 className="h-7 w-7" />
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-8 text-center">
                  <DashboardStat label="Score" value="72/100" />
                  <DashboardStat label="Rank" value="128/4500" color="text-secondary" />
                  <DashboardStat label="Accuracy" value="81%" />
                </div>

                <div className="bg-gray-50 rounded-2xl p-8 border">
                   <div className="flex items-center justify-between mb-4">
                     <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Performance Insights</span>
                     <span className="text-[10px] font-black text-red-500 bg-red-50 px-2 py-1 rounded">Action Required</span>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {['Punjabi Grammar', 'Punjab GK', 'Reasoning'].map(t => (
                       <span key={t} className="text-xs font-bold px-3 py-1 bg-white border rounded-lg text-primary">{t}</span>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BOARDS STRIP */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-6">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] text-center mb-10">
            Official Recruitment Boards Coverage
          </p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 text-white/80 text-sm font-bold uppercase tracking-widest">
            {boards.map(board => (
              <div key={board} className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>{board}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED EXAMS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold text-primary mb-4">Major Recruitment Catalogs</h2>
              <p className="text-gray-500 font-medium text-lg">
                Structured discipline for Punjab's most competitive exams with verified patterns.
              </p>
            </div>
            <Link href="/exams" className="text-secondary font-bold text-sm flex items-center hover:underline">
              View All 30+ Exams <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXAMS.slice(0, 8).map(exam => (
              <Card key={exam.id} className="hover:shadow-lg transition-all border-gray-100 rounded-2xl overflow-hidden bg-white">
                 <CardContent className="p-8 space-y-6">
                   <div className="flex justify-between items-start">
                     <span className="text-[10px] font-black text-secondary bg-secondary/5 px-3 py-1 rounded border border-secondary/10 uppercase tracking-widest">
                       {exam.board}
                     </span>
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-primary mb-2 line-clamp-1">{exam.name}</h3>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{exam.category}</p>
                   </div>
                   <div className="pt-4 border-t flex items-center justify-between">
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{exam.totalMocks} Mocks</div>
                     <Button asChild variant="link" className="p-0 h-auto text-secondary font-bold">
                       <Link href={`/exams/${exam.id}`}>Explore →</Link>
                     </Button>
                   </div>
                 </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* WHY SECTION */}
      <section className="py-32 bg-gray-50 border-y">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-primary mb-24">Institutional Excellence</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left">
            <WhyCard 
              icon={<Landmark className="text-secondary" />} 
              title="Official Board Alignment" 
              desc="Every mock test is designed based on the actual recruitment board notification and latest PSSSB/PPSC trends." 
            />
            <WhyCard 
              icon={<BarChart3 className="text-secondary" />} 
              title="State-Wide Ranking" 
              desc="Compete with real Punjab aspirants and get your estimated state rank based on platform performance." 
            />
            <WhyCard 
              icon={<ShieldCheck className="text-secondary" />} 
              title="Bilingual Solutions" 
              desc="Detailed explanations in both English and Punjabi to ensure conceptual clarity for all subjects." 
            />
          </div>
        </div>
      </section>

      <footer className="py-20 border-t bg-white">
        <div className="container mx-auto px-6 text-center">
          <Logo className="mx-auto mb-10" />
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.5em]">
            © 2026 CRACKLIX • THE AUTHORITATIVE PREPARATION SYSTEM
          </p>
        </div>
      </footer>
    </div>
  );
}

function DashboardStat({ label, value, color = "text-primary" }: { label: string, value: string, color?: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <p className={`text-3xl font-bold tracking-tight ${color}`}>{value}</p>
    </div>
  );
}

function WhyCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="space-y-6">
      <div className="h-16 w-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm">
        {icon}
      </div>
      <h4 className="text-2xl font-bold text-primary">{title}</h4>
      <p className="text-gray-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
