import { AnalyticsBento } from "@/components/analytics/analytics-bento";
import { AuditLogsBento } from "@/components/audit-logs-bento";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { CTA } from "@/components/cta";
import { FeatureGrid } from "@/components/feature/feature-grid";
import { HashedKeysBento } from "@/components/hashed-keys-bento";
import { Hero } from "@/components/hero/hero";
import { ImageWithBlur } from "@/components/image-with-blur";
import { IpWhitelistingBento } from "@/components/ip-whitelisting-bento";
import { LatencyBento } from "@/components/latency-bento";
import { OpenSource } from "@/components/open-source";
import { RateLimitsBento } from "@/components/rate-limits-bento";
import { Section, SectionTitle } from "@/components/section";
import {
  TopLeftShiningLight,
  TopRightShiningLight,
} from "@/components/svg/background-shiny";
import { FeatureGridChip } from "@/components/svg/feature-grid-chip";
import { OssLight } from "@/components/svg/oss-light";
import { UsageBento } from "@/components/usage-bento";
import { ChevronRight, LogIn, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import mainboard from "../images/mainboard.svg";
import {
  DesktopLogoCloud,
  MobileLogoCloud,
} from "./(components)/logo-cloud-content";
import { CodeExamples } from "./code-examples";

export const metadata = {
  title: "Vietcod - Giải pháp Cung cấp & Triển khai Server Game Trọn gói",
  description:
    "Chuyên cung cấp mã nguồn Game chất lượng cao, dịch vụ thiết lập máy chủ (Setup Server) và vận hành trọn gói. Bàn giao hệ thống hoàn chỉnh, chạy ngay trong ngày.",
  keywords: [
    "Vietcod",
    "Mua source game",
    "Setup server game",
    "Mã nguồn game mobile",
    "Thiết lập máy chủ game",
    "Dịch vụ vận hành game trọn gói",
    "Mã nguồn web game",
    "Source server game",
  ],
  openGraph: {
    title: "Vietcod - Sở hữu hệ thống Game chuyên nghiệp",
    description:
      "Cung cấp mã nguồn và dịch vụ Setup Server Game trọn gói từ A-Z. Hệ thống ổn định, bảo mật và sẵn sàng kinh doanh.",
    url: "https://vietcod.com/",
    siteName: "Vietcod Technology",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 675,
      },
    ],
    type: "website",
  },
  twitter: {
    title: "Vietcod - Chuyên gia triển khai Server Game",
    card: "summary_large_image",
    description:
      "Giải pháp mã nguồn và vận hành máy chủ game chuyên nghiệp cho nhà đầu tư.",
  },
  icons: {
    shortcut: "/vietcod.ico",
  },
};

export default async function Landing() {
  return (
    <>
      <TopRightShiningLight />
      <TopLeftShiningLight />
      <div className="relative w-full pt-6 overflow-hidden">
        <div className="container relative mx-auto">
          <Image
            src={mainboard}
            alt="Animated SVG showing computer circuits lighting up"
            className="absolute inset-x-0 flex  xl:hidden -z-10 scale-[2]"
            priority
          />
        </div>
        <div className="container relative flex flex-col mx-auto space-y-16 md:space-y-32">
          <Section>
            <Hero />
          </Section>
          <Section className="mt-16 md:mt-32">
            <DesktopLogoCloud />
            <MobileLogoCloud />
          </Section>
          <Section className="mt-16 md:mt-18">
            <CodeExamples />
          </Section>
          <Section className="mt-16 md:mt-18">
            <OpenSource />
          </Section>

          <Section className="mt-16 md:mt-20">
            <SectionTitle
              className="mt-8 md:mt-16 lg:mt-32"
              title="Mọi công cụ để bắt đầu kinh doanh Game"
              text="Từ hạ tầng máy chủ, hệ thống thanh toán tự động đến các công cụ marketing giữ chân người chơi. Vietcod cung cấp giải pháp trọn gói giúp bạn vận hành dễ dàng và hiệu quả."
              align="center"
            />
            <AnalyticsBento />
            <div className="mt-6 grid md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_2fr] gap-6 z-50">
              <LatencyBento />
              <UsageBento />
            </div>
          </Section>
          <div className="relative w-full -z-10 ">
            <OssLight className="absolute scale-[2] left-[-70px] sm:left-[70px] md:left-[150px] lg:left-[200px] xl:left-[420px] top-[-250px]" />
          </div>

          <Section className="mt-16 md:mt-32">
            <SectionTitle
              title="Bảo mật tối đa, Sẵn sàng mở rộng"
              text="Bắt đầu kinh doanh với sự an tâm tuyệt đối. Hệ thống của Vietcod tích hợp sẵn các lớp bảo mật chuyên sâu: chống DDoS, mã hóa dữ liệu giao dịch và nhật ký vận hành minh bạch, giúp bạn dễ dàng mở rộng quy mô hàng chục Server mà không gặp trở ngại."
              align="center"
            >
              <div className="flex mt-10 mb-10 space-x-6">
                <Link href="https://zalo.me/0865811722" className="group">
                  <PrimaryButton
                    shiny
                    IconLeft={ShieldCheck}
                    label="Bắt đầu ngay"
                    className="h-10"
                  />
                </Link>
                <Link href="/demo">
                  <SecondaryButton label="Xem demo" IconRight={ChevronRight} />
                </Link>
              </div>
            </SectionTitle>
            <div className="grid xl:grid-cols-[2fr_3fr] gap-6">
              <HashedKeysBento />
              <AuditLogsBento />
            </div>

            <div className="relative grid md:grid-cols-[1fr_1fr] xl:grid-cols-[3fr_2fr] gap-6 z-50">
              {/* TODO: optimize to avoid fetching svg on mobile */}
              <div
                aria-hidden
                className="hidden lg:block pointer-events-none absolute top-[calc(100%-51px)] right-[226px] lg:right-[500px] aspect-[1400/541] w-[1400px]"
              >
                <ImageWithBlur
                  src="/images/landing/leveled-up-api-auth-chip-min.svg"
                  alt="Visual decoration auth chip"
                  fill
                />
              </div>

              <IpWhitelistingBento />
              <RateLimitsBento />
            </div>
          </Section>
          <Section className="mt-16 md:mt-32">
            <div className="relative">
              <SectionTitle
                className="mt-8 md:mt-16 lg:mt-32 xl:mt-48"
                title="Nâng tầm vận hành Game"
                text="Sở hữu hệ thống với độ bảo mật tối tân, hạ tầng siêu tốc và khả năng kiểm soát tuyệt đối. Vietcod giúp bạn tối ưu hóa mọi quy trình kinh doanh và bảo vệ dữ liệu ở mức cao nhất."
              >
                <div className="flex mt-10 mb-10 space-x-6">
                  <Link href="https://zalo.me/0865811722" className="group">
                    <PrimaryButton
                      shiny
                      IconLeft={ShieldCheck}
                      label="Bắt đầu ngay"
                      className="h-10"
                    />
                  </Link>

                  <Link href="/demo">
                    <SecondaryButton
                      label="Xem bản dùng thử"
                      IconRight={ChevronRight}
                    />
                  </Link>
                </div>
              </SectionTitle>
            </div>

            <FeatureGrid className="relative z-50 mt-20" />

            <div className="relative -z-10">
              <FeatureGridChip className="absolute top-[50px] left-[400px]" />
            </div>
          </Section>
          <Section className="mt-16 md:mt-32">
            <CTA />
          </Section>
        </div>
      </div>
    </>
  );
}
