
"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Clock, CheckCircle2, XCircle, Zap, CreditCard, Loader2 } from "lucide-react"
import { useCollection, useFirestore, useUser } from "@/firebase"
import { collection, query, where, doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { approvePaymentRequest } from "@/app/actions/payment"
import { useToast } from "@/hooks/use-toast"

/**
 * @fileOverview Administrative Manual UPI Verification Hub v2.0.
 * Hardened approval engine with automatic PASS activation.
 */

export default function VerifyPaymentsPage() {
  const db = useFirestore()
  const { user: admin } = useUser()
  const { toast } = useToast()
  const [processingId, setProcessingId] = useState<string | null>(null)

  const requestsQuery = useMemo(() => {
    if (!db) return null
    return query(collection(db, "payment_requests"), where("status", "==", "PENDING"))
  }, [db])

  const { data: requests, loading } = useCollection<any>(requestsQuery)

  const handleApprove = async (requestId: string) => {
    if (!admin) return
    setProcessingId(requestId)
    try {
      await approvePaymentRequest(requestId, admin.uid)
      toast({ title: "Pass Activated", description: "Aspirant upgraded and registry synchronized." })
    } catch (e: any) {
      toast({ variant: "destructive", title: "Approval Failed" })
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (requestId: string) => {
    if (!db) return
    if (!confirm("Permanently reject this payment request?")) return
    
    try {
      await updateDoc(doc(db, "payment_requests", requestId), {
        status: 'REJECTED',
        updatedAt: serverTimestamp()
      });
      toast({ title: "Request Rejected" });
    } catch (e) {
      toast({ variant: "destructive", title: "Action Failed" });
    }
  }

  return (
    <div className="space-y-12 pb-20 text-[#0F172A] text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 px-4">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-6 w-6 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">M-Payment Audit Queue</span>
           </div>
          <h1 className="text-5xl font-black font-headline text-[#0F172A] uppercase tracking-tight">Manual Verification</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Audit and authorize manual UPI/QR transaction requests for PASS activation.</p>
        </div>
        <div className="px-8 py-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-6 shadow-sm">
           <div className="space-y-0.5">
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Pending Node Queue</p>
              <p className="text-3xl font-headline font-black text-emerald-700 leading-none">{requests?.length || 0}</p>
           </div>
           <Zap className="h-8 w-8 text-emerald-400 animate-pulse" />
        </div>
      </div>

      <Card className="border-slate-100 shadow-3xl bg-white rounded-[3rem] overflow-hidden mx-4">
        <CardHeader className="p-10 border-b border-slate-50 bg-slate-50/30">
           <CardTitle className="font-headline font-black text-2xl uppercase">Approval Ledger</CardTitle>
        </CardHeader>
        <CardContent className="p-0 text-left">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-50 h-20">
                <TableHead className="px-12 text-[10px] font-black uppercase text-slate-500">Aspirant Node</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-slate-500">UTR / Transaction ID</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-slate-500 text-center">Amount</TableHead>
                <TableHead className="text-right px-12 text-[10px] font-black uppercase text-slate-500">Audit Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-slate-50"><TableCell colSpan={4} className="px-12 py-8"><Skeleton className="h-12 w-full rounded-2xl bg-slate-50" /></TableCell></TableRow>
                ))
              ) : requests && requests.length > 0 ? (
                requests.map((req: any) => (
                  <TableRow key={req.id} className="border-slate-50 hover:bg-slate-50 transition-colors group">
                    <TableCell className="px-12 py-10">
                       <div className="flex items-center gap-6">
                          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase text-xs shadow-inner">
                             {req.userName?.[0] || 'A'}
                          </div>
                          <div>
                             <p className="font-black text-[#0F172A] text-lg leading-tight uppercase">{req.userName}</p>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{req.planName} • {req.userEmail}</p>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell>
                       <code className="text-sm font-mono font-black text-[#0F172A] bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                         {req.transactionId}
                       </code>
                    </TableCell>
                    <TableCell className="text-center">
                       <span className="font-headline font-black text-2xl text-[#0F172A]">₹{req.amount}</span>
                    </TableCell>
                    <TableCell className="text-right px-12">
                       <div className="flex justify-end gap-3">
                          <Button 
                            onClick={() => handleApprove(req.id)}
                            disabled={processingId === req.id}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-xl shadow-xl gap-3 transition-all active:scale-95 border-none"
                          >
                             {processingId === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                             Verify & Activate
                          </Button>
                          <Button 
                            variant="ghost" 
                            onClick={() => handleReject(req.id)}
                            className="h-12 w-12 rounded-xl text-rose-500 hover:bg-rose-50 p-0"
                          >
                             <XCircle className="h-6 w-6" />
                          </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                   <TableCell colSpan={4} className="h-80 text-center">
                      <div className="flex flex-col items-center justify-center opacity-10 space-y-6">
                         <CreditCard className="h-24 w-24 text-slate-400" />
                         <p className="font-black font-headline text-2xl uppercase tracking-widest">No Pending Approvals</p>
                      </div>
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
