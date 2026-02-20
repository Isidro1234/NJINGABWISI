import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
  }
};

export default nextConfig;
