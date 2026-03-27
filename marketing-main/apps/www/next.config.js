const { withContentCollections } = require("@content-collections/next");

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
];
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // TẮT tính năng này để tương thích với force-dynamic
    cacheComponents: false, 
  },
  typescript: {
    // Bỏ qua lỗi TypeScript khi build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Bỏ qua lỗi ESLint khi build (nếu cần)
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  pageExtensions: ["tsx", "mdx", "ts", "js"],
  reactStrictMode: true,
  cacheComponents: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/changelog/:slug",
        destination: "/changelog#:slug", // Matched parameters can be used in the destination
      },
      {
        source: "/docs",
        destination: "https://unkey.mintlify.dev/docs",
      },
      {
        source: "/docs/:match*",
        destination: "https://unkey.mintlify.dev/docs/:match*",
      },
      {
        source: "/terms",
        destination: "/policies/terms",
      },
      {
        source: "/api/c15t/:path*",
        destination: `${process.env?.NEXT_PUBLIC_C15T_URL ?? ""}/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/fDbezjbJbD",
        permanent: false,
      },
      {
        source: "/github",
        destination: "https://github.com/unkeyed/unkey",
        permanent: false,
      },
      {
        source: "/meet",
        destination: "https://cal.com/team/unkey",
        permanent: false,
      },
    ];
  },
};

module.exports = withContentCollections(withBundleAnalyzer(nextConfig));
