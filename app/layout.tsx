import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter, Italianno } from 'next/font/google';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WishlistDrawer } from '@/components/wishlist/WishlistDrawer';
import { WishlistSync } from '@/components/wishlist/WishlistSync';
import { LocaleProvider } from '@/lib/i18n/client';
import { getLocale, getT } from '@/lib/i18n/server';
import { JsonLd } from '@/components/seo/JsonLd';
import { organizationSchema, websiteSchema } from '@/lib/seo/json-ld';
import './globals.css';

// Ces deux composants n'impactent pas le rendu initial (effets post-hydration).
// On les charge en dynamic sans SSR pour alléger le bundle du premier paint.
const SmoothScroll = dynamic(
  () => import('@/components/layout/SmoothScroll').then((m) => m.SmoothScroll),
  { ssr: false, loading: () => null }
);
const CustomCursor = dynamic(
  () => import('@/components/layout/CustomCursor').then((m) => m.CustomCursor),
  { ssr: false, loading: () => null }
);
const Toaster = dynamic(
  () => import('@/components/ui/Toaster').then((m) => m.Toaster),
  { ssr: false, loading: () => null }
);
const CookieBanner = dynamic(
  () => import('@/components/layout/CookieBanner').then((m) => m.CookieBanner),
  { ssr: false, loading: () => null }
);
const ScrollToTop = dynamic(
  () => import('@/components/layout/ScrollToTop').then((m) => m.ScrollToTop),
  { ssr: false, loading: () => null }
);
const WhatsAppButton = dynamic(
  () => import('@/components/layout/WhatsAppButton').then((m) => m.WhatsAppButton),
  { ssr: false, loading: () => null }
);
const PlausibleAnalytics = dynamic(
  () => import('@/components/analytics/Plausible').then((m) => m.PlausibleAnalytics),
  { ssr: false, loading: () => null }
);

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
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  const t = getT(locale);
  return (
    <html
      lang={locale}
      className={cn(inter.variable, cormorant.variable, italianno.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-noir text-ivoire/90 font-sans">
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <LocaleProvider locale={locale}>
          <SmoothScroll>
            <>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:border focus:border-or focus:bg-noir focus:px-4 focus:py-2 focus:font-sans focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:text-or"
              >
                {t('common.skipToContent')}
              </a>
              <CustomCursor />
              <Header />
              <main id="main-content">{children}</main>
              <Footer />
              <CartDrawer />
              <WishlistDrawer />
              <WishlistSync />
              <Toaster />
              <CookieBanner />
              <ScrollToTop />
              <WhatsAppButton />
              <PlausibleAnalytics />
            </>
          </SmoothScroll>
        </LocaleProvider>
      </body>
    </html>
  );
}
