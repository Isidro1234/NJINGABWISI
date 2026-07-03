import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),

  // ── External packages (moved out of experimental in Next.js 15+) ──────────
  serverExternalPackages: ['firebase-admin'],

  // ── Experimental ──────────────────────────────────────────────────────────
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },

  // ── Images ────────────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:  'njinga-worker.njinga.workers.dev',
        pathname:  '/**',
      },
    ],
  },

  // ── Proxy API calls to Express backend ────────────────────────────────────
  async rewrites() {
    return [
      {
        source:      '/api/v1/:path*',
        destination: 'https://njinga-api.onrender.com/api/v1/:path*',
      },
    ]
  },

  // ── Webpack (SVGR support) ─────────────────────────────────────────────────
  webpack(config) {
    // Exclude SVGs from the default file loader
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.('.svg')
    )
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i
    }

    // Handle SVGs with SVGR
    config.module.rules.push({
      test:          /\.svg$/i,
      issuer:        fileLoaderRule?.issuer,
      resourceQuery: { not: [/url/] },
      use:           ['@svgr/webpack'],
    })

    return config
  },
}

export default withNextIntl(nextConfig)