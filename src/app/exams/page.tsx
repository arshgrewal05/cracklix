import Navbar from "@/components/layout/Navbar"
import { EXAMS } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"
import { Search, Filter, BookOpen, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ExamsCatalog() {
  const boards = [
    "PSSSB", "PPSC", "Punjab Police", "Education", "High Court", "Power Sector", "Health", "Cooperative"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-headline font-bold mb-2">Exam Catalog</h1>
            <p className="text-muted-foreground font-medium text-lg">Official catalog of all supported Punjab Government Recruitment Boards.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10 h-12 rounded-xl" placeholder="Search exams or boards..." />
          </div>
        </div>

        {/* Board Filtering */}
        <div className="flex flex-wrap gap-2 mb-12">
          <Badge className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer">All Boards</Badge>
          {boards.map(board => (
            <Badge key={board} variant="outline" className="px-4 py-2 rounded-lg cursor-pointer hover:bg-secondary/5 border-gray-200">
              {board}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EXAMS.map(exam => (
            <Card key={exam.id} className="bg-white border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group rounded-[1.5rem] overflow-hidden flex flex-col">
              <CardContent className="p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary bg-secondary/5 px-3 py-1 rounded border border-secondary/10">
                    {exam.board}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {exam.category}
                  </span>
                </div>
                
                <h3 className="font-headline text-2xl font-black mb-4 text-primary group-hover:text-secondary transition-colors">
                  {exam.name}
                </h3>
                
                <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2 mb-8">
                  {exam.description}
                </p>

                <div className="mt-auto space-y-4 pt-8 border-t border-gray-50">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">
                    <span className="flex items-center gap-2"><Clock className="h-3 w-3" /> Mock Tests</span>
                    <span className="text-primary">{exam.totalMocks} Series</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">
                    <span className="flex items-center gap-2"><BookOpen className="h-3 w-3" /> Questions</span>
                    <span className="text-primary">{exam.activeQuestions}+ MCQs</span>
                  </div>
                  <div className="pt-4">
                    <Button asChild className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl gap-2 shadow-lg shadow-blue-200">
                      <Link href={`/exams/${exam.id}`}>
                        Start Preparation →
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
