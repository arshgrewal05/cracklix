
import { MetadataRoute } from 'next';

/**
 * @fileOverview Institutional PWA Manifest Configuration v12.0.
 * UPDATED: Synchronized with the latest high-fidelity "Pura Logo" (Full Branding).
 */
export default function manifest(): MetadataRoute.Manifest {
  const logoUrl = 'https://i.ibb.co/5WjGyLhn/1000110132-removebg-preview.png';

  return {
    name: 'CRACKLIX | Punjab Exam Hub',
    short_name: 'CRACKLIX',
    description: "Punjab's most trusted government exam preparation platform.",
    start_url: '/',
    id: '/',
    display: 'standalone',
    background_color: '#0B1528',
    theme_color: '#0B1528',
    orientation: 'portrait',
    icons: [
      {
        src: logoUrl,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: logoUrl,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'My Exams',
        url: '/my-exams',
        description: 'View your pinned exam hubs',
      },
      {
        name: 'Mock Tests',
        url: '/mocks',
        description: 'Browse all available practice tests',
      },
    ],
  };
}
