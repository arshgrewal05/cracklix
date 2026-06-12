'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { X, ShieldCheck, Zap, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @fileOverview Institutional PWA Lifecycle Manager v22.0.
 * HARDENED: Reliable 'deferredPrompt' capture for home-screen installation.
 */
export default function PWAManager() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Service Worker registration
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        (reg) => console.log('[PWA] Service Worker Active'),
        (err) => console.log('[PWA] Service Worker Offline')
      );
    }

    // 2. Capture Install Prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      // Store event globally for other UI nodes (like Hero button)
      (window as any).deferredPrompt = e;
      setDeferredPrompt(e);
      
      // Notify components like Navbar/Hero that app is installable
      window.dispatchEvent(new CustomEvent('pwa-installable'));
      
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isExcluded = pathname?.includes('/attempt') || pathname?.startsWith('/admin');
      
      if (!isExcluded && !isStandalone) {
        const timer = setTimeout(() => setShowPrompt(true), 3500);
        return () => clearTimeout(timer);
      }
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      (window as any).deferredPrompt = null;
      setShowPrompt(false);
      setIsInstalled(true);
      window.dispatchEvent(new CustomEvent('pwa-installed'));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [pathname]);

  const handleInstallClick = async () => {
    const prompt = deferredPrompt || (window as any).deferredPrompt;
    if (!prompt) return;

    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowPrompt(false);
      (window as any).deferredPrompt = null;
      setDeferredPrompt(null);
    }
  };

  if (!mounted || isInstalled) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 md:bottom-10 left-4 right-4 md:left-auto md:right-10 z-[2000] md:w-96 pointer-events-auto"
        >
          <div className="bg-[#0F172A] text-white p-5 rounded-[2.5rem] shadow-5xl border border-white/10 flex items-center gap-4 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-1000">
              <ShieldCheck className="h-20 w-20" />
            </div>
            
            <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0 border border-white/20">
               <Zap className="h-6 w-6 text-primary fill-current" />
            </div>

            <div className="flex-1 min-w-0 text-left">
               <h4 className="text-[13px] font-black uppercase tracking-tight leading-none mb-1">Download Cracklix</h4>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Install for easy learning</p>
            </div>

            <div className="flex items-center gap-2">
               <Button 
                onClick={handleInstallClick}
                className="h-10 px-4 bg-primary hover:bg-orange-600 text-white font-black uppercase text-[9px] tracking-widest rounded-xl shadow-lg border-none transition-all active:scale-95 gap-2"
               >
                  <Download className="h-3.5 w-3.5" /> Install
               </Button>
               <button 
                onClick={() => setShowPrompt(false)}
                className="p-2 text-slate-500 hover:text-white transition-colors"
               >
                  <X className="h-4 w-4" />
               </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
