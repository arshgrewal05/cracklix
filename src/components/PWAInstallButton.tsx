'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'primary' | 'secondary';
  showLabel?: boolean;
}

/**
 * @fileOverview Hardened PWA Native Trigger v6.0.
 * REMOVED: Fallback messages and menu tips.
 * AUDIT: Strictly triggers native browser install prompt.
 */
export default function PWAInstallButton({ 
  className, 
  variant = 'default',
  showLabel = true 
}: PWAInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkState = () => {
      if ((window as any).deferredPrompt) {
        setDeferredPrompt((window as any).deferredPrompt);
      }

      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
      if (isStandalone) {
        setIsInstalled(true);
      }
    };

    const handleInstallable = () => {
      setDeferredPrompt((window as any).deferredPrompt);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    checkState();
    window.addEventListener('pwa-installable', handleInstallable);
    window.addEventListener('pwa-installed', handleInstalled);

    return () => {
      window.removeEventListener('pwa-installable', handleInstallable);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, []);

  const handleInstall = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`[PWA] Install choice: ${outcome}`);
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        (window as any).deferredPrompt = null;
      }
    } catch (err) {
      console.error('[PWA] Error triggering native prompt:', err);
    }
  };

  if (isInstalled || !deferredPrompt) return null;

  return (
    <Button
      onClick={handleInstall}
      className={cn(
        "font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl transition-all active:scale-95",
        variant === 'primary' ? "bg-primary hover:bg-orange-600 text-white" : "",
        className
      )}
    >
      <Download className="h-4 w-4" />
      {showLabel && "Install App"}
    </Button>
  );
}
