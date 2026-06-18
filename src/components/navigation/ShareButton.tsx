'use client';

import React, { useMemo, useState } from "react";
import { Share2, Loader2, MessageSquare, Send, Copy, Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ShareButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'dark';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'h-14';
  showLabel?: boolean;
}

/**
 * @fileOverview Hardened Social Share Hub v8.0.
 * DIRECT SHARE: Integrated direct WhatsApp and Telegram links for desktop/fallback scenarios.
 * NATIVE: Prioritizes OS-native share sheet for "Other App" functioning.
 */
export default function ShareButton({ 
  className = "", 
  variant = 'default', 
  size = 'default',
  showLabel = true 
}: ShareButtonProps) {
  const db = useFirestore();
  const { toast } = useToast();
  const [isDialogOpen, setIsShareDialogOpen] = useState(false);
  
  const settingsRef = useMemo(() => (db ? doc(db, 'settings', 'global') : null), [db]);
  const { data: settings, loading } = useDoc<any>(settingsRef);

  const shareTitle = settings?.shareTitle || "Cracklix | Punjab's Smart Mock Test Platform";
  const shareDesc = settings?.shareDescription || "Join thousands of aspirants preparing for Punjab Government Exams.";
  const shareUrl = settings?.shareUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://cracklix.com');

  const handleShare = async () => {
    const shareData = {
      title: shareTitle,
      text: shareDesc,
      url: shareUrl
    };

    try {
      // Priority 1: Native OS Share Sheet (Functions like other native apps)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Priority 2: Custom Social Hub Fallback
        setIsShareDialogOpen(true);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setIsShareDialogOpen(true);
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Registry node link saved to clipboard.",
      });
    } catch (e) {
      toast({ variant: "destructive", title: "Copy Failed" });
    }
  };

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareTitle + "\n\n" + shareUrl)}`;
    window.open(url, '_blank');
  };

  const shareToTelegram = () => {
    const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
    window.open(url, '_blank');
  };

  const isDark = variant === 'dark';

  return (
    <>
      <Button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleShare();
        }}
        disabled={loading}
        variant={isDark ? 'ghost' : (variant as any)}
        className={cn(
          "rounded-xl font-black uppercase text-[10px] tracking-widest gap-3 transition-all active:scale-95",
          isDark ? "bg-[#0F172A] hover:bg-black text-white shadow-xl" : "",
          className
        )}
        size={size as any}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Share2 className={cn("h-4 w-4", isDark ? "text-primary" : "")} />
        )}
        {showLabel && <span>Share Cracklix</span>}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="bg-white rounded-[2rem] md:rounded-[3.5rem] border-none shadow-5xl max-w-[400px] w-[95vw] p-0 overflow-hidden text-left">
          <div className="h-1.5 w-full bg-primary" />
          <DialogHeader className="p-8 md:p-10 pb-4 text-center">
             <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary shadow-xl mb-4">
                <Share2 className="h-7 w-7" />
             </div>
             <DialogTitle className="text-xl md:text-2xl font-black font-headline uppercase text-[#0F172A]">Share Prep Hub</DialogTitle>
             <DialogDescription className="text-slate-400 text-[9px] md:text-[11px] font-bold uppercase tracking-widest leading-relaxed">Choose a platform to invite aspirants</DialogDescription>
          </DialogHeader>

          <div className="px-8 md:px-10 pb-10 space-y-3">
             <button 
               onClick={shareToWhatsApp}
               className="w-full h-14 md:h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl flex items-center px-5 gap-4 shadow-lg transition-all active:scale-95 group"
             >
                <div className="h-9 w-9 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                   <MessageSquare className="h-4 w-4 fill-current" />
                </div>
                <span className="font-black uppercase text-[10px] md:text-xs tracking-widest">Share to WhatsApp</span>
             </button>

             <button 
               onClick={shareToTelegram}
               className="w-full h-14 md:h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl flex items-center px-5 gap-4 shadow-lg transition-all active:scale-95 group"
             >
                <div className="h-9 w-9 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Send className="h-4 w-4 fill-current" />
                </div>
                <span className="font-black uppercase text-[10px] md:text-xs tracking-widest">Share to Telegram</span>
             </button>

             <div className="h-px w-full bg-slate-50 my-2" />

             <button 
               onClick={copyToClipboard}
               className="w-full h-12 bg-slate-50 hover:bg-slate-100 text-[#0F172A] rounded-2xl flex items-center px-6 gap-5 border border-slate-100 transition-all active:scale-95 group"
             >
                <Copy className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                <span className="font-bold text-[10px] md:text-[11px] uppercase tracking-widest truncate">{shareUrl}</span>
             </button>
          </div>

          <DialogFooter className="bg-slate-50 p-4 flex justify-center">
             <div className="flex items-center gap-2.5 text-slate-300">
                <Globe className="h-3 w-3" />
                <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest">Institutional Direct Share Node Active</p>
             </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
