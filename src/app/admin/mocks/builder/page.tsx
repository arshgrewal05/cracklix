
"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ChevronLeft, 
  Database, 
  Zap,
  Sparkles,
  Settings,
  Filter,
  Layers,
  ClipboardCheck,
  Search,
  CheckCircle2
} from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError } from "@/firebase/errors"

/**
 * @fileOverview Final Production-Ready Smart Mock Builder.
 * Features: Auto-Mock Generation, Sectional Blueprinting, Manual Library.
 */

export default function MockBuilderPage() {
  const router = useRouter()
  const db = useFirestore()
  const { toast } = useToast()

  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))
  const { data: questionBank } = useCollection<any>(useMemo(() => (db ? collection(db, "questions") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))

  const [isPublishing, setIsPublishing] = useState(false)
  const [mockData, setMockData] = useState({
    title: "", boardId: "", examId: "", duration: 120, difficulty: "Medium", mockType: "FULL" as any
  })

  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([])
  const [bankSearch, setBankSearch] = useState("")

  const [smartConfig, setSmartConfig] = useState({ 
    count: 100, 
    difficulty: "all",
    subjectId: "all"
  })

  const handleAutoPick = () => {
    if (!questionBank || questionBank.length === 0) {
      toast({ variant: "destructive", title: "Bank Empty", description: "No questions available to extract." })
      return
    }

    let pool = [...questionBank]
    
    if (smartConfig.difficulty !== 'all') {
      pool = pool.filter(q => q.difficulty === smartConfig.difficulty)
    }
    if (smartConfig.subjectId !== 'all') {
      pool = pool.filter(q => q.subjectId === smartConfig.subjectId)
    }

    if (pool.length < smartConfig.count) {
      toast({ 
        variant: "destructive", 
        title: "Shortfall Detected", 
        description: `Only ${pool.length} MCQs found matching this blueprint. Target: ${smartConfig.count}` 
      })
      return
    }

    const selected = pool.sort(() => 0.5 - Math.random()).slice(0, smartConfig.count)
    setSelectedQuestions(selected)
    
    toast({ 
      title: "Assembly Complete", 
      description: `Structured ${selected.length} high-fidelity questions automatically.` 
    })
  }

  const handlePublish = () => {
    if (!mockData.title || !mockData.examId || selectedQuestions.length === 0) {
      toast({ variant: "destructive", title: "Audit Failed", description: "Title, Hub and questions required." })
      return
    }

    setIsPublishing(true)
    const mockId = `mock-${Date.now()}`
    const mockRef = doc(db, "mocks", mockId)
    const payload = {
      ...mockData,
      id: mockId,
      totalQuestions: selectedQuestions.length,
      questionIds: selectedQuestions.map(q => q.id),
      published: true,
      createdAt: serverTimestamp(),
      author: "Institutional Admin"
    }

    setDoc(mockRef, payload)
      .then(() => {
        toast({ title: "Series Deployed", description: "The mock series is now live." })
        router.push("/admin/mocks")
      })
      .catch(async () => {
        errorEmitter.emit("permission-error", new FirestorePermissionError({ 
          path: mockRef.path, 
          operation: 'create', 
          requestResourceData: payload 
        }))
      })
      .finally(() => setIsPublishing(false))
  }

  const filteredBank = useMemo(() => {
    if (!questionBank) return []
    return questionBank.filter(q => 
      (q.questionEn || "").toLowerCase().includes(bankSearch.toLowerCase()) || 
      (q.id || "").includes(bankSearch)
    )
  }, [bankSearch, questionBank])

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl h-14 w-14 border border-foreground/5 bg-card/30">
            <ChevronLeft className="h-7 w-7" />
          </Button>
          <div>
            <h1 className="text-4xl font-black font-headline text-primary uppercase tracking-tight">Smart Builder</h1>
            <p className="text-muted-foreground mt-1">Scale your series with blueprint-driven assembly.</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-3 font-black px-12 h-16 shadow-3xl rounded-2xl" onClick={handlePublish} disabled={isPublishing}>
          <ClipboardCheck className="h-5 w-5" /> {isPublishing ? "Deploying..." : "Publish Series"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-foreground/5 bg-card/50 shadow-2xl rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-10 pb-0">
               <CardTitle className="text-2xl font-headline font-black uppercase text-slate-100">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="p-10 space-y-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Series Title</Label>
                <Input placeholder="e.g. PSSSB Clerk Full Mock 01" value={mockData.title} onChange={e => setMockData({...mockData, title: e.target.value})} className="rounded-xl h-12 bg-background border-none shadow-inner" />
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Authority</Label>
                  <Select onValueChange={val => setMockData({...mockData, boardId: val})}>
                    <SelectTrigger className="rounded-xl h-12 bg-background border-none shadow-sm"><SelectValue placeholder="Select Board" /></SelectTrigger>
                    <SelectContent>{boards?.map(b => <SelectItem key={b.id} value={b.id}>{b.abbreviation}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Exam Hub</Label>
                  <Select onValueChange={val => setMockData({...mockData, examId: val})}>
                    <SelectTrigger className="rounded-xl h-12 bg-background border-none shadow-sm"><SelectValue placeholder="Select Exam" /></SelectTrigger>
                    <SelectContent>{exams?.filter(e => e.boardId === mockData.boardId).map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Time (Min)</Label>
                  <Input type="number" value={mockData.duration} onChange={e => setMockData({...mockData, duration: parseInt(e.target.value)})} className="rounded-xl h-12 bg-background border-none text-center font-black" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Type</Label>
                  <Select onValueChange={val => setMockData({...mockData, mockType: val as any})} defaultValue="FULL">
                    <SelectTrigger className="rounded-xl h-12 bg-background border-none shadow-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL">Full Length</SelectItem>
                      <SelectItem value="SUBJECT">Subject Wise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-primary/5 rounded-[2.5rem] p-10 space-y-4 text-center">
             <Database className="h-10 w-10 text-primary mx-auto opacity-20" />
             <div>
                <p className="text-5xl font-black font-headline text-slate-100">{selectedQuestions.length}</p>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Questions Linked</p>
             </div>
          </Card>
        </div>

        <div className="lg:col-span-8">
           <Tabs defaultValue="smart" className="space-y-8">
              <TabsList className="bg-slate-100/50 rounded-2xl p-1.5 h-16 w-fit">
                 <TabsTrigger value="smart" className="rounded-xl h-full px-8 font-black uppercase text-[10px] gap-2"><Sparkles className="h-4 w-4" /> Auto Assembler</TabsTrigger>
                 <TabsTrigger value="manual" className="rounded-xl h-full px-8 font-black uppercase text-[10px] gap-2"><Database className="h-4 w-4" /> Manual Library</TabsTrigger>
              </TabsList>

              <TabsContent value="smart" className="space-y-6">
                 <Card className="border-none shadow-2xl rounded-[3rem] bg-white p-12 text-center space-y-10">
                    <div className="max-w-md mx-auto space-y-8">
                       <div className="h-20 w-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto text-primary">
                          <Zap className="h-10 w-10" />
                       </div>
                       <div className="space-y-2">
                          <h3 className="text-3xl font-headline font-black text-slate-800 uppercase">Smart Extraction</h3>
                          <p className="text-slate-500 font-medium">Define quantity and subject to generate instantly.</p>
                       </div>
                       
                       <div className="grid grid-cols-1 gap-6 text-left">
                          <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase text-slate-400">Target Subject</Label>
                             <Select onValueChange={val => setSmartConfig({...smartConfig, subjectId: val})} defaultValue="all">
                                <SelectTrigger className="h-14 rounded-xl bg-slate-50 border-none shadow-inner"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                   <SelectItem value="all">Mix All Subjects</SelectItem>
                                   {subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                </SelectContent>
                             </Select>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-slate-400">Total Count</Label>
                                <Input type="number" value={smartConfig.count} onChange={e => setSmartConfig({...smartConfig, count: parseInt(e.target.value)})} className="h-14 rounded-xl bg-slate-50 border-none shadow-inner text-xl font-black text-center" />
                             </div>
                             <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase text-slate-400">Difficulty</Label>
                                <Select onValueChange={val => setSmartConfig({...smartConfig, difficulty: val})} defaultValue="all">
                                   <SelectTrigger className="h-14 rounded-xl bg-slate-50 border-none shadow-inner"><SelectValue /></SelectTrigger>
                                   <SelectContent><SelectItem value="all">Mixed</SelectItem><SelectItem value="easy">Easy</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="hard">Hard</SelectItem></SelectContent>
                                </Select>
                             </div>
                          </div>
                       </div>

                       <Button onClick={handleAutoPick} className="w-full h-16 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-[0.2em] rounded-2xl gap-3">
                          <Zap className="h-5 w-5 text-primary" /> Run Assembler
                       </Button>
                    </div>
                 </Card>
              </TabsContent>

              <TabsContent value="manual" className="space-y-6">
                 <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                    <Input className="pl-12 h-14 rounded-2xl bg-white border-none shadow-xl text-lg" placeholder="Search Global Bank..." value={bankSearch} onChange={e => setBankSearch(e.target.value)} />
                 </div>

                 <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredBank.slice(0, 50).map(q => {
                      const isAdded = selectedQuestions.find(s => s.id === q.id)
                      return (
                        <div key={q.id} className="p-6 rounded-[1.5rem] border border-slate-100 bg-white flex items-center justify-between group hover:border-primary transition-all shadow-sm">
                           <div className="space-y-2 flex-1 pr-8">
                              <p className="font-bold text-slate-700 line-clamp-1">{q.questionEn}</p>
                              <div className="flex gap-2">
                                 <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-100 text-slate-400">{q.subjectId || 'GK'}</Badge>
                                 <Badge className="text-[8px] font-black uppercase bg-orange-50 text-orange-500 border-none">{q.difficulty}</Badge>
                              </div>
                           </div>
                           <Button 
                            onClick={() => isAdded ? setSelectedQuestions(selectedQuestions.filter(s => s.id !== q.id)) : setSelectedQuestions([...selectedQuestions, q])} 
                            variant={isAdded ? "default" : "outline"}
                            className={`rounded-xl h-10 px-6 font-black uppercase text-[9px] tracking-widest ${isAdded ? 'bg-emerald-500' : ''}`}
                           >
                             {isAdded ? <CheckCircle2 className="h-4 w-4 mr-2" /> : 'Link'} {isAdded ? 'Added' : 'MCQ'}
                           </Button>
                        </div>
                      )
                    })}
                 </div>
              </TabsContent>
           </Tabs>
        </div>
      </div>
    </div>
  )
}
