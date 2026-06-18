'use client';

import { useMemo } from "react";
import { Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDoc, useFirestore } from "@/firebase";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'dark';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'h-14';
  showLabel?: boolean;
}

/**
 * @fileOverview Hardened Native Share Node v4.0.
 * LOGIC: Triggers the OS-native share sheet (WhatsApp, Telegram, etc.) on supported devices.
 * FALLBACK: Copy-to-clipboard functionality for legacy browsers.
 */
export default function ShareButton({ 
  className = "", 
  variant = 'default', 
  size = 'default',
  showLabel = true 
}: ShareButtonProps) {
  const db = useFirestore();
  const { toast } = useToast();
  
  const settingsRef = useMemo(() => (db ? doc(db, 'settings', 'global') : null), [db]);
  const { data: settings, loading } = useDoc<any>(settingsRef);

  const handleShare = async () => {
    const shareData = {
      title: settings?.shareTitle || "Cracklix | Punjab's Smart Mock Test Platform",
      text: settings?.shareDescription || "Join thousands of aspirants preparing for Punjab Government Exams with high-fidelity mocks and official patterns.",
      url: settings?.shareUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://cracklix.com')
    };

    try {
      // 1. Trigger Native OS Share Sheet (Direct WhatsApp/Telegram option)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // 2. Fallback: Copy to Clipboard
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareData.url);
          toast({
            title: "Link Copied!",
            description: "Direct link saved to your clipboard. You can now paste it in any app.",
          });
        }
      }
    } catch (err) {
      // Handle user cancellation silently, log other errors
      if ((err as Error).name !== 'AbortError') {
        console.error('[SHARE_NODE_FAILURE]', err);
      }
    }
  };

  const isDark = variant === 'dark';

  return (
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
  );
}
