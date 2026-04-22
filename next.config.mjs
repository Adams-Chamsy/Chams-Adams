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
      { protocol: 'https', hostname: 'cdn.sanity.io' },
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
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
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
