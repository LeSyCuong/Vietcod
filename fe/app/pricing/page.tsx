import { CTA } from "@/components/cta";
import { Particles } from "@/components/particles";
import { ShinyCardGroup } from "@/components/shiny-card";
import {
  TopLeftShiningLight,
  TopRightShiningLight,
} from "@/components/svg/background-shiny";
import { Check, Stars, Zap, Sparkles, ShieldAlert } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  BelowEnterpriseSvg,
  Bullet,
  Bullets,
  Button,
  Color,
  Cost,
  EnterpriseCardHighlight,
  FreeCardHighlight,
  PricingCard,
  PricingCardContent,
  PricingCardFooter,
  PricingCardHeader,
  ProCardHighlight,
  Separator,
} from "./components";

export default function PricingPage() {
  return (
    <div className="px-4 mx-auto lg:px-0 pt-[64px]">
      <TopRightShiningLight />
      <TopLeftShiningLight />
      <div
        aria-hidden
        className="absolute -top-[4.5rem] left-1/2 -translate-x-1/2 w-[2679px] h-[540px] -scale-x-100"
      >
        <div className="absolute -left-[100px] w-[1400px] aspect-[1400/541] [mask-image:radial-gradient(50%_76%_at_92%_28%,_#FFF_0%,_#FFF_30.03%,_rgba(255,_255,_255,_0.00)_100%)]">
          <Image
            alt="Visual decoration auth chip"
            src="/images/landing/leveled-up-api-auth-chip-min.svg"
            fill
          />
        </div>
        <div className="absolute right-0 w-[1400px] aspect-[1400/541] [mask-image:radial-gradient(26%_76%_at_30%_6%,_#FFF_0%,_#FFF_30.03%,_rgba(255,_255,_255,_0.00)_100%)]">
          <Image
            alt="Visual decoration auth chip"
            src="/images/landing/leveled-up-api-auth-chip-min.svg"
            fill
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center my-16 xl:my-24">
        <h1 className="section-title-heading-gradient max-sm:mx-6 max-sm:text-4xl font-medium text-[4rem] leading-[4rem] max-w-3xl text-center ">
          Giải pháp Web Game toàn diện
        </h1>

        <p className="mt-8 bg-gradient-to-br text-transparent bg-gradient-stop bg-clip-text from-white via-white via-40% to-white/40 max-w-2xl text-center text-lg">
          Từ những trang chủ giới thiệu sắc nét đến hệ thống Auto Banking tự
          động hóa hoàn toàn. Vietcod mang đến các gói thiết kế tối ưu nhất cho
          sự phát triển Server Game của bạn.
        </p>
      </div>

      <ShinyCardGroup className="grid h-full max-w-4xl grid-cols-2 gap-6 mx-auto group">
        <PricingCard className="col-span-2 md:col-span-1">
          <FreeCardHighlight className="absolute top-0 right-0 pointer-events-none" />

          <PricingCardHeader
            title="Free Tier"
            description="Everything you need to start!"
            className="bg-gradient-to-tr from-transparent to-[#ffffff]/10 "
            color={Color.White}
          />
          <Separator />

          <PricingCardContent>
            <Cost dollar="0đ" />
            <div className="text-center text-xs font-semibold text-white/50 mb-4 uppercase tracking-wider">
              (Miễn phí đi kèm Server)
            </div>
            <Link href="https://zalo.me/0865811722" target="_blank">
              <Button label="Nhận Web Miễn Phí" />
            </Link>
            <Bullets>
              <li>
                <Bullet
                  Icon={Check}
                  label="Thiết kế Landing Page chuẩn Game"
                  color={Color.White}
                />
              </li>
              <li>
                <Bullet
                  Icon={Check}
                  label="Trang thông tin, Tin tức & Sự kiện"
                  color={Color.White}
                />
              </li>
              <li>
                <Bullet
                  Icon={Check}
                  label="Hiển thị thông tin Bank/Momo"
                  color={Color.White}
                />
              </li>
              <li>
                <Bullet
                  Icon={Check}
                  label="Tích hợp tải Game (PC/Mobile)"
                  color={Color.White}
                />
              </li>
              <li>
                <Bullet
                  Icon={Check}
                  label="Tối ưu hóa UI/UX & Tốc độ tải trang"
                  color={Color.White}
                />
              </li>
              <li>
                <div className="h-6" />
              </li>
            </Bullets>
          </PricingCardContent>
          <PricingCardFooter>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold text-white">
                Điều kiện áp dụng gói Cơ Bản:
              </p>
              <p className="text-xs text-white/60">
                Gói web tĩnh (Static Website) này được tặng kèm MIỄN PHÍ 100%
                khi quý khách mua bất kỳ mã nguồn Server Game tại Vietcod. Giao
                diện đẹp mắt giúp thu hút người chơi ngay từ cái nhìn đầu tiên.
              </p>
            </div>
          </PricingCardFooter>
        </PricingCard>
        <PricingCard className="col-span-2 md:col-span-1">
          <ProCardHighlight className="absolute top-0 right-0 pointer-events-none" />

          <PricingCardHeader
            title="Gói Vận Hành (Pro)"
            description="Tự động hóa doanh thu và giữ chân người chơi."
            className="bg-gradient-to-tr from-black/50 to-[#FFD600]/10 "
            color={Color.Yellow}
          />
          <Separator />

          <PricingCardContent>
            <div className="flex items-center justify-between">
              <Cost dollar="2.000.000đ" className="w-full text-center" />
            </div>
            <Link href="https://zalo.me/0865811722" target="_blank">
              <Button label="Triển khai Hệ Thống Pro" />
            </Link>
            <Bullets>
              <li>
                <Bullet
                  Icon={Sparkles}
                  label="Bao gồm mọi tính năng của gói Cơ Bản"
                  color={Color.Yellow}
                />
              </li>
              <li>
                <Bullet
                  Icon={Check}
                  label="Hệ thống User Profile & Đăng nhập"
                  color={Color.Yellow}
                />
              </li>
              <li>
                <Bullet
                  Icon={Zap}
                  label="Auto Banking (Duyệt nạp tự động 24/7)"
                  color={Color.Yellow}
                  textColor="text-white font-semibold"
                />
              </li>
              <li>
                <Bullet
                  Icon={Check}
                  label="Tính năng Mốc nạp & Tích nạp nhận quà"
                  color={Color.Yellow}
                />
              </li>
              <li>
                <Bullet
                  Icon={Check}
                  label="Hệ thống Vòng quay may mắn & Minigame"
                  color={Color.Yellow}
                />
              </li>
              <li>
                <Bullet
                  Icon={Check}
                  label="Phát phát Giftcode tự động"
                  color={Color.Yellow}
                />
              </li>
              <li>
                <Bullet
                  Icon={Check}
                  label="Trang Admin Dashboard quản trị toàn diện"
                  color={Color.Yellow}
                />
              </li>
            </Bullets>
          </PricingCardContent>
          <PricingCardFooter>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold text-white">
                Đầu tư một lần, sinh lời dài hạn.
              </p>
              <p className="text-xs text-white/60">
                Trọn gói 1 lần, không thu phí duy trì hàng tháng. Biến Website
                thành cỗ máy kiếm tiền tự động. Yêu cầu mua kèm Server Game tại
                Vietcod để đảm bảo API đồng bộ vào Database game một cách tối ưu
                nhất.
              </p>
            </div>
          </PricingCardFooter>
        </PricingCard>

        <PricingCard className="col-span-2">
          <EnterpriseCardHighlight className="absolute top-0 right-0 pointer-events-none" />

          <div className="flex flex-col h-full md:flex-row">
            <div className="flex flex-col w-full gap-8">
              <PricingCardHeader
                title="Gói Đặc Quyền (Enterprise)"
                description="Hệ sinh thái tính năng thiết kế độc bản cho Server lớn."
                color={Color.Purple}
                className="bg-gradient-to-tr from-transparent to-[#9D72FF]/10 "
              />
              <PricingCardContent>
                <div className="flex flex-col h-full justify-between gap-6">
                  <div>
                    <Cost dollar="Tùy chỉnh" />
                    <div className="text-left text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">
                      (Theo yêu cầu tính năng)
                    </div>
                  </div>
                  <Link href="https://zalo.me/0865811722?text=Tôi muốn nhận tư vấn gói Web Enterprise">
                    <div className="w-full p-px rounded-lg h-10 bg-gradient-to-r from-[#02DEFC] via-[#0239FC] to-[#7002FC] overflow-hidden group/btn">
                      <div className="bg-black rounded-[7px] h-full bg-opacity-95 group-hover/btn:bg-opacity-25 duration-1000">
                        <div className="flex items-center justify-center w-full h-full bg-gradient-to-tr from-[#02DEFC]/20 via-[#0239FC]/20 to-[#7002FC]/20  rounded-[7px]">
                          <span className="text-sm font-semibold text-white">
                            Liên hệ nhận báo giá
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </PricingCardContent>
            </div>
            <Separator orientation="vertical" className="hidden md:flex" />
            <Separator orientation="horizontal" className="md:hidden" />
            <div className="relative w-full p-8">
              <Particles
                className="absolute inset-0 duration-500 opacity-50 -z-10 group-hover:opacity-100"
                quantity={10}
                color={Color.Purple}
                vx={0.1}
                vy={-0.1}
              />
              <Bullets>
                <li>
                  <Bullet
                    Icon={Sparkles}
                    label="Bao gồm toàn bộ tính năng gói Pro"
                    color={Color.Purple}
                  />
                </li>
                <li>
                  <Bullet
                    Icon={Check}
                    label="Lập trình tính năng Custom theo yêu cầu riêng"
                    color={Color.Purple}
                  />
                </li>
                <li>
                  <Bullet
                    Icon={Check}
                    label="Thiết kế giao diện UI/UX Độc quyền 100%"
                    color={Color.Purple}
                  />
                </li>
                <li>
                  <Bullet
                    Icon={Check}
                    label="Tích hợp sâu API In-game (Web-to-Game sync)"
                    color={Color.Purple}
                  />
                </li>
                <li>
                  <Bullet
                    Icon={ShieldAlert}
                    label="Tích hợp Anti-DDoS & Firewall Layer 7 cao cấp"
                    color={Color.Purple}
                    textColor="text-white font-semibold"
                  />
                </li>
                <li>
                  <Bullet
                    Icon={Stars}
                    label="Kỹ sư hỗ trợ kỹ thuật ưu tiên 24/7"
                    color={Color.Purple}
                  />
                </li>
              </Bullets>
            </div>
          </div>
        </PricingCard>
      </ShinyCardGroup>
      <BelowEnterpriseSvg className="container inset-x-0 top-0 mx-auto -mt-64 -mb-32" />

      <div className="-mx-4 lg:mx-0">
        <CTA />
      </div>
    </div>
  );
}
