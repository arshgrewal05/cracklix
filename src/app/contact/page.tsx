
"use client"

import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export default function ContactPage() {
  const { toast } = useToast()
  const [sending, setSending] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      toast({ title: "Message Logged", description: "Arsh Grewal Management will contact you within 24 hours." })
      setSending(false)
      const form = e.target as HTMLFormElement
      form.reset()
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-50/30">
      <Navbar />
      <main className="container mx-auto px-6 py-24 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                 <MessageSquare className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-6xl font-headline font-black text-[#0F172A] tracking-tight uppercase leading-[0.9]">
                Support <br/> <span className="text-primary">Hub</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Have an inquiry about official exam patterns or institutional access? Reach out to our management node directly.
              </p>
            </div>

            <div className="space-y-10">
               <ContactInfo icon={<Mail />} label="Email Node" value="arshdeepgrewal1122@gmail.com" />
               <ContactInfo icon={<Phone />} label="Institutional Line" value="+91 98881 88602" />
               <ContactInfo icon={<MapPin />} label="HQs Node" value="Phase 7, Mohali, Punjab" />
            </div>

            <div className="pt-12 border-t border-slate-100 flex items-center gap-4 text-emerald-600">
               <ShieldCheck className="h-6 w-6" />
               <p className="text-[10px] font-black uppercase tracking-widest">Institutional Verification Enabled</p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Card className="border-none shadow-3xl shadow-slate-900/5 rounded-[3.5rem] bg-white overflow-hidden">
               <div className="h-2 w-full bg-primary" />
               <CardContent className="p-16">
                  <form onSubmit={handleSubmit} className="space-y-8">
                     <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Identity</label>
                           <Input required placeholder="Arsh Grewal" className="h-14 rounded-xl border-slate-100 bg-slate-50/50 font-bold" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Contact String</label>
                           <Input required type="email" placeholder="name@domain.com" className="h-14 rounded-xl border-slate-100 bg-slate-50/50 font-bold" />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Message Context</label>
                        <Textarea required placeholder="Describe your inquiry or technical issue..." className="min-h-[200px] rounded-2xl border-slate-100 bg-slate-50/50 p-6 leading-relaxed font-medium" />
                     </div>
                     <Button type="submit" disabled={sending} className="w-full h-16 bg-[#0F172A] hover:bg-black text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl transition-all active:scale-95">
                        {sending ? "Transmitting..." : "Initiate Contact"} <Send className="ml-3 h-4 w-4" />
                     </Button>
                  </form>
               </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function ContactInfo({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-6 group">
      <div className="h-16 w-16 rounded-[1.5rem] bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center shrink-0 border border-slate-50 text-slate-300 group-hover:bg-primary/5 group-hover:text-primary transition-all">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{label}</p>
        <p className="text-xl font-bold text-[#0F172A]">{value}</p>
      </div>
    </div>
  )
}
