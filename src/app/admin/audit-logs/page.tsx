
"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, Clock, User, Activity, Filter, Download } from "lucide-react"
import { useCollection, useFirestore } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

/**
 * @fileOverview Institutional Audit Trail Console.
 * Tracks all administrative activity within the Cracklix ecosystem.
 */

export default function AuditLogsPage() {
  const db = useFirestore()
  const logsQuery = useMemo(() => (db ? query(collection(db, "audit_logs"), orderBy("timestamp", "desc"), limit(50)) : null), [db])
  const { data: logs, loading } = useCollection<any>(logsQuery)

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Security & Integrity Monitor</span>
           </div>
          <h1 className="text-5xl font-black font-headline text-primary uppercase tracking-tight">Audit Trail</h1>
          <p className="text-muted-foreground mt-2 text-lg">Detailed ledger of all institutional modifications and extraction activities.</p>
        </div>
        <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/5 bg-white/5 font-black uppercase text-[10px] tracking-widest gap-3">
           <Download className="h-4 w-4" /> Export Ledger
        </Button>
      </div>

      <Card className="border-none shadow-3xl shadow-slate-900/5 bg-card/50 rounded-[3rem] overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-white/5 h-20">
                <TableHead className="px-12 text-[10px] font-black uppercase tracking-[0.3em]">Timestamp</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.3em]">Administrator</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.3em]">Action Details</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-[0.3em]">Resource Context</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i} className="border-white/5"><TableCell colSpan={4} className="px-12 py-8"><Skeleton className="h-12 w-full rounded-2xl bg-white/5" /></TableCell></TableRow>
                ))
              ) : logs && logs.length > 0 ? (
                logs.map((log: any) => (
                  <TableRow key={log.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="px-12 py-8">
                       <div className="flex items-center gap-3 text-slate-500">
                          <Clock className="h-4 w-4" />
                          <span className="text-xs font-bold">{new Date(log.timestamp?.seconds * 1000).toLocaleString()}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                             <User className="h-5 w-5" />
                          </div>
                          <p className="font-bold text-slate-100">{log.adminName || 'System'}</p>
                       </div>
                    </TableCell>
                    <TableCell>
                       <Badge className="bg-white/5 text-slate-300 border-white/5 uppercase text-[9px] font-black px-3 py-1">
                          {log.action}
                       </Badge>
                    </TableCell>
                    <TableCell className="max-w-md">
                       <p className="text-xs font-medium text-slate-400 line-clamp-1">{log.details}</p>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                   <TableCell colSpan={4} className="h-80 text-center">
                      <div className="flex flex-col items-center justify-center opacity-20 space-y-4">
                         <Activity className="h-16 w-16" />
                         <p className="font-black uppercase tracking-widest text-[10px]">No audit entries recorded in this cycle.</p>
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
