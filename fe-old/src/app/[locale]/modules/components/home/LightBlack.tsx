import Glowing from "@/app/[locale]/modules/components/home/Glowing";
import FeatureGrid from "./FeatureGrid";

export default function LightBlack() {
  return (
    <section className="white-section w-full min-h-screen flex flex-col justify-center items-center bg-[#111111] px-5 pt-20 md:pb-10">
      <div className="max-w-screen text-center">
        <h2 className="text-white font-semibold text-[clamp(1.5rem,3vw,3rem)] mb-3 mt-12">
          Nơi cung cấp mã nguồn game chất lượng, sẵn sàng triển khai
        </h2>

        <p className="text-[#cccccc] text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed mb-10">
          Khám phá kho mã nguồn game đa dạng, từ casual đến RPG, giúp bạn tiết
          kiệm thời gian phát triển và nhanh chóng đưa sản phẩm ra thị trường.
          Hỗ trợ tối ưu, cập nhật liên tục và hướng dẫn chi tiết cho nhà phát
          triển.
        </p>
      </div>
      <div className="-mt-50 z-10 -mb-70 md:mt-15 md:mb-0">
        <Glowing img="/uploads/images/ERP.jpg,/uploads/images/CRM.jpg" />
      </div>

      <div className="mt-24 w-full flex justify-center">
        <FeatureGrid />
      </div>
    </section>
  );
}
