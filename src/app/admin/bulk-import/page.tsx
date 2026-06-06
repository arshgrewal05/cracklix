
"use client"

import { useState, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Database, 
  ChevronLeft, 
  AlertCircle, 
  Settings2, 
  Loader2, 
  Trash2, 
  Zap, 
  Rocket, 
  SearchCode, 
  Image as ImageIcon, 
  Upload, 
  CheckCircle2, 
  FileWarning 
} from "lucide-react"
import { useFirestore, useCollection, useStorage } from "@/firebase"
import { collection, doc, writeBatch, serverTimestamp, getDocs, query, where, limit } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useToast } from "@/hooks/use-toast"
import { parseBulkQuestions } from "@/lib/parser"
import { Difficulty, Question, ContentStatus } from "@/types"
import QuestionRenderer from "@/components/questions/QuestionRenderer"

/**
 * @fileOverview Institutional Bulk Ingestion Hub v3.5.
 * Features: Automatic Question Splitting, Media Linkage, and Detection Preview.
 */

export default function BulkImportPage() {
  const router = useRouter()
  const db = useFirestore()
  const storage = useStorage()
  const { toast } = useToast()
  
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))

  const [metadata, setMetadata] = useState({
    boardId: "",
    examId: "",
    subjectId: "",
    chapterId: "",
    difficulty: "Medium" as Difficulty,
    status: "PUBLISHED" as ContentStatus,
  })

  const [rawText, setRawText] = useState("")
  const [parsedQuestions, setParsedQuestions] = useState<Partial<Question>[]>([])
  const [parseErrors, setParseErrors] = useState<string[]>([])
  const [confidence, setConfidence] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAnalyze = async () => {
    if (!rawText.trim()) return
    if (!metadata.boardId || !metadata.subjectId || !metadata.examId) {
      toast({ variant: "destructive", title: "Config Required", description: "Select Board, Exam and Subject before analysis." })
      return
    }

    const { questions, errors, confidence: conf } = parseBulkQuestions(rawText, metadata)
    
    setParsedQuestions(questions)
    setParseErrors(errors)
    setConfidence(conf)

    if (errors.length > 0) {
      toast({ variant: "destructive", title: "Split Warnings", description: `Found ${errors.length} parsing issues.` })
    } else {
      toast({ title: "Analysis Complete", description: `Detected ${questions.length} individual questions.` })
    }
  }

  const handleImageUpload = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !storage) return

    setUploadingIdx(idx)
    const storageRef = ref(storage, `question_assets/${Date.now()}_${file.name}`)

    try {
      const snapshot = await uploadBytes(storageRef, file)
      const url = await getDownloadURL(snapshot.ref)
      
      const updated = [...parsedQuestions]
      updated[idx].imageUrl = url
      setParsedQuestions(updated)
      
      toast({ title: "Media Linked", description: "Image attached to question node." })
    } catch (err) {
      toast({ variant: "destructive", title: "Upload Failed" })
    } finally {
      setUploadingIdx(null)
    }
  }

  const handleSaveToBank = async () => {
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
        isStandalone: true,
      };
      
      // Cleanup
      Object.keys(payload).forEach(key => (payload[key] === undefined || payload[key] === null) && delete payload[key]);
      batch.set(qRef, payload)
    })

    try {
      await batch.commit()
      toast({ title: "Bank Sync Success", description: `${parsedQuestions.length} nodes successfully committed.` })
      router.push("/admin/questions")
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Failed", description: e.message })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="space-y-10 pb-24 text-left max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl border bg-white h-12 w-12 shadow-sm"><ChevronLeft className="h-6 w-6" /></Button>
          <div className="text-left">
            <h1 className="text-4xl font-black font-headline text-[#0F172A] uppercase tracking-tight">Bulk Ingestion Engine</h1>
            <p className="text-slate-500 font-medium">Automatic boundary detection for massive scale datasets.</p>
          </div>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" onClick={() => { setRawText(""); setParsedQuestions([]); }} className="h-16 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-3 shadow-sm bg-white">
              Reset Buffer
           </Button>
           <Button onClick={handleSaveToBank} disabled={isSyncing || parsedQuestions.length === 0} className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl h-16 px-12 gap-3 shadow-3xl shadow-emerald-900/20">
              {isSyncing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Rocket className="h-5 w-5" />} Commit {parsedQuestions.length} Nodes
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none bg-white shadow-3xl rounded-[3rem] overflow-hidden">
            <div className="h-2 w-full bg-primary" />
            <CardHeader className="p-10 pb-4">
              <CardTitle className="font-headline font-black text-2xl uppercase flex items-center gap-4"><Settings2 className="h-6 w-6 text-primary" /> Target Metadata</CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-4 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Board</Label>
                  <Select value={metadata.boardId} onValueChange={v => setMetadata({...metadata, boardId: v, examId: ""})}>
                    <SelectTrigger className="rounded-xl h-11 bg-slate-50 border-none font-bold text-[#0F172A]"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{boards?.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.abbreviation}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Exam Hub</Label>
                  <Select value={metadata.examId} onValueChange={v => setMetadata({...metadata, examId: v})}>
                    <SelectTrigger className="rounded-xl h-11 bg-slate-50 border-none font-bold text-[#0F172A]"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{exams?.filter(e => e.boardId === metadata.boardId).map((e: any) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                   <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Subject Node</Label>
                   <Select value={metadata.subjectId} onValueChange={v => setMetadata({...metadata, subjectId: v})}>
                      <SelectTrigger className="rounded-xl h-11 bg-slate-50 border-none font-bold text-[#0F172A]"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{subjects?.map((s:any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                   </Select>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="p-10 bg-[#0F172A] rounded-[3rem] text-white space-y-6">
             <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary"><SearchCode className="h-6 w-6" /></div>
                <h3 className="font-headline font-black uppercase">Detection Logic</h3>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-400">Questions Detected</span>
                   <span className="font-black text-primary">{parsedQuestions.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-slate-400">Parse Confidence</span>
                   <span className="font-black text-emerald-400">{confidence}%</span>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">
           <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">Ingestion Buffer (Paste content with Q1, Q2...)</Label>
              <Textarea 
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder="Q291. What is... A) Opt 1 B) Opt 2 ... Correct Answer: A"
                className="min-h-[500px] rounded-[3.5rem] bg-white border-none p-12 text-sm font-mono shadow-4xl custom-scrollbar text-[#0F172A]"
              />
              <Button onClick={handleAnalyze} className="w-full h-20 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-[0.3em] rounded-[2.5rem] shadow-4xl mt-6 gap-4">
                 <Zap className="h-6 w-6 text-primary fill-current" /> Analyze & Detect Boundaries
              </Button>
           </div>

           {parsedQuestions.length > 0 && (
             <Card className="border-none shadow-4xl rounded-[4rem] bg-white overflow-hidden text-left">
                <CardHeader className="p-12 border-b border-slate-50 bg-slate-50/30 flex flex-row justify-between items-center">
                   <div className="space-y-2">
                      <CardTitle className="font-headline font-black text-3xl uppercase">Detected Matrix ({parsedQuestions.length})</CardTitle>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Verify answers and link media before bank sync.</p>
                   </div>
                   <Badge className="bg-emerald-100 text-emerald-600 border-none font-black px-6 py-2 rounded-xl text-xs uppercase tracking-widest">VALIDATED</Badge>
                </CardHeader>
                <CardContent className="p-12 space-y-12 max-h-[800px] overflow-y-auto custom-scrollbar">
                   {parsedQuestions.map((q, idx) => (
                      <div key={idx} className="p-10 bg-slate-50/50 rounded-[3rem] border border-slate-100 space-y-8 group/item">
                         <div className="flex items-center justify-between">
                            <Badge className="bg-primary text-white border-none text-[10px] font-black uppercase px-4 py-1 rounded-lg">Node {q.displayId}</Badge>
                            <div className="flex gap-2">
                               <input 
                                 type="file" 
                                 className="hidden" 
                                 accept="image/*" 
                                 ref={fileInputRef} 
                                 onChange={(e) => handleImageUpload(idx, e)} 
                               />
                               <Button 
                                 variant="outline" 
                                 size="sm" 
                                 className="rounded-xl h-10 px-4 gap-2 bg-white font-bold uppercase text-[9px]"
                                 onClick={() => {
                                   // This is a simplification; ideally use a unique ref per row
                                   const input = document.createElement('input');
                                   input.type = 'file';
                                   input.accept = 'image/*';
                                   input.onchange = (e: any) => handleImageUpload(idx, e);
                                   input.click();
                                 }}
                                 disabled={uploadingIdx === idx}
                               >
                                  {uploadingIdx === idx ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImageIcon className="h-3 w-3 text-primary" />}
                                  {q.imageUrl ? "Update Image" : "Add Image"}
                               </Button>
                               <Button variant="ghost" size="icon" className="h-10 w-10 text-rose-500" onClick={() => setParsedQuestions(parsedQuestions.filter((_, i) => i !== idx))}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                         </div>
                         <QuestionRenderer question={q} language="bilingual" showSolution={true} />
                      </div>
                   ))}
                </CardContent>
             </Card>
           )}
        </div>
      </div>
    </div>
  )
}
