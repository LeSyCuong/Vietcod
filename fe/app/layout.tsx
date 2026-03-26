import { Footer } from "@/components/footer/footer";
import { Navigation } from "@/components/navbar/navigation";
import { env } from "@/lib/env";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

import { ConsentManagerProvider } from "@c15t/nextjs";
import { ConsentBanner } from "./consent-banner";
import { Tracking } from "./tracking";

const parsedEnv = env();

export const metadata: Metadata = {
  metadataBase: new URL(
    parsedEnv.NEXT_PUBLIC_BASE_URL || "https://vietcod.com",
  ),
  title: {
    default: "Vietcod - Giải pháp Cung cấp & Triển khai Server Game Trọn gói",
    template: "%s | Vietcod",
  },
  description:
    "Chuyên cung cấp mã nguồn Game chất lượng cao và dịch vụ thiết lập máy chủ chuyên nghiệp. Chúng tôi vận hành hệ thống toàn diện để bạn tập trung kinh doanh.",
  openGraph: {
    title: "Vietcod - Sở hữu hệ thống Game chuyên nghiệp",
    description:
      "Giải pháp mã nguồn và vận hành máy chủ game trọn gói từ A-Z. Hệ thống ổn định, bảo mật và sẵn sàng kinh doanh ngay.",
    url: parsedEnv.NEXT_PUBLIC_BASE_URL,
    siteName: "Vietcod Technology",
    images: [
      {
        url: `/og.png`,
        width: 1200,
        height: 675,
        alt: "Vietcod - Game Infrastructure Platform",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    title: "Vietcod - Chuyên gia triển khai Server Game",
    card: "summary_large_image",
    description:
      "Cung cấp mã nguồn và dịch vụ vận hành máy chủ game chuyên nghiệp.",
    images: [`${parsedEnv.NEXT_PUBLIC_BASE_URL}/og.png`],
  },
  icons: {
    shortcut: "/vietcod.png",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "Vietcod",
    "mua source game",
    "setup server game",
    "mã nguồn game",
    "triển khai máy chủ game",
    "vận hành game trọn gói",
  ],
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`[color-scheme:dark] scroll-smooth ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen overflow-x-hidden antialiased bg-black text-pretty">
        <ConsentManagerProvider
          options={{
            ...(parsedEnv.NEXT_PUBLIC_C15T_MODE
              ? { mode: "c15t", backendURL: "/api/c15t" }
              : { mode: "offline" }),
            react: {
              colorScheme: "dark",
            },
          }}
        >
          <ConsentBanner />

          <div className="relative overflow-x-clip">
            <Navigation />
            {children}
            <Tracking />
            {process.env.NODE_ENV !== "production" ? (
              <div className="fixed bottom-0 right-0 flex items-center justify-center w-6 h-6 p-3 m-8 font-mono text-xs text-black bg-white rounded-lg pointer-events-none ">
                <div className="block sm:hidden md:hidden lg:hidden xl:hidden 2xl:hidden">
                  al
                </div>
                <div className="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">
                  sm
                </div>
                <div className="hidden sm:hidden md:block lg:hidden xl:hidden 2xl:hidden">
                  md
                </div>
                <div className="hidden sm:hidden md:hidden lg:block xl:hidden 2xl:hidden">
                  lg
                </div>
                <div className="hidden sm:hidden md:hidden lg:hidden xl:block 2xl:hidden">
                  xl
                </div>
                <div className="hidden sm:hidden md:hidden lg:hidden xl:hidden 2xl:block">
                  2xl
                </div>
              </div>
            ) : null}
          </div>
          <Footer />
        </ConsentManagerProvider>
      </body>
    </html>
  );
}
