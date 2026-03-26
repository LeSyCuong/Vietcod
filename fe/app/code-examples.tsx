"use client";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import { SectionTitle } from "@/components/section";
import type { LangIconProps } from "@/components/svg/lang-icons";
import {
  CurlIcon,
  GoIcon,
  PythonIcon,
  TSIcon,
} from "@/components/svg/lang-icons";
import { CodeEditor } from "@/components/ui/code-editor";
import { CopyCodeSnippetButton } from "@/components/ui/copy-code-button";
import { MeteorLines } from "@/components/ui/meteorLines";
import { cn } from "@/lib/utils";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { PrismTheme } from "prism-react-renderer";
import React, { useEffect } from "react";
import { useState } from "react";
const Tabs = TabsPrimitive.Root;

const editorTheme = {
  plain: {
    color: "#F8F8F2",
    backgroundColor: "#282A36",
  },
  styles: [
    {
      types: ["keyword"],
      style: {
        color: "#9D72FF",
      },
    },
    {
      types: ["function"],
      style: {
        color: "#FB3186",
      },
    },
    {
      types: ["string"],
      style: {
        color: "#3CEEAE",
      },
    },
    {
      types: ["string-property"],
      style: {
        color: "#9D72FF",
      },
    },
    {
      types: ["number"],
      style: {
        color: "#FB3186",
      },
    },
    {
      types: ["comment"],
      style: {
        color: "#4D4D4D",
      },
    },
  ],
} satisfies PrismTheme;

const TypescriptCodeBlock = `{
  "dich_vu": "Auto Recharge System",
  "phuong_thuc": ["Momo", "ZaloPay", "VietQR", "TheCao"],
  "cau_hinh_ty_le": {
    "chuyen_khoan": 1.0,  // 10,000đ = 10,000 xu
    "the_cao": 0.85,      // Chiết khấu nhà mạng
    "khuyen_mai_nap_dau": "200%"
  },
  "security": "SSL/TLS 1.3 & Webhook Verification",
  "callback": "https://api.vietcod.com/v1/payment/callback",
  "trang_thai": "Realtime Processing"
}`;

const nextJsCodeBlock = `{
  "event": "Tích Nạp Theo Mốc",
  "thoi_gian": "Tuần đầu khai mở S1",
  "cac_moc_uu_dai": {
    "moc_100k": { "qua": ["Vàng x1tr", "Đá Cường Hóa x10", "VIP 1"] },
    "moc_500k": { "qua": ["Thần Khí S", "Lệnh Bài Exp x50", "Danh Hiệu Đặc Biệt"] },
    "moc_2tr": { "qua": ["Thú Cưỡi Truyền Thuyết", "Bộ Trang Bị Bậc 7", "VIP 5"] },
    "moc_5tr": { "qua": ["Cánh Thiên Thần", "Rương Tùy Chọn Thần Tướng"] }
  },
  "tra_thuong": "Tuần hoàn tự động qua Mail-Box"
}`;

const nuxtCodeBlock = `{
  "system": "Vòng Quay May Mắn (Lucky Wheel)",
  "ty_le_vat_pham": [
    { "bac_S": "0.5%", "item": "Mảnh Thần Binh" },
    { "bac_A": "5.0%", "item": "Đá Tăng Bậc" },
    { "bac_B": "20.0%", "item": "Vàng Khóa" },
    { "bac_C": "74.5%", "item": "Thuốc Thể Lực" }
  ],
  "co_che_bao_hiem": "Chạm mốc 100 lượt chắc chắn nhận bậc S",
  "chi_phi": "50 xu/lượt",
  "reset_mien_phi": "00:00 mỗi ngày"
}`;

const adminDashboard = `{
  "portal": "Vietcod Admin Control Panel",
  "analytics": {
    "doanh_thu": "Realtime Chart (Hourly/Daily)",
    "ccu": "Current Concurrent Users",
    "arpu": "Average Revenue Per User"
  },
  "management_tools": {
    "player_editor": "Buff vật phẩm, khóa/mở tài khóa, reset pass",
    "server_control": ["Bảo trì", "Gộp Server", "Mở Server mới"],
    "event_manager": "Bật/Tắt sự kiện In-game trực tiếp"
  },
  "logs": "Trace lịch sử nạp và giao dịch vật phẩm 24/7"
}`;

const pythonVerifyKeyBlock = `{
  "loai_code": "Giftcode Tân Thủ / Event",
  "prefix": "VIETCOD_S1_",
  "cau_hinh": {
    "so_luong": 1000,
    "gioi_han_nhap": "1 mã / 1 tài khoản",
    "phan_thuong": ["Exp x2", "Vàng x500k", "Quà Random"],
    "expired": "2026-12-31"
  }
}`;

const honoCodeBlock = `{
  "leaderboard": "Bảng Xếp Hạng Toàn Server",
  "danh_muc": ["Lực Chiến", "Cấp Độ", "Tích Nạp", "Đấu Trường"],
  "phan_thuong_top_1": {
    "vinh_danh": "Tượng Vàng trang chủ & Thông báo toàn Server",
    "vat_pham": ["Vũ Khí Tuyệt Thế", "Aura Hào Quang", "Cánh Bậc 10"],
    "quyen_loi": "Kích hoạt kênh Chat đặc biệt"
  },
  "thoi_gian_ket_toan": "23:59 Chủ Nhật hàng tuần"
}`;

const serverSecurity = `{
  "infrastructure": "High-Performance Game Server",
  "protection": {
    "anti_ddos": "Lớp 7 (Application Layer) Chuyên Sâu",
    "firewall": "IP Whitelisting & Rate Limiting",
    "database": "Mã hóa AES-256 & Backup tự động mỗi 3h"
  },
  "alert_system": "Telegram Bot thông báo trạng thái Server Realtime",
  "uptime_commit": "99.9%"
}`;

const goCreateKeyCodeBlock = `{
  "server_spec": "Dedicated Server Game Optimization",
  "cpu": "Dual Intel Xeon Platinum 8280 (56 Cores, 112 Threads)",
  "ram": "256GB ECC DDR4 2933MHz",
  "ssd": "2TB NVMe Samsung Enterprise (RAID 1)",
  "network": "1Gbps Unmetered Bandwidth",
  "datacenter": "Tier 3 Standard (Viettel/FPT)"
}`;

type Framework = {
  name: string;
  Icon: React.FC<LangIconProps>;
  codeBlock: string;
  editorLanguage: string;
};

const languagesList = {
  "Kinh doanh": [
    {
      name: "Auto Banking",
      Icon: TSIcon,
      codeBlock: TypescriptCodeBlock,
      editorLanguage: "json",
    },
    {
      name: "Tích nạp",
      Icon: TSIcon,
      codeBlock: nextJsCodeBlock,
      editorLanguage: "json",
    },
    {
      name: "Vòng quay",
      codeBlock: nuxtCodeBlock,
      Icon: TSIcon,
      editorLanguage: "json",
    },
    {
      name: "Bảng xếp hạng",
      Icon: TSIcon,
      codeBlock: honoCodeBlock,
      editorLanguage: "json",
    },
  ],
  "Quản trị": [
    {
      name: "Dashboard",
      Icon: PythonIcon,
      codeBlock: adminDashboard,
      editorLanguage: "json",
    },
    {
      name: "Giftcode",
      Icon: PythonIcon,
      codeBlock: pythonVerifyKeyBlock,
      editorLanguage: "json",
    },
  ],
  "Hạ tầng": [
    {
      name: "Bảo mật",
      Icon: GoIcon,
      codeBlock: serverSecurity,
      editorLanguage: "json",
    },
    {
      name: "Cấu hình Server",
      Icon: GoIcon,
      codeBlock: goCreateKeyCodeBlock,
      editorLanguage: "json",
    },
  ],
} as const satisfies {
  [key: string]: Framework[];
};

type Language = "Kinh doanh" | "Quản trị" | "Hạ tầng";

type LanguagesList = {
  name: Language;
  Icon: React.FC<LangIconProps>;
};

const languages = [
  { name: "Kinh doanh", Icon: TSIcon },
  { name: "Quản trị", Icon: PythonIcon },
  { name: "Hạ tầng", Icon: GoIcon },
] as LanguagesList[];

// TODO extract this automatically from our languages array
type FrameworkName = (typeof languagesList)[Language][number]["name"];

interface Props {
  className?: string;
}

const LanguageTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, value, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    value={value}
    className={cn(
      "inline-flex items-center gap-1 justify-center whitespace-nowrap rounded-t-lg px-3  py-1.5 text-sm transition-all hover:text-white/80 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-t from-black to-black data-[state=active]:from-white/10 border border-b-0 text-white/30 data-[state=active]:text-white border-[#454545] font-light",
      className,
    )}
    {...props}
  />
));

LanguageTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const CodeExamples: React.FC<Props> = ({ className }) => {
  const [language, setLanguage] = useState<Language>("Kinh doanh");
  const [framework, setFramework] = useState<FrameworkName>("Auto Banking");
  const [languageHover, setLanguageHover] = useState("Kinh doanh");
  function getLanguage({
    language,
    framework,
  }: {
    language: Language;
    framework: FrameworkName;
  }) {
    const frameworks = languagesList[language];
    const currentFramework = frameworks.find((f) => f.name === framework);
    return currentFramework?.editorLanguage || "tsx";
  }

  useEffect(() => {
    setFramework(languagesList[language].at(0)!.name);
  }, [language]);

  function getCodeBlock({
    language,
    framework,
  }: {
    language: Language;
    framework: FrameworkName;
  }) {
    const frameworks = languagesList[language];
    const currentFramework = frameworks.find((f) => f.name === framework);
    return currentFramework?.codeBlock || "";
  }

  return (
    <section className={className}>
      <SectionTitle
        title="Quản trị tối ưu, Kinh doanh hiệu quả"
        text="Hệ thống Vietcod được module hóa hoàn toàn, giúp bạn làm chủ mọi tính năng từ Webshop, Thanh toán đến bảo mật Server mà không cần chạm vào code. Đơn giản, mạnh mẽ và chuyên nghiệp."
        align="center"
        className="relative"
      >
        <div className="absolute bottom-32 left-[-50px]">
          <MeteorLines className="ml-2 fade-in-0" delay={3} number={1} />
          <MeteorLines className="ml-10 fade-in-40" delay={0} number={1} />
          <MeteorLines className="ml-16 fade-in-100" delay={5} number={1} />
        </div>
        <div className="absolute bottom-32 right-[200px]">
          <MeteorLines className="ml-2 fade-in-0" delay={4} number={1} />
          <MeteorLines className="ml-10 fade-in-40" delay={0} number={1} />
          <MeteorLines className="ml-16 fade-in-100" delay={2} number={1} />
        </div>
        <div className="mt-10">
          <div className="flex gap-6 pb-14">
            <Link key="get-started" href="https://zalo.me/0865811722">
              <PrimaryButton
                shiny
                label="Tư vấn vận hành"
                IconRight={ChevronRight}
              />
            </Link>
            <Link key="docs" href="/demo-website">
              <SecondaryButton label="Demo website" IconRight={ChevronRight} />
            </Link>
          </div>
        </div>
      </SectionTitle>
      <div className="relative w-full rounded-4xl border-[.75px] border-white/10 bg-gradient-to-b from-[#111111] to-black border-t-[.75px] border-t-white/20">
        <div
          aria-hidden
          className="absolute pointer-events-none inset-x-16 h-[432px] bottom-[calc(100%-2rem)] bg-[radial-gradient(94.69%_94.69%_at_50%_100%,rgba(255,255,255,0.20)_0%,rgba(255,255,255,0)_55.45%)]"
        />
        <Tabs
          defaultValue={language}
          onValueChange={(l) => setLanguage(l as Language)}
          className="relative flex items-end h-16 px-4 border rounded-tr-3xl rounded-tl-3xl border-white/10 editor-top-gradient"
        >
          <TabsPrimitive.List className="flex items-end gap-4 overflow-x-auto scrollbar-hidden">
            {languages.map(({ name, Icon }) => (
              <LanguageTrigger
                key={name}
                onMouseEnter={() => setLanguageHover(name)}
                onMouseLeave={() => setLanguageHover(language)}
                value={name}
              >
                <Icon active={languageHover === name || language === name} />
                {name}
              </LanguageTrigger>
            ))}
          </TabsPrimitive.List>
        </Tabs>
        <div className="flex flex-col sm:flex-row overflow-x-auto scrollbar-hidden sm:h-[520px]">
          <FrameworkSwitcher
            frameworks={languagesList[language]}
            currentFramework={framework}
            setFramework={setFramework}
          />
          <div className="relative flex w-full pt-4 pb-8 pl-8 font-mono text-xs text-white sm:text-sm">
            <CodeEditor
              language={getLanguage({ language, framework })}
              theme={editorTheme}
              codeBlock={getCodeBlock({ language, framework })}
            />
            <CopyCodeSnippetButton
              textToCopy={getCodeBlock({ language, framework })}
              className="absolute hidden cursor-pointer top-5 right-5 lg:flex"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

function FrameworkSwitcher({
  frameworks,
  currentFramework,
  setFramework,
}: {
  frameworks: Framework[];
  currentFramework: FrameworkName;
  setFramework: React.Dispatch<React.SetStateAction<FrameworkName>>;
}) {
  return (
    <div className="flex flex-col justify-between sm:w-[216px] text-white text-sm pt-6 px-4 font-mono md:border-r md:border-white/10">
      <div className="flex items-center space-x-2 sm:flex-col sm:space-x-0 sm:space-y-2">
        {frameworks.map((framework) => (
          <button
            key={framework.name}
            type="button"
            onClick={() => {
              setFramework(framework.name as FrameworkName);
            }}
            className={cn(
              "flex items-center cursor-pointer hover:bg-white/10 py-1 px-2 rounded-lg w-[184px] ",
              {
                "bg-white/10 text-white": currentFramework === framework.name,
                "text-white/40": currentFramework !== framework.name,
              },
            )}
          >
            <div>{framework.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
