"use cache";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UnkeyLogo } from "./footer-svgs";
import { Wordmark } from "./wordmark";

type NavLink = {
  title: string;
  href: string;
  external?: boolean;
};
const navigation = [
  {
    title: "Company",
    links: [
      { title: "About", href: "/about" },
      { title: "Contact", href: "tel:+84865811722", external: true },
      {
        title: "View Source",
        href: "https://github.com/LeSyCuong/Vietcod",
        external: true,
      },
    ],
  },
  {
    title: "Dịch vụ",
    links: [
      {
        title: "Hạ tầng",
        href: "https://portal.vietnix.vn/aff.php?aff=2857&url=https://vietnix.vn/vps-gia-re/",
        external: true,
      },
      { title: "Server game", href: "/templates" },
      { title: "Web game trọn gói", href: "/pricing" },
    ],
  },
  {
    title: "Kết nối",
    links: [
      {
        title: "Zalo",
        href: "https://zalo.me/0865811722",
        external: true,
      },
      {
        title: "Telegram",
        href: "https://t.me/cuong99871",
        external: true,
      },
      {
        title: "Book a Call",
        href: "tel:+84865811722",
        external: true,
      },
    ],
  },
  {
    title: "Điều khoản",
    links: [
      { title: "Điều khoản sử dụng", href: "/policies/terms" },
      { title: "Chính sách bảo mật", href: "/policies/privacy" },
    ],
  },
] satisfies Array<{ title: string; links: Array<NavLink> }>;

const Column: React.FC<{
  title: string;
  links: Array<NavLink>;
  className?: string;
}> = ({ title, links, className }) => {
  return (
    <div className={cn("flex flex-col gap-8   text-left ", className)}>
      <span className="w-full text-sm font-medium tracking-wider text-white font-display">
        {title}
      </span>
      <ul className="flex flex-col gap-4 md:gap-6">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-sm font-normal transition hover:text-white/40 text-white/70"
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export async function Footer() {
  return (
    <div className="border-t border-white/20 blog-footer-radial-gradient">
      <footer className="container relative grid grid-cols-2 gap-8 pt-8 mx-auto overflow-hidden lg:gap-16 sm:grid-cols-3 xl:grid-cols-5 sm:pt-12 md:pt-16 lg:pt-24 xl:pt-32">
        <div className="flex flex-col items-center col-span-2 sm:items-start sm:col-span-3 xl:col-span-1">
          <UnkeyLogo />
          <div className="mt-8 text-sm font-normal leading-6 text-white/60">
            Giải pháp vận hành Game Online toàn diện.
          </div>
          <div className="text-sm font-normal leading-6 text-white/40">
            Vietcod. {new Date().getUTCFullYear()}
          </div>
        </div>

        {navigation.map(({ title, links }) => (
          <Column
            key={title}
            title={title}
            links={links}
            className="col-span-1 "
          />
        ))}
      </footer>
      <div className="container mt-8 h-[100px]">
        <Wordmark className="flex w-full" />
      </div>
    </div>
  );
}
