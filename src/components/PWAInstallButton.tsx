'use client';

import React, { useState, useEffect } from 'react';
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
 * @fileOverview Production PWA Trigger Node v10.0 (Event Capture Fixed).
 * LOGIC: Directly captures beforeinstallprompt and syncs with global state.
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

  const updateState = () => {
    if (typeof window === 'undefined') return;
    
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    setIsInstalled(isStandalone);

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // If it's not installed, and we either have a prompt or it's iOS
    const hasPrompt = !!(window as any).deferredPrompt;
    setCanInstall(!isStandalone && (hasPrompt || ios));
  };

  useEffect(() => {
    setMounted(true);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      // Store the event globally
      (window as any).deferredPrompt = e;
      setCanInstall(true);
      // Notify other buttons
      window.dispatchEvent(new CustomEvent('pwa-installable'));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('pwa-installable', updateState);
    window.addEventListener('appinstalled', updateState);
    
    // Initial check
    updateState();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-installable', updateState);
      window.removeEventListener('appinstalled', updateState);
    };
  }, []);

  const handleInstall = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isIOS) {
       toast({
         title: "📱 Add to Home Screen",
         description: "Tap the 'Share' icon in Safari and select 'Add to Home Screen' to install Cracklix.",
       });
       return;
    }

    const prompt = (window as any).deferredPrompt;
    if (!prompt) {
      toast({
        title: "Already Optimized",
        description: "Cracklix is already installed or your browser handles installation automatically.",
      });
      return;
    }

    try {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') {
        (window as any).deferredPrompt = null;
        setCanInstall(false);
      }
    } catch (err) {
      console.error('[PWA] Native prompt failed:', err);
    }
  };

  if (!mounted || isInstalled || !canInstall) return null;

  return (
    <Button
      onClick={handleInstall}
      className={cn(
        "font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl transition-all active:scale-95",
        variant === 'primary' ? "bg-primary hover:bg-blue-700 text-white" : 
        variant === 'dark' ? "bg-[#0B1528] hover:bg-black text-white" : "",
        className
      )}
    >
      {isIOS ? <Smartphone className="h-4 w-4" /> : <Download className="h-4 w-4" />}
      {showLabel && (isIOS ? "Install App" : "Install App")}
      <Sparkles className="h-3 w-3 text-primary animate-pulse" />
    </Button>
  );
}
