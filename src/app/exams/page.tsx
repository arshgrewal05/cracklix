import Navbar from "@/components/layout/Navbar"
import ExamCard from "@/components/exams/ExamCard"
import { EXAMS } from "@/lib/mock-data"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function ExamsCatalog() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-headline font-bold mb-2">Exam Catalog</h1>
            <p className="text-muted-foreground">Browse all supported competitive examinations.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Search exams..." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {EXAMS.map(exam => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </main>
    </div>
  )
}