
"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  ChevronLeft, 
  Database, 
  ClipboardCheck,
  Search,
  Layers,
  Loader2,
  Plus,
  Trash2,
  Zap,
  Clock,
  MinusCircle,
  PlusCircle,
  XCircle,
  Gem,
  Filter,
  ListTree,
  GripVertical,
  BookOpen,
  History,
  Languages,
  Smartphone,
  CheckCircle2,
  ChevronDown
} from "lucide-react"
import { useCollection, useFirestore, useDoc } from "@/firebase"
import { collection, doc, setDoc, serverTimestamp, query, where, limit, getDocs } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { MockType, Difficulty, AccessType } from "@/types"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Institutional Mock Architect v8.5.
 * Features: PSSSB Standard Section Registry, Modular Assembly, and Targeted Ingestion.
 * Fixed: Layout overflow in bank header and scrollable subject nodes.
 */

const PSSSB_SECTIONS = [
  "General Knowledge & Current Affairs",
  "Punjab History & Culture",
  "Logical Reasoning & Mental Ability",
  "Quantitative Aptitude",
  "Punjabi (Qualifying - Part A)",
  "Punjabi (Part B)",
  "English Language",
  "Information Technology (ICT)",
  "Agriculture & General Economy"
];

export default function MockBuilderPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><Loader2 className="h-10 w-10 text-primary animate-spin" /></div>}>
      <MockBuilderContent />
    </Suspense>
  )
}

function MockBuilderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const db = useFirestore()
  const { toast } = useToast()

  const mockId = searchParams.get("id")
  const isEditing = !!mockId

  const { data: existingMock } = useDoc<any>(useMemo(() => (db && mockId ? doc(db, "mocks", mockId) : null), [db, mockId]))
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))
  const { data: passes } = useCollection<any>(useMemo(() => (db ? query(collection(db, "passes"), where("active", "==", true)) : null), [db]))
  
  const [bankLoading, setBankLoading] = useState(false)
  const [questionBank, setQuestionBank] = useState<any[]>([])
  const [bankFilter, setBankFilter] = useState({ subjectId: "all", search: "" })

  const [isPublishing, setIsPublishing] = useState(false)
  const [mockData, setMockData] = useState<any>({
    title: "", 
    boardId: "", 
    examId: "",
    duration: 120, 
    difficulty: "Medium" as Difficulty, 
    mockType: "FULL" as MockType, 
    accessType: "FREE" as AccessType,
    passId: "any", 
    published: false,
    positiveMarks: 1,
    negativeMarks: 0.25,
  })

  // Subject-Wise Section State
  const [sections, setSections] = useState<any[]>([
    { id: 'sec-1', name: 'General Knowledge & Current Affairs', questions: [] }
  ])
  const [activeSectionId, setActiveSectionId] = useState('sec-1')
  const [bankSelection, setBankSelection] = useState<string[]>([])

  useEffect(() => {
    async function fetchBank() {
      if (!db) return
      setBankLoading(true)
      try {
        const q = query(collection(db, "questions"), limit(500))
        const snap = await getDocs(q)
        setQuestionBank(snap.docs.map(d => ({ ...d.data(), id: d.id })))
      } finally {
        setBankLoading(false)
      }
    }
    fetchBank()
  }, [db])

  // Hydrate sections on edit
  useEffect(() => {
    if (existingMock && questionBank.length > 0) {
      setMockData(prev => ({ 
        ...prev, 
        ...existingMock,
        passId: existingMock.passId || "any"
      }));

      if (existingMock.sections && existingMock.sections.length > 0) {
        const hydratedSections = existingMock.sections.map((s: any, idx: number) => {
          const qIds = existingMock.questionIds?.slice(
            existingMock.sections.slice(0, idx).reduce((acc: number, curr: any) => acc + curr.count, 0),
            existingMock.sections.slice(0, idx + 1).reduce((acc: number, curr: any) => acc + curr.count, 0)
          ) || [];
          
          return {
            id: `sec-${idx + 1}`,
            name: s.name,
            questions: questionBank.filter(q => qIds.includes(q.id))
          };
        });
        setSections(hydratedSections);
        if (hydratedSections[0]) setActiveSectionId(hydratedSections[0].id);
      } else if (existingMock.questionIds) {
        setSections([{
          id: 'sec-1',
          name: 'General',
          questions: questionBank.filter(q => existingMock.questionIds.includes(q.id))
        }]);
      }
    }
  }, [existingMock, questionBank])

  const filteredBank = useMemo(() => {
    const allSelectedIds = sections.flatMap(s => s.questions.map(q => q.id));
    return questionBank.filter((q: any) => {
      const matchesSub = bankFilter.subjectId === "all" || q.subjectId === bankFilter.subjectId
      const qText = (q.englishQuestion || q.questionEn || q.questionText || "").toLowerCase()
      const matchesSearch = !bankFilter.search || qText.includes(bankFilter.search.toLowerCase())
      const notAlreadySelected = !allSelectedIds.includes(q.id)
      return matchesSub && matchesSearch && notAlreadySelected
    })
  }, [questionBank, bankFilter, sections])

  const handleAddSection = (presetName?: string) => {
    const newId = `sec-${Date.now()}`;
    setSections([...sections, { id: newId, name: presetName || `New Section ${sections.length + 1}`, questions: [] }]);
    setActiveSectionId(newId);
  }

  const handleUpdateSectionName = (id: string, name: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, name } : s));
  }

  const handleBulkLink = () => {
    const toAdd = questionBank.filter(q => bankSelection.includes(q.id))
    setSections(sections.map(s => s.id === activeSectionId ? { ...s, questions: [...s.questions, ...toAdd] } : s));
    setBankSelection([])
    toast({ title: "Nodes Linked", description: `${toAdd.length} questions linked to current section.` })
  }

  const removeQuestion = (sectionId: string, qId: string) => {
    setSections(sections.map(s => s.id === sectionId ? { ...s, questions: s.questions.filter((q: any) => q.id !== qId) } : s));
  }

  const handlePublish = async () => {
    if (!mockData.title || !mockData.boardId || !mockData.examId) {
      toast({ variant: "destructive", title: "Missing Node", description: "Title, Board, and Exam are mandatory." })
      return
    }

    const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0);
    if (totalQuestions === 0) {
      toast({ variant: "destructive", title: "Audit Blocked", description: "Empty mocks cannot be deployed." });
      return;
    }

    setIsPublishing(true)
    const finalId = mockId || `mock-${Date.now()}`
    const mockRef = doc(db!, "mocks", finalId)
    
    const flatQuestionIds = sections.flatMap(s => s.questions.map(q => q.id));
    const sectionMetadata = sections.map(s => ({
      name: s.name,
      count: s.questions.length
    })).filter(s => s.count > 0);

    const payload = {
      ...mockData,
      id: finalId,
      totalQuestions,
      questionIds: flatQuestionIds,
      sections: sectionMetadata,
      passId: mockData.passId === 'any' ? '' : mockData.passId,
      updatedAt: serverTimestamp(),
      createdAt: isEditing ? (existingMock?.createdAt || serverTimestamp()) : serverTimestamp(),
    };

    Object.keys(payload).forEach(key => (payload[key] === undefined || payload[key] === null) && delete payload[key]);

    try {
      await setDoc(mockRef, payload, { merge: true })
      toast({ title: "Series Deployed", description: "Blueprint committed to registry." })
      router.push("/admin/mocks")
    } catch (err: any) {
      toast({ variant: "destructive", title: "Sync Failed" })
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-10 pb-32 text-left pt-4">
      <div className="flex items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl border bg-white h-12 w-12 shadow-sm"><ChevronLeft className="h-6 w-6 text-[#0F172A]" /></Button>
          <div className="text-left">
            <h1 className="text-4xl font-black font-headline uppercase tracking-tight text-[#0F172A]">Mock Architect</h1>
            <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 mt-1">Institutional CBT Blueprinting Engine</p>
          </div>
        </div>
        <div className="flex gap-4">
           <Button className="bg-primary hover:bg-orange-600 font-black px-12 h-16 rounded-2xl uppercase text-[11px] tracking-[0.2em] gap-3 shadow-3xl" onClick={handlePublish} disabled={isPublishing}>
             {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardCheck className="h-5 w-5" />} {isEditing ? "Update Registry" : "Deploy Live Series"}
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none shadow-4xl rounded-[3rem] bg-white p-10 space-y-8">
             <div className="space-y-6">
               <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Series Headline</Label>
                 <Input value={mockData.title} onChange={e => setMockData({...mockData, title: e.target.value})} className="rounded-xl h-14 font-bold text-lg border-slate-100" />
               </div>

               <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Series Category</Label>
                  <Select value={mockData.mockType} onValueChange={(v: MockType) => setMockData({...mockData, mockType: v})}>
                    <SelectTrigger className="rounded-xl h-12 bg-slate-50/50 border-none"><SelectValue placeholder="Category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL">Full Length Mock</SelectItem>
                      <SelectItem value="SECTIONAL">Sectional Test</SelectItem>
                      <SelectItem value="CHAPTER">Chapter Wise Test</SelectItem>
                      <SelectItem value="PYQ">Previous Year Paper</SelectItem>
                    </SelectContent>
                  </Select>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Authority</Label>
                   <Select value={mockData.boardId} onValueChange={v => setMockData({...mockData, boardId: v, examId: ""})}>
                     <SelectTrigger className="rounded-xl h-12 bg-slate-50/50 border-none"><SelectValue placeholder="Select" /></SelectTrigger>
                     <SelectContent>{boards?.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.abbreviation}</SelectItem>)}</SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Exam Hub</Label>
                   <Select value={mockData.examId} onValueChange={v => setMockData({...mockData, examId: v})}>
                     <SelectTrigger className="rounded-xl h-12 bg-slate-50/50 border-none"><SelectValue placeholder="Select" /></SelectTrigger>
                     <SelectContent>{exams?.filter((e: any) => e.boardId === mockData.boardId).map((e: any) => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                   </Select>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-500 ml-1 flex items-center gap-2"><Clock className="h-3 w-3" /> Duration (Mins)</Label>
                    <Input type="number" value={mockData.duration} onChange={e => setMockData({...mockData, duration: parseInt(e.target.value) || 0})} className="h-12 rounded-xl text-center border-slate-100" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-500 ml-1 flex items-center gap-2"><PlusCircle className="h-3 w-3 text-emerald-500" /> Correct Marks</Label>
                    <Input type="number" step="0.1" value={mockData.positiveMarks} onChange={e => setMockData({...mockData, positiveMarks: parseFloat(e.target.value) || 0})} className="h-12 rounded-xl text-center border-slate-100" />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-500 ml-1 flex items-center gap-2"><MinusCircle className="h-3 w-3 text-rose-500" /> Penalty Node</Label>
                    <Input type="number" step="0.05" value={mockData.negativeMarks} onChange={e => setMockData({...mockData, negativeMarks: parseFloat(e.target.value) || 0})} className="h-12 rounded-xl text-center border-slate-100" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Access Tier</Label>
                    <Select value={mockData.accessType} onValueChange={(v: AccessType) => setMockData({...mockData, accessType: v})}>
                      <SelectTrigger className="rounded-xl h-12 bg-slate-50/50 border-none"><SelectValue placeholder="Protocol" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FREE">Free Hub</SelectItem>
                        <SelectItem value="PREMIUM">Elite Vault</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
               </div>

               {mockData.accessType === 'PREMIUM' && (
                  <div className="space-y-2 animate-in slide-in-from-top-4">
                    <Label className="text-[10px] font-black uppercase text-primary ml-1">Required Pass Node</Label>
                    <Select value={mockData.passId || "any"} onValueChange={(v: string) => setMockData({...mockData, passId: v})}>
                      <SelectTrigger className="rounded-xl h-14 bg-primary/5 border-primary/20 text-primary font-bold"><SelectValue placeholder="Any Premium Pass" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Premium Pass</SelectItem>
                        {passes?.map((p: any) => (
                           <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
               )}

               <div className="pt-8 border-t border-slate-50 flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl">
                  <div className="space-y-0.5">
                     <p className="font-black text-[11px] uppercase text-[#0F172A]">Production Status</p>
                     <p className="text-[8px] text-slate-400 font-bold uppercase">Toggle to make series live</p>
                  </div>
                  <Switch checked={mockData.published} onCheckedChange={val => setMockData({...mockData, published: val})} />
               </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
           <Card className="border-none shadow-4xl rounded-[4rem] bg-white overflow-hidden min-h-[750px] flex flex-col">
              <Tabs defaultValue="bank" className="flex-1 flex flex-col">
                 <TabsList className="bg-slate-50/50 border-b border-slate-100 w-full justify-start h-20 px-10 gap-12 rounded-none">
                    <TabsTrigger value="bank" className="font-black uppercase text-[11px] tracking-widest gap-3 h-12 data-[state=active]:text-primary">
                       <Database className="h-4 w-4" /> Atomic Bank
                    </TabsTrigger>
                    <TabsTrigger value="assembly" className="font-black uppercase text-[11px] tracking-widest gap-3 h-12 data-[state=active]:text-primary">
                       <Layers className="h-4 w-4" /> Blueprint Assembly 
                       <Badge className="bg-primary text-white border-none text-[8px] ml-1">{sections.reduce((acc, s) => acc + s.questions.length, 0)}</Badge>
                    </TabsTrigger>
                 </TabsList>

                 <TabsContent value="bank" className="p-10 flex-1 flex flex-col m-0">
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                       <div className="relative flex-1">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input placeholder="Search bank nodes..." value={bankFilter.search} onChange={e => setBankFilter({...bankFilter, search: e.target.value})} className="h-12 pl-12 rounded-xl bg-slate-50 border-none text-[#0F172A] font-bold" />
                       </div>
                       
                       <div className="w-full md:w-64">
                          <Select value={bankFilter.subjectId} onValueChange={(v) => setBankFilter({...bankFilter, subjectId: v})}>
                             <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold text-xs">
                                <div className="flex items-center gap-2">
                                   <Filter className="h-3.5 w-3.5 text-primary" />
                                   <SelectValue placeholder="Choose Subject" />
                                </div>
                             </SelectTrigger>
                             <SelectContent className="max-h-[300px]">
                                <SelectItem value="all">All Subjects</SelectItem>
                                {subjects?.map((s: any) => (
                                   <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                ))}
                             </SelectContent>
                          </Select>
                       </div>
                    </div>

                    <div className="bg-[#0F172A] p-6 rounded-3xl mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-6 text-white shadow-2xl overflow-hidden">
                       <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 flex-1 min-w-0">
                          <div className="space-y-2 text-left min-w-0 flex-1 max-w-md">
                             <Label className="text-[9px] font-black uppercase text-slate-400 ml-1">Target Subject Node</Label>
                             <Select value={activeSectionId} onValueChange={setActiveSectionId}>
                                <SelectTrigger className="h-11 w-full bg-white/10 border-white/5 text-white font-black text-[10px] rounded-xl uppercase tracking-widest overflow-hidden">
                                   <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                   {sections.map(s => <SelectItem key={s.id} value={s.id} className="uppercase font-bold text-[10px]">{s.name}</SelectItem>)}
                                </SelectContent>
                             </Select>
                          </div>
                          
                          <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-10">
                             <Checkbox 
                               checked={filteredBank.length > 0 && bankSelection.length === filteredBank.length} 
                               onCheckedChange={(v) => {
                                  if (v) setBankSelection(filteredBank.map(q => q.id))
                                  else setBankSelection([])
                               }}
                             />
                             <div className="text-left">
                                <p className="font-black uppercase text-[10px] tracking-widest text-white">Select All</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">({bankSelection.length} Nodes)</p>
                             </div>
                          </div>
                       </div>

                       <div className="shrink-0">
                         <Button 
                           disabled={bankSelection.length === 0} 
                           onClick={handleBulkLink} 
                           className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 h-14 px-12 rounded-xl text-[10px] uppercase font-black tracking-[0.2em] shadow-xl transition-all active:scale-95"
                         >
                            Link {bankSelection.length} Nodes
                         </Button>
                       </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-3">
                       {bankLoading ? (
                          <div className="flex flex-col items-center justify-center py-20 opacity-20">
                             <Loader2 className="h-10 w-10 animate-spin mb-4" />
                             <p className="font-black uppercase text-[10px] tracking-widest">Hydrating Atomic Registry...</p>
                          </div>
                       ) : filteredBank.map(q => (
                          <div key={q.id} className={cn(
                             "p-5 rounded-2xl border flex items-center justify-between transition-all",
                             bankSelection.includes(q.id) ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-white border-slate-100 hover:border-primary/10"
                          )}>
                             <div className="flex items-center gap-6 min-w-0 flex-1 text-left">
                                <Checkbox 
                                  checked={bankSelection.includes(q.id)} 
                                  onCheckedChange={() => {
                                     setBankSelection(prev => prev.includes(q.id) ? prev.filter(id => id !== q.id) : [...prev, q.id])
                                  }}
                                />
                                <div className="min-w-0 flex-1">
                                   <p className="font-bold text-sm text-[#0F172A] truncate">{q.englishQuestion || q.questionEn || q.questionText}</p>
                                   <div className="flex items-center gap-3 mt-1.5">
                                      <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-100 text-slate-400 px-2 py-0">{q.subjectId}</Badge>
                                      <span className="text-[7px] font-mono text-slate-300 uppercase">ID: {q.id?.slice(-8)}</span>
                                   </div>
                                </div>
                             </div>
                             <Button size="sm" variant="ghost" className="text-primary font-black uppercase text-[9px] hover:bg-primary/10 ml-4 shrink-0" onClick={() => {
                                setSections(sections.map(s => s.id === activeSectionId ? { ...s, questions: [...s.questions, q] } : s));
                             }}>Link Node</Button>
                          </div>
                       ))}
                       
                       {filteredBank.length === 0 && !bankLoading && (
                          <div className="text-center py-32 opacity-20 flex flex-col items-center gap-6">
                             <Database className="h-16 w-16 text-slate-300" />
                             <p className="font-black uppercase text-sm tracking-[0.3em] text-slate-500">No matching nodes in this registry segment.</p>
                          </div>
                       )}
                    </div>
                 </TabsContent>

                 <TabsContent value="assembly" className="p-10 flex-1 flex flex-col m-0">
                    <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                       <div className="space-y-1 text-left">
                          <p className="font-black uppercase text-[11px] text-[#0F172A] tracking-widest">CBT Blueprint Sections ({sections.length})</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Define logical subject segments for this series.</p>
                       </div>
                       
                       <div className="flex items-center gap-3">
                          <Select onValueChange={(val) => handleAddSection(val)}>
                             <SelectTrigger className="h-11 w-64 bg-white border-slate-200 rounded-xl font-black uppercase text-[9px] tracking-widest">
                                <Plus className="h-3 w-3 text-primary mr-2" /> 
                                <SelectValue placeholder="Add PSSSB Subject" />
                             </SelectTrigger>
                             <SelectContent className="max-h-[300px]">
                                {PSSSB_SECTIONS.map(s => <SelectItem key={s} value={s} className="font-bold text-[10px] uppercase">{s}</SelectItem>)}
                             </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm" className="bg-white rounded-xl h-11 px-6 font-black uppercase text-[9px] text-[#0F172A] border-slate-200 gap-2 shadow-sm" onClick={() => handleAddSection()}>
                             Custom Node
                          </Button>
                       </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-12 pb-20">
                       {sections.map((section, sIdx) => (
                          <div key={section.id} className="space-y-5 animate-in slide-in-from-bottom-2 duration-500">
                             <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-4 flex-1">
                                   <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-black text-[10px]">{sIdx + 1}</div>
                                   <input 
                                     value={section.name}
                                     onChange={(e) => handleUpdateSectionName(section.id, e.target.value)}
                                     className="bg-transparent border-none font-black uppercase text-sm text-[#0F172A] outline-none w-full tracking-widest focus:text-primary transition-colors"
                                     placeholder="Enter Section Name..."
                                   />
                                </div>
                                <div className="flex items-center gap-4">
                                   <Badge className="bg-primary/10 text-primary border-none font-black text-[9px] px-3 py-1 rounded-lg uppercase tracking-widest">{section.questions.length} Linked Nodes</Badge>
                                   <Button 
                                     size="icon" 
                                     variant="ghost" 
                                     className="h-10 w-10 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all"
                                     onClick={() => {
                                        if (section.questions.length > 0) {
                                           if (confirm("This section contains linked questions. Purge anyway?")) {
                                              setSections(sections.filter(s => s.id !== section.id));
                                           }
                                        } else {
                                           setSections(sections.filter(s => s.id !== section.id));
                                        }
                                     }}
                                   >
                                      <Trash2 className="h-5 w-5" />
                                   </Button>
                                </div>
                             </div>

                             <div className="space-y-2.5 pl-12">
                                {section.questions.map((q: any, qIdx: number) => (
                                   <div key={`${q.id}-${qIdx}`} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group/q hover:border-primary/20 transition-all shadow-sm">
                                      <div className="flex items-center gap-5 min-w-0 flex-1 text-left">
                                         <span className="font-black text-[10px] text-slate-300 shrink-0">#{qIdx+1}</span>
                                         <p className="font-bold text-xs text-[#0F172A] truncate">{q.englishQuestion || q.questionEn || q.questionText}</p>
                                      </div>
                                      <Button size="icon" variant="ghost" className="h-9 w-9 rounded-lg text-slate-300 hover:text-rose-50 hover:bg-rose-50 opacity-20 group-hover/q:opacity-100 transition-all" onClick={() => removeQuestion(section.id, q.id)}>
                                         <Trash2 className="h-4 w-4" />
                                      </Button>
                                   </div>
                                ))}
                                {section.questions.length === 0 && (
                                   <div className="p-10 border-2 border-dashed border-slate-100 rounded-3xl text-center opacity-30 flex flex-col items-center gap-3">
                                      <Zap className="h-8 w-8 text-slate-300" />
                                      <p className="italic text-[10px] uppercase font-black tracking-widest text-slate-400">Zero nodes linked to this subject node.</p>
                                   </div>
                                )}
                             </div>
                          </div>
                       ))}
                    </div>
                 </TabsContent>
              </Tabs>
           </Card>
        </div>
      </div>
    </div>
  )
}
