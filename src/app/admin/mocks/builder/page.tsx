
"use client"

import React, { useState, useMemo, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
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
  PlusCircle,
  Filter,
  BookOpen,
  Lock,
  History,
  Target,
  Languages,
  ShieldCheck,
  Settings2,
  CheckCircle2,
  Gem,
  LayoutGrid,
  Landmark,
  ChevronRight,
  GraduationCap,
  AlertTriangle,
  FileStack,
  ListTree,
  SearchCode,
  Unlock
} from "lucide-react"
import { useCollection, useFirestore, useDoc } from "@/firebase"
import { collection, doc, setDoc, serverTimestamp, query, limit, getDocs, writeBatch, where } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { MockType, Difficulty, AccessLevel, LanguageDisplayMode } from "@/types"
import { cn } from "@/lib/utils"

const SELECTION_RULES = [
  { id: 'unused-only', label: 'Use Only Unused Questions', icon: <Zap className="h-3 w-3" /> },
  { id: 'no-locked', label: 'Exclude Locked Assets', icon: <Lock className="h-3 w-3" /> },
  { id: 'no-duplicates', label: 'Block Duplicates', icon: <ShieldCheck className="h-3 w-3" /> }
];

const ASSIGNMENT_MODES = [
  { id: 'SINGLE', label: 'Single Vertical' },
  { id: 'MULTIPLE', label: 'Multiple Verticals' },
  { id: 'BOARD', label: 'Entire Authority Hub' }
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
  const { data: rawBoards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: allExamsRaw } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))
  
  const boards = useMemo(() => {
     if (!rawBoards) return [];
     const unique = new Map();
     rawBoards.forEach(b => {
        const key = b.abbreviation?.toLowerCase().trim() || b.id;
        if (!unique.has(key)) unique.set(key, b);
     });
     return Array.from(unique.values()).sort((a, b) => a.abbreviation.localeCompare(b.abbreviation));
  }, [rawBoards]);

  const allExams = useMemo(() => {
     if (!allExamsRaw) return [];
     const unique = new Map();
     allExamsRaw.forEach(e => {
        const normalizedName = e.name?.toLowerCase().trim();
        if (!unique.has(normalizedName)) {
           unique.set(normalizedName, e);
        }
     });
     return Array.from(unique.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [allExamsRaw]);

  const [bankLoading, setBankLoading] = useState(false)
  const [questionBank, setQuestionBank] = useState<any[]>([])
  const [activeRules, setActiveRules] = useState<string[]>(['unused-only', 'no-locked', 'no-duplicates'])
  const [assignmentMode, setAssignmentMode] = useState<'SINGLE' | 'MULTIPLE' | 'BOARD'>('SINGLE')
  const [searchBoard, setSearchBoard] = useState("")
  const [searchExam, setSearchExam] = useState("")
  
  const [isPublishing, setIsPublishing] = useState(false)
  const [mockData, setMockData] = useState<any>({
    title: "", 
    sourceBoardId: "", 
    boardIds: [] as string[], 
    examIds: [] as string[],
    duration: 120, 
    difficulty: "Medium" as Difficulty, 
    mockType: "FULL" as MockType, 
    accessLevel: "FREE" as AccessLevel,
    published: false,
    languageMode: "ENGLISH_PUNJABI" as LanguageDisplayMode,
    positiveMarks: 1,
    negativeMarks: 0.25,
    attemptLimit: 0,
  })

  const [sections, setSections] = useState<any[]>([
    { id: 'sec-1', name: 'General Hub', questions: [] }
  ])
  const [activeSectionId, setActiveSectionId] = useState('sec-1')
  const [bankSelection, setBankSelection] = useState<string[]>([])
  const [bankFilter, setBankFilter] = useState({ subjectId: "all" })

  useEffect(() => {
    async function fetchBank() {
      if (!db || !mockData.sourceBoardId) return
      setBankLoading(true)
      try {
        const q = query(collection(db, "questions"), where("boardId", "==", mockData.sourceBoardId), limit(2000))
        const snap = await getDocs(q)
        setQuestionBank(snap.docs.map(d => ({ ...d.data(), id: d.id })))
      } finally {
        setBankLoading(false)
      }
    }
    fetchBank()
  }, [db, mockData.sourceBoardId])

  useEffect(() => {
    if (existingMock && questionBank.length > 0) {
      setMockData(prev => ({ 
        ...prev, 
        ...existingMock,
        accessLevel: existingMock.accessLevel || 'FREE'
      }));

      if (existingMock.sections && existingMock.sections.length > 0 && existingMock.questionIds) {
        let currentIndex = 0;
        const qIds = existingMock.questionIds;
        const hydratedSections = existingMock.sections.map((s: any, idx: number) => {
          const sectionQIds = qIds.slice(currentIndex, currentIndex + (s.count || 0));
          currentIndex += (s.count || 0);
          return { id: `sec-${idx + 1}`, name: s.name, questions: questionBank.filter(q => sectionQIds.includes(q.id)) };
        });
        setSections(hydratedSections);
        if (hydratedSections[0]) setActiveSectionId(hydratedSections[0].id);
      }
    }
  }, [existingMock, questionBank])

  const filteredBank = useMemo(() => {
    const allSelectedIds = sections.flatMap(s => s.questions.map(q => q.id));
    return questionBank.filter((q: any) => {
      const matchesSubject = bankFilter.subjectId === "all" || q.subjectId === bankFilter.subjectId
      const notAlreadySelected = !allSelectedIds.includes(q.id)
      const qStatus = q.status || 'UNUSED';
      if (activeRules.includes('unused-only') && (qStatus === 'USED' || (q.usedCount || 0) > 0)) return false;
      if (activeRules.includes('no-locked') && qStatus === 'LOCKED') return false;
      return matchesSubject && notAlreadySelected
    })
  }, [questionBank, bankFilter, sections, activeRules])

  const handleBulkLink = () => {
    const toAdd = questionBank.filter(q => bankSelection.includes(q.id))
    setSections(sections.map(s => s.id === activeSectionId ? { ...s, questions: [...s.questions, ...toAdd] } : s));
    setBankSelection([])
    toast({ title: "Assets Linked" })
  }

  const handlePublish = async () => {
    if (!db || isPublishing) return
    if (!mockData.title || !mockData.sourceBoardId) {
      toast({ variant: "destructive", title: "Audit Blocked", description: "Source Board and Title are mandatory." })
      return
    }

    const flatQuestionIds = sections.flatMap(s => s.questions.map(q => q.id));
    if (flatQuestionIds.length === 0) {
      toast({ variant: "destructive", title: "Deployment Rejected", description: "At least one question must be linked." })
      return;
    }

    setIsPublishing(true)
    const finalId = mockId || `mock-${Date.now()}`
    const mockRef = doc(db, "mocks", finalId)
    const sectionMetadata = sections.map(s => ({ name: s.name, count: s.questions.length })).filter(s => s.count > 0);

    const payload = {
      ...mockData,
      id: finalId,
      totalQuestions: flatQuestionIds.length,
      questionIds: flatQuestionIds,
      sections: sectionMetadata,
      updatedAt: serverTimestamp(),
      createdAt: existingMock?.createdAt || serverTimestamp(),
      totalMarks: flatQuestionIds.length * (parseFloat(mockData.positiveMarks) || 1),
    };

    try {
      await setDoc(mockRef, payload, { merge: true });
      const batch = writeBatch(db);
      flatQuestionIds.forEach(id => {
        batch.update(doc(db, "questions", id), { status: 'USED', updatedAt: serverTimestamp() });
      });
      await batch.commit();
      toast({ title: "Series Deployed", description: "The mock has been synced." });
      router.push("/admin/mocks")
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Failed" })
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-32 text-left pt-4">
      <div className="flex flex-wrap items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-4 md:gap-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl border bg-white h-12 w-12 shadow-sm"><ChevronLeft className="h-6 w-6" /></Button>
          <div className="text-left">
            <h1 className="text-2xl md:text-4xl font-headline font-black uppercase tracking-tight text-[#0F172A]">{isEditing ? "Modify Mock" : "Elite Architect"}</h1>
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">Registry Flow Engine</p>
          </div>
        </div>
        <Button onClick={handlePublish} disabled={isPublishing} className="bg-primary hover:bg-orange-600 font-black px-6 md:px-12 h-14 md:h-16 rounded-2xl uppercase text-[10px] md:text-[11px] tracking-[0.2em] gap-3 shadow-3xl">
          {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardCheck className="h-5 w-5" />} Deploy Live Registry
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 px-4">
        <div className="lg:col-span-4 space-y-8 overflow-y-auto max-h-[85vh] custom-scrollbar pr-2">
          <Card className="border-none shadow-4xl rounded-[3rem] bg-white p-10 space-y-8">
             <div className="space-y-8">
                <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] ml-1">Mock Metadata</p>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Series Title</Label>
                   <Input value={mockData.title ?? ""} onChange={e => setMockData({...mockData, title: e.target.value})} className="rounded-xl h-14 font-bold text-lg border-slate-100" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   {/* Phase 7: Access Level Select */}
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Access Level</Label>
                      <Select value={mockData.accessLevel} onValueChange={(v: AccessLevel) => setMockData({...mockData, accessLevel: v})}>
                         <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-black text-[9px] uppercase">
                            <div className="flex items-center gap-2">
                               {mockData.accessLevel === 'PREMIUM' ? <Lock className="h-3 w-3 text-amber-500" /> : <Unlock className="h-3 w-3 text-emerald-500" />}
                               <SelectValue />
                            </div>
                         </SelectTrigger>
                         <SelectContent>
                            <SelectItem value="FREE">FREE TEST</SelectItem>
                            <SelectItem value="PREMIUM">PREMIUM TEST</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Mock Type</Label>
                      <Select value={mockData.mockType} onValueChange={(v: any) => setMockData({...mockData, mockType: v})}>
                         <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-black text-[9px] uppercase"><SelectValue /></SelectTrigger>
                         <SelectContent>
                            <SelectItem value="FULL">Full Length</SelectItem>
                            <SelectItem value="SUBJECT">Subject-wise</SelectItem>
                            <SelectItem value="SECTIONAL">Sectional</SelectItem>
                            <SelectItem value="PYQ">PYQ Papers</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Duration (Mins)</Label>
                      <Input type="number" value={mockData.duration} onChange={e => setMockData({...mockData, duration: parseInt(e.target.value) || 0})} className="h-12 rounded-xl bg-slate-50/50" />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Attempt Limit</Label>
                      <Input type="number" value={mockData.attemptLimit} onChange={e => setMockData({...mockData, attemptLimit: parseInt(e.target.value) || 0})} className="h-12 rounded-xl bg-slate-50/50" />
                   </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="font-black text-[11px] uppercase text-[#0F172A]">Registry Live</p>
                  <Switch checked={mockData.published} onCheckedChange={v => setMockData({...mockData, published: v})} />
                </div>
             </div>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
           <Card className="border-none shadow-4xl rounded-[4rem] bg-white overflow-hidden min-h-[600px] flex flex-col border border-slate-100">
              <Tabs defaultValue="bank" className="flex-1 flex flex-col">
                 <TabsList className="bg-slate-50/50 border-b border-slate-100 w-full justify-start h-20 px-10 gap-12 rounded-none">
                    <TabsTrigger value="bank" className="font-black uppercase text-[11px] tracking-widest gap-3 h-12 data-[state=active]:text-primary"><Database className="h-4 w-4" /> Global Silo</TabsTrigger>
                    <TabsTrigger value="assembly" className="font-black uppercase text-[11px] tracking-widest gap-3 h-12 data-[state=active]:text-primary"><Layers className="h-4 w-4" /> Section Assembly</TabsTrigger>
                 </TabsList>

                 <TabsContent value="bank" className="p-10 flex-1 flex flex-col m-0 text-left">
                    {!mockData.sourceBoardId ? (
                       <div className="bg-[#0B1528] p-10 rounded-[2.5rem] mb-10 text-white shadow-2xl">
                          <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-4">Select Source Board</p>
                          <Select value={mockData.sourceBoardId} onValueChange={(v) => setMockData({...mockData, sourceBoardId: v})}>
                             <SelectTrigger className="h-14 rounded-xl bg-white/5 border-none font-black uppercase text-[11px] tracking-widest"><SelectValue placeholder="Source Silo" /></SelectTrigger>
                             <SelectContent>{boards?.map((b: any) => <SelectItem key={b.id} value={b.id}>{b.abbreviation} Silo</SelectItem>)}</SelectContent>
                          </Select>
                       </div>
                    ) : (
                       <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-4">
                          {questionBank.map(q => (
                             <div key={q.id} onClick={() => setBankSelection(p => p.includes(q.id) ? p.filter(id => id !== q.id) : [...p, q.id])} className={cn("p-4 rounded-xl border flex items-center justify-between cursor-pointer", bankSelection.includes(q.id) ? "bg-primary/5 border-primary" : "bg-white border-slate-100")}>
                                <div className="flex items-center gap-4">
                                   <Checkbox checked={bankSelection.includes(q.id)} onCheckedChange={() => {}} />
                                   <p className="font-bold text-sm truncate max-w-lg">{q.englishQuestion}</p>
                                </div>
                                <Badge variant="outline" className="text-[8px] font-black uppercase">{q.status || 'UNUSED'}</Badge>
                             </div>
                          ))}
                       </div>
                    )}
                    {bankSelection.length > 0 && <div className="pt-6"><Button onClick={handleBulkLink} className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px]">Link {bankSelection.length} Assets</Button></div>}
                 </TabsContent>

                 <TabsContent value="assembly" className="p-10 flex-1 flex flex-col m-0 text-left">
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8">
                       {sections.map(s => (
                          <div key={s.id} className="space-y-4">
                             <div className="flex items-center justify-between border-b pb-2">
                                <h4 className="font-black uppercase text-xs text-primary">{s.name} ({s.questions.length})</h4>
                                <Button variant="ghost" size="icon" onClick={() => setSections(p => p.filter(x => x.id !== s.id))}><Trash2 className="h-4 w-4" /></Button>
                             </div>
                             {s.questions.map((q:any) => <div key={q.id} className="text-xs font-bold text-slate-500 bg-slate-50 p-2 rounded-lg truncate">{q.englishQuestion}</div>)}
                          </div>
                       ))}
                       <Button onClick={() => setSections([...sections, { id: `sec-${Date.now()}`, name: `Section ${sections.length + 1}`, questions: [] }])} variant="outline" className="w-full border-dashed h-14 rounded-xl">Add Section</Button>
                    </div>
                 </TabsContent>
              </Tabs>
           </Card>
        </div>
      </div>
    </div>
  )
}
