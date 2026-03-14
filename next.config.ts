import type { NextConfig } from "next";
import path from "path";
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin()
export default withNextIntl({ 
  outputFileTracingRoot: path.join(__dirname)
  ,
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  }, webpack: (config) => {
    // Find the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule:any) =>
      rule.test?.test?.('.svg')
    );

    // Exclude SVG from the existing file loader rule
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // Add a new rule for SVGR
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: fileLoaderRule?.issuer,
      resourceQuery: { not: [/url/] }, // Exclude SVGs with `?url` query
      use: ['@svgr/webpack'],
    });

    return config;
  },
  images:{
    remotePatterns:[{
      protocol:"https", hostname:"njinga-worker.njinga.workers.dev/**" , 
      pathname:"/**"}]
  },


})