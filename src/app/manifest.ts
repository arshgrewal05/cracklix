import { MetadataRoute } from 'next';

/**
 * @fileOverview Production-Grade PWA Manifest v4.0.
 * UPDATED: Pointed to professional icon and maskable icon nodes.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cracklix',
    short_name: 'Cracklix',
    description: "Punjab's most trusted government exam preparation platform.",
    start_url: '/',
    id: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#020617',
    theme_color: '#2563eb',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/cracklix-icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/cracklix-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/maskable-icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['education', 'lifestyle']
  };
}
