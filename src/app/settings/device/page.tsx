
"use client"

import { useState, useMemo } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { useUser, useFirestore } from "@/firebase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Smartphone, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  Lock, 
  History,
  Info,
  Loader2,
  CheckCircle2
} from "lucide-react"
import { DeviceService } from "@/services/device-service"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { getDeviceName } from "@/lib/device"
import BackButton from "@/components/navigation/BackButton"

/**
 * @fileOverview Institutional Device Management Center.
 */

export default function DeviceManagementPage() {
  const { profile, loading, currentDeviceId } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const cooldown = useMemo(() => {
    if (!profile) return { canChange: true, daysRemaining: 0 }
    return DeviceService.canChangeDevice(profile)
  }, [profile])

  const handleDeviceChange = async () => {
    if (!db || !profile || !cooldown.canChange) return
    
    setIsProcessing(true)
    try {
      await DeviceService.bindCurrentDevice(db, profile.id, profile.deviceLock?.enforcementLevel || 3)
      toast({ 
        title: "Device Bind Successful", 
        description: "Your account is now locked to this device for 30 days." 
      })
    } catch (e) {
      toast({ variant: "destructive", title: "Registration Failed" })
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
    </div>
  )

  if (!profile) return null

  const isCurrentLocked = profile.deviceLock?.deviceId === currentDeviceId;

  return (
    <div className="min-h-screen bg-slate-50/50 font-body text-left">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-16 max-w-4xl space-y-12">
        <div className="flex items-center gap-6">
           <BackButton label="Settings" fallback="/profile" />
           <div className="text-left">
              <h1 className="text-3xl md:text-5xl font-headline font-black text-[#0F172A] uppercase tracking-tight leading-none">Security Lock</h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">One Pass • One Device Policy</p>
           </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
           {/* CURRENT DEVICE STATUS */}
           <Card className="border-none shadow-3xl rounded-[2.5rem] bg-white overflow-hidden border border-slate-100">
              <CardHeader className="p-8 md:p-10 border-b border-slate-50">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <Smartphone className="h-6 w-6 text-primary" />
                       <CardTitle className="font-headline font-black text-xl md:text-2xl uppercase">Device Status</CardTitle>
                    </div>
                    <Badge className={cn(
                       "px-4 py-1.5 rounded-xl font-black text-[10px] uppercase",
                       isCurrentLocked ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    )}>
                       {isCurrentLocked ? "Authorized" : "Unauthorized Node"}
                    </Badge>
                 </div>
              </CardHeader>
              <CardContent className="p-8 md:p-10 space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LOCKED DEVICE</p>
                       <p className="text-lg font-black text-[#0F172A] uppercase">{profile.deviceLock?.deviceName || "Unregistered"}</p>
                       <code className="text-[10px] font-mono text-slate-300">ID: {profile.deviceLock?.deviceId || "---"}</code>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CURRENT DEVICE</p>
                       <p className="text-lg font-black text-primary uppercase">{getDeviceName()}</p>
                       <code className="text-[10px] font-mono text-slate-300">ID: {currentDeviceId}</code>
                    </div>
                 </div>

                 {!isCurrentLocked && (
                    <div className="bg-amber-50 border border-amber-100 p-6 md:p-8 rounded-[2rem] space-y-6">
                       <div className="flex items-start gap-4">
                          <AlertTriangle className="h-6 w-6 text-amber-600 shrink-0" />
                          <div className="space-y-2 text-left">
                             <h4 className="font-black uppercase text-amber-900 text-sm tracking-tight">Identity Mismatch Detected</h4>
                             <p className="text-xs text-amber-700 leading-relaxed font-medium">
                                This device is not registered with your Premium Pass. You must authorize this device to access premium mock tests. 
                                <strong> Note: Device changes are only allowed once every 30 days.</strong>
                             </p>
                          </div>
                       </div>
                       
                       <div className="pt-4 border-t border-amber-200/50 flex flex-col sm:flex-row items-center justify-between gap-6">
                          <div className="text-left">
                             <p className="text-[9px] font-black text-amber-900 uppercase">COOLDOWN PERIOD</p>
                             <p className="text-xl font-headline font-black text-amber-600">
                                {cooldown.canChange ? "ELIGIBLE NOW" : `${cooldown.daysRemaining} Days Left`}
                             </p>
                          </div>
                          <Button 
                            onClick={handleDeviceChange}
                            disabled={!cooldown.canChange || isProcessing}
                            className="bg-[#0F172A] hover:bg-black text-white h-14 px-10 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl border-none gap-3"
                          >
                             {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                             Authorize This Device
                          </Button>
                       </div>
                    </div>
                 )}

                 {isCurrentLocked && (
                    <div className="flex items-center gap-4 text-emerald-600 bg-emerald-50 px-6 py-4 rounded-xl border border-emerald-100">
                       <ShieldCheck className="h-5 w-5" />
                       <p className="text-[10px] font-black uppercase tracking-widest">Device Identity Verified against State Registry</p>
                    </div>
                 )}
              </CardContent>
           </Card>

           {/* POLICY DOCS */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PolicyCard 
                icon={<Lock className="text-blue-500" />} 
                title="Single Binding" 
                desc="One Premium Pass is strictly bound to one physical device to prevent account sharing." 
              />
              <PolicyCard 
                icon={<History className="text-primary" />} 
                title="30-Day Cooldown" 
                desc="If you change your phone, you can register a new one only once every 30 days." 
              />
           </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function PolicyCard({ icon, title, desc }: any) {
   return (
      <div className="p-8 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 text-left space-y-4">
         <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner">
            {icon}
         </div>
         <h3 className="font-headline font-black text-lg uppercase text-[#0F172A]">{title}</h3>
         <p className="text-xs text-slate-400 leading-relaxed font-medium uppercase tracking-tight">{desc}</p>
      </div>
   )
}
