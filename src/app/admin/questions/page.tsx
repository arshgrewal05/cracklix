
"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, FileText, Database, Layers, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, orderBy, deleteDoc, doc, where } from "firebase/firestore"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

/**
 * @fileOverview Enterprise Question Bank with Workflow Filtering.
 * Optimized to show only standalone questions (not hidden mock questions).
 */

export default function QuestionBank() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [boardFilter, setBoardFilter] = useState("all")

  // Filter for isStandalone != false to show only general bank questions
  const qQuery = useMemo(() => {
    if (!db) return null
    return query(
      collection(db, "questions"), 
      where("isStandalone", "!=", false),
      orderBy("isStandalone"), // Required for inequality filter
      orderBy("createdAt", "desc")
    )
  }, [db])

  const { data: questions, loading } = useCollection<any>(qQuery)
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))

  const filteredQuestions = useMemo(() => {
    if (!questions) return []
    return questions.filter(q => {
      const matchesSearch = (q.questionEn || "").toLowerCase().includes(searchTerm.toLowerCase()) || (q.id || "").toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || q.status === statusFilter
      const matchesBoard = boardFilter === "all" || q.boardId === boardFilter
      return matchesSearch && matchesStatus && matchesBoard
    })
  }, [questions, searchTerm, statusFilter, boardFilter])

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this node from the global bank?")) return
    await deleteDoc(doc(db!, "questions", id))
    toast({ title: "Node Purged", description: "Asset removed from global bank." })
  }

  return (
    <div className="space-y-10 pb-20 text-[#0F172A]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-6 w-6 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Scale Architecture Hub</span>
          </div>
          <h1 className="text-5xl font-black font-headline text-primary uppercase tracking-tight">Enterprise Bank</h1>
          <p className="text-muted-foreground mt-2 text-lg">Managing {questions?.length || 0} Standalone MCQs. Mock-specific items are hidden.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button asChild className="bg-primary hover:bg-primary/90 gap-3 font-black shadow-2xl h-14 px-10 rounded-2xl uppercase tracking-widest text-xs">
            <Link href="/admin/questions/add"><Plus className="h-5 w-5" /> New Asset</Link>
          </Button>
        </div>
      </div>

      <Card className="border-foreground/5 bg-card/50 shadow-2xl rounded-[3rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-white/5 bg-muted/20">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            <div className="relative w-full lg:w-[45%]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input className="pl-14 h-16 rounded-[1.5rem] bg-background border-none shadow-inner" placeholder="Search standalone bank..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="rounded-xl h-12 bg-background border-none w-40 shadow-sm"><SelectValue placeholder="Workflow Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="DRAFT">Draft Nodes</SelectItem>
                  <SelectItem value="REVIEW">Pending Audit</SelectItem>
                  <SelectItem value="PUBLISHED">Live Assets</SelectItem>
                </SelectContent>
              </Select>
              <Select value={boardFilter} onValueChange={setBoardFilter}>
                <SelectTrigger className="rounded-xl h-12 bg-background border-none w-40 shadow-sm"><SelectValue placeholder="Authority" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Boards</SelectItem>{boards?.map(b => <SelectItem key={b.id} value={b.id}>{b.abbreviation}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-white/5 h-16">
                <TableHead className="px-10 text-[10px] font-black uppercase tracking-[0.2em]">Asset Logic</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em]">Audit Workflow</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.2em]">Metadata</TableHead>
                <TableHead className="text-right px-10 text-[10px] font-black uppercase tracking-[0.2em]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-white/5"><TableCell colSpan={4} className="px-10 py-8"><Skeleton className="h-14 w-full rounded-2xl bg-white/5" /></TableCell></TableRow>
                ))
              ) : filteredQuestions.length > 0 ? filteredQuestions.map((q: any) => (
                <TableRow key={q.id} className="hover:bg-white/5 border-white/5 transition-colors">
                  <TableCell className="px-10 py-8 max-w-lg">
                    <p className="font-bold text-slate-100 line-clamp-1">{q.questionEn}</p>
                    <div className="flex items-center gap-4 mt-2">
                       <code className="text-[9px] font-mono text-slate-500">ID: {q.id.slice(-8)}</code>
                       <span className="text-[9px] font-black text-primary uppercase tracking-widest">{q.boardId} • {q.subjectId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`border-none px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      q.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-500' :
                      q.status === 'REVIEW' ? 'bg-orange-500/10 text-orange-500' : 'bg-slate-500/10 text-slate-400'
                    }`}>
                      {q.status || 'DRAFT'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-slate-400">
                           {q.correctAnswer}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">Bank Active</span>
                     </div>
                  </TableCell>
                  <TableCell className="text-right px-10">
                    <div className="flex justify-end gap-3 opacity-30 hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/5" asChild>
                        <Link href={`/admin/questions/add?id=${q.id}`}><Edit className="h-4 w-4" /></Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-rose-500/10 hover:text-rose-500" onClick={() => handleDelete(q.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                   <TableCell colSpan={4} className="h-40 text-center opacity-30 italic text-slate-400 font-bold uppercase text-xs">No standalone questions in bank. Use bulk import to populate.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
