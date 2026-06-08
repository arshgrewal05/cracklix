
"use client"

import { useSearchParams, useRouter } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Lock, ArrowLeft, Loader2, QrCode, CheckCircle2, Gem, Copy, Download, Zap } from "lucide-react"
import { useUser, useDoc, useFirestore } from "@/firebase"
import { useEffect, useState, Suspense, useMemo } from "react"
import { useToast } from "@/hooks/use-toast"
import { submitManualPayment } from "@/app/actions/payment"
import { doc } from "firebase/firestore"

/**
 * @fileOverview Institutional Checkout Hub v45.0.
 * Dynamic Manual UPI flow matched to Admin Settings.
 */

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-white"><Loader2 className="h-10 w-10 text-primary animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  )
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const planId = searchParams.get("plan") || ""
  const { user, profile, loading } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  const [processing, setProcessing] = useState(false)
  const [utr, setUtr] = useState("")

  const { data: settings } = useDoc<any>(useMemo(() => (db ? doc(db, 'settings', 'global') : null), [db]));
  const { data: planData, loading: planLoading } = useDoc<any>(useMemo(() => (db && planId ? doc(db, 'passes', planId) : null), [db, planId]));

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [user, loading, router])

  const upiId = settings?.upiId || "arshdeepgrewal1122-1@oksbi";
  const upiLink = `upi://pay?pa=${upiId}&pn=Cracklix&am=${planData?.price || 0}&cu=INR`;
  const qrUrl = settings?.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiLink)}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    toast({ title: "UPI ID Copied" });
  };

  const handleManualPayment = async () => {
    if (!user || !profile || !planData) return
    if (!utr || utr.length < 10) {
       toast({ variant: "destructive", title: "UTR Invalid", description: "Please enter the 12-digit transaction ID." })
       return
    }

    setProcessing(true)
    try {
       await submitManualPayment({
          userId: user.uid,
          userEmail: user.email || '',
          userName: profile.name,
          planId: planId,
          transactionId: utr
       })
       toast({ title: "Registry Synced", description: "Admin will verify your payment node within 24 hours." })
       router.push("/dashboard")
    } catch (e: any) {
       toast({ variant: "destructive", title: "Submission Failed" })
    } finally {
       setProcessing(false)
    }
  }

  if (planLoading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="h-10 w-10 text-primary animate-spin" /></div>
  if (!planData) return <div className="h-screen flex items-center justify-center bg-slate-50 text-slate-400 font-black uppercase tracking-widest text-xs">Registry Node Not Found</div>

  return (
    <div className="min-h-screen bg-slate-50/50 font-body">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-6 py-12 md:py-24 max-w-5xl">
        <div className="flex items-center gap-6 mb-12">
           <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-2xl h-14 w-14 border border-slate-200 bg-white shadow-sm">
             <ArrowLeft className="h-6 w-6 text-[#0F172A]" />
           </Button>
           <div className="text-left">
              <h1 className="text-4xl font-headline font-black text-[#0F172A] uppercase tracking-tight">Final Registry Audit</h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1 text-left">Secure Manual Payment Node</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 text-left">
           <div className="lg:col-span-7 space-y-10">
              <Card className="border-none shadow-3xl rounded-[3rem] bg-white overflow-hidden">
                 <CardHeader className="p-10 bg-slate-50/50 border-b border-slate-100">
                    <CardTitle className="font-headline font-black text-xl uppercase text-[#0F172A]">M-Payment Instructions</CardTitle>
                 </CardHeader>
                 <CardContent className="p-10 space-y-10">
                    <div className="flex flex-col items-center gap-10">
                       <div className="h-56 w-56 md:h-64 md:w-64 bg-white rounded-3xl border-4 border-slate-50 flex items-center justify-center p-6 shadow-2xl relative group overflow-hidden">
                          <img src={qrUrl} alt="Audit QR" className="w-full h-full object-contain" />
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <Button variant="secondary" size="sm" asChild className="rounded-xl font-black uppercase text-[10px]"><a href={qrUrl} download="Cracklix_QR.png"><Download className="h-4 w-4 mr-2" /> Download</a></Button>
                          </div>
                       </div>
                       
                       <div className="w-full space-y-4">
                          <div className="p-5 bg-[#0F172A] rounded-2xl border border-white/5 flex items-center justify-between shadow-2xl">
                             <div className="min-w-0 flex-1">
                                <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-1">Institutional UPI ID</p>
                                <p className="text-lg font-black text-white truncate">{upiId}</p>
                             </div>
                             <Button size="icon" variant="ghost" onClick={handleCopyUPI} className="text-primary hover:bg-white/10 rounded-xl"><Copy className="h-5 w-5" /></Button>
                          </div>
                          
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <li className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase bg-slate-50 p-3 rounded-xl border border-slate-100"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Pay Exactly ₹{planData.price}</li>
                             <li className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase bg-slate-50 p-3 rounded-xl border border-slate-100"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Save Transaction ID</li>
                          </ul>
                       </div>
                    </div>

                    <div className="space-y-4 pt-8 border-t border-slate-100">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">UTR / 12-Digit Transaction ID</Label>
                          <Input 
                            value={utr}
                            onChange={e => setUtr(e.target.value.replace(/\D/g, '').slice(0,12))}
                            placeholder="Enter 12-digit number" 
                            className="h-14 rounded-xl border-slate-200 bg-slate-50 font-black text-xl tracking-widest text-[#0F172A] text-center" 
                          />
                       </div>
                       <Button 
                          onClick={handleManualPayment}
                          disabled={processing}
                          className="w-full h-16 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl transition-all active:scale-95 border-none gap-3"
                       >
                          {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                          Commit Audit Submission
                       </Button>
                    </div>
                 </CardContent>
              </Card>
           </div>

           <div className="lg:col-span-5 space-y-8">
              <Card className="border-none shadow-5xl rounded-[3.5rem] bg-[#0B1528] text-white p-10 md:p-14 overflow-hidden relative">
                 <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-[3000ms]"><Gem className="h-48 w-48" /></div>
                 <div className="relative z-10 space-y-12">
                    <div className="space-y-2 text-center">
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Plan Node Registry</p>
                       <h3 className="text-3xl md:text-5xl font-headline font-black uppercase leading-tight">{planData.name}</h3>
                    </div>
                    
                    <div className="space-y-5 pt-8 border-t border-white/5">
                       <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
                          <span>Institutional Fee</span>
                          <span className="text-white font-black">₹{planData.price}</span>
                       </div>
                       <div className="flex justify-between items-center pt-8 border-t border-white/5">
                          <span className="text-xl font-headline font-black uppercase">Grand Total</span>
                          <span className="text-5xl font-black text-primary tracking-tighter tabular-nums">₹{planData.price}</span>
                       </div>
                    </div>
                 </div>
              </Card>

              <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl flex items-start gap-4">
                 <Lock className="h-5 w-5 text-slate-300 shrink-0 mt-1" />
                 <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase">
                    All transaction nodes are audited against the official Punjab Recruitment norms. Pass activation occurs within 24 hours of successful verification.
                 </p>
              </div>
           </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
