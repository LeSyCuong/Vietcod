"use client";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { track } from "@vercel/analytics";
import { motion } from "framer-motion";
import { ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PrimaryButton, SecondaryButton } from "../button";
import { DesktopNavLink, MobileNavLink } from "./link";

export function Navigation() {
  const [scrollPercent, setScrollPercent] = useState(0);

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 100;
      const scrollPercent = Math.min(window.scrollY / 2 / scrollThreshold, 1);
      setScrollPercent(scrollPercent);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      style={{
        backgroundColor: `rgba(0, 0, 0, ${scrollPercent})`,
        borderColor: `rgba(255, 255, 255, ${Math.min(scrollPercent / 5, 0.15)})`,
      }}
      className="fixed z-[100] top-0 border-b-[.75px] border-white/10 w-full py-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center justify-between w-full sm:w-auto sm:gap-12 lg:gap-20">
          <Link href="/" aria-label="Vietcod Home">
            <Logo className="min-w-[100px]" />
          </Link>
          <MobileLinks className="lg:hidden" />
          <DesktopLinks className="hidden lg:flex" />
        </div>
        <div className="hidden sm:flex whitespace-nowrap gap-4">
          <Link href="/pricing">
            <SecondaryButton
              label="Thiết kế Web Game"
              IconRight={LayoutGrid}
              className="h-8 text-sm"
            />
          </Link>
          <Link href="/templates" rel="noopener noreferrer">
            <PrimaryButton
              shiny
              label="Server Game"
              IconRight={ChevronRight}
              className="h-8"
              onClick={async () => {
                track("signin", { location: "navigation" });
              }}
            />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

function MobileLinks({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={className}>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-end h-8 gap-2 pl-3 py-2 text-sm duration-150 text-white/60 hover:text-white/80"
          >
            Menu
            <ChevronDown className="w-4 h-4 relative top-[1px]" />
          </button>
        </DrawerTrigger>
        <DrawerContent className="bg-black/90 z-[110] border-white/10">
          <DrawerTitle className="sr-only">Menu Vietcod</DrawerTitle>
          <DrawerHeader className="flex justify-center border-b border-white/5 pb-4">
            <Logo />
          </DrawerHeader>
          <div className="relative w-full mx-auto antialiased z-[110]">
            <ul className="flex flex-col px-8 divide-y divide-white/10">
              <li>
                <MobileNavLink
                  onClick={() => setIsOpen(false)}
                  href="/"
                  label="Trang chủ"
                />
              </li>
              <li>
                <MobileNavLink
                  onClick={() => setIsOpen(false)}
                  href="/about"
                  label="Giới thiệu"
                />
              </li>
              <li>
                <MobileNavLink
                  onClick={() => setIsOpen(false)}
                  href="https://portal.vietnix.vn/aff.php?aff=2857&url=https://vietnix.vn/vps-gia-re/"
                  label="Hạ tầng"
                />
              </li>
              <li>
                <MobileNavLink
                  onClick={() => setIsOpen(false)}
                  href="/blog"
                  label="Blog"
                />
              </li>
              <li>
                <MobileNavLink
                  onClick={() => setIsOpen(false)}
                  href="/pricing"
                  label="Thiết kế Web Game"
                />
              </li>
            </ul>
          </div>
          <DrawerFooter className="gap-4">
            <Link
              href="/templates"
              rel="noopener noreferrer"
              className="w-full"
            >
              <PrimaryButton
                shiny
                label="Server Game"
                IconRight={ChevronRight}
                className="flex justify-center w-full text-center"
              />
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 duration-500 text-white/75 hover:text-white/80 h-10 border border-white/10 rounded-lg text-center bg-black"
            >
              Đóng Menu
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

const DesktopLinks: React.FC<{ className: string }> = ({ className }) => (
  <ul className={cn("items-center hidden gap-8 lg:flex xl:gap-10", className)}>
    <li>
      <DesktopNavLink href="/about" label="Giới thiệu" />
    </li>
    <li>
      <DesktopNavLink
        href="https://portal.vietnix.vn/aff.php?aff=2857&url=https://vietnix.vn/vps-gia-re/"
        label="Hạ tầng"
        external
      />
    </li>
    <li>
      <DesktopNavLink href="/blog" label="Blog" />
    </li>
    <li>
      <DesktopNavLink
        href="https://zalo.me/0865811722"
        label="Hỗ trợ"
        external
      />
    </li>
  </ul>
);

const Logo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="110"
    height="40"
    viewBox="0 0 110 40"
  >
    <defs>
      <radialGradient
        id="paint_vietcod_nav"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(55 20) rotate(23) scale(90)"
      >
        <stop offset="0.2" stopColor="white" />
        <stop offset="0.9" stopColor="white" stopOpacity="0.5" />
      </radialGradient>
    </defs>
    <text
      x="0"
      y="28"
      fontFamily="Inter, sans-serif"
      fontWeight="800"
      fontSize="26"
      fill="url(#paint_vietcod_nav)"
      style={{ letterSpacing: "-0.04em", shapeRendering: "geometricPrecision" }}
    >
      Vietcod
    </text>
  </svg>
);
