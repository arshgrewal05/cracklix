
"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Edit, 
  Search, 
  RefreshCw,
  FileWarning,
  Layers,
  SearchCode,
  Archive,
  Rocket
} from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, doc, deleteDoc, writeBatch, updateDoc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { errorEmitter } from "@/firebase/error-emitter"
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors"

/**
 * @fileOverview Institutional Integrity & Cleanup Dashboard.
 * Features: Deep Scan for Duplicate Registries and Empty Vertical Nodes.
 */

export default function QADashboard() {
  const db = useFirestore()
  const { toast } = useToast()
  const [isSyncing, setIsSyncing] = useState(false)

  const { data: questions, loading: qLoading } = useCollection<any>(useMemo(() => (db ? collection(db, "questions") : null), [db]))
  const { data: mocks, loading: mLoading } = useCollection<any>(useMemo(() => (db ? collection(db, "mocks") : null), [db]))
  const { data: exams, loading: eLoading } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))

  // AI-Driven Integrity Analysis
  const audit = useMemo(() => {
    if (!questions || !mocks || !exams) return { dummyMocks: [], brokenQuestions: [], redundantExams: [], stats: { dummy: 0, critical: 0 } }

    const dummyKeywords = ["TEST", "DUMMY", "DEMO", "SAMPLE", "MOCK 1", "MOCK 2", "PLACEHOLDER"];
    
    // 1. Detect Dummy Mocks
    const dummyMocks = mocks.filter((m: any) => 
      dummyKeywords.some(kw => m.title?.toUpperCase().includes(kw)) ||
      m.isDummy === true
    )

    // 2. Detect Redundant/Empty Exams
    const redundantExams = exams.filter((e: any) => {
       const hasQuestions = questions.some((q: any) => q.examId === e.id);
       const hasMocks = mocks.some((m: any) => m.examId === e.id);
       return !hasQuestions && !hasMocks; // Hubs that exist but have zero content
    })

    // 3. Detect Overlapping Names (Potential Duplicates)
    const duplicates: any[] = [];
    const nameMap: Record<string, string> = {};
    exams.forEach((e: any) => {
       const key = `${e.name?.toLowerCase()}_${e.boardId}`;
       if (nameMap[key]) {
          duplicates.push(e);
       } else {
          nameMap[key] = e.id;
       }
    });

    const brokenQuestions = questions.filter((q: any) => 
      !q.correctAnswer || 
      (!q.englishQuestion && !q.questionEn)
    )

    return {
      dummyMocks,
      brokenQuestions,
      redundantExams: [...new Set([...redundantExams, ...duplicates])],
      stats: {
        dummy: dummyMocks.length,
        critical: redundantExams.length + duplicates.length + brokenQuestions.length
      }
    }
  }, [questions, mocks, exams])

  const handleBulkPurgeDummy = async () => {
    if (!db || audit.dummyMocks.length === 0) return
    if (!confirm(`CRITICAL AUDIT: Permanently purge ${audit.dummyMocks.length} dummy nodes?`)) return
    
    setIsSyncing(true)
    const batch = writeBatch(db)
    audit.dummyMocks.forEach(m => batch.delete(doc(db, "mocks", m.id)))

    try {
      await batch.commit()
      toast({ title: "Registry Cleaned" })
    } catch (e) {
      toast({ variant: "destructive", title: "Audit Failed" })
    } finally {
      setIsSyncing(false)
    }
  }

  const handlePurgeExam = async (id: string) => {
     if (!db) return;
     if (!confirm("Permanently purge this empty/duplicate registry hub?")) return;
     await deleteDoc(doc(db, "exams", id));
     toast({ title: "Hub Purged" });
  }

  return (
    <div className="space-y-12 pb-20 text-[#0F172A] text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 px-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <ShieldAlert className="h-6 w-6 text-rose-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Integrity & Audit Hub</span>
           </div>
          <h1 className="text-5xl font-black font-headline text-[#0F172A] uppercase tracking-tight">System Cleanup</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Scan and isolate redundant, empty, or placeholder registries.</p>
        </div>
        <div className="flex gap-4">
           <Button 
             onClick={handleBulkPurgeDummy} 
             disabled={isSyncing || audit.dummyMocks.length === 0}
             className="bg-rose-600 hover:bg-rose-700 text-white h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-xs gap-3 shadow-2xl"
           >
              <Trash2 className="h-5 w-5" /> Purge All Dummy Nodes
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
         <QAStatCard label="Dummy Detections" value={audit.stats.dummy} color="text-rose-600" desc="Mocks flagged with 'Test/Demo' keywords" />
         <QAStatCard label="Redundant Hubs" value={audit.redundantExams.length} color="text-orange-600" desc="Exams with zero questions or duplicate names" />
         <QAStatCard label="Registry Integrity" value={`${questions && questions.length > 0 ? Math.round(((questions.length - audit.brokenQuestions.length) / questions.length) * 100) : 100}%`} color="text-emerald-600" desc="Validated high-fidelity preparation nodes" />
      </div>

      <div className="space-y-12 px-4">
         <section className="space-y-6">
            <h3 className="text-2xl font-headline font-black uppercase flex items-center gap-4">
               <Archive className="h-6 w-6 text-orange-600" /> Redundant Registry Hubs
            </h3>
            <Card className="border-slate-100 shadow-3xl bg-white rounded-[2.5rem] overflow-hidden">
               <Table>
                  <TableHeader className="bg-slate-50/50">
                     <TableRow className="border-slate-50 h-16">
                        <TableHead className="px-10 text-[10px] font-black uppercase text-slate-500">Hub Identity</TableHead>
                        <TableHead className="text-[10px] font-black uppercase text-center text-slate-500">Audit Context</TableHead>
                        <TableHead className="text-right px-10 text-[10px] font-black uppercase text-slate-500">Audit Action</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {eLoading ? (
                        <TableRow><TableCell colSpan={3} className="p-10"><Skeleton className="h-12 w-full rounded-xl" /></TableCell></TableRow>
                     ) : audit.redundantExams.length > 0 ? (
                        audit.redundantExams.map((e: any) => (
                           <TableRow key={e.id} className="border-slate-50 hover:bg-slate-50 transition-colors group">
                              <TableCell className="px-10 py-6 text-left">
                                 <p className="font-bold text-[#000000] uppercase">{e.name}</p>
                                 <code className="text-[9px] text-slate-400 font-mono uppercase tracking-widest">ID: {e.id} • Board: {e.boardId}</code>
                              </TableCell>
                              <TableCell className="text-center">
                                 <Badge className="bg-orange-50 text-orange-600 border-none px-4 py-1 text-[9px] uppercase font-black">
                                    CONTENT_EMPTY
                                 </Badge>
                              </TableCell>
                              <TableCell className="text-right px-10">
                                 <div className="flex justify-end gap-3 opacity-20 group-hover:opacity-100 transition-all">
                                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-rose-50 text-rose-600" onClick={() => handlePurgeExam(e.id)}>
                                       <Trash2 className="h-4 w-4" />
                                    </Button>
                                 </div>
                              </TableCell>
                           </TableRow>
                        ))
                     ) : (
                        <TableRow><TableCell colSpan={3} className="h-40 text-center opacity-30 italic font-black uppercase text-[10px]">Registry audit complete. Hub coverage is 100% efficient.</TableCell></TableRow>
                     )}
                  </TableBody>
               </Table>
            </Card>
         </section>
      </div>
    </div>
  )
}

function QAStatCard({ label, value, color, desc }: any) {
   return (
      <Card className="border-slate-100 bg-white rounded-[2.5rem] p-10 shadow-2xl text-left">
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">{label}</p>
         <h4 className={`text-6xl font-headline font-black tracking-tighter ${color} leading-none`}>{value}</h4>
         <p className="text-xs font-bold text-slate-500 mt-5 leading-relaxed">{desc}</p>
      </Card>
   )
}
