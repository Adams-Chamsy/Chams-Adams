import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter, Italianno } from 'next/font/google';
import { cn } from '@/lib/utils';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { CustomCursor } from '@/components/layout/CustomCursor';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-cormorant',
});

const italianno = Italianno({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-italianno',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Chams Adams';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Maison de couture, kaftan subsaharien de luxe`,
    template: `%s · ${siteName}`,
  },
  description:
    'Chams Adams, maison de couture — kaftan subsaharien de luxe, héritier du grand boubou ouest-africain. Pièces sur-mesure et prêt-à-porter pour cérémonies, Tabaski, Magal et mariages.',
  applicationName: siteName,
  authors: [{ name: siteName }],
  keywords: [
    'kaftan',
    'kaftan de luxe',
    'boubou',
    'couture africaine',
    'haute couture',
    'sur-mesure',
    'Tabaski',
    'Magal',
    'cérémonie',
    'Chams Adams',
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    title: siteName,
    siteName,
    description:
      'Maison de couture — kaftan subsaharien de luxe. Pièces sur-mesure et prêt-à-porter.',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description:
      'Maison de couture — kaftan subsaharien de luxe. Pièces sur-mesure et prêt-à-porter.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={cn(inter.variable, cormorant.variable, italianno.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-noir text-ivoire/90 font-sans">
        <SmoothScroll>
          <CustomCursor />
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
