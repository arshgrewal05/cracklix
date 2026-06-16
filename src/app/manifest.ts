import { MetadataRoute } from 'next';

/**
 * @fileOverview Production-Grade PWA Manifest v7.0.
 * HARDENED: Locked categories and added launch screenshots for Android/OS support.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cracklix | Punjab Mock Test Platform',
    short_name: 'Cracklix',
    description: "Punjab's most trusted government exam preparation platform. PSSSB, PPSC, Punjab Police, and more.",
    start_url: '/',
    id: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#2563eb',
    orientation: 'portrait',
    icons: [
      {
        src: '/logo/cracklix-icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo/cracklix-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/logo/cracklix-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['education', 'lifestyle', 'productivity']
  };
}
