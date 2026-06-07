
"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MoreVertical, ShieldCheck, Trash2, Gift, Gem, RefreshCw, XCircle, User as UserIcon, Calendar, MapPin, Mail, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCollection, useFirestore, useUser } from "@/firebase"
import { collection, query, doc, updateDoc, serverTimestamp, deleteDoc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import StudentAvatar from "@/components/brand/StudentAvatar"
import { cn } from "@/utils"

/**
 * @fileOverview Institutional Student Registry v9.0.
 * Enhanced: Full visibility into aspirant personal details (Phone, DOB, Address).
 */

export default function AspirantsManagement() {
  const db = useFirestore()
  const { user: currentUser, profile: currentProfile } = useUser()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [grantDialogUser, setGrantDialogUser] = useState<any>(null)
  const [grantPlanId, setGrantPlanId] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)

  const usersQuery = useMemo(() => (db ? query(collection(db, 'users')) : null), [db])
  const { data: aspirants, loading } = useCollection<any>(usersQuery)

  const passQuery = useMemo(() => (db ? collection(db, "passes") : null), [db])
  const { data: rawPasses } = useCollection<any>(passQuery)

  const passes = useMemo(() => {
    if (!rawPasses) return []
    return [...rawPasses].sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0))
  }, [rawPasses])

  const filteredAspirants = useMemo(() => {
    if (!aspirants) return []
    return aspirants
      .filter(a => 
        (a.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
        (a.email || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
  }, [aspirants, searchTerm])

  const handleGrantPass = async () => {
    if (!grantDialogUser || !db || !grantPlanId) return
    const selectedPass = passes?.find(p => p.id === grantPlanId)
    if (!selectedPass) return

    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + selectedPass.durationDays)

    try {
       await updateDoc(doc(db, "users", grantDialogUser.id), {
          status: grantPlanId,
          passExpiryDate: expiryDate.toISOString(),
          updatedAt: serverTimestamp()
       })
       toast({ title: "Pass Granted", description: `User upgraded to ${selectedPass.name}.` })
       setGrantDialogUser(null)
    } catch (e: any) {
       toast({ variant: "destructive", title: "Grant Failed" })
    }
  }

  const handleRevokePass = async (userId: string) => {
    if (!db) return
    if (!confirm("Revoke access node?")) return
    await updateDoc(doc(db, "users", userId), { status: 'Free', passExpiryDate: null })
    toast({ title: "Pass Revoked" })
  }

  return (
    <div className="space-y-12 pb-20 text-[#0F172A] text-left">
      <div className="flex justify-between items-center px-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Aspirant Audit Control</span>
           </div>
          <h1 className="text-5xl font-headline font-black text-primary uppercase tracking-tight">Student Registry</h1>
          <p className="text-slate-600 mt-1 font-medium">Monitoring {aspirants?.length || 0} institutional identity nodes.</p>
        </div>
      </div>

      <Card className="border-none shadow-3xl rounded-[3rem] overflow-hidden bg-white mx-4">
        <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
          <div className="relative w-full md:w-[45%]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input className="pl-14 h-16 rounded-[1.5rem] bg-white border-none shadow-inner text-lg font-medium" placeholder="Search aspirant registry..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="p-0 text-left">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 h-20">
                <TableHead className="px-10 text-[10px] font-black uppercase tracking-widest text-slate-500">Identity Hub</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Personal Nodes</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500">Registry Detail</TableHead>
                <TableHead className="text-right px-10 text-[10px] font-black uppercase tracking-widest text-slate-500">Audit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRow key={i}><TableCell colSpan={4} className="p-10"><Skeleton className="h-16 w-full rounded-2xl" /></TableCell></TableRow>)
              ) : filteredAspirants.map((aspirant: any) => (
                <TableRow key={aspirant.id} className="border-slate-50 hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setSelectedUser(aspirant)}>
                  <TableCell className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <StudentAvatar profile={aspirant} className="h-14 w-14 border-2 border-primary/20 rounded-2xl" />
                      <div>
                        <p className="font-black text-[#0F172A] text-lg uppercase tracking-tight">{aspirant.name}</p>
                        <p className="text-xs font-bold text-slate-400 lowercase">{aspirant.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1.5">
                       <p className="text-xs font-bold text-slate-600 flex items-center gap-2"><Phone className="h-3 w-3" /> {aspirant.phone || 'NA'}</p>
                       <p className="text-xs font-bold text-slate-400 flex items-center gap-2"><Calendar className="h-3 w-3" /> {aspirant.dob || 'DOB Pending'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                       <Badge className="bg-amber-50 text-amber-600 border-none px-3 py-1 rounded-lg text-[8px] font-black uppercase w-fit">
                         {aspirant.status || 'Free'} PASS
                       </Badge>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[150px]"><MapPin className="h-2.5 w-2.5 inline mr-1" /> {aspirant.address || 'Address Pending'}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right px-10">
                    <DropdownMenu>
                       <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <button className="h-12 w-12 rounded-2xl hover:bg-white shadow-sm flex items-center justify-center opacity-30 group-hover:opacity-100 transition-all"><MoreVertical className="h-6 w-6" /></button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end" className="w-64 bg-[#0F172A] border-white/10 text-white rounded-[2.5rem] p-4 shadow-5xl">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase text-slate-500 mb-3 px-2">Authority Node</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setGrantDialogUser(aspirant)} className="rounded-xl px-4 py-3 gap-3 focus:bg-primary/20 text-primary">
                             <Gem className="h-4 w-4" /> Grant Access
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRevokePass(aspirant.id)} className="rounded-xl px-4 py-3 gap-3 text-amber-400">
                             <XCircle className="h-4 w-4" /> Reset to Free
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/5 my-2" />
                          <DropdownMenuItem onClick={async () => { if(confirm("Purge node?")) await deleteDoc(doc(db!, "users", aspirant.id)) }} className="rounded-xl px-4 py-3 gap-3 text-rose-500">
                             <Trash2 className="h-4 w-4" /> Purge Identity
                          </DropdownMenuItem>
                       </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* FULL ASPIRANT DETAIL DIALOG */}
      <Dialog open={!!selectedUser} onOpenChange={(o) => !o && setSelectedUser(null)}>
         <DialogContent className="sm:max-w-xl rounded-[3rem] bg-white border-none shadow-4xl p-0 overflow-hidden text-left">
            <div className="h-2 w-full bg-[#0F172A]" />
            <DialogHeader className="p-10 pb-6">
               <DialogTitle className="text-3xl font-black font-headline uppercase text-[#0F172A]">Aspirant Profile Audit</DialogTitle>
            </DialogHeader>
            <div className="p-10 pt-0 space-y-10">
               <div className="flex items-center gap-8 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                  <StudentAvatar profile={selectedUser} className="h-24 w-24 border-4 border-white shadow-xl" />
                  <div className="space-y-1">
                     <h2 className="text-2xl font-black text-[#0F172A] uppercase leading-tight">{selectedUser?.name}</h2>
                     <Badge className="bg-primary text-white border-none font-black text-[9px] px-3 py-1 rounded-lg">{selectedUser?.status} NODE</Badge>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <AuditData icon={<Mail />} label="EMAIL NODE" val={selectedUser?.email} />
                  <AuditData icon={<Phone />} label="CONTACT HUB" val={selectedUser?.phone || "Pending"} />
                  <AuditData icon={<Calendar />} label="DATE OF BIRTH" val={selectedUser?.dob || "Pending Audit"} />
                  <AuditData icon={<GraduationCap />} label="TARGET VERTICAL" val={selectedUser?.targetExam} />
                  <AuditData icon={<MapPin />} label="FULL CORRESPONDENCE ADDRESS" val={selectedUser?.address || "No address node synced"} colSpan={2} />
               </div>
            </div>
            <DialogFooter className="p-10 pt-4 bg-slate-50">
               <Button onClick={() => setSelectedUser(null)} className="w-full h-14 bg-[#0F172A] hover:bg-black rounded-xl font-black uppercase tracking-widest text-[10px]">Close Audit</Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

      <Dialog open={!!grantDialogUser} onOpenChange={(open) => !open && setGrantDialogUser(null)}>
         <DialogContent className="bg-[#0F172A] text-white border-white/10 rounded-[3rem] max-w-md p-10">
            <DialogHeader className="text-center space-y-4">
               <DialogTitle className="text-2xl font-headline font-black uppercase">Grant Pass Access</DialogTitle>
            </DialogHeader>
            <div className="py-8 space-y-6">
               <select value={grantPlanId} onChange={e => setGrantPlanId(e.target.value)} className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-4 outline-none font-bold">
                  <option value="" disabled className="bg-[#0F172A]">Select Pass Hub</option>
                  {passes?.map((p: any) => <option key={p.id} value={p.id} className="bg-[#0F172A]">{p.name}</option>)}
               </select>
            </div>
            <DialogFooter><Button onClick={handleGrantPass} className="w-full bg-primary h-12 rounded-xl font-black">Activate Node</Button></DialogFooter>
         </DialogContent>
      </Dialog>
    </div>
  )
}

function AuditData({ icon, label, val, colSpan = 1 }: any) {
   return (
      <div className={cn("space-y-1.5", colSpan > 1 ? "md:col-span-2" : "")}>
         <div className="flex items-center gap-2 text-slate-400">
            {React.cloneElement(icon, { className: "h-3 w-3" })}
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
         </div>
         <p className="text-sm font-bold text-[#0F172A] uppercase leading-tight bg-slate-50/50 p-3 rounded-xl border border-slate-50">{val}</p>
      </div>
   )
}
import React from "react"
