
"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Database, 
  ChevronLeft, 
  Loader2, 
  Trash2, 
  Rocket, 
  Languages,
  CheckCircle2,
  FileText,
  Sparkles,
  ClipboardList
} from "lucide-react"
import { useFirestore, useCollection } from "@/firebase"
import { collection, doc, writeBatch, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { bulkParseMCQ } from "@/ai/flows/bulk-parse-mcq"
import { Difficulty, Question, ContentStatus } from "@/types"
import QuestionRenderer from "@/components/questions/QuestionRenderer"

/**
 * @fileOverview Exam Content Ingestion Hub v5.0.
 * Clean, exam-oriented design following Testbook / PSSSB pattern.
 * Removed all Institutional/Node jargon.
 */
export default function BulkImportPage() {
  const router = useRouter()
  const db = useFirestore()
  const { toast } = useToast()
  
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))

  const [metadata, setMetadata] = useState({
    boardId: "",
    subjectId: "",
    difficulty: "Medium" as Difficulty,
    status: "PUBLISHED" as ContentStatus,
  })

  const [rawText, setRawText] = useState("")
  const [parsedQuestions, setParsedQuestions] = useState<Partial<Question>[]>([])
  const [isSyncing, setIsSyncing] = useState(false)
  const [isParsing, setIsParsing] = useState(false)

  const handleAnalyze = async () => {
    if (!rawText.trim()) return
    if (!metadata.boardId || !metadata.subjectId) {
      toast({ variant: "destructive", title: "Missing Settings", description: "Please select a Board and Subject first." })
      return
    }

    setIsParsing(true)
    try {
      const aiResults = await bulkParseMCQ({ rawText });
      const mapped = aiResults.map(q => ({
        ...metadata,
        questionEn: q.question_english,
        questionPa: q.question_punjabi,
        optionAEn: q.option_a_english,
        optionAPa: q.option_a_punjabi,
        optionBEn: q.option_b_english,
        optionBPa: q.option_b_punjabi,
        optionCEn: q.option_c_english,
        optionCPa: q.option_c_punjabi,
        optionDEn: q.option_d_english,
        optionDPa: q.option_d_punjabi,
        correctAnswer: q.correct_option as any,
        explanationEn: q.explanation_english,
        explanationPa: q.explanation_punjabi,
        displayId: `Q${q.question_number}`,
        isStandalone: true,
        status: metadata.status
      }));
      setParsedQuestions(mapped);
      toast({ title: "Analysis Complete", description: "Verify the content preview below." })
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message })
    } finally {
      setIsParsing(false)
    }
  }

  const handleSave = async () => {
    if (!db || parsedQuestions.length === 0) return
    setIsSyncing(true)
    const batch = writeBatch(db)

    parsedQuestions.forEach(q => {
      const qRef = doc(collection(db, "questions"))
      const payload: any = {
        ...q,
        id: qRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      Object.keys(payload).forEach(key => (payload[key] === undefined || payload[key] === null) && delete payload[key]);
      batch.set(qRef, payload)
    })

    try {
      await batch.commit()
      toast({ title: "Success", description: "Questions saved to database." })
      router.push("/admin/questions")
    } catch (e: any) {
      toast({ variant: "destructive", title: "Save Failed" })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="space-y-12 pb-32 text-left max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 px-4 pt-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl border border-slate-200 h-12 w-12"><ChevronLeft className="h-6 w-6" /></Button>
          <div>
            <h1 className="text-4xl font-black font-headline text-[#0F172A] uppercase tracking-tight">Exam Content Paste</h1>
            <p className="text-slate-500 mt-1 font-medium">Add questions using direct text paste for high-fidelity mocks.</p>
          </div>
        </div>
        <div className="flex gap-4">
           <Button onClick={handleSave} disabled={isSyncing || parsedQuestions.length === 0} className="bg-[#0F172A] hover:bg-black text-white font-black uppercase text-[11px] tracking-widest rounded-xl h-14 px-12 gap-3 shadow-2xl">
              {isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />} Save {parsedQuestions.length} Questions
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
        <div className="lg:col-span-5 space-y-8">
          <Card className="border-none bg-white shadow-3xl rounded-[2.5rem] overflow-hidden">
            <div className="h-1.5 w-full bg-[#0F172A]" />
            <CardHeader className="p-8 pb-4">
              <CardTitle className="font-headline font-black text-xl uppercase flex items-center gap-3"><ClipboardList className="h-5 w-5 text-primary" /> Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Board</Label>
                  <Select value={metadata.boardId} onValueChange={v => setMetadata({...metadata, boardId: v})}>
                    <SelectTrigger className="rounded-xl h-11 bg-slate-50 border-none font-bold"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{boards?.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.abbreviation}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                   <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Subject</Label>
                   <Select value={metadata.subjectId} onValueChange={v => setMetadata({...metadata, subjectId: v})}>
                      <SelectTrigger className="rounded-xl h-11 bg-slate-50 border-none font-bold"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{subjects?.map((s:any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                   </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <Textarea 
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder="Paste raw MCQ text here..."
              className="min-h-[450px] rounded-[2.5rem] bg-white border-none p-10 text-sm font-bold shadow-4xl custom-scrollbar"
            />
            <Button onClick={handleAnalyze} disabled={isParsing || !rawText.trim()} className="w-full h-16 bg-primary hover:bg-orange-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl gap-3">
               {isParsing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Analyze Content
            </Button>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-10">
           {parsedQuestions.length > 0 ? (
             <div className="space-y-8">
                <div className="flex items-center gap-4 px-4">
                   <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg"><CheckCircle2 className="h-6 w-6" /></div>
                   <h2 className="text-3xl font-headline font-black uppercase text-[#0F172A]">{parsedQuestions.length} Questions Preview</h2>
                </div>
                <div className="space-y-8">
                   {parsedQuestions.map((q, idx) => (
                      <Card key={idx} className="border-none shadow-3xl rounded-[3rem] bg-white p-12 text-left group">
                         <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-6">
                            <Badge className="bg-[#0F172A] text-white border-none text-[11px] font-black px-6 py-2 rounded-xl uppercase">Question {idx + 1}</Badge>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-rose-500 bg-rose-50" onClick={() => setParsedQuestions(parsedQuestions.filter((_, i) => i !== idx))}><Trash2 className="h-5 w-5" /></Button>
                         </div>
                         <QuestionRenderer question={q} language="bilingual" showSolution={true} />
                      </Card>
                   ))}
                </div>
             </div>
           ) : (
             <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-slate-300 opacity-20 text-center">
                <Languages className="h-32 w-32 mb-8" />
                <p className="font-headline font-black uppercase text-2xl tracking-[0.4em]">Preview Hub Empty</p>
                <p className="text-lg font-bold mt-4">Paste text and click Analyze to generate previews.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
