
"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Database, Users, ShieldCheck, Rocket, Zap, RefreshCw, ChevronRight, ListTree, Loader2, FileText, Newspaper, Landmark, BookOpen, Send } from "lucide-react"
import Link from "next/link"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query } from "firebase/firestore"
import { useMemo, useState } from "react"
import { seedInitialData } from "@/services/seed-data"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * @fileOverview Institutional Command Center.
 * Hardened: Verified Firestore instance checks to prevent runtime collection() errors.
 */

export default function AdminDashboard() {
  const db = useFirestore()
  const { toast } = useToast()
  const [isSyncing, setIsSyncing] = useState(false)

  // Double-gated instance validation
  const isValidDb = db && typeof db === 'object' && (db as any).type === 'firestore';

  const { data: users } = useCollection<any>(useMemo(() => (isValidDb ? collection(db, "users") : null), [isValidDb, db]))
  const { data: questions, loading: qLoading } = useCollection<any>(useMemo(() => (isValidDb ? collection(db, "questions") : null), [isValidDb, db]))
  const { data: mocks } = useCollection<any>(useMemo(() => (isValidDb ? collection(db, "mocks") : null), [isValidDb, db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (isValidDb ? collection(db, "subjects") : null), [isValidDb, db]))
  const { data: exams } = useCollection<any>(useMemo(() => (isValidDb ? collection(db, "exams") : null), [isValidDb, db]))
  const { data: notes } = useCollection<any>(useMemo(() => (isValidDb ? collection(db, "notes") : null), [isValidDb, db]))
  const { data: pyqs } = useCollection<any>(useMemo(() => (isValidDb ? collection(db, "pyqs") : null), [isValidDb, db]))

  const proUsers = useMemo(() => users?.filter((u: any) => u.status && u.status !== 'Free') || [], [users]);

  // Subject Breakdown Audit
  const subjectBreakdown = useMemo(() => {
    if (!questions) return [];
    const uniqueSubjectIds = Array.from(new Set(questions.map((q: any) => q.subjectId))).filter(Boolean);
    return uniqueSubjectIds.map(id => {
       const subjectName = subjects?.find((s: any) => s.id === id)?.name || id.replace('-', ' ').toUpperCase();
       return { id, name: subjectName, count: questions.filter((q: any) => q.subjectId === id).length }
    }).sort((a, b) => b.count - a.count);
  }, [questions, subjects]);

  // Exam Breakdown Audit
  const examBreakdown = useMemo(() => {
     if (!questions || !exams) return [];
     return exams.map((e: any) => {
        return { id: e.id, name: e.name, count: questions.filter((q: any) => q.examId === e.id).length }
     }).sort((a, b) => b.count - a.count);
  }, [questions, exams]);

  const handlePushToRegistry = async () => {
    if (!isValidDb) return
    setIsSyncing(true)
    try {
      await seedInitialData(db)
      toast({ title: "Registry Synced", description: "Official Punjab Exam hierarchy pushed to live registry." })
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Failed", description: e.message })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <div className="space-y-12 pb-20 text-[#0F172A] text-left">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Live Registry Overview</span>
           </div>
          <h1 className="text-5xl font-headline font-black text-[#0F172A] uppercase tracking-tight">Command Center</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Registry Volume: {questions?.length || 0} Atomic Nodes Locked.</p>
        </div>
        <div className="flex gap-4">
           <Button onClick={handlePushToRegistry} disabled={isSyncing} className="bg-emerald-600 hover:bg-emerald-700 h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest gap-3 shadow-2xl text-white">
              {isSyncing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Push to Registry
           </Button>
           <Button asChild className="bg-[#0F172A] hover:bg-black text-white rounded-2xl h-14 px-10 font-black shadow-2xl uppercase tracking-widest text-xs">
            <Link href="/admin/bulk-import"><Plus className="mr-3 h-5 w-5" /> Bulk Import</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
         <StatCard label="Atomic Bank" value={questions?.length ?? "..."} icon={<Database className="text-blue-500" />} />
         <StatCard label="Live Series" value={mocks?.filter((m: any) => m.published).length ?? "..."} icon={<Zap className="text-primary" />} />
         <StatCard label="Pro Aspirants" value={proUsers.length} icon={<Users className="text-emerald-500" />} />
         <StatCard label="PYQ Archives" value={pyqs?.length ?? "..."} icon={<FileText className="text-orange-500" />} />
         <StatCard label="Study Notes" value={notes?.length ?? "..."} icon={<BookOpen className="text-rose-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         <Card className="lg:col-span-8 border-none shadow-3xl bg-white rounded-[3.5rem] overflow-hidden text-left">
            <Tabs defaultValue="subjects">
               <CardHeader className="p-12 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-headline font-black uppercase text-[#0F172A]">Mastery Hubs</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Sectional and Vertical Registry Audit.</CardDescription>
                  </div>
                  <TabsList className="bg-white border p-1 rounded-xl h-12 shadow-sm">
                    <TabsTrigger value="subjects" className="font-black uppercase text-[9px] px-6 h-full data-[state=active]:bg-[#0F172A] data-[state=active]:text-white">Subjects</TabsTrigger>
                    <TabsTrigger value="exams" className="font-black uppercase text-[9px] px-6 h-full data-[state=active]:bg-[#0F172A] data-[state=active]:text-white">Exams</TabsTrigger>
                  </TabsList>
               </CardHeader>
               <CardContent className="p-0">
                  <TabsContent value="subjects" className="m-0">
                     <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {qLoading ? (
                           <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-300">
                              <Loader2 className="h-10 w-10 animate-spin" />
                              <p className="font-black uppercase text-[10px]">Auditing Registry...</p>
                           </div>
                        ) : subjectBreakdown.map((s) => (
                           <div key={s.id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                              <div className="flex items-center gap-6">
                                 <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase text-xs">{s.name[0]}</div>
                                 <div>
                                    <p className="font-black text-[#0B1528] text-lg uppercase leading-none">{s.name}</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Subject Registry Node: {s.id}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-2xl font-headline font-black text-primary leading-none">{s.count}</p>
                                 <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Questions</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </TabsContent>
                  <TabsContent value="exams" className="m-0">
                     <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {qLoading ? (
                           <div className="p-20 flex flex-col items-center justify-center gap-4 text-slate-300">
                              <Loader2 className="h-10 w-10 animate-spin" />
                           </div>
                        ) : examBreakdown.map((e) => (
                           <div key={e.id} className="p-8 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                              <div className="flex items-center gap-6">
                                 <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-black uppercase text-xs shadow-inner"><Landmark className="h-5 w-5" /></div>
                                 <div>
                                    <p className="font-black text-[#0B1528] text-lg uppercase leading-none">{e.name}</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Exam Hub Node: {e.id}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-2xl font-headline font-black text-amber-600 leading-none">{e.count}</p>
                                 <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">Linked MCQs</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </TabsContent>
               </CardContent>
            </Tabs>
         </Card>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }: any) {
   return (
      <Card className="border-none shadow-xl bg-white p-6 rounded-[2.5rem] group hover:translate-y-[-4px] transition-all text-left">
         <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">{icon}</div>
            <div className="min-w-0">
               <p className="text-2xl font-headline font-black text-[#0F172A] leading-none">{value === "..." ? <Loader2 className="h-4 w-4 animate-spin" /> : value}</p>
               <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1 truncate">{label}</p>
            </div>
         </div>
      </Card>
   )
}
