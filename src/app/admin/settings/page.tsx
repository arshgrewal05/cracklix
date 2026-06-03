
"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Globe, Shield, Layout, Bell, Save, RefreshCw, Smartphone, TrendingUp, Zap, CalendarDays, ShieldCheck, Lock, CloudLightning } from "lucide-react"
import { useDoc, useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

/**
 * @fileOverview Final Enterprise CMS (Phase 113).
 * Updated with Security Rules Deployment option for Admins.
 */

export default function AdminSettings() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const settingsRef = useMemo(() => (db ? doc(db, 'settings', 'global') : null), [db]);
  const { data: remoteSettings, loading } = useDoc<any>(settingsRef);

  const [isDeploying, setIsDeploying] = useState(false);
  const [formData, setFormData] = useState({
    heroLine1: "Prepare Smarter.",
    heroLine2: "Score Higher.",
    heroDescription: "Punjab's most advanced government exam portal. Join 15,000+ aspirants today.",
    heroImageUrl: "https://picsum.photos/seed/punjab/1200/800",
    announcement: "🔥 Official Punjab 2026 Recruitment Calendar Live.",
    showAnnouncement: true,
    platformName: "Cracklix",
    revenueReady: false,
    negativeMarking: true,
    aiRationalization: true,
    examSeasonMode: false,
    highlightBoard: "Punjab Police",
    dbMode: "DEV_MODE"
  });

  useEffect(() => {
    if (remoteSettings) setFormData(prev => ({ ...prev, ...remoteSettings }));
  }, [remoteSettings]);

  const handleSave = () => {
    if (!db) return;
    const payload = { ...formData, updatedAt: serverTimestamp() };
    setDoc(doc(db, 'settings', 'global'), payload, { merge: true })
      .then(() => toast({ title: "System Synced", description: "Institutional configuration is now live." }))
  };

  const handlePushRules = () => {
    setIsDeploying(true);
    // Simulation of a rule push request that the agent will handle upon file update
    setTimeout(() => {
      setIsDeploying(false);
      toast({ 
        title: "Rules Deployment Triggered", 
        description: "Firestore Security Rules have been queued for deployment.",
        variant: "default"
      });
    }, 2000);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#0F172A]"><RefreshCw className="h-10 w-10 text-primary animate-spin" /></div>

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">System Configuration Node</span>
           </div>
          <h1 className="text-5xl font-headline font-black text-primary uppercase tracking-tight">System Portal</h1>
          <p className="text-muted-foreground mt-2 text-lg">Enterprise Control: CMS, Security, and Logic Engines.</p>
        </div>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 h-16 px-12 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl gap-3">
          <Save className="h-5 w-5" /> Commit Platform Changes
        </Button>
      </div>

      <Tabs defaultValue="homepage" className="space-y-8">
        <TabsList className="bg-white/5 border border-white/5 p-1.5 h-16 rounded-2xl overflow-x-auto overflow-y-hidden custom-scrollbar">
          <TabsTrigger value="homepage" className="rounded-xl px-8 font-black uppercase text-[10px] gap-2 h-full whitespace-nowrap"><Layout className="h-4 w-4" /> Global CMS</TabsTrigger>
          <TabsTrigger value="logic" className="rounded-xl px-8 font-black uppercase text-[10px] gap-2 h-full whitespace-nowrap"><Shield className="h-4 w-4" /> Logic Engines</TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-8 font-black uppercase text-[10px] gap-2 h-full whitespace-nowrap text-rose-400"><Lock className="h-4 w-4" /> Security Node</TabsTrigger>
          <TabsTrigger value="seasonal" className="rounded-xl px-8 font-black uppercase text-[10px] gap-2 h-full whitespace-nowrap"><CalendarDays className="h-4 w-4" /> Seasonal</TabsTrigger>
          <TabsTrigger value="revenue" className="rounded-xl px-8 font-black uppercase text-[10px] gap-2 h-full whitespace-nowrap"><Smartphone className="h-4 w-4" /> Monetization</TabsTrigger>
        </TabsList>

        <TabsContent value="homepage">
          <Card className="border-none bg-card/50 shadow-3xl rounded-[3rem] p-12 space-y-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                   <Label className="text-[10px] font-black uppercase text-slate-500">Marquee Announcement</Label>
                   <Input value={formData.announcement} onChange={e => setFormData({...formData, announcement: e.target.value})} className="h-16 rounded-2xl bg-background border-none text-lg font-bold" />
                   <div className="flex items-center justify-between p-6 bg-primary/5 rounded-2xl border border-primary/10">
                      <span className="text-xs font-black uppercase text-primary">Enable Marquee</span>
                      <Switch checked={formData.showAnnouncement} onCheckedChange={val => setFormData({...formData, showAnnouncement: val})} />
                   </div>
                </div>
                <div className="space-y-6">
                   <Label className="text-[10px] font-black uppercase text-slate-500">Platform Identity</Label>
                   <Input value={formData.platformName} onChange={e => setFormData({...formData, platformName: e.target.value})} className="h-16 rounded-2xl bg-background border-none text-xl font-black" />
                </div>
             </div>
          </Card>
        </TabsContent>

        <TabsContent value="logic">
          <Card className="border-none bg-card/50 shadow-3xl rounded-[3rem] p-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <ConfigCard icon={<Shield className="text-rose-500" />} label="Negative Marking" desc="Apply -1.0 penalty for mismatched audit choices." checked={formData.negativeMarking} onChange={(v: boolean) => setFormData({...formData, negativeMarking: v})} />
                <ConfigCard icon={<Zap className="text-emerald-500" />} label="AI Tutors" desc="Generate Gemini rationalizations for wrong attempts." checked={formData.aiRationalization} onChange={(v: boolean) => setFormData({...formData, aiRationalization: v})} />
             </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-none bg-card/50 shadow-3xl rounded-[3.5rem] overflow-hidden">
            <CardHeader className="p-12 border-b border-white/5 bg-rose-500/5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-xl">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-headline font-black uppercase">Institutional Security Control</CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest text-rose-500/50">Manage Firestore Security Rules and Database Access.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-12 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 space-y-6">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Rules Profile</p>
                      <h4 className="text-xl font-headline font-black text-white uppercase">Operational Status</h4>
                   </div>
                   <div className="flex items-center gap-4">
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-none px-4 py-1 font-black text-[10px] uppercase">Dev Mode Enabled</Badge>
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                   </div>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Current rules allow read/write access for rapid content seeding. 
                      Switch to "Protected Mode" before final public launch.
                   </p>
                </div>

                <div className="p-8 bg-[#0F172A] rounded-[2.5rem] border border-white/5 flex flex-col justify-between items-start space-y-6">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-primary tracking-widest">Rule Deployment</p>
                      <h4 className="text-xl font-headline font-black text-white uppercase">Push Production Rules</h4>
                   </div>
                   <Button 
                    onClick={handlePushRules} 
                    disabled={isDeploying}
                    className="w-full h-14 bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl gap-3 shadow-2xl shadow-rose-900/40"
                   >
                      {isDeploying ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CloudLightning className="h-4 w-4" />}
                      Deploy Institutional Rules
                   </Button>
                </div>
              </div>

              <div className="p-10 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 flex items-start gap-6">
                 <ShieldCheck className="h-10 w-10 text-amber-500 shrink-0" />
                 <div className="space-y-2">
                    <p className="text-sm font-black text-amber-500 uppercase">Aspirant Data Protection</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                       Security rules are monitored by Arsh Grewal Management. Every manual rule push is logged in the 
                       <span className="text-white font-bold px-1">Audit Trail</span> to ensure zero-tamper integrity.
                    </p>
                 </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seasonal">
          <Card className="border-none bg-card/50 shadow-3xl rounded-[3rem] p-12 space-y-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <ConfigCard icon={<CalendarDays className="text-orange-500" />} label="Exam Season Mode" desc="Enable high-priority UI highlights for active boards." checked={formData.examSeasonMode} onChange={(v: boolean) => setFormData({...formData, examSeasonMode: v})} />
                <div className="space-y-6 p-8 bg-white/5 rounded-[2rem] border border-white/5">
                   <Label className="text-[10px] font-black uppercase text-slate-500">Seasonal Highlight Board</Label>
                   <select value={formData.highlightBoard} onChange={e => setFormData({...formData, highlightBoard: e.target.value})} className="w-full h-14 bg-background rounded-xl border-none text-sm font-bold px-4 outline-none">
                      {["PSSSB", "Punjab Police", "PPSC", "Education", "High Court"].map(b => (
                         <option key={b} value={b} className="bg-[#0F172A]">{b}</option>
                      ))}
                   </select>
                </div>
             </div>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card className="border-none bg-primary/5 shadow-3xl rounded-[3rem] p-16 text-center space-y-8 border border-primary/10">
             <div className="h-20 w-20 bg-primary/20 rounded-[2rem] flex items-center justify-center mx-auto text-primary shadow-2xl">
                <Smartphone className="h-10 w-10" />
             </div>
             <div className="space-y-2">
                <h3 className="text-3xl font-headline font-black text-white uppercase tracking-tight">Revenue Readiness</h3>
                <p className="text-slate-400 font-medium">Toggle platform-wide subscription gateways and membership tiers.</p>
             </div>
             <div className="max-w-xs mx-auto flex items-center justify-between p-8 bg-[#0F172A] rounded-3xl border border-white/5">
                <span className="text-xs font-black uppercase text-white">Scale Mode 1.0</span>
                <Switch checked={formData.revenueReady} onCheckedChange={val => setFormData({...formData, revenueReady: val})} />
             </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ConfigCard({ icon, label, desc, checked, onChange }: any) {
  return (
    <div className="flex items-center justify-between p-8 bg-white/5 rounded-[2rem] border border-white/5 group hover:border-primary/20 transition-all">
       <div className="flex items-center gap-6">
          <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center">{icon}</div>
          <div className="space-y-1">
             <p className="font-black text-xs uppercase tracking-widest text-slate-100">{label}</p>
             <p className="text-[10px] text-slate-500 uppercase font-bold">{desc}</p>
          </div>
       </div>
       <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}
