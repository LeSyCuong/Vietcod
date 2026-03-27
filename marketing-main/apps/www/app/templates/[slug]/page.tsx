import { ArrowLeft, PlayCircle, Globe, Cpu } from "lucide-react";
import { CTA } from "@/components/cta";
import { ChangelogLight } from "@/components/svg/changelog";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type GameProduct, getImgUrl } from "../data";
import { db } from "@/lib/db";

export async function generateStaticParams() {
  try {
    const [rows] = await db.execute(
      "SELECT id FROM sanpham_game ORDER BY id DESC",
    );
    const games = rows as { id: number }[];

    return games.map((game) => ({
      slug: game.id.toString(),
    }));
  } catch (error) {
    console.error("Lỗi khi sinh static params cho game:", error);
    return [];
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function TemplateDetail(props: Props) {
  const resolvedParams = await props.params;
  const slug = resolvedParams.slug;

  let game: GameProduct | undefined = undefined;

  try {
    const [rows] = await db.execute(
      "SELECT id, name, img, price, category, content, link_youtube FROM sanpham_game WHERE id = ? LIMIT 1",
      [slug],
    );

    const games = rows as GameProduct[];
    if (games.length > 0) {
      game = games[0];
    }
  } catch (error) {
    console.error(`Database Query Error for slug ${slug}:`, error);
  }

  if (!game) return notFound();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <>
      <div className="relative mx-auto -z-100 pt-[64px]">
        <ChangelogLight className="w-full max-w-[1000px] mx-auto -top-40 opacity-30" />
      </div>

      <div className="container flex flex-wrap px-6 md:px-8 mx-auto mt-10 text-white/60">
        <div className="flex flex-col self-start w-full px-0 mx-0 xl:w-1/3 xl:sticky top-24 z-10">
          <Link
            href="/templates"
            className="flex items-center gap-2 text-sm duration-200 text-white/60 hover:text-white/80"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách Server
          </Link>

          <div className="mb-8 mt-10">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              {game.name}
            </h2>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-black text-white tracking-tighter">
                {formatPrice(game.price)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <Link
              target="_blank"
              href={`https://zalo.me/0865811722?text=Tôi muốn nhận bàn giao server: ${game.name}`}
              className="group relative flex items-center justify-center w-full px-8 py-4 text-sm font-black text-black transition-all duration-300 bg-gradient-to-r from-zinc-100 to-zinc-400 rounded-xl hover:from-white hover:to-zinc-200 active:scale-[0.98]"
            >
              NHẬN SERVER GAME
            </Link>

            <p className="text-[10px] text-center text-zinc-500 uppercase font-bold tracking-widest">
              THỜI GIAN TRIỂN KHAI: 2H-4H
            </p>
          </div>

          <div className="mt-12 space-y-4">
            <div className="p-4 rounded-2xl border border-white/15 backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Kiến trúc
                </span>
                <span className="text-sm font-black text-zinc-300 uppercase">
                  {game.category || "Standard"}
                </span>
              </div>
            </div>
            <div className="p-4 rounded-2xl border border-white/15 backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-2">
                  <Cpu className="w-3 h-3" /> Bàn giao
                </span>
                <span className="text-sm font-bold text-zinc-300">
                  Trọn gói
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full mt-16 mb-24 xl:w-2/3 md:mt-0 xl:pt-12 xl:pl-24">
          {game.img && (
            <div className="w-full mb-16 relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-transparent rounded-3xl blur opacity-20" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 aspect-video shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)]">
                <img
                  src={getImgUrl(game.img)}
                  alt={game.name}
                  className="w-full h-full object-cover duration-700"
                />
              </div>
            </div>
          )}

          {game.link_youtube && (
            <div className="w-full mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  <PlayCircle className="w-6 h-6 text-zinc-300" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight italic uppercase">
                  Play Preview
                </h3>
              </div>
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${game.link_youtube}?autoplay=0&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0"
                ></iframe>
              </div>
            </div>
          )}

          <div className="w-full p-8 md:p-12 rounded-3xl border border-white/15 backdrop-blur-3xl relative overflow-hidden">
            <h3 className="text-2xl font-black text-white mb-8 border-l-4 border-zinc-500 pl-4 uppercase tracking-tighter">
              Thông số
            </h3>
            <div
              className="prose prose-invert max-w-none text-zinc-400 leading-relaxed text-lg
                prose-strong:text-white prose-strong:font-bold
                prose-p:mb-6 prose-li:text-zinc-300"
              dangerouslySetInnerHTML={{
                __html:
                  game.content ||
                  "Hệ thống đang được Vietcod tối ưu hóa dữ liệu kỹ thuật...",
              }}
            />
          </div>
        </div>
      </div>
      <CTA />
    </>
  );
}
