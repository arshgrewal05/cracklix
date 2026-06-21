'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'primary' | 'secondary' | 'dark';
  showLabel?: boolean;
}

/**
 * @fileOverview Hardened PWA Install Trigger v16.0.
 * Works without login and handles global prompt captures.
 */
export default function PWAInstallButton({ 
  className, 
  variant = 'default',
  showLabel = true 
}: PWAInstallButtonProps) {
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const updateState = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    setIsInstalled(isStandalone);

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    const hasPrompt = !!(window as any).deferredPrompt;
    setCanInstall(!isStandalone && (hasPrompt || ios));
  }, []);

  useEffect(() => {
    setMounted(true);

    const handleCheck = () => {
       console.log('[INSTALL_BTN] PWA State Synchronized');
       updateState();
    };

    window.addEventListener('pwa-installable', handleCheck);
    window.addEventListener('appinstalled', handleCheck);
    
    updateState();

    return () => {
      window.removeEventListener('pwa-installable', handleCheck);
      window.removeEventListener('appinstalled', handleCheck);
    };
  }, [updateState]);

  const handleInstall = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isIOS) {
       toast({
         title: "📱 iOS Installation",
         description: "Tap 'Share' in your Safari browser and select 'Add to Home Screen'.",
       });
       return;
    }

    const prompt = (window as any).deferredPrompt;
    if (!prompt) {
      toast({
        variant: "destructive",
        title: "Setup Required",
        description: "Please use the 'Install' option in your browser menu.",
      });
      return;
    }

    try {
      console.log('[PWA_INSTALL] Prompting user...');
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      console.log('[PWA_INSTALL] User Choice:', outcome);
      if (outcome === 'accepted') {
        (window as any).deferredPrompt = null;
        setCanInstall(false);
      }
    } catch (err) {
      console.error('[PWA_INSTALL_FAILURE]:', err);
    }
  };

  if (!mounted || isInstalled) return null;

  return (
    <Button
      onClick={handleInstall}
      className={cn(
        "font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl transition-all active:scale-95",
        variant === 'primary' ? "bg-primary hover:bg-blue-700 text-white border-none" : 
        variant === 'dark' ? "bg-[#0B1528] hover:bg-black text-white border-none" : 
        variant === 'outline' ? "bg-white border-slate-200 text-[#0F172A] hover:bg-slate-50" : "",
        className
      )}
    >
      {isIOS ? <Smartphone className="h-4 w-4" /> : <Download className="h-4 w-4" />}
      {showLabel && (canInstall ? "Install App" : "Setup App")}
      <Sparkles className="h-3 w-3 text-primary animate-pulse" />
    </Button>
  );
}