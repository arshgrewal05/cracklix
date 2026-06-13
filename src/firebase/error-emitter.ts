import { FirestorePermissionError } from './errors';

/**
 * @fileOverview Pure TypeScript Error Dispatcher.
 * REMOVED: Node.js 'events' dependency to resolve Webpack 'call' runtime errors in browser.
 */

type PermissionListener = (error: FirestorePermissionError) => void;

class ErrorEmitter {
  private listeners: Record<string, PermissionListener[]> = {};

  on(event: 'permission-error', listener: PermissionListener): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  off(event: 'permission-error', listener: PermissionListener): void {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(l => l !== listener);
  }

  emit(event: 'permission-error', error: FirestorePermissionError): void {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(listener => {
      try {
        listener(error);
      } catch (err) {
        console.error("[CBT EMIT ERROR]:", err);
      }
    });
  }
}

export const errorEmitter = new ErrorEmitter();
