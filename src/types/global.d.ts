
/**
 * @fileOverview Global TypeScript Declarations.
 * Resolves TS2882 errors for CSS side-effect imports during tsc.
 */

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// Global window extensions for PWA and Capacitor
interface Window {
  deferredPrompt?: any;
  Cashfree?: any;
}
