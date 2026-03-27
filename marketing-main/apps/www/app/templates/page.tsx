import { Suspense } from "react";
import { TemplatesClient } from "./client";
import { type GameProduct } from "./data";
import { db } from "@/lib/db";

export const metadata = {
  title: "Server Game Online | Vietcod",
  description:
    "Khám phá các giải pháp vận hành Server Game trọn gói từ Vietcod.",
  openGraph: {
    title: "Server Game Online | Vietcod",
    description:
      "Khám phá các giải pháp vận hành Server Game trọn gói từ Vietcod.",
    url: "https://vietcod.com/templates",
    siteName: "vietcod.com",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 675,
      },
    ],
  },
  twitter: {
    title: "Blog | Vietcod",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/vietcod.ico",
  },
};

async function GameList() {
  let games: GameProduct[] = [];

  try {
    const [rows] = await db.execute(
      "SELECT id, name, img, price, category, content, link_youtube FROM sanpham_game ORDER BY id DESC",
    );

    games = rows as GameProduct[];
  } catch (error) {
    console.error("Database Query Error:", error);
    games = [];
  }

  return <TemplatesClient initialGames={games} />;
}

export default function TemplatesPage() {
  return (
    <div>
      <Suspense fallback={<LoadingPlaceholder />}>
        <GameList />
      </Suspense>
    </div>
  );
}

function LoadingPlaceholder() {
  return (
    <div className="container mx-auto pt-32 text-center text-white/20">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-64 bg-white/10 rounded-lg mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 bg-white/5 rounded-2xl border border-white/10"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
