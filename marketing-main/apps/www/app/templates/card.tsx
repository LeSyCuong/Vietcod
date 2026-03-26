import Link from "next/link";
import Image from "next/image";
import { ArrowRight, VenetianMask } from "lucide-react";
import { getImgUrl, type GameProduct } from "@/app/templates/data";

// Hàm loại bỏ thẻ HTML
const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "");
};

// Hàm Format tiền VNĐ
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export function GameCard({ game }: { game: GameProduct }) {
  return (
    <Link
      href={`/templates/${game.id}`}
      className="flex flex-col items-start justify-start min-h-[400px] lg:h-[460px] w-full overflow-hidden duration-200 border rounded-xl border-white/10 hover:border-white/20 group bg-black/50"
    >
      <div className="relative w-full aspect-[3/2] shrink-0 overflow-hidden border-b border-white/5 bg-black">
        {game.img ? (
          <Image
            src={getImgUrl(game.img)}
            alt={game.name}
            width={800}
            height={533}
            unoptimized={true}
            className="object-cover object-center w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-white/5">
            <VenetianMask className="w-8 h-8 text-white/20" />
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow w-full p-4 lg:p-5 overflow-hidden">
        <div className="flex flex-row flex-wrap gap-1.5 mb-3">
          {game.category?.split(",").map((c, i) => (
            <span
              key={i}
              className="px-2 py-0.5 text-[9px] lg:text-[10px] font-bold uppercase rounded bg-white/5 text-white/50 border border-white/10"
            >
              {c.trim()}
            </span>
          ))}
        </div>

        <h3
          className="text-base lg:text-lg font-bold leading-tight line-clamp-2 mb-2 h-10 lg:h-12
                       bg-gradient-to-r from-white via-white/90 to-white/40 bg-clip-text text-transparent
                       group-hover:from-white group-hover:to-white duration-500"
        >
          {game.name}
        </h3>

        <p className="text-[11px] lg:text-xs leading-relaxed text-white/40 line-clamp-2 lg:line-clamp-3 mb-2">
          {stripHtml(game.content) ||
            "Hệ thống vận hành Server Game chuyên nghiệp từ Vietcod."}
        </p>

        <div className="flex items-center justify-between w-full mt-auto pt-3 lg:pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[9px] lg:text-[10px] text-white/20 uppercase tracking-widest font-medium">
              Giá triển khai
            </span>
            <span className="text-base lg:text-lg font-bold text-white/90">
              {formatPrice(game.price)}
            </span>
          </div>

          <div
            className="w-8 h-8 lg:w-9 lg:h-9 rounded-full border border-white/10 flex items-center justify-center 
                          group-hover:bg-white/90 group-hover:border-white/90 duration-300"
          >
            <ArrowRight className="w-4 h-4 text-white group-hover:text-black duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}
