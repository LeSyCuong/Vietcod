"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Button from "../../../components/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

export default function GraphLines() {
  const t = useTranslations("home");
  const router = useRouter();
  const sectionTitle = t("WhyUs.sectionTitle");
  const headingLine1 = t("WhyUs.headingLine1");
  const headingLine2 = t("WhyUs.headingLine2");
  const description = t.rich("WhyUs.description", {
    strong: (chunks) => <strong>{chunks}</strong>,
  });
  const animatedText = t("WhyUs.animatedText");
  const letters = animatedText.split("");

  const letterVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const pathVariants: Variants = {
    hidden: { pathLength: 0, pathOffset: 1, opacity: 0 },
    visible: (custom: number) => ({
      pathLength: 1,
      pathOffset: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeInOut",
        delay: custom,
      },
    }),
  };

  const leftPathVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (custom: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1, ease: "easeInOut", delay: custom },
    }),
  };

  const handleClick = () => {
    router.push("https://zalo.me/0865811722");
  };

  return (
    <motion.div
      className="relative w-full min-h-screen bg-[#111111] flex flex-col md:flex-row items-center justify-center md:justify-between px-6 md:px-12 py-15 md:pb-20"
      initial="hidden"
      whileInView="visible"
      exit="hidden"
      viewport={{ once: false, amount: 0.3 }}
    >
      {/* Nội dung text */}
      <div className="w-full md:w-1/2 text-white font-sans text-center md:text-left mb-10 md:mb-0">
        <p className="text-xs md:text-sm tracking-widest text-gray-400 mb-2 2xl:text-base">
          {sectionTitle}
        </p>

        <h1
          className="text-3xl md:text-4xl font-bold mb-4 leading-tight 
                 2xl:text-5xl"
        >
          {headingLine1}
          <br />
          <span
            className="text-transparent text-5xl md:text-6xl bg-clip-text bg-gradient-to-r from-pink-600 to-blue-700 
                     2xl:text-7xl"
          >
            {headingLine2}
          </span>
        </h1>

        <p
          className="text-sm md:text-base text-gray-300 mb-6 max-w-md md:max-w-lg mx-auto md:mx-0 
               2xl:text-lg 2xl:max-w-2xl"
        >
          {description}
        </p>

        <div className="flex justify-center md:justify-start gap-3">
          <Button onClick={handleClick} text={t("Consultation")} svg={true} />
        </div>
      </div>

      <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:h-[70vh]">
        <Image
          src="/uploads/images/globe-light.svg"
          alt="Global light"
          fill
          className="object-contain"
          priority
        />

        {/* Button + text */}
        <div className="flex justify-center">
          <button
            className="-mt-[2%] px-3 py-2 2xl:px-5 2xl:py-3 
                     group hover:border-strong flex gap-1 sm:gap-2 items-center 
                     bg-alternative rounded-xl border border-gray-800"
          >
            <div className="text-blue-300 ml-2 text-sm font-mono 2xl:text-base">
              &gt;
            </div>

            <motion.div
              className="ml-2 flex-1 text-left text-[rgb(0,191,255)] 
                 text-xs md:text-sm 2xl:text-base font-mono"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { delayChildren: 1, staggerChildren: 0.05 },
                },
              }}
            >
              {letters.map((char, i) => (
                <motion.span
                  key={i}
                  variants={letterVariants}
                  className={char === " " ? "mx-[0.2em]" : ""}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          </button>
        </div>

        {/* Cột sáng dọc */}
        <span
          className="absolute w-[0.2%] h-[24%] left-[51%] top-[7%]"
          style={{
            background:
              "linear-gradient(to top, rgb(0, 191, 255), transparent)",
          }}
        />
        {/* Đường giữa */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 155 284"
          className="absolute"
          style={{ width: "25%", height: "40%", left: "34%", top: "32%" }}
        >
          <motion.path
            d="M.797 283.216c14.605-22.693 64.498-78.738 87.739-104.396-22.406-17.823-47.852-46.354-57.983-58.555 36.536-29.153 96.735-65.699 122.267-80.327-6.727-8.041-21.226-27.282-26.518-39.053"
            stroke="url(#lg-svg1)"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
            variants={pathVariants}
            custom={1.8}
          />
          <defs>
            <linearGradient
              id="lg-svg1"
              x1="100%"
              x2="100%"
              y1="-20%"
              y2="130%"
            >
              <stop offset="0" stopColor="rgb(0,191,255)" stopOpacity="0" />
              <stop offset="0.5" stopColor="rgb(0,191,255)" stopOpacity="0.9" />
              <stop offset="1" stopColor="rgb(0,191,255)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </motion.svg>
        {/* Đường phải */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 272 235"
          className="absolute"
          style={{ width: "28%", height: "40%", left: "50.5%", top: "28%" }}
        >
          <motion.path
            d="M271.749 233.614C215.075 230.474 159.599 210.964 138.945 201.602C144.38 186.681 156.517 152.612 161.587 135.71C126.058 122.39 44.25 76.75 1.25 0.75"
            stroke="url(#lg-svg2)"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
            variants={pathVariants}
            custom={2}
          />
          <defs>
            <linearGradient
              id="lg-svg2"
              x1="100%"
              x2="100%"
              y1="-20%"
              y2="130%"
            >
              <stop offset="0" stopColor="rgb(0,191,255)" stopOpacity="0" />
              <stop offset="0.5" stopColor="rgb(0,191,255)" stopOpacity="0.9" />
              <stop offset="1" stopColor="rgb(0,191,255)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </motion.svg>
        {/* Đường trái */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 261 144"
          className="absolute"
          style={{ width: "35%", height: "21%", left: "21.5%", top: "31%" }}
        >
          <motion.path
            d="M260.5 1.5C157.75 30.75 67.75 89 1.13281 143.202"
            stroke="url(#lg-svg3)"
            strokeWidth="1.4"
            strokeLinecap="round"
            fill="none"
            variants={leftPathVariants}
            custom={2.2}
          />
          <defs>
            <linearGradient
              id="lg-svg3"
              x1="100%"
              x2="100%"
              y1="-20%"
              y2="130%"
            >
              <stop offset="0" stopColor="rgb(0,191,255)" stopOpacity="0" />
              <stop offset="0.5" stopColor="rgb(0,191,255)" stopOpacity="0.9" />
              <stop offset="1" stopColor="rgb(0,191,255)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </motion.svg>
        {/* Các chấm tròn */}
        <motion.div
          className="absolute w-[2.5%] h-[3.5%] border-2 border-gray-400 bg-blue-300 rounded-full left-[24.5%] top-[50%] shadow-lg shadow-cyan-400"
          variants={letterVariants}
        />
        <motion.div
          className="absolute w-[2.5%] h-[3.5%] border-2 border-gray-400 bg-blue-300 rounded-full left-[50%] top-[30%] shadow-lg shadow-cyan-400"
          variants={letterVariants}
        />
        <motion.div
          className="absolute w-[2.5%] h-[3.5%] border-2 border-gray-400 bg-blue-300 rounded-full left-[77%] top-[63%] shadow-lg shadow-cyan-400"
          variants={letterVariants}
        />
      </div>
    </motion.div>
  );
}
