
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
  Lock,
  Target,
  ShieldCheck,
  CheckCircle2,
  Landmark,
  GraduationCap,
  MoveUp,
  MoveDown,
  Languages,
  BookOpen,
  X,
  Globe,
  LayoutGrid,
  Tags,
  SearchCode,
  Box
} from "lucide-react"
import { useCollection, useFirestore, useDoc } from "@/firebase"
import { collection, doc, setDoc, serverTimestamp, query, limit, getDocs, writeBatch, where, documentId, orderBy } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { MockType, Difficulty, AccessLevel, LanguageDisplayMode, MockAssignmentMode } from "@/types"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * @fileOverview Institutional Mock Architect v18.0 (Production Recovery).
 * RESTORED: Full question bank management, search, and sectional assembly.
 * UPDATED: Category -> Hub -> Vertical hierarchy for targeted distribution.
 */

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

  // --- DATA LISTENERS ---
  const { data: existingMock } = useDoc<any>(useMemo(() => (db && mockId ? doc(db, "mocks", mockId) : null), [db, mockId]))
  const { data: categories } = useCollection<any>(useMemo(() => (db ? query(collection(db, "categories"), orderBy("displayOrder", "asc")) : null), [db]))
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards"), orderBy("displayOrder", "asc")) : null), [db]))
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams")) : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects")) : null), [db]))
  
  // --- STATE HUB ---
  const [bankLoading, setBankLoading] = useState(false)
  const [questionBank, setQuestionBank] = useState<any[]>([])
  const [isPublishing, setIsPublishing] = useState(false)
  
  // Question Bank Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBoard, setFilterBoard] = useState("all")
  const [filterExam, setFilterExam] = useState("all")
  const [filterSubject, setFilterSubject] = useState("all")
  const [hideUsed, setHideUsed] = useState(true)
  const [blockDuplicates, setBlockDuplicates] = useState(true)
  const [bankSelection, setBankSelection] = useState<string[]>([])

  // Mock Metadata & Architecture
  const [mockData, setMockData] = useState<any>({
    title: "", 
    categoryId: "all",
    boardIds: [] as string[],
    examIds: [] as string[],
    mockType: "FULL" as MockType, 
    duration: 120, 
    difficulty: "Medium" as Difficulty, 
    accessLevel: "FREE" as AccessLevel,
    published: true,
    languageMode: "ENGLISH_PUNJABI" as LanguageDisplayMode,
    positiveMarks: 1,
    negativeMarks: 0.25,
    attemptLimit: 0,
  })

  // Assembly State
  const [sections, setSections] = useState<any[]>([
    { id: 'sec-1', name: 'General Hub', questions: [] }
  ])
  const [activeSectionId, setActiveSectionId] = useState('sec-1')

  // --- DERIVED REGISTRY COLLECTIONS ---
  const filteredBoardsForAssignment = useMemo(() => {
     if (!boards) return [];
     if (mockData.categoryId === "all") return boards;
     return boards.filter(b => b.categoryId === mockData.categoryId);
  }, [boards, mockData.categoryId]);

  const filteredExamsForAssignment = useMemo(() => {
     if (!exams) return [];
     if (mockData.boardIds?.length > 0) {
        return exams.filter(e => mockData.boardIds.includes(e.boardId));
     }
     return exams;
  }, [exams, mockData.boardIds]);

  // --- DATA SYNC ---
  useEffect(() => {
    async function fetchBank() {
      if (!db) return
      setBankLoading(true)
      try {
        const q = query(collection(db, "questions"), limit(2000))
        const snap = await getDocs(q)
        setQuestionBank(snap.docs.map(d => ({ ...d.data(), id: d.id })))
      } finally {
        setBankLoading(false)
      }
    }
    fetchBank()
  }, [db])

  useEffect(() => {
    if (existingMock && questionBank.length > 0) {
      setMockData({ 
        ...existingMock,
        categoryId: existingMock.categoryId || "all",
        boardIds: existingMock.boardIds || (existingMock.boardId ? [existingMock.boardId] : []),
        examIds: existingMock.examIds || (existingMock.examId ? [existingMock.examId] : [])
      });

      if (existingMock.questionIds) {
        let currentIndex = 0;
        const hydratedSections = (existingMock.sections || [{ name: 'General Hub', count: existingMock.questionIds.length }]).map((s: any, idx: number) => {
          const count = parseInt(s.count) || 0;
          const sectionQIds = existingMock.questionIds.slice(currentIndex, currentIndex + count);
          currentIndex += count;
          return { 
            id: `sec-${idx + 1}`, 
            name: s.name, 
            questions: sectionQIds.map(id => questionBank.find(q => q.id === id)).filter(Boolean) 
          };
        });
        setSections(hydratedSections);
      }
    }
  }, [existingMock, questionBank])

  // --- BANK FILTER LOGIC ---
  const filteredBank = useMemo(() => {
    const allSelectedIds = sections.flatMap(s => s.questions.map(q => q.id));
    const assemblyHashes = new Set(
      sections.flatMap(s => s.questions.map(q => 
        `${q.englishQuestion?.trim()}_${q.correctAnswer}`.toLowerCase()
      ))
    );

    return questionBank.filter((q: any) => {
      const matchesSearch = !searchTerm || (q.englishQuestion?.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesBoard = filterBoard === "all" || q.boardId === filterBoard;
      const matchesExam = filterExam === "all" || q.examId === filterExam;
      const matchesSub = filterSubject === "all" || q.subjectId === filterSubject;
      
      const notInThisMock = !allSelectedIds.includes(q.id);
      const usedGuard = !hideUsed || (q.status !== 'USED');
      
      const qHash = `${q.englishQuestion?.trim()}_${q.correctAnswer}`.toLowerCase();
      const isContentDuplicate = assemblyHashes.has(qHash);
      const duplicateGuard = !blockDuplicates || (!isContentDuplicate && q.status !== 'DUPLICATE');
      
      return matchesSearch && matchesBoard && matchesExam && matchesSub && notInThisMock && usedGuard && duplicateGuard;
    })
  }, [questionBank, searchTerm, filterBoard, filterExam, filterSubject, hideUsed, blockDuplicates, sections])

  // --- ACTIONS ---
  const handleLinkQuestions = () => {
    const toAdd = questionBank.filter(q => bankSelection.includes(q.id));
    setSections(prev => prev.map(s => s.id === activeSectionId ? { ...s, questions: [...s.questions, ...toAdd] } : s));
    setBankSelection([]);
    toast({ title: `Linked ${toAdd.length} Assets` });
  }

  const handleSelectAllInBank = () => {
    if (bankSelection.length === filteredBank.length) {
      setBankSelection([]);
    } else {
      setBankSelection(filteredBank.map(q => q.id));
    }
  }

  const handlePublish = async () => {
    if (!db || isPublishing) return
    if (!mockData.title || (mockData.boardIds.length === 0)) {
      toast({ variant: "destructive", title: "Audit Blocked", description: "Title and Target Hubs are mandatory." })
      return
    }

    const flatQuestionIds = sections.flatMap(s => s.questions.map(q => q.id));
    if (flatQuestionIds.length === 0) {
       toast({ variant: "destructive", title: "Link Blocked", description: "Add questions first." });
       return;
    }

    setIsPublishing(true)
    const finalId = mockId || `mock-${Date.now()}`
    const mockRef = doc(db, "mocks", finalId)
    const sectionMetadata = sections.map(s => ({ name: s.name, count: s.questions.length })).filter(s => s.count > 0);

    const payload = {
      ...mockData,
      id: finalId,
      boardId: mockData.boardIds[0] || "",
      totalQuestions: flatQuestionIds.length,
      questionIds: flatQuestionIds,
      sections: sectionMetadata,
      totalMarks: flatQuestionIds.length * (mockData.positiveMarks || 1),
      updatedAt: serverTimestamp(),
      createdAt: existingMock?.createdAt || serverTimestamp(),
    };

    try {
      await setDoc(mockRef, payload, { merge: true });
      const batch = writeBatch(db);
      flatQuestionIds.forEach(id => {
        batch.update(doc(db, "questions", id), { 
          status: 'USED', 
          updatedAt: serverTimestamp() 
        });
      });
      await batch.commit();
      toast({ title: "Series Deployed", description: "Mock series is now live." });
      router.push("/admin/mocks")
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Failed" })
    } finally {
      setIsPublishing(false)
    }
  }

  const toggleBoardId = (id: string) => {
     const current = mockData.boardIds || [];
     setMockData({
        ...mockData,
        boardIds: current.includes(id) ? current.filter(x => x !== id) : [...current, id]
     });
  };

  const toggleExamId = (id: string) => {
     const current = mockData.examIds || [];
     setMockData({
        ...mockData,
        examIds: current.includes(id) ? current.filter(x => x !== id) : [...current, id]
     });
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-8 pb-32 text-left pt-2 md:pt-4">
      
      {/* TOP COMMAND BAR */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl border bg-white h-12 w-12 shadow-sm">
             <ChevronLeft className="h-6 w-6" />
          </Button>
          <div className="text-left">
            <h1 className="text-2xl md:text-4xl font-headline font-black uppercase tracking-tight text-[#0F172A]">{isEditing ? "Modify Series" : "Mock Architect"}</h1>
            <p className="text-[9px] md:text-[10px] uppercase font-black tracking-widest text-slate-400 mt-1">Institutional Assembly Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <Button onClick={handlePublish} disabled={isPublishing} className="bg-[#0F172A] hover:bg-black text-white font-black px-8 md:px-12 h-14 md:h-16 rounded-2xl uppercase text-[10px] md:text-[11px] tracking-[0.2em] gap-3 shadow-3xl border-none">
             {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardCheck className="h-5 w-5" />} {isEditing ? "Sync Hub" : "Deploy Series"}
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 px-4">
        
        {/* LEFT: ARCHITECTURE SIDEBAR */}
        <div className="lg:col-span-4 space-y-8">
           <div className="space-y-8 bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100">
              
              <div className="space-y-6">
                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Series Title</Label>
                    <Input value={mockData.title || ""} onChange={e => setMockData({...mockData, title: e.target.value})} className="rounded-xl h-12 border-slate-100 bg-slate-50/50" placeholder="e.g. Patwari Full Mock 01" />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Test Type</Label>
                       <Select value={mockData.mockType || "FULL"} onValueChange={(v: any) => setMockData({...mockData, mockType: v})}>
                          <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-none font-bold text-[10px] uppercase"><SelectValue /></SelectTrigger>
                          <SelectContent>
                             <SelectItem value="FULL">Full Length Mock</SelectItem>
                             <SelectItem value="SUBJECT">Subject-Wise Test</SelectItem>
                             <SelectItem value="SECTIONAL">Sectional Test</SelectItem>
                             <SelectItem value="PYQ">PYQ Paper</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Access Level</Label>
                       <Select value={mockData.accessLevel || "FREE"} onValueChange={(v: any) => setMockData({...mockData, accessLevel: v})}>
                          <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-none font-bold text-[10px] uppercase"><SelectValue /></SelectTrigger>
                          <SelectContent>
                             <SelectItem value="FREE">Public (FREE)</SelectItem>
                             <SelectItem value="PREMIUM">Elite (PREMIUM)</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                 </div>

                 {/* HIERARCHICAL ASSIGNMENT HUB */}
                 <div className="space-y-6 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                       <LayoutGrid className="h-4 w-4 text-primary" />
                       <p className="text-[10px] font-black uppercase text-[#0F172A] tracking-[0.3em]">Assignment Hub</p>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="space-y-2">
                          <Label className="text-[9px] font-black uppercase text-slate-400">Target Category</Label>
                          <select 
                             value={mockData.categoryId} 
                             onChange={e => setMockData({...mockData, categoryId: e.target.value, boardIds: []})} 
                             className="w-full h-11 bg-slate-900 text-white border-none rounded-xl px-4 font-black uppercase text-[10px] outline-none"
                          >
                             <option value="all">ALL REGISTRY CATEGORIES</option>
                             {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
                          </select>
                       </div>

                       <div className="space-y-2">
                          <Label className="text-[9px] font-black uppercase text-slate-500">Target Authority Boards</Label>
                          <div className="max-h-40 overflow-y-auto custom-scrollbar pr-2 space-y-1 bg-slate-50 p-2 rounded-xl border border-slate-100 shadow-inner">
                             {filteredBoardsForAssignment.length > 0 ? filteredBoardsForAssignment.map((b: any) => (
                                <div key={b.id} className="flex items-center space-x-3 p-2 bg-white rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => toggleBoardId(b.id)}>
                                   <Checkbox checked={mockData.boardIds?.includes(b.id)} className="border-slate-300" />
                                   <span className="text-[10px] font-bold text-[#0F172A] uppercase">{b.abbreviation} HUB</span>
                                </div>
                             )) : <p className="text-[9px] text-slate-400 italic p-4 text-center">No Hubs in this category.</p>}
                          </div>
                       </div>

                       {mockData.boardIds?.length > 0 && (
                          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                             <Label className="text-[9px] font-black uppercase text-slate-500">Specific Verticals (Exams)</Label>
                             <div className="max-h-48 overflow-y-auto custom-scrollbar pr-2 space-y-1 bg-slate-50 p-2 rounded-xl border border-slate-100 shadow-inner">
                                {filteredExamsForAssignment.length > 0 ? filteredExamsForAssignment.map((e: any) => (
                                   <div key={e.id} className="flex items-center space-x-3 p-2 bg-white rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => toggleExamId(e.id)}>
                                      <Checkbox checked={mockData.examIds?.includes(e.id)} className="border-slate-300" />
                                      <span className="text-[10px] font-bold text-slate-500 uppercase">{e.name}</span>
                                   </div>
                                )) : <p className="text-[9px] text-slate-400 italic p-4 text-center">No exams linked to selected Hubs.</p>}
                             </div>
                          </div>
                       )}
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-4 pt-6 border-t border-slate-50">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Language Mode</Label>
                       <Select value={mockData.languageMode} onValueChange={(v: any) => setMockData({...mockData, languageMode: v})}>
                          <SelectTrigger className="h-11 rounded-xl bg-white border-slate-200 font-black uppercase text-[9px]"><SelectValue /></SelectTrigger>
                          <SelectContent>
                             <SelectItem value="ENGLISH_PUNJABI">English & ਪੰਜਾਬੀ</SelectItem>
                             <SelectItem value="ENGLISH_HINDI">English & हिन्दी</SelectItem>
                             <SelectItem value="ENGLISH">English Only</SelectItem>
                             <SelectItem value="PUNJABI">ਪੰਜਾਬੀ Only</SelectItem>
                             <SelectItem value="HINDI">हिन्दी Only</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-500 ml-1 flex items-center gap-2"><Clock className="h-3 w-3" /> Duration (Min)</Label>
                            <Input type="number" value={mockData.duration} onChange={e => setMockData({...mockData, duration: parseInt(e.target.value) || 0})} className="h-11 rounded-xl bg-slate-50 border-none font-black text-center" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-slate-500 ml-1 flex items-center gap-2"><Lock className="h-3 w-3" /> Limit</Label>
                            <Input type="number" value={mockData.attemptLimit} onChange={e => setMockData({...mockData, attemptLimit: parseInt(e.target.value) || 0})} className="h-11 rounded-xl bg-slate-50 border-none font-black text-center" />
                        </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT: CONTENT ASSEMBLY HUB */}
        <div className="lg:col-span-8 space-y-6">
           <Tabs defaultValue="bank" className="w-full">
              <TabsList className="bg-slate-100 p-1 h-14 rounded-2xl mb-8 flex justify-start gap-4">
                 <TabsTrigger value="bank" className="rounded-xl px-8 font-black uppercase text-[10px] h-full data-[state=active]:bg-white data-[state=active]:shadow-lg gap-2">
                   <Database className="h-4 w-4 text-primary" /> Global Question Bank
                 </TabsTrigger>
                 <TabsTrigger value="assembly" className="rounded-xl px-8 font-black uppercase text-[10px] h-full data-[state=active]:bg-white data-[state=active]:shadow-lg gap-2">
                   <Layers className="h-4 w-4 text-primary" /> Active Assembly Hub
                 </TabsTrigger>
              </TabsList>

              <TabsContent value="bank" className="space-y-8 m-0 animate-in fade-in duration-300">
                 <div className="bg-[#0B1528] rounded-[2.5rem] p-8 md:p-12 text-white space-y-10 shadow-4xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5"><Zap className="h-40 w-40" /></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10 text-left">
                       <div className="md:col-span-4 relative mb-4">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                          <Input 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                            className="h-14 pl-12 rounded-xl bg-white/5 border-white/10 text-white font-medium" 
                            placeholder="Search keywords..." 
                          />
                       </div>
                       <div className="space-y-3">
                          <Label className="text-[9px] font-black uppercase text-slate-400">Board Hub</Label>
                          <select value={filterBoard} onChange={e => setFilterBoard(e.target.value)} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 font-bold text-xs outline-none text-white">
                             <option value="all">All Boards</option>
                             {boards?.map((b:any) => <option key={b.id} value={b.id}>{b.abbreviation}</option>)}
                          </select>
                       </div>
                       <div className="space-y-3">
                          <Label className="text-[9px] font-black uppercase text-slate-400">Vertical</Label>
                          <select value={filterExam} onChange={e => setFilterExam(e.target.value)} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 font-bold text-xs outline-none text-white">
                             <option value="all">All Verticals</option>
                             {exams?.map((ex:any) => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                          </select>
                       </div>
                       <div className="space-y-3">
                          <Label className="text-[9px] font-black uppercase text-slate-400">Subject Hub</Label>
                          <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 font-bold text-xs outline-none text-white">
                             <option value="all">All Subjects</option>
                             {subjects?.map((s:any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                       </div>
                       <div className="flex items-center gap-4 bg-white/5 px-6 h-11 rounded-xl border border-white/5 mt-auto">
                          <span className="text-[9px] font-black uppercase text-slate-400">Unused Only</span>
                          <Switch checked={hideUsed} onCheckedChange={setHideUsed} className="data-[state=checked]:bg-primary" />
                       </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 relative z-10">
                       <div className="flex flex-wrap items-center justify-between gap-6">
                          <div className="flex flex-wrap items-center gap-6">
                             <div className="space-y-3 text-left min-w-[240px]">
                                <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target Section</Label>
                                <select 
                                  value={activeSectionId} 
                                  onChange={e => setActiveSectionId(e.target.value)} 
                                  className="w-full h-12 bg-primary text-white border-none rounded-xl px-4 font-black uppercase text-[10px] outline-none shadow-inner"
                                >
                                   {sections.map(s => <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>)}
                                </select>
                             </div>
                             
                             <button 
                               onClick={handleSelectAllInBank} 
                               className="h-12 px-6 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 transition-all"
                             >
                                {bankSelection.length === filteredBank.length ? 'Deselect All' : 'Select All Filtered'}
                             </button>
                          </div>

                          <div className="shrink-0">
                            <Button 
                              onClick={handleLinkQuestions}
                              disabled={bankSelection.length === 0}
                              className="h-16 px-10 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-2xl shadow-3xl border-none transition-all active:scale-95"
                            >
                               Link {bankSelection.length} Assets
                            </Button>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    {bankLoading ? (
                       Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl bg-white" />)
                    ) : filteredBank.length > 0 ? (
                       <div className="grid grid-cols-1 gap-3">
                          {filteredBank.map((q) => (
                             <div 
                               key={q.id} 
                               onClick={() => setBankSelection(p => p.includes(q.id) ? p.filter(id => id !== q.id) : [...p, q.id])}
                               className={cn(
                                 "group p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex items-center gap-8 text-left",
                                 bankSelection.includes(q.id) ? "bg-primary/5 border-primary shadow-xl" : "bg-white border-slate-100 hover:border-slate-300"
                               )}
                             >
                                <div className={cn(
                                   "h-8 w-8 rounded-full border-[3px] flex items-center justify-center transition-all",
                                   bankSelection.includes(q.id) ? "bg-primary border-primary" : "border-slate-200 group-hover:border-primary/40"
                                )}>
                                   {bankSelection.includes(q.id) && <CheckCircle2 className="h-5 w-5 text-white" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                   <div className="flex items-center gap-3 mb-2">
                                      <Badge className="bg-[#0F172A] text-white border-none font-black uppercase text-[8px] px-3 py-1 rounded shadow-sm">{q.boardId}</Badge>
                                      <Badge variant="outline" className="bg-slate-50 border-slate-100 text-[#0F172A] font-black uppercase text-[8px] px-2 py-0.5">{q.subjectId}</Badge>
                                   </div>
                                   <p className="font-bold text-[#0F172A] text-lg leading-snug line-clamp-1">{q.englishQuestion}</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    ) : (
                       <div className="py-32 text-center opacity-20 flex flex-col items-center gap-4">
                          <Database className="h-20 w-20 text-slate-300" />
                          <p className="font-black uppercase tracking-widest text-sm text-slate-500">No Registry Assets Found</p>
                       </div>
                    )}
                 </div>
              </TabsContent>

              <TabsContent value="assembly" className="space-y-12 m-0 animate-in fade-in duration-300">
                 <div className="space-y-10">
                    {sections.map((sec, sIdx) => (
                      <Card key={sec.id} className="border-none shadow-3xl rounded-[3rem] bg-white overflow-hidden border border-slate-100 hover:border-primary/20 transition-all group">
                         <div className="flex items-center justify-between p-8 bg-slate-50/50 border-b border-slate-50">
                            <div className="flex items-center gap-6">
                               <div className="h-10 w-10 bg-[#0F172A] text-white rounded-xl flex items-center justify-center font-black text-sm shadow-xl shrink-0">{sIdx + 1}</div>
                               <div className="space-y-1 text-left">
                                  <div className="flex items-center gap-2">
                                     <SearchCode className="h-3 w-3 text-primary" />
                                     <span className="text-[10px] font-black uppercase text-primary tracking-widest">Section Header</span>
                                  </div>
                                  <Input 
                                    value={sec.name} 
                                    onChange={e => setSections(p => p.map(s => s.id === sec.id ? { ...s, name: e.target.value } : s))} 
                                    className="h-10 w-full md:w-80 bg-transparent border-none font-black uppercase text-xl focus-visible:ring-0 p-0 text-[#0F172A]" 
                                  />
                               </div>
                            </div>
                            <div className="flex items-center gap-4">
                               <div className="text-right hidden md:block mr-4">
                                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">ASSETS LINKED</p>
                                  <p className="text-xl font-headline font-black text-[#0F172A]">{sec.questions.length}</p>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSections(p => p.filter(s => s.id !== sec.id))} className="h-12 w-12 text-rose-500 hover:bg-rose-50 rounded-2xl transition-colors"><Trash2 className="h-5 w-5" /></Button>
                            </div>
                         </div>

                         <div className="p-8 space-y-4">
                            <div className="grid grid-cols-1 gap-2">
                               {sec.questions.map((q: any, qIdx: number) => (
                                  <div key={q.id} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl group/item hover:bg-white hover:shadow-lg transition-all">
                                     <div className="flex items-center gap-6 min-w-0">
                                        <span className="text-[10px] font-black text-slate-300 w-6 uppercase">#{qIdx + 1}</span>
                                        <p className="text-sm font-bold text-slate-600 truncate max-w-2xl text-left">{q.englishQuestion}</p>
                                     </div>
                                     <button 
                                       onClick={() => setSections(p => p.map(s => s.id === sec.id ? { ...s, questions: s.questions.filter((item: any) => item.id !== q.id) } : s))}
                                       className="opacity-0 group-hover/item:opacity-100 text-rose-400 hover:text-rose-600 transition-all p-2"
                                     >
                                        <X className="h-4 w-4" />
                                     </button>
                                  </div>
                               ))}
                               {sec.questions.length === 0 && (
                                  <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem] opacity-20 flex flex-col items-center gap-4">
                                     <BookOpen className="h-12 w-12 text-slate-400" />
                                     <p className="font-black uppercase tracking-[0.4em] text-[10px] text-slate-500">Awaiting Bank Link</p>
                                  </div>
                               )}
                            </div>
                         </div>
                      </Card>
                    ))}

                    <div className="pt-10 border-t border-slate-100">
                       <div className="flex flex-col items-center gap-6">
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Institutional Assembly Protocol</p>
                          <Button onClick={() => setSections([...sections, { id: `sec-${Date.now()}`, name: `Section ${sections.length + 1}`, questions: [] }])} className="h-20 w-full md:w-[480px] bg-white border-dashed border-2 border-slate-200 rounded-[2.5rem] shadow-xl hover:border-primary transition-all flex items-center justify-center gap-4 text-[#0F172A]">
                             <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-sm"><Plus className="h-6 w-6" /></div>
                             <span className="font-black uppercase tracking-[0.2em] text-slate-500 text-sm">ADD SECTION HUB</span>
                          </Button>
                       </div>
                    </div>
                 </div>
              </TabsContent>
           </Tabs>
        </div>
      </div>
    </div>
  )
}
