import { Exam } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Trophy } from "lucide-react"

interface ExamCardProps {
  exam: Exam
}

export default function ExamCard({ exam }: ExamCardProps) {
  return (
    <Link href={`/exams/${exam.id}`}>
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group rounded-xl overflow-hidden h-full flex flex-col">
        <CardContent className="p-8 flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1E5EFF] bg-blue-50 px-2 py-1 rounded border border-blue-100">
              {exam.category}
            </span>
            <Trophy className="h-5 w-5 text-gray-200 group-hover:text-[#F59E0B] transition-colors" />
          </div>
          
          <h3 className="font-headline text-xl font-bold mb-3 text-[#0B1F3A] group-hover:text-[#1E5EFF] transition-colors">
            {exam.title}
          </h3>
          
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-6">
            {exam.description}
          </p>

          <div className="mt-auto space-y-2 border-t border-gray-50 pt-6">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-400">
              <span>Mocks</span>
              <span className="text-[#0B1F3A]">{exam.totalMocks}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-400">
              <span>MCQs</span>
              <span className="text-[#0B1F3A]">{exam.activeQuestions}+</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}