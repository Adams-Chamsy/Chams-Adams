import createMDX from '@next/mdx';
import { withSentryConfig } from '@sentry/nextjs';

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Active les pages MDX (le dossier `content/journal` est lu via gray-matter,
  // mais .mdx dans `app/` pourra aussi être rendu directement).
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@react-three/drei'],
    mdxRs: true,
  },

  async headers() {
    const isProd = process.env.NODE_ENV === 'production';
    // CSP — volontairement tolérante sur 'unsafe-inline' (Next hydration +
    // Tailwind/Framer styles) tant qu'on n'a pas basculé sur un système de
    // nonces via middleware. À durcir dans un chantier perf/security dédié.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://plausible.io https://challenges.cloudflare.com https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' https://fonts.gstatic.com data:",
      "connect-src 'self' https://plausible.io https://challenges.cloudflare.com https://api.stripe.com https://*.supabase.co wss://*.supabase.co",
      "frame-src 'self' https://challenges.cloudflare.com https://js.stripe.com https://hooks.stripe.com",
      "worker-src 'self' blob:",
      "media-src 'self' blob: data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      isProd ? 'upgrade-insecure-requests' : '',
    ]
      .filter(Boolean)
      .join('; ');

    const headers = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
      { key: 'Content-Security-Policy', value: csp },
    ];

    if (isProd) {
      headers.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      });
    }

    return [
      {
        source: '/:path*',
        headers,
      },
    ];
  },
};

const withSentry = (cfg) => {
  // Ne wrappe avec Sentry que si une org + project sont configurés ;
  // sinon on renvoie la config telle quelle pour éviter des warnings à chaque build.
  const hasSentryOrg = Boolean(process.env.SENTRY_ORG && process.env.SENTRY_PROJECT);
  if (!hasSentryOrg) return cfg;
  return withSentryConfig(cfg, {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: true,
    widenClientFileUpload: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  });
};

export default withSentry(withMDX(nextConfig));
