'use client';

import { useEffect } from 'react';
import { Capacitor, PluginListenerHandle } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { StatusBar, Style } from '@capacitor/status-bar';

export default function CapacitorManager() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let backListenerHandle: PluginListenerHandle | null = null;
    let urlListenerHandle: PluginListenerHandle | null = null;

    const setupListeners = async () => {
      // Hardware Back Button Handling
      backListenerHandle = await App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          App.exitApp();
        } else {
          window.history.back();
        }
      });

      // Deep Link Listener
      urlListenerHandle = await App.addListener('appUrlOpen', (data) => {
        const slug = data.url.split('.app').pop();
        if (slug) window.location.href = slug;
      });
    };

    setupListeners();

    // Status Bar Configuration
    try {
      StatusBar.setStyle({ style: Style.Dark });
      StatusBar.setBackgroundColor({ color: '#0B1528' });
    } catch (e) {
      console.warn('[NATIVE_BRIDGE] StatusBar plugin error');
    }

    // External Browser Interceptor
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.href && Capacitor.isNativePlatform()) {
        try {
          const url = new URL(anchor.href);
          const isExternal = url.hostname !== window.location.hostname;
          const isPdf = anchor.href.endsWith('.pdf');

          if (isExternal || isPdf) {
            e.preventDefault();
            Browser.open({ url: anchor.href });
          }
        } catch (e) {}
      }
    };

    document.addEventListener('click', handleLinkClick);
    
    return () => {
      document.removeEventListener('click', handleLinkClick);
      if (backListenerHandle) backListenerHandle.remove();
      if (urlListenerHandle) urlListenerHandle.remove();
    };
  }, []);

  return null;
}