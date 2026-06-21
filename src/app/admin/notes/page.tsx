"use client";

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Edit, Save, FileText, Search, Download, Landmark, GraduationCap, X, Loader2 } from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, doc, setDoc, deleteDoc, orderBy, serverTimestamp } from "firebase/firestore"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Institutional Content Hub CMS v10.0 (PWA Hardened).
 * FIXED: Removed syntax error. Standardized to Title Case and Primary Blue.
 */

export default function AdminNotesManagement() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const notesQuery = useMemo(() => (db ? query(collection(db, "notes"), orderBy("updatedAt", "desc")) : null), [db])
  const { data: notes, loading } = useCollection<any>(notesQuery)
  const { data: boards } = useCollection<any>(useMemo(() => (db ? collection(db, "boards") : null), [db]))
  const { data: exams } = useCollection<any>(useMemo(() => (db ? collection(db, "exams") : null), [db]))
  const { data: subjects } = useCollection<any>(useMemo(() => (db ? collection(db, "subjects") : null), [db]))

  const [editingNote, setEditingNote] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!db || !editingNote || isSaving) return
    if (!editingNote.title || !editingNote.pdfUrl || !editingNote.examId) {
       toast({ variant: "destructive", title: "Audit Blocked", description: "Incomplete metadata." })
       return
    }

    setIsSaving(true)
    const noteId = editingNote.id || `note-${Date.now()}`
    const noteRef = doc(db, "notes", noteId)
    
    const payload = { ...editingNote, id: noteId, updatedAt: serverTimestamp(), createdAt: editingNote.createdAt || serverTimestamp(), status: 'PUBLISHED' }

    try {
      await setDoc(noteRef, payload, { merge: true })
      toast({ title: "Asset Deployed" })
      setEditingNote(null)
    } finally {
      setIsSaving(false)
    }
  }

  const filteredNotes = useMemo(() => {
    if (!notes) return []
    return notes.filter(n => 
      n.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      n.examId?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [notes, searchTerm])

  return (
    <div className="space-y-6 md:space-y-10 pb-24 text-[#0F172A] text-left animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-1">
        <div className="space-y-1">
           <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-[9px] font-black tracking-[0.1em] text-slate-400">Institutional Study Base</span>
           </div>
          <h1 className="text-2xl md:text-5xl font-black text-[#0F172A] tracking-tight">Content Hub</h1>
          <p className="text-slate-500 text-[11px] md:text-lg font-medium">Manage study notes, PDFs, and syllabus metadata.</p>
        </div>
        <Button onClick={() => setEditingNote({ title: "", boardId: "", examId: "", subjectId: "", category: "NOTES", pdfUrl: "", isFree: true, description: "" })} className="w-full md:w-auto h-11 md:h-14 px-8 bg-primary hover:bg-blue-700 text-white font-black rounded-full shadow-xl border-none active:scale-95 gap-2">
          <Plus className="h-4 w-4" /> Register Asset
        </Button>
      </div>

      <div className="relative group px-1">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-primary transition-colors" />
         <Input className="h-14 md:h-16 pl-14 rounded-2xl md:rounded-full bg-white border-slate-50 shadow-inner text-base md:text-lg font-bold" placeholder="Search repository..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      <Card className="border-none shadow-xl rounded-2xl md:rounded-[3rem] overflow-hidden bg-white mx-1 border border-slate-50">
        <CardContent className="p-0 text-left overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-50 h-14 md:h-20">
                <TableHead className="px-6 md:px-12 text-[9px] md:text-[10px] font-black text-slate-400">Asset Identity</TableHead>
                <TableHead className="text-[9px] md:text-[10px] font-black text-slate-400">Relational Vertical</TableHead>
                <TableHead className="text-[9px] md:text-[10px] font-black text-slate-400 text-center">Tier</TableHead>
                <TableHead className="text-right px-6 md:px-12 text-[9px] md:text-[10px] font-black text-slate-400">Audit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-slate-50"><TableCell colSpan={4} className="px-6 py-6 md:px-12 md:py-10"><Skeleton className="h-10 w-full rounded-xl bg-slate-50" /></TableCell></TableRow>
                ))
              ) : filteredNotes.map((note) => (
                <TableRow key={note.id} className="border-slate-50 hover:bg-slate-50 transition-colors group">
                  <TableCell className="px-6 md:px-12 py-5 md:py-10">
                    <div className="flex items-center gap-4 md:gap-6">
                       <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner shrink-0 transition-transform group-hover:scale-105"><FileText className="h-5 w-5" /></div>
                       <div className="min-w-0">
                          <p className="font-bold text-[#0F172A] text-sm md:text-lg leading-tight truncate">{note.title}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{note.category}</p>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="space-y-1">
                        <Badge variant="outline" className="border-slate-100 text-slate-500 text-[7px] md:text-[8px] font-black uppercase px-2 rounded-md">{note.boardId || 'PSSSB'} HUB</Badge>
                        <p className="text-xs md:text-sm font-medium text-slate-400 line-clamp-1 truncate max-w-[200px]">{exams?.find((e:any) => e.id === note.examId)?.name || note.examId}</p>
                     </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn("border-none text-[8px] md:text-[9px] font-black uppercase px-3 py-1 rounded-lg shadow-sm", note.isFree ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                        {note.isFree ? 'FREE' : 'ELITE'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-6 md:px-12">
                     <div className="flex justify-end gap-2 md:gap-3 opacity-20 group-hover:opacity-100 transition-all">
                        <button onClick={() => setEditingNote(note)} className="h-9 w-9 md:h-11 md:w-11 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary active:scale-90 transition-all"><Edit className="h-5 w-5" /></button>
                        <button onClick={async () => { if(confirm("Purge asset node?")) await deleteDoc(doc(db!, "notes", note.id)) }} className="h-9 w-9 md:h-11 md:w-11 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-rose-500 hover:bg-rose-50 active:scale-90 transition-all"><Trash2 className="h-5 w-5" /></button>
                     </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingNote} onOpenChange={o => !o && !isSaving && setEditingNote(null)}>
         <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] bg-white rounded-3xl md:rounded-[3rem] border-none shadow-5xl p-0 overflow-hidden text-left flex flex-col">
            <div className="h-2 w-full bg-primary shrink-0" />
            <DialogHeader className="p-6 md:p-10 pb-2 md:pb-4 shrink-0">
               <DialogTitle className="text-xl md:text-3xl font-black text-[#0F172A]">Asset Architect</DialogTitle>
               <DialogDescription className="text-slate-400 font-bold text-[9px] md:text-sm mt-1">Configure study material metadata.</DialogDescription>
            </DialogHeader>
            <div className="px-6 md:px-10 pb-6 md:pb-10 space-y-6 md:space-y-8 overflow-y-auto custom-scrollbar flex-1">
               <div className="space-y-2 text-left">
                  <Label className="text-[9px] font-black text-slate-500 ml-1">Asset Title</Label>
                  <Input value={editingNote?.title || ""} onChange={e => setEditingNote({...editingNote, title: e.target.value})} className="h-12 md:h-14 rounded-xl border-slate-200 bg-slate-50 font-bold" placeholder="e.g. Punjab GK Master Notes" />
               </div>
               <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-2 text-left">
                     <Label className="text-[9px] font-black text-slate-500 ml-1">Assigned Board</Label>
                     <select value={editingNote?.boardId || ""} onChange={e => setEditingNote({...editingNote, boardId: e.target.value})} className="w-full h-12 md:h-14 bg-slate-50 border-none rounded-xl px-4 font-bold text-sm outline-none shadow-inner">
                        <option value="">Select Board</option>
                        {boards?.map((b: any) => <option key={b.id} value={b.id}>{b.abbreviation}</option>)}
                     </select>
                  </div>
                  <div className="space-y-2 text-left">
                     <Label className="text-[9px] font-black text-slate-500 ml-1">Assigned Exam</Label>
                     <select value={editingNote?.examId || ""} onChange={e => setEditingNote({...editingNote, examId: e.target.value})} className="w-full h-12 md:h-14 bg-slate-50 border-none rounded-xl px-4 font-bold text-sm outline-none shadow-inner">
                        <option value="">Select Exam</option>
                        {exams?.filter((e:any) => !editingNote?.boardId || e.boardId === editingNote.boardId).map((e: any) => <option key={e.id} value={e.id}>{e.name}</option>)}
                     </select>
                  </div>
               </div>
               <div className="space-y-2 text-left">
                  <Label className="text-[9px] font-black text-slate-500 ml-1">PDF Node URL</Label>
                  <Input value={editingNote?.pdfUrl || ""} onChange={e => setEditingNote({...editingNote, pdfUrl: e.target.value})} className="h-12 md:h-14 rounded-xl border-slate-200 bg-slate-50 font-mono text-xs text-primary" placeholder="https://..." />
               </div>
               <div className="flex items-center justify-between p-5 md:p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                  <div className="space-y-0.5">
                     <p className="text-[10px] font-black text-[#0F172A]">Public Node (Free)</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Disable to require Pass</p>
                  </div>
                  <Switch checked={editingNote?.isFree} onCheckedChange={v => setEditingNote({...editingNote, isFree: v})} />
               </div>
            </div>
            <DialogFooter className="p-6 md:p-10 pt-4 bg-slate-50 border-t border-slate-100 flex flex-row gap-4">
               <Button variant="ghost" onClick={() => setEditingNote(null)} className="h-11 md:h-12 px-6 font-black uppercase text-[10px] text-slate-400">Discard</Button>
               <Button onClick={handleSave} disabled={isSaving} className="flex-1 bg-primary hover:bg-blue-700 text-white h-11 md:h-12 rounded-full font-black text-[10px] tracking-widest shadow-xl gap-2 active:scale-95 border-none">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Commit Asset
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  )
}
