import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

const logos = [
  {
    name: "Game 3D",
    url: "/images/games/mmorpg.svg",
    href: "#",
  },
  {
    name: "Web Game H5",
    url: "/images/games/h5-games.svg",
    href: "#",
  },
  {
    name: "Card Game",
    url: "/images/games/card-game.svg",
    href: "#",
  },
];

export function DesktopLogoCloud() {
  return (
    <div className="hidden md:flex w-full flex-col items-center">
      <span
        className={cn(
          "font-mono text-sm md:text-md text-white/50 text-center opacity-0 animate-fade-in-up [animation-delay:1s]",
        )}
      >
        Hệ thống hỗ trợ đa nền tảng
      </span>

      <div className="flex w-full flex-col items-center justify-center px-4 md:px-8">
        <div className="mt-10 flex gap-x-12">
          {logos.map((logo, idx) => (
            <div
              key={String(idx)}
              className={cn(
                "relative w-[180px] h-[40px] grayscale opacity-50 hover:opacity-100 hover:grayscale-0 transition-all duration-300",
                "opacity-0 animate-fade-in-up [animation-delay:var(--animation-delay)]",
              )}
              style={
                {
                  "--animation-delay": `calc(1.1s + .12s * ${idx})`,
                } as CSSProperties
              }
            >
              {/* Nếu chưa có ảnh svg, anh có thể dùng text tạm thời hoặc icon */}
              <div className="flex items-center justify-center h-full text-white font-bold tracking-widest text-lg opacity-80">
                {logo.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const MobileLogoCloud = () => {
  return (
    <div className="md:hidden w-full flex flex-col items-center">
      <span
        className={cn(
          "font-mono text-sm text-white/50 text-center uppercase tracking-widest",
        )}
      >
        Giải pháp toàn diện
      </span>

      <div className="w-full px-4">
        <div
          className="group relative mt-6 flex gap-6 overflow-hidden p-2"
          style={{
            maskImage:
              "linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 95%)",
          }}
        >
          {[0, 1].map((groupIndex) => (
            <div
              key={`logo-group-${groupIndex}`}
              className="flex shrink-0 animate-logo-cloud flex-row justify-around gap-12"
            >
              {logos.map((logo) => (
                <div
                  key={`${groupIndex}-${logo.name}`}
                  className="flex items-center justify-center px-4"
                >
                  <span className="text-white/40 font-bold whitespace-nowrap">
                    {logo.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
