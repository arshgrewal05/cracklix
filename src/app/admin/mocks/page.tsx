
"use client"

import React, { useMemo, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  ClipboardList, 
  Layers, 
  ChevronRight, 
  Clock, 
  FileText, 
  Calendar, 
  BookOpen, 
  ListTree, 
  FileStack, 
  Filter, 
  CheckCircle2, 
  Loader2, 
  X, 
  Zap,
  Eye,
  Lock,
  Unlock,
  RefreshCw
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, deleteDoc, doc, setDoc, serverTimestamp, where, writeBatch } from "firebase/firestore"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

export default function MockManagement() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [boardFilter, setBoardFilter] = useState("all")
  const [accessFilter, setAccessFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDeletingBulk, setIsDeletingBulk] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const mocksQuery = useMemo(() => (db ? collection(db, "mocks") : null), [db])
  const boardsQuery = useMemo(() => (db ? collection(db, "boards") : null), [db])

  const { data: rawMocks, loading } = useCollection<any>(mocksQuery)
  const { data: boards } = useCollection<any>(boardsQuery)

  const mocks = useMemo(() => {
    if (!rawMocks) return []
    return [...rawMocks]
      .filter(m => {
        const tier = (m.accessLevel || 'FREE').toUpperCase();
        const matchesSearch = m.title?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesBoard = boardFilter === "all" || m.boardId === boardFilter || (m.boardIds && m.boardIds.includes(boardFilter))
        const matchesAccess = accessFilter === "all" || tier === accessFilter;
        return matchesSearch && matchesBoard && matchesAccess
      })
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
  }, [rawMocks, searchTerm, boardFilter, accessFilter])

  // Phase 7: Dashboard Cards
  const stats = useMemo(() => {
    if (!rawMocks) return { total: 0, free: 0, premium: 0 };
    return {
      total: rawMocks.length,
      free: rawMocks.filter((m: any) => m.accessLevel === 'FREE' || !m.accessLevel).length,
      premium: rawMocks.filter((m: any) => m.accessLevel === 'PREMIUM').length
    };
  }, [rawMocks]);

  const toggleTier = async (mockId: string, currentTier: string) => {
    if (!db || togglingId) return
    const nextTier = currentTier === 'PREMIUM' ? 'FREE' : 'PREMIUM'
    setTogglingId(mockId)
    
    try {
      await setDoc(doc(db, "mocks", mockId), { 
        accessLevel: nextTier, 
        updatedAt: serverTimestamp() 
      }, { merge: true })
      toast({ title: "Tier Hub Updated", description: `Mock tier synced to ${nextTier}.` })
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Failed" })
    } finally {
      setTogglingId(null)
    }
  }

  const handleDeleteSingle = async (id: string) => {
    if (!db) return
    if (!confirm("Permanently purge this series?")) return
    await deleteDoc(doc(db, "mocks", id))
    toast({ title: "Series Purged" })
  }

  return (
    <div className="space-y-8 md:space-y-12 text-left pb-32 px-4 md:px-0 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <Layers className="h-6 w-6 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Mock List Hub</span>
           </div>
          <h1 className="text-2xl md:text-5xl font-headline font-black text-primary uppercase tracking-tight">Mock Manager</h1>
        </div>
        <div className="flex gap-4">
           <Button asChild className="bg-primary hover:bg-orange-600 gap-2 font-black shadow-2xl rounded-xl h-12 md:h-16 px-8 md:px-12 uppercase tracking-widest text-[10px]">
             <Link href="/admin/mocks/builder"><Zap className="h-5 w-5" /> Assemble New</Link>
           </Button>
        </div>
      </div>

      {/* Phase 7: Dashboard Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="p-8 border-none bg-white shadow-xl rounded-[2.5rem]">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Total Tests</p>
            <p className="text-5xl font-headline font-black text-[#0F172A]">{stats.total}</p>
         </Card>
         <Card className="p-8 border-none bg-emerald-50 shadow-xl rounded-[2.5rem]">
            <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-2">Free Tests</p>
            <p className="text-5xl font-headline font-black text-emerald-700">{stats.free}</p>
         </Card>
         <Card className="p-8 border-none bg-amber-50 shadow-xl rounded-[2.5rem]">
            <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-2">Premium Tests</p>
            <p className="text-5xl font-headline font-black text-amber-700">{stats.premium}</p>
         </Card>
      </div>

      <Card className="border-none shadow-3xl bg-white rounded-2xl md:rounded-[3rem] overflow-hidden">
        <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-[35%]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input className="pl-12 h-14 rounded-2xl bg-white border-slate-100 shadow-inner" placeholder="Search series..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            {/* Phase 7: Filters */}
            <div className="flex items-center gap-3">
              <Select value={accessFilter} onValueChange={setAccessFilter}>
                <SelectTrigger className="w-44 rounded-xl h-11 bg-white border-none shadow-sm font-bold text-xs"><SelectValue placeholder="All Tiers" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Tiers</SelectItem><SelectItem value="FREE">FREE ONLY</SelectItem><SelectItem value="PREMIUM">PREMIUM ONLY</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="h-20 border-slate-100">
                  <TableHead className="px-10 text-[10px] font-black uppercase tracking-widest text-slate-500">Identity</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Tier Control</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Status</TableHead>
                  <TableHead className="text-right px-10 text-[10px] font-black uppercase tracking-widest text-slate-500">Control</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={4} className="p-10"><Skeleton className="h-16 w-full" /></TableCell></TableRow> : 
                mocks.map((mock: any) => {
                  const tier = (mock.accessLevel || 'FREE').toUpperCase();
                  const isSyncingTier = togglingId === mock.id;
                  return (
                    <TableRow key={mock.id} className="hover:bg-slate-50 border-slate-50 transition-colors group">
                      <TableCell className="px-10 py-6">
                        <p className="font-black text-[#0F172A] text-lg uppercase leading-none">{mock.title}</p>
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">{mock.totalQuestions} Qs • {mock.duration}m</p>
                      </TableCell>
                      <TableCell>
                         <button 
                            onClick={() => toggleTier(mock.id, tier)}
                            disabled={isSyncingTier}
                            className="flex items-center gap-2 group/tier text-left focus:outline-none"
                         >
                            {isSyncingTier ? <RefreshCw className="h-3 w-3 animate-spin" /> : tier === 'PREMIUM' ? <Lock className="h-3 w-3 text-amber-500" /> : <Unlock className="h-3 w-3 text-emerald-500" />}
                            <Badge className={cn("border-none text-[8px] font-black px-2 py-0.5", tier === 'PREMIUM' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600")}>{tier}</Badge>
                         </button>
                      </TableCell>
                      <TableCell>
                         <div className={cn("h-2.5 w-2.5 rounded-full", mock.published ? 'bg-emerald-500' : 'bg-slate-300')} />
                      </TableCell>
                      <TableCell className="text-right px-10">
                        <div className="flex justify-end gap-2 opacity-20 group-hover:opacity-100 transition-all">
                          <Button variant="ghost" size="icon" asChild><Link href={`/admin/mocks/builder?id=${mock.id}`}><Edit className="h-4 w-4" /></Link></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteSingle(mock.id)} className="hover:text-rose-600"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
