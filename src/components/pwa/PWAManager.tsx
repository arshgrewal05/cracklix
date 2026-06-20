'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { X, Zap, Download, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @fileOverview Smart Institutional PWA Install Node v8.0.
 * LOGIC: Captures native beforeinstallprompt and manages the global installation state.
 * Syncs with PWAInstallButton components.
 */
export default function PWAManager() {
  const pathname = usePathname();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sessionDismissed, setSessionDismissed] = useState(false);

  const checkInstallability = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    const isExcluded = pathname?.includes('/attempt') || pathname?.startsWith('/admin');
    const hasPrompt = !!(window as any).deferredPrompt;
    
    if (isStandalone) {
      setIsInstalled(true);
      setShowPrompt(false);
      return;
    }

    // Only show the floating prompt if we have a prompt and aren't in an excluded route
    if (!isExcluded && !sessionDismissed && hasPrompt) {
      setShowPrompt(true);
    } else {
      setShowPrompt(false);
    }
  }, [pathname, sessionDismissed]);

  useEffect(() => {
    setMounted(true);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Store globally for all buttons
      (window as any).deferredPrompt = e;
      // Trigger a custom event so buttons can re-render
      window.dispatchEvent(new CustomEvent('pwa-installable'));
      checkInstallability();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('pwa-installable', checkInstallability);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
    });

    // Check on mount
    checkInstallability();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-installable', checkInstallability);
    };
  }, [checkInstallability]);

  const handleInstallClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const prompt = (window as any).deferredPrompt;
    if (!prompt) return;

    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
      (window as any).deferredPrompt = null;
    }
  };

  if (!mounted || isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-28 md:bottom-12 left-4 md:left-auto md:right-8 z-[2000] w-[calc(100%-2rem)] md:w-[360px] pointer-events-auto"
      >
        <div className="bg-[#0B1528] text-white p-5 rounded-[2.5rem] shadow-5xl border border-white/10 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
          
          <div className="flex flex-col gap-5 relative z-10">
             <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 shadow-inner">
                      <Zap className="h-6 w-6 text-primary fill-current animate-pulse" />
                   </div>
                   <div className="min-w-0 text-left">
                      <h4 className="text-sm font-black uppercase tracking-tight leading-none mb-1">Cracklix App</h4>
                      <div className="flex items-center gap-1.5 text-primary">
                         <Sparkles className="h-3 w-3" />
                         <p className="text-[9px] font-black uppercase tracking-widest">Institutional Hub</p>
                      </div>
                   </div>
                </div>
                <button 
                  onClick={() => {
                    setSessionDismissed(true);
                    setShowPrompt(false);
                  }}
                  className="h-8 w-8 flex items-center justify-center text-slate-500 hover:text-white bg-white/5 rounded-xl border border-white/5"
                >
                   <X className="h-4 w-4" />
                </button>
             </div>

             <div className="space-y-4">
                <p className="text-[13px] font-bold text-slate-300 leading-snug">
                   🚀 <span className="text-white">Get Faster Access</span> to Punjab Govt Exams. Install for better performance.
                </p>
                <Button 
                  onClick={handleInstallClick}
                  className="w-full h-14 bg-primary hover:bg-blue-700 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-3xl border-none transition-all active:scale-95 gap-3"
                >
                   <Download className="h-4 w-4" /> INSTALL APP
                </Button>
             </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
