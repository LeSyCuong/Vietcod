import Link from "next/link";

import { PrimaryButton, SecondaryButton } from "@/components/button";
import { BookOpen, ChevronRight, PhoneCall } from "lucide-react";

export function HeroMainSection() {
  return (
    <div className="relative flex flex-col items-center text-center ">
      <h1 className="bg-gradient-to-br text-balance text-transparent bg-gradient-stop bg-clip-text from-white via-white via-30% to-white/30  font-medium text-6xl leading-none xl:text-[82px] tracking-tighter">
        Giải pháp vận hành và phát triển Game online
      </h1>

      <p className="mt-6 sm:mt-8 bg-gradient-to-br text-transparent text-balance bg-gradient-stop bg-clip-text max-w-sm sm:max-w-lg xl:max-w-4xl from-white/70 via-white/70 via-40% to-white/30 text-base md:text-lg">
        Triển khai hạ tầng Web & Mobile Game, thay bạn xử lý mọi vấn đề kỹ thuật
        phức tạp nhất. Chúng tôi thiết lập, vận hành và bảo mật toàn bộ hệ thống
        — Bạn chỉ cần tập trung vào kinh doanh và tối ưu lợi nhuận.
      </p>

      <div className="flex items-center gap-6 mt-16">
        <Link href="/templates" className="group">
          <PrimaryButton
            shiny
            IconRight={ChevronRight}
            label="Server Game"
            className="h-10"
          />
        </Link>

        <Link
          target="_blank"
          href="https://zalo.me/0865811722"
          className="hidden sm:flex"
        >
          <SecondaryButton IconLeft={PhoneCall} label="Liên hệ tư vấn" />
        </Link>
      </div>
    </div>
  );
}
