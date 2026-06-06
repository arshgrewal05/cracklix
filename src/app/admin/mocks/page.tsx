
"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Eye, MoreVertical, Search, Filter, Trash2, Edit, ClipboardList, Layers, History, CheckCircle2, XCircle, Copy, Gem } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, deleteDoc, doc, setDoc, serverTimestamp } from "firebase/firestore"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Ultimate Mock Management Ledger v5.5.
 * Hardened: Verified Firestore instance checks to prevent runtime collection() errors.
 */

export default function MockManagement() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [boardFilter, setBoardFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Double-gated instance validation
  const isValidDb = db && typeof db === 'object' && (db as any).type === 'firestore';

  const mocksQuery = useMemo(() => {
    if (!isValidDb) return null
    return query(collection(db, "mocks"))
  }, [isValidDb, db])

  const { data: rawMocks, loading } = useCollection<any>(mocksQuery)
  const { data: boards } = useCollection<any>(useMemo(() => (isValidDb ? collection(db, "boards") : null), [isValidDb, db]))
  const { data: passes } = useCollection<any>(useMemo(() => (isValidDb ? collection(db, "passes") : null), [isValidDb, db]))

  const mocks = useMemo(() => {
    if (!rawMocks) return []
    return [...rawMocks]
      .filter(m => {
        const matchesSearch = m.title?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesBoard = boardFilter === "all" || m.boardId === boardFilter
        const matchesType = typeFilter === "all" || m.mockType === typeFilter
        return matchesSearch && matchesBoard && matchesType
      })
      .sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0
        const timeB = b.createdAt?.seconds || 0
        return timeB - timeA
      })
  }, [rawMocks, searchTerm, boardFilter, typeFilter])

  const handleDelete = async (id: string) => {
    if (!isValidDb || !confirm("CRITICAL: Permanently purge this mock blueprint? This is irreversible.")) return
    const mockRef = doc(db, "mocks", id)
    deleteDoc(mockRef)
      .then(() => toast({ title: "Series Purged", description: "Mock test removed from cloud registry." }))
      .catch(async (serverError) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({ path: mockRef.path, operation: 'delete' }));
      });
  }

  const handleDuplicate = async (mock: any) => {
    if (!isValidDb) return
    const newId = `mock-${Date.now()}`
    const newMock = {
      ...mock,
      id: newId,
      title: `${mock.title} (Clone)`,
      published: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    await setDoc(doc(db, "mocks", newId), newMock)
    toast({ title: "Module Cloned", description: "Draft duplicate created successfully." })
  }

  const togglePublish = async (id: string, current: boolean) => {
    if (!isValidDb) return
    await setDoc(doc(db, "mocks", id), { published: !current, updatedAt: serverTimestamp() }, { merge: true })
    toast({ title: "Registry Updated", description: `Test is now ${!current ? 'Live' : 'Hidden'}.` })
  }

  return (
    <div className="space-y-12 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-4 gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <Layers className="h-6 w-6 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Institutional Mock Registry</span>
           </div>
          <h1 className="text-5xl font-headline font-black text-primary uppercase tracking-tight">Mock Manager</h1>
          <p className="text-slate-500 mt-1 font-medium">Complete CRUD control for 500+ official patterns and sectional tests.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-orange-600 gap-2 font-black shadow-2xl rounded-2xl h-16 px-12 uppercase tracking-widest text-[10px]">
          <Link href="/admin/mocks/builder">
            <Plus className="h-5 w-5" /> Assemble New Blueprint
          </Link>
        </Button>
      </div>

      <Card className="border-none shadow-3xl bg-white rounded-[3rem] overflow-hidden mx-4">
        <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative w-full lg:w-[35%]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input className="pl-12 h-14 rounded-2xl bg-white border-slate-100 shadow-inner" placeholder="Search by title..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Select value={boardFilter} onValueChange={setBoardFilter}>
                <SelectTrigger className="rounded-xl h-11 bg-white border-none w-44 shadow-sm font-bold text-xs"><SelectValue placeholder="Board Hub" /></SelectTrigger>
                <SelectContent><SelectItem value="all" className="font-bold">All Boards</SelectItem>{boards?.map(b => <SelectItem key={b.id} value={b.id}>{b.abbreviation}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="rounded-xl h-11 bg-white border-none w-44 shadow-sm font-bold text-xs"><SelectValue placeholder="Content Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-bold">All Types</SelectItem>
                  <SelectItem value="FULL">Full Mocks</SelectItem>
                  <SelectItem value="SECTIONAL">Sectionals</SelectItem>
                  <SelectItem value="CHAPTER">Chapter Tests</SelectItem>
                  <SelectItem value="PYQ">PYQ Archives</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-50 h-20">
                <TableHead className="px-10 text-[10px] font-black uppercase tracking-widest text-slate-500">Mock Identity & Context</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Access Tier</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Status</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Last Audit</TableHead>
                <TableHead className="text-right px-10 text-[10px] font-black uppercase tracking-widest text-slate-500">Control</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-slate-50"><TableCell colSpan={5} className="px-10 py-8"><Skeleton className="h-16 w-full rounded-2xl" /></TableCell></TableRow>
                ))
              ) : mocks.length > 0 ? (
                mocks.map((mock: any) => {
                   const passName = passes?.find((p: any) => p.id === mock.passId)?.name || 'Any Premium';
                   return (
                    <TableRow key={mock.id} className="hover:bg-slate-50 group border-slate-50 transition-colors">
                      <TableCell className="px-10 py-10">
                        <div className="flex items-center gap-6">
                          <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                            <ClipboardList className="h-7 w-7 text-slate-400 group-hover:text-primary transition-colors" />
                          </div>
                          <div className="space-y-1.5">
                            <p className="font-black text-[#0F172A] text-xl uppercase tracking-tight leading-none">{mock.title}</p>
                            <div className="flex items-center gap-3">
                               <Badge variant="outline" className="border-slate-200 text-[8px] font-black uppercase px-2 py-0.5">{mock.boardId}</Badge>
                               <div className="h-1 w-1 rounded-full bg-slate-200" />
                               <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{mock.totalQuestions} Questions</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex flex-col gap-1.5">
                            <Badge className={cn(
                               "border-none text-[8px] font-black uppercase px-3 py-1 rounded-lg w-fit",
                               mock.accessType === 'FREE' ? "bg-slate-100 text-slate-500" : "bg-amber-100 text-amber-600"
                            )}>
                               {mock.accessType}
                            </Badge>
                            {mock.accessType === 'PREMIUM' && (
                               <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                  <Gem className="h-3 w-3 text-amber-500" /> {passName}
                               </div>
                            )}
                         </div>
                      </TableCell>
                      <TableCell>
                         <button onClick={() => togglePublish(mock.id, mock.published)} className="flex items-center gap-3 group/status">
                            <div className={cn("h-2.5 w-2.5 rounded-full", mock.published ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-300')} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/status:text-primary transition-colors">{mock.published ? 'PUBLISHED' : 'DRAFT NODE'}</span>
                         </button>
                      </TableCell>
                      <TableCell>
                         <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-500">{new Date(mock.updatedAt?.seconds * 1000 || Date.now()).toLocaleDateString()}</p>
                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Cloud Synced</p>
                         </div>
                      </TableCell>
                      <TableCell className="text-right px-10">
                        <div className="flex justify-end gap-3 opacity-20 group-hover:opacity-100 transition-all">
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-white hover:text-primary shadow-sm" asChild title="View Student Hub">
                            <Link href={`/mocks/${mock.id}`}><Eye className="h-5 w-5" /></Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-white hover:text-blue-500 shadow-sm" onClick={() => handleDuplicate(mock)} title="Clone Blueprint">
                            <Copy className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-white hover:text-primary shadow-sm" asChild title="Edit Blueprint">
                            <Link href={`/admin/mocks/builder?id=${mock.id}`}><Edit className="h-5 w-5" /></Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-rose-50 hover:text-rose-600 shadow-sm" onClick={() => handleDelete(mock.id)} title="Purge Module"><Trash2 className="h-5 w-5" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow><TableCell colSpan={5} className="h-80 text-center opacity-20 font-black uppercase text-xs tracking-widest">No mocks matched the current audit filter.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
