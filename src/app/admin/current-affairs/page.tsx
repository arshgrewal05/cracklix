
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  Search, 
  Newspaper, 
  Zap, 
  Loader2, 
  X, 
  Upload, 
  FileCode,
  Calendar,
  Layers
} from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, doc, setDoc, deleteDoc, query, serverTimestamp, writeBatch } from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { CurrentAffairHubItem, Question } from "@/types"
import { cn } from "@/lib/utils"
import * as XLSX from 'xlsx';

/**
 * @fileOverview Institutional Current Affairs Management Hub v1.1.
 * FIXED: Removed Firestore orderBy to bypass potential index errors; sorting handled client-side.
 */

export default function AdminCurrentAffairs() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const caQuery = useMemo(() => (db ? collection(db, "current_affairs_hub") : null), [db])
  const { data: rawCaItems, loading } = useCollection<CurrentAffairHubItem>(caQuery as any)

  const [editingItem, setEditingItem] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const caItems = useMemo(() => {
     if (!rawCaItems) return [];
     return [...rawCaItems].sort((a, b) => {
        const tA = a.updatedAt?.seconds || 0;
        const tB = b.updatedAt?.seconds || 0;
        return tB - tA;
     });
  }, [rawCaItems]);

  const handleSave = async () => {
    if (!db || !editingItem) return
    if (!editingItem.title || !editingItem.type) {
      toast({ variant: "destructive", title: "Audit Blocked", description: "Title and Type are mandatory." })
      return
    }

    setIsSaving(true)
    const caId = editingItem.id || `ca-hub-${Date.now()}`
    const caRef = doc(db, "current_affairs_hub", caId)
    
    // Process Questions into the global registry if they exist
    let quizId = editingItem.quizId || `quiz-${caId}`
    if (editingItem.questions && editingItem.questions.length > 0) {
      const batch = writeBatch(db)
      const qIds: string[] = []

      editingItem.questions.forEach((q: any, idx: number) => {
        const qRef = q.id ? doc(db, "questions", q.id) : doc(collection(db, "questions"))
        const qId = qRef.id
        qIds.push(qId)
        
        batch.set(qRef, {
          ...q,
          id: qId,
          examId: 'current-affairs',
          sectionId: editingItem.title,
          updatedAt: serverTimestamp(),
          createdAt: q.createdAt || serverTimestamp()
        }, { merge: true })
      })

      // Create/Update the associated MockTest
      const mockRef = doc(db, "mocks", quizId)
      batch.set(mockRef, {
        id: quizId,
        title: `${editingItem.title} Quiz`,
        mockType: 'CA_QUIZ',
        accessType: 'FREE',
        duration: 15,
        totalQuestions: qIds.length,
        questionIds: qIds,
        published: true,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      }, { merge: true })

      await batch.commit()
    }

    const payload = {
      ...editingItem,
      id: caId,
      quizId: (editingItem.questions?.length > 0) ? quizId : null,
      updatedAt: serverTimestamp(),
      createdAt: editingItem.createdAt || serverTimestamp()
    }

    delete payload.questions // Don't store full question array in the hub item

    try {
      await setDoc(caRef, payload, { merge: true })
      toast({ title: "Registry Updated", description: "Current Affairs node successfully synced." })
      setEditingItem(null)
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Failed", description: e.message })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently purge this Current Affairs node?")) return
    await deleteDoc(doc(db!, "current_affairs_hub", id))
    toast({ title: "Node Purged", description: "Asset removed from cloud." })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json(sheet)

        const mappedQuestions = rows.map((r: any) => ({
          englishQuestion: r.Question || r.question || "",
          optionAEnglish: r.A || r.OptionA || "",
          optionBEnglish: r.B || r.OptionB || "",
          optionCEnglish: r.C || r.OptionC || "",
          optionDEnglish: r.D || r.OptionD || "",
          correctAnswer: r.CorrectAnswer || r.Answer || "A",
          englishExplanation: r.Explanation || ""
        }))

        setEditingItem({
          ...editingItem,
          questions: [...(editingItem.questions || []), ...mappedQuestions]
        })
        toast({ title: "Bulk Extraction Success", description: `${mappedQuestions.length} MCQs staged.` })
      } catch (err) {
        toast({ variant: "destructive", title: "Parse Error", description: "Check file structure." })
      } finally {
        setIsImporting(false)
        e.target.value = ""
      }
    }
    reader.readAsBinaryString(file)
  }

  const filteredItems = useMemo(() => {
    if (!caItems) return []
    return caItems.filter(item => 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.type?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [caItems, searchTerm])

  return (
    <div className="space-y-12 pb-24 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 px-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <Newspaper className="h-6 w-6 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Official News Registry</span>
           </div>
          <h1 className="text-5xl font-black font-headline text-primary uppercase tracking-tight">CA Manager</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Coordinate Daily, Weekly, and Monthly strategic content.</p>
        </div>
        <Button onClick={() => setEditingItem({ title: "", type: "DAILY", month: new Date().toLocaleString('default', { month: 'long' }), year: new Date().getFullYear().toString(), status: "PUBLISHED", questions: [], language: "English + Punjabi" })} className="bg-primary hover:bg-orange-600 h-16 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest gap-3 shadow-2xl transition-all active:scale-95">
          <Plus className="h-5 w-5" /> Initialize CA Node
        </Button>
      </div>

      <Card className="border-none shadow-3xl bg-white rounded-[3rem] overflow-hidden mx-4">
        <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
           <div className="relative w-full md:w-[45%]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                className="pl-16 h-16 rounded-[1.5rem] bg-white border-none shadow-inner text-lg font-medium text-[#0F172A]" 
                placeholder="Search Current Affairs..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-50 h-20">
                <TableHead className="px-10 text-[10px] font-black uppercase text-slate-500">Node Identity</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-slate-500 text-center">Type & Context</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-slate-500 text-center">Quiz Status</TableHead>
                <TableHead className="text-right px-10 text-[10px] font-black uppercase text-slate-500">Audit Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={4} className="px-10 py-8"><Skeleton className="h-14 w-full rounded-2xl bg-slate-50" /></TableCell></TableRow>
                ))
              ) : filteredItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50 border-slate-50 transition-all group">
                  <TableCell className="px-10 py-8 text-left">
                    <div className="flex items-center gap-6">
                       <div className={cn(
                         "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner transition-transform group-hover:scale-105",
                         item.type === 'DAILY' ? 'bg-orange-50 text-primary' : 
                         item.type === 'WEEKLY' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                       )}>
                          <Calendar className="h-6 w-6" />
                       </div>
                       <div>
                          <p className="font-black text-[#0F172A] text-xl uppercase tracking-tight leading-none">{item.title}</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{item.month} {item.year}</p>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 text-[9px] font-black uppercase px-3 py-1 rounded-lg">
                       {item.type} Hub
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                     {item.quizId ? (
                        <div className="flex flex-col items-center gap-1">
                           <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black uppercase">Quiz Active</Badge>
                           <span className="text-[7px] font-black text-slate-300 uppercase">Synced to CBT</span>
                        </div>
                     ) : (
                        <span className="text-[8px] font-black text-slate-300 uppercase">No Questions</span>
                     )}
                  </TableCell>
                  <TableCell className="text-right px-10">
                    <div className="flex justify-end gap-3 opacity-20 group-hover:opacity-100 transition-all">
                       <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-slate-50 hover:bg-white hover:text-primary shadow-sm" onClick={() => setEditingItem(item)}>
                        <Edit className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-600 shadow-sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingItem} onOpenChange={(open) => !open && !isSaving && setEditingItem(null)}>
        <DialogContent className="sm:max-w-5xl max-h-[95vh] rounded-[3rem] bg-white border-none shadow-5xl p-0 overflow-hidden text-left flex flex-col">
          <div className="h-2 w-full bg-[#0F172A] shrink-0" />
          <DialogHeader className="p-10 pb-4 shrink-0 flex flex-row items-center justify-between">
            <DialogTitle className="text-3xl font-black font-headline uppercase text-[#0F172A]">CA Hub Node Configuration</DialogTitle>
            <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X className="h-6 w-6 text-slate-400" /></button>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar px-10 pb-10 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {/* Metadata Column */}
               <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Package Title</Label>
                    <Input value={editingItem?.title || ""} onChange={e => setEditingItem({...editingItem, title: e.target.value})} className="h-14 rounded-xl border-slate-100 font-black text-lg text-[#0F172A]" placeholder="e.g. Daily CA - 25 Oct 2026" />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Package Type</Label>
                      <select value={editingItem?.type} onChange={e => setEditingItem({...editingItem, type: e.target.value})} className="w-full h-14 bg-slate-50 border-none rounded-xl px-4 font-black uppercase text-[10px] outline-none">
                        <option value="DAILY">DAILY HUB</option>
                        <option value="WEEKLY">WEEKLY HUB</option>
                        <option value="MONTHLY">MONTHLY HUB</option>
                        <option value="SPECIAL">SPECIAL NODE</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Language Node</Label>
                      <Input value={editingItem?.language || "English + Punjabi"} onChange={e => setEditingItem({...editingItem, language: e.target.value})} className="h-14 rounded-xl border-slate-100 bg-slate-50 font-bold uppercase text-[10px]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Month</Label>
                        <select value={editingItem?.month} onChange={e => setEditingItem({...editingItem, month: e.target.value})} className="w-full h-14 bg-slate-50 border-none rounded-xl px-4 font-bold text-sm outline-none">
                          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">Year</Label>
                        <Input value={editingItem?.year} onChange={e => setEditingItem({...editingItem, year: e.target.value})} className="h-14 rounded-xl border-slate-100 font-bold" />
                     </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-500 ml-1 flex items-center gap-2">
                       <Upload className="h-3 w-3" /> PDF Material Link
                    </Label>
                    <Input 
                      value={editingItem?.pdfUrl || ""} 
                      onChange={e => setEditingItem({...editingItem, pdfUrl: e.target.value.trim()})} 
                      className="h-14 rounded-xl border-slate-100 bg-slate-50 font-bold text-primary" 
                      placeholder="https://..." 
                    />
                  </div>
               </div>

               {/* Quiz / MCQs Column */}
               <div className="bg-slate-50/50 rounded-[3rem] p-10 border border-slate-100 space-y-8 flex flex-col">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <Zap className="h-6 w-6 text-primary" />
                        <h4 className="font-headline font-black text-xl uppercase text-[#0F172A]">Quiz Architect</h4>
                     </div>
                     <Badge className="bg-[#0F172A] text-white border-none font-black px-4 py-1.5 rounded-xl text-[10px]">{editingItem?.questions?.length || 0} Questions</Badge>
                  </div>

                  <div className="flex gap-4">
                     <div className="relative flex-1">
                        <Button asChild variant="outline" className="w-full h-14 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-black uppercase text-[10px] tracking-widest gap-3 bg-white hover:text-primary hover:border-primary/50 transition-all">
                           <label className="cursor-pointer">
                              <FileCode className="h-4 w-4" /> Bulk Upload (Excel)
                              <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />
                           </label>
                        </Button>
                     </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 max-h-[400px]">
                     {editingItem?.questions?.map((q: Question, idx: number) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group/q">
                           <button onClick={() => {
                              const qs = [...editingItem.questions];
                              qs.splice(idx, 1);
                              setEditingItem({...editingItem, questions: qs});
                           }} className="absolute top-4 right-4 text-rose-300 hover:text-rose-500 opacity-0 group-hover/q:opacity-100 transition-opacity"><Trash2 className="h-4 w-4" /></button>
                           <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1.5">Q{idx+1} Statement</p>
                           <p className="font-bold text-sm text-[#0F172A] leading-relaxed mb-4">{q.englishQuestion}</p>
                           <div className="grid grid-cols-2 gap-2">
                              {['A','B','C','D'].map(opt => (
                                 <div key={opt} className={cn("px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase", q.correctAnswer === opt ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-slate-50 border-transparent text-slate-400")}>
                                    {opt}: {q[`option${opt}English` as keyof Question]}
                                 </div>
                              ))}
                           </div>
                        </div>
                     ))}
                     {editingItem?.questions?.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 text-center py-20">
                           <Layers className="h-12 w-12 mb-4" />
                           <p className="font-black uppercase text-[10px]">Staging hub empty.</p>
                        </div>
                     )}
                  </div>

                  <Button onClick={() => setEditingItem({...editingItem, questions: [...(editingItem.questions || []), { englishQuestion: "New Question Statement?", optionAEnglish: "Option A", optionBEnglish: "Option B", optionCEnglish: "Option C", optionDEnglish: "Option D", correctAnswer: "A", englishExplanation: "Explanation here..." }]})} variant="ghost" className="w-full h-12 text-[#0F172A] hover:bg-slate-100 rounded-xl font-black uppercase text-[10px] tracking-widest border border-slate-200">
                     <Plus className="h-4 w-4 mr-2" /> Add Manual Question
                  </Button>
               </div>
            </div>
          </div>

          <DialogFooter className="p-10 pt-4 bg-slate-50 flex gap-4 shrink-0 border-t border-slate-100">
            <button onClick={() => setEditingItem(null)} className="rounded-xl h-14 px-8 font-black uppercase text-[10px] text-slate-400 hover:text-[#0F172A]">Cancel Draft</button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-[#0F172A] hover:bg-black text-white h-14 px-10 rounded-xl font-black uppercase text-[10px] tracking-widest flex-1 shadow-xl transition-all active:scale-95 gap-3">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Commit CA Hub to Registry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
