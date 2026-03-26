/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin({
  defaultLocale: "en",
  locales: ["vi", "en", "ja", "ko", "zh"],
});

const nextConfig = withNextIntl({
  productionBrowserSourceMaps: true,
  async rewrites() {
    return [
      {
        source: "/server/:path*",
        destination: "http://localhost:8080/server/:path*",
      },
    ];
  },
  compiler: {
    styledComponents: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    "next-intl",
    "i18next",
    "@tiptap/extension-color",
    "@tiptap/extension-history",
    "@tiptap/extension-image",
    "@tiptap/extension-link",
    "@tiptap/extension-text-align",
    "@tiptap/extension-text-style",
    "@tiptap/extension-underline",
    "@tiptap/react",
    "@tiptap/starter-kit",
    "lucide",
    "lucide-react",
  ],
  webpack(config: any) {
    config.module.rules.push({
      test: /\.(js|mjs)$/,
      include: [
        /node_modules\/next-intl/,
        /node_modules\/i18next/,
        /node_modules\/html-react-parser/,
        /node_modules\/lucide/,
        /node_modules\/lucide-react/,
        /node_modules\/@tiptap/,
      ],
      use: {
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: { ios: "12" },
                bugfixes: true,
                modules: false,
                useBuiltIns: false,
              },
            ],
            "next/babel",
          ],
          plugins: [
            "@babel/plugin-transform-named-capturing-groups-regex",
            "@babel/plugin-transform-unicode-regex",
          ],
          cacheDirectory: true,
        },
      },
    });

    config.module.rules.push({
      test: /\.(js|mjs)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: { ios: "12" },
                bugfixes: true,
                modules: false,
                useBuiltIns: false,
              },
            ],
            "next/babel",
          ],
          plugins: [
            "@babel/plugin-transform-named-capturing-groups-regex",
            "@babel/plugin-transform-unicode-regex",
          ],
          cacheDirectory: true,
        },
      },
    });
    return config;
  },
});

module.exports = nextConfig;
