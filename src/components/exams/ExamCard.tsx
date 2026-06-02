import { Exam } from "@/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"

interface ExamCardProps {
  exam: Exam
}

export default function ExamCard({ exam }: ExamCardProps) {
  const placeholder = PlaceHolderImages.find(p => p.id === exam.thumbnail)

  return (
    <Card className="overflow-hidden group hover:border-primary/50 transition-all">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={placeholder?.imageUrl || "https://picsum.photos/seed/default/400/250"}
          alt={exam.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          data-ai-hint={placeholder?.imageHint || "education"}
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-secondary text-secondary-foreground font-semibold">
            {exam.category}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-xl">{exam.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {exam.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground font-medium">
          {exam.totalMocks} Mock Exams Available
        </span>
        <Button asChild variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
          <Link href={`/exams/${exam.id}`}>Explore</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}