import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Header, Footer } from '@/components/layout';
import AuthProvider from '@/components/providers/AuthProvider';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'KURO - Ropa Alternativa & Japanese Streetwear',
    template: '%s | KURO',
  },
  description:
    'Tienda online de ropa alternativa con estilo japones. Remeras, hoodies, pants y accesorios con disenos unicos. Envios a todo el pais.',
  keywords: [
    'ropa alternativa',
    'streetwear japones',
    'remeras oversize',
    'hoodies',
    'ropa urbana',
    'tienda online argentina',
  ],
  authors: [{ name: 'KURO' }],
  creator: 'KURO',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://kuro.com.ar',
    siteName: 'KURO',
    title: 'KURO - Ropa Alternativa & Japanese Streetwear',
    description:
      'Tienda online de ropa alternativa con estilo japones. Remeras, hoodies, pants y accesorios con disenos unicos.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KURO - Ropa Alternativa & Japanese Streetwear',
    description:
      'Tienda online de ropa alternativa con estilo japones. Remeras, hoodies, pants y accesorios con disenos unicos.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
