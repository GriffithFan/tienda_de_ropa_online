import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KURO - Ropa Alternativa & Streetwear',
    short_name: 'KURO',
    description: 'Tienda online de ropa alternativa con estilo japonés. Remeras, hoodies, pants y accesorios con diseños únicos.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    orientation: 'portrait',
    categories: ['shopping', 'fashion', 'lifestyle'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    screenshots: [
      {
        src: '/images/screenshot-wide.png',
        sizes: '1280x720',
        type: 'image/png',
        // @ts-expect-error - form_factor is valid but not in types yet
        form_factor: 'wide',
      },
      {
        src: '/images/screenshot-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        // @ts-expect-error - form_factor is valid but not in types yet
        form_factor: 'narrow',
      },
    ],
  }
}
