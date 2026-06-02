"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useFirestore, useCollection } from "@/firebase"
import { collection, doc, writeBatch, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { parseBulkQuestions } from "@/lib/parser"
import { FileText, Zap, CheckCircle2, Database, ChevronLeft, AlertCircle, Trash2 } from "lucide-react"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors"

/**
 * @fileOverview Final Production-Ready Bulk Import Engine.
 * Features: Regex-based extraction, high-speed batch commits, and metadata validation.
 */

export default function BulkImportPage() {
  const router = useRouter()
  const db = useFirestore()
  const { toast } = useToast()
  
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))

  const [rawText, setRawText] = useState("")
  const [metadata, setMetadata] = useState({
    boardId: "",
    examId: "",
    subjectId: "",
    difficulty: "medium" as any
  })
  const [parsedQuestions, setParsedQuestions] = useState<any[]>([])
  const [isImporting, setIsImporting] = useState(false)

  const handleParse = () => {
    if (!rawText.trim()) return
    if (!metadata.boardId || !metadata.examId || !metadata.subjectId) {
      toast({ variant: "destructive", title: "Audit Error", description: "Define classification metadata (Board/Exam/Subject) first." })
      return
    }
    const results = parseBulkQuestions(rawText, metadata)
    setParsedQuestions(results)
    if (results.length > 0) {
      toast({ title: "Extraction Complete", description: `Structured ${results.length} institutional-grade MCQs.` })
    } else {
      toast({ variant: "destructive", title: "Extraction Failed", description: "Invalid format. Use: Q1. [Text] A. [Op] B. [Op] C. [Op] D. [Op] Answer: [A/B/C/D]" })
    }
  }

  const handleImport = () => {
    if (!db || parsedQuestions.length === 0) return
    setIsImporting(true)

    const batch = writeBatch(db)
    parsedQuestions.forEach(q => {
      const newRef = doc(collection(db, "questions"))
      batch.set(newRef, {
        ...q,
        id: newRef.id,
        createdAt: serverTimestamp(),
        author: "Arsh Grewal Management"
      })
    })

    batch.commit()
      .then(() => {
        toast({ title: "Repository Synced", description: `${parsedQuestions.length} MCQs committed to official global bank.` })
        router.push("/admin/questions")
      })
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: '/questions',
          operation: 'write',
          requestResourceData: { batchSize: parsedQuestions.length },
        }));
      })
      .finally(() => setIsImporting(false))
  }

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl border border-foreground/5 bg-card/30 h-12 w-12">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-black font-headline text-primary uppercase tracking-tight">Bulk Extraction Engine</h1>
            <p className="text-muted-foreground">High-speed structured content entry for Arsh Grewal Management.</p>
          </div>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="h-12 rounded-xl border-white/5 font-bold gap-2" onClick={() => { setRawText(""); setParsedQuestions([]); }}>
              <Trash2 className="h-4 w-4" /> Clear All
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-foreground/5 bg-card/50 shadow-2xl rounded-[2.5rem] overflow-hidden">
            <div className="h-2 w-full bg-primary" />
            <CardHeader className="p-8">
              <CardTitle className="font-headline text-xl">Operational MCQ Paste</CardTitle>
              <CardDescription>
                Paste raw text from official gazettes. Format: Q1. [Text] A. [Op] B. [Op] C. [Op] D. [Op] Answer: [A/B/C/D]
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-muted-foreground ml-1">Board Registry</p>
                  <Select onValueChange={val => setMetadata({...metadata, boardId: val})}>
                    <SelectTrigger className="rounded-xl bg-background border-none shadow-sm h-11"><SelectValue placeholder="Select Authority" /></SelectTrigger>
                    <SelectContent>{boards?.map(b => <SelectItem key={b.id} value={b.id}>{b.abbreviation}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-muted-foreground ml-1">Source Exam</p>
                  <Select onValueChange={val => setMetadata({...metadata, examId: val})}>
                    <SelectTrigger className="rounded-xl bg-background border-none shadow-sm h-11"><SelectValue placeholder="Select Exam" /></SelectTrigger>
                    <SelectContent>{exams?.filter(e => e.boardId === metadata.boardId).map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-muted-foreground ml-1">Thematic Subject</p>
                  <Select onValueChange={val => setMetadata({...metadata, subjectId: val})}>
                    <SelectTrigger className="rounded-xl bg-background border-none shadow-sm h-11"><SelectValue placeholder="Select Subject" /></SelectTrigger>
                    <SelectContent>{subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-muted-foreground ml-1">Difficulty Level</p>
                  <Select onValueChange={val => setMetadata({...metadata, difficulty: val})} defaultValue="medium">
                    <SelectTrigger className="rounded-xl bg-background border-none shadow-sm h-11"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy Level</SelectItem>
                      <SelectItem value="medium">Medium Level</SelectItem>
                      <SelectItem value="hard">Hard Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Textarea 
                placeholder="Paste MCQ data strings here..."
                className="min-h-[400px] rounded-2xl bg-background/50 border-none shadow-inner p-6 text-sm font-mono custom-scrollbar leading-relaxed"
                value={rawText}
                onChange={e => setRawText(e.target.value)}
              />
              
              <Button onClick={handleParse} className="w-full h-14 bg-primary hover:bg-primary/90 font-black uppercase tracking-widest gap-2 rounded-2xl shadow-xl">
                <Zap className="h-5 w-5" /> Run Extraction Engine
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card className="border-foreground/5 bg-card/30 backdrop-blur-sm shadow-2xl rounded-[2.5rem] h-full flex flex-col">
            <CardHeader className="p-8">
              <CardTitle className="font-headline text-xl flex items-center gap-3">
                <Database className="h-5 w-5 text-primary" /> Validated Results
              </CardTitle>
              <CardDescription>{parsedQuestions.length} Items successfully structured for global bank.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 flex-1 overflow-y-auto custom-scrollbar space-y-4">
              {parsedQuestions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-30 py-20">
                  <AlertCircle className="h-16 w-16 mb-4" />
                  <p className="font-black uppercase tracking-widest text-xs">Waiting for Audit Input</p>
                </div>
              ) : (
                parsedQuestions.map((q, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-background border border-foreground/5 space-y-3 group hover:border-primary transition-colors">
                    <div className="flex justify-between items-center">
                       <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-black uppercase px-2 py-0.5">MCQ {idx+1} Validated</Badge>
                       <span className="text-[10px] font-black text-slate-500 font-mono">KEY: {q.correctAnswer}</span>
                    </div>
                    <p className="text-xs font-bold leading-relaxed line-clamp-3 text-slate-200">{q.questionEn}</p>
                    <div className="flex gap-2">
                       <Badge variant="outline" className="text-[8px] border-slate-700 text-slate-500">{metadata.subjectId}</Badge>
                       <Badge variant="outline" className="text-[8px] border-slate-700 text-slate-500">{metadata.difficulty}</Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            {parsedQuestions.length > 0 && (
               <div className="p-8 border-t border-white/5">
                  <Button 
                    className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-[0.2em] gap-3 rounded-2xl shadow-3xl shadow-emerald-900/40"
                    onClick={handleImport}
                    disabled={isImporting}
                  >
                    <CheckCircle2 className="h-5 w-5" /> {isImporting ? "Syncing Repository..." : `Commit ${parsedQuestions.length} Items`}
                  </Button>
               </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
