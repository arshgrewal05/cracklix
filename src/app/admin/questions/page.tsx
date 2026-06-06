
"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Database, Filter, Eye, AlertCircle, CheckSquare, History, X, Loader2, Zap, AlertTriangle, Layers, Copy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, deleteDoc, doc, where, writeBatch, setDoc, serverTimestamp } from "firebase/firestore"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

/**
 * @fileOverview Institutional Asset Ledger (Global Bank) v4.0.
 * Features: Usage Detection, Safety Locks, and Bulk Purge Logic.
 */

export default function QuestionBank() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [boardFilter, setBoardFilter] = useState("all")
  const [showUnusedOnly, setShowUnusedOnly] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const qQuery = useMemo(() => {
    if (!db) return null
    return query(collection(db, "questions"), where("isStandalone", "==", true))
  }, [db])

  const mocksQuery = useMemo(() => (db ? collection(db, "mocks") : null), [db])

  const { data: allQuestions, loading } = useCollection<any>(qQuery)
  const { data: allMocks } = useCollection<any>(mocksQuery)
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))

  // Usage Matrix Generator
  const usageMap = useMemo(() => {
    if (!allQuestions || !allMocks) return {};
    const map: Record<string, string[]> = {};
    allMocks.forEach(m => {
       m.questionIds?.forEach((qid: string) => {
          if (!map[qid]) map[qid] = [];
          map[qid].push(m.title);
       });
    });
    return map;
  }, [allQuestions, allMocks]);

  const filteredQuestions = useMemo(() => {
    if (!allQuestions) return []
    return allQuestions
      .filter(q => {
        const matchesSearch = (q.questionEn || q.titleEn || "").toLowerCase().includes(searchTerm.toLowerCase())
        const matchesSub = subjectFilter === "all" || q.subjectId === subjectFilter
        const matchesBoard = boardFilter === "all" || q.boardId === boardFilter
        const usageCount = usageMap[q.id]?.length || 0;
        const matchesUnused = !showUnusedOnly || usageCount === 0
        return matchesSearch && matchesSub && matchesBoard && matchesUnused
      })
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
  }, [allQuestions, searchTerm, subjectFilter, boardFilter, showUnusedOnly, usageMap])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredQuestions.map(q => q.id))
    } else {
      setSelectedIds([])
    }
  }

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handlePurgeIds = async (ids: string[], isGlobal = false) => {
    if (!db || ids.length === 0) return
    
    // Safety Audit: Check for active usage in selection
    const usedIds = ids.filter(id => (usageMap[id]?.length || 0) > 0);
    const confirmMsg = usedIds.length > 0 
      ? `CRITICAL AUDIT: ${usedIds.length} questions in your selection are ACTIVE in mocks. Deleting them will break those tests. Continue?`
      : `Audit: Permanently purge ${ids.length} nodes from registry?`;

    if (!confirm(confirmMsg)) return

    setIsDeleting(true)
    try {
      const batchSize = 400
      for (let i = 0; i < ids.length; i += batchSize) {
        const chunk = ids.slice(i, i + batchSize)
        const batch = writeBatch(db)
        chunk.forEach(id => { batch.delete(doc(db, "questions", id)) })
        await batch.commit()
      }
      toast({ title: "Audit Success", description: `${ids.length} items successfully purged.` })
      setSelectedIds([])
    } catch (e: any) {
      toast({ variant: "destructive", title: "Audit Error", description: "Registry sync failed." })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteSingle = (id: string) => {
    const usage = usageMap[id] || [];
    const confirmMsg = usage.length > 0 
      ? `WARNING: This question is used in ${usage.length} mocks (${usage.slice(0,2).join(', ')}...). Deleting it will cause audit errors in these tests. Proceed?`
      : "Permanently purge this asset from the global bank?";

    if (!confirm(confirmMsg)) return
    
    const qRef = doc(db!, "questions", id)
    deleteDoc(qRef)
      .then(() => {
        toast({ title: "Asset Purged", description: "Node removed from registry." })
        setSelectedIds(prev => prev.filter(i => i !== id))
      })
      .catch(async () => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: qRef.path, operation: 'delete' }))
      });
  }

  const handleClone = async (q: any) => {
     const newId = `q-${Date.now()}`
     const payload = { ...q, id: newId, questionEn: `${q.questionEn} (Copy)`, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }
     await setDoc(doc(db!, "questions", newId), payload)
     toast({ title: "Node Cloned", description: "Standalone copy created in bank." })
  }

  const allSelected = filteredQuestions.length > 0 && selectedIds.length === filteredQuestions.length;

  return (
    <div className="space-y-6 text-[#0F172A] text-left relative pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
        <div className="text-left">
          <div className="flex items-center gap-3 mb-1.5">
            <Database className="h-5 w-5 text-primary" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Atomic Asset Registry</span>
          </div>
          <h1 className="text-4xl font-black font-headline text-primary uppercase tracking-tight">Question Bank</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Monitoring {allQuestions?.length || 0} reusable MCQ nodes across the ecosystem.</p>
        </div>
        <div className="flex gap-4">
           <Button asChild variant="outline" className="h-12 px-6 rounded-2xl font-black uppercase text-[9px] tracking-widest gap-2 shadow-sm bg-white border-slate-200">
              <Link href="/admin/bulk-import"><Plus className="h-4 w-4" /> Bulk Ingestion</Link>
           </Button>
          <Button asChild className="bg-[#0F172A] hover:bg-black text-white gap-2 font-black shadow-2xl h-12 px-8 rounded-2xl uppercase tracking-widest text-[9px]">
            <Link href="/admin/questions/add"><Plus className="h-4 w-4" /> Add Manual</Link>
          </Button>
        </div>
      </div>

      {selectedIds.length > 0 && (
         <div className="mx-4 bg-[#0B1528] p-4 rounded-2xl flex flex-wrap items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300 shadow-4xl text-white sticky top-2 z-[60] border border-white/10">
            <div className="flex items-center gap-6 px-4">
               <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <CheckSquare className="h-5 w-5" />
               </div>
               <div className="text-left">
                  <p className="text-lg font-headline font-black leading-none uppercase">{selectedIds.length} Assets Targeted</p>
                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1">Bulk Audit Terminal</p>
               </div>
            </div>
            <div className="flex items-center gap-3 px-4">
               <Button onClick={() => setSelectedIds([])} variant="ghost" className="text-slate-400 hover:text-white uppercase text-[9px] font-black">Cancel</Button>
               <Button onClick={() => handlePurgeIds(selectedIds)} className="h-12 px-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-[9px] tracking-[0.2em] shadow-xl">
                  {isDeleting ? "Purging..." : "Purge Selection"}
               </Button>
            </div>
         </div>
      )}

      <Card className="border-none shadow-3xl rounded-[2.5rem] overflow-hidden bg-white mx-4">
        <CardHeader className="p-8 border-b border-slate-50 bg-muted/20">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:w-[35%]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input className="pl-12 h-12 rounded-xl bg-white border-none shadow-inner text-sm" placeholder="Search by question text..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-50">
                 <Label className="text-[8px] font-black uppercase text-slate-400">Unused Only</Label>
                 <Switch checked={showUnusedOnly} onCheckedChange={setShowUnusedOnly} />
              </div>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="rounded-xl h-11 bg-white border-none w-44 shadow-sm font-bold text-xs"><SelectValue placeholder="Subject" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Subjects</SelectItem>{subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={boardFilter} onValueChange={setBoardFilter}>
                <SelectTrigger className="rounded-xl h-11 bg-white border-none w-44 shadow-sm font-bold text-xs"><SelectValue placeholder="Board Hub" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Boards</SelectItem>{boards?.map(b => <SelectItem key={b.id} value={b.id}>{b.abbreviation}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-white/5 h-16">
                <TableHead className="w-[60px] px-8 text-center"><Checkbox checked={allSelected} onCheckedChange={(v) => handleSelectAll(!!v)} /></TableHead>
                <TableHead className="px-4 text-[9px] font-black uppercase text-slate-500">Question Content</TableHead>
                <TableHead className="text-[9px] font-black uppercase text-slate-500">Classification</TableHead>
                <TableHead className="text-center text-[9px] font-black uppercase text-slate-500">Usage Registry</TableHead>
                <TableHead className="text-right px-8 text-[9px] font-black uppercase text-slate-500">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={5} className="px-8 py-6"><Skeleton className="h-12 w-full rounded-xl" /></TableCell></TableRow>
                ))
              ) : filteredQuestions.length > 0 ? filteredQuestions.map((q: any) => {
                const usages = usageMap[q.id] || [];
                return (
                  <TableRow key={q.id} className={cn("hover:bg-slate-50 border-white/5 transition-colors group", selectedIds.includes(q.id) ? 'bg-primary/5' : '')}>
                    <TableCell className="px-8 py-6 text-center">
                       <Checkbox checked={selectedIds.includes(q.id)} onCheckedChange={() => toggleSelection(q.id)} />
                    </TableCell>
                    <TableCell className="px-4 py-8 max-w-xl text-left">
                      <p className="font-bold text-[#000000] text-base leading-snug line-clamp-2">{q.questionEn || q.titleEn}</p>
                      <div className="flex items-center gap-3 mt-3">
                         <Badge className="bg-primary/10 text-primary border-none text-[7px] font-black uppercase px-2 py-0.5 rounded-md">{q.questionType}</Badge>
                         <code className="text-[8px] font-mono text-slate-400 font-bold uppercase">ID: {q.id.slice(-8)}</code>
                      </div>
                    </TableCell>
                    <TableCell className="text-left">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{q.boardId}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{q.subjectId} • {q.chapterId || 'GEN'}</p>
                       </div>
                    </TableCell>
                    <TableCell className="text-center">
                       <TooltipProvider>
                          <Tooltip>
                             <TooltipTrigger asChild>
                                <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-xl border transition-all cursor-help", usages.length > 0 ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-slate-50 border-slate-100 text-slate-400")}>
                                   <Layers className="h-3 w-3" />
                                   <span className="text-xs font-black">{usages.length}</span>
                                </div>
                             </TooltipTrigger>
                             <TooltipContent className="bg-[#0F172A] text-white p-4 rounded-xl border-white/10 shadow-4xl w-64">
                                <p className="text-[9px] font-black uppercase text-primary mb-2">Usage Audit Hub</p>
                                {usages.length > 0 ? (
                                   <ul className="space-y-2">
                                      {usages.map((name, i) => (
                                         <li key={i} className="text-[10px] font-bold border-b border-white/5 pb-1 last:border-0">{name}</li>
                                      ))}
                                   </ul>
                                ) : (
                                   <p className="text-[10px] font-medium text-slate-400 italic">This node is standalone and not linked to any active mocks.</p>
                                )}
                             </TooltipContent>
                          </Tooltip>
                       </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <div className="flex justify-end gap-2 opacity-20 group-hover:opacity-100 transition-all">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white hover:text-blue-500 shadow-sm" onClick={() => handleClone(q)} title="Clone Node"><Copy className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white hover:text-primary shadow-sm" asChild title="Edit Node">
                          <Link href={`/admin/questions/add?id=${q.id}`}><Edit className="h-4 w-4" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-rose-50 hover:text-rose-600 shadow-sm" onClick={() => handleDeleteSingle(q.id)} title="Purge Node"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              }) : (
                <TableRow><TableCell colSpan={5} className="h-80 text-center opacity-20 italic">Global bank empty or filter mismatch.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
