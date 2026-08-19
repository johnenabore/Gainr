import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Gainr – AI Strength Coach',
    short_name: 'Gainr',
    description: 'AI-powered gym tracker that coaches your progressive overload, detects plateaus, and explains your progress in plain language.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#09090b',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}