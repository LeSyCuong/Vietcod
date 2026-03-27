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
  typescript: {
    ignoreBuildErrors: true,
  },
  // Đã xóa block eslint cũ ở đây để tránh lỗi Invalid Key
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
  // Bật tính năng cache mới của Next.js 16
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
        destination: "/changelog#:slug",
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
