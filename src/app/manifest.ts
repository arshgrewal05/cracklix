
import { MetadataRoute } from 'next';

/**
 * @fileOverview Optimized Institutional PWA Manifest v17.0.
 * Optimized for Google Play Store (TWA) with maskable icons and high-fidelity branding.
 */
export default function manifest(): MetadataRoute.Manifest {
  const squareIcon = 'https://i.ibb.co/VW2MK9ww/file-00000000deec7206abdeca16860cdec1.png';

  return {
    name: 'CRACKLIX | Punjab Exam Hub',
    short_name: 'CRACKLIX',
    description: "Punjab's most trusted government exam preparation platform.",
    start_url: '/',
    id: 'cracklix-hub',
    display: 'standalone',
    background_color: '#0B1528',
    theme_color: '#0B1528',
    orientation: 'portrait',
    icons: [
      {
        src: squareIcon,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: squareIcon,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Practice Tests',
        url: '/mocks',
        description: 'Browse all available practice tests',
      },
      {
        name: 'Current Affairs',
        url: '/current-affairs',
        description: 'Daily exam relevant updates',
      },
    ],
    related_applications: [],
    prefer_related_applications: false
  };
}
