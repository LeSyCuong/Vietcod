"use client";

import { useRef, useEffect } from "react";
import React from "react";
import { useTranslations } from "next-intl";
import Button from "@/app/[locale]/components/Button";
import { createRoot } from "react-dom/client";
import { useRouter } from "next/navigation";

const Hero = () => {
  const t = useTranslations("home");
  const router = useRouter();
  const features = t.raw("Hero.features") as { title: string }[];

  const featuresPC = features
    .map((f, idx) => {
      const beforeClass =
        idx === 0
          ? ""
          : "before:relative before:mx-2 before:inline-block before:aspect-square before:w-[3px] before:rounded-full before:bg-white/30 before:align-middle before:content-[''] sm:before:mx-2";
      return `
      <li class="relative sm:shrink-0 ${beforeClass}">
        ${f.title}
      </li>
    `;
    })
    .join("");

  const featuresMB = features
    .map(
      (f) => `
      <li
        class="relative before:relative before:mx-2.5 before:inline-block before:aspect-square before:w-[3px] before:rounded-full before:bg-white/30 before:align-middle before:content-[''] sm:shrink-0 sm:before:mx-2 first:before:content-none"
      >
        ${f.title}
      </li>
    `,
    )
    .join("");

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!containerRef.current) return;

    if (containerRef.current.shadowRoot) {
      return;
    }
    const shadowRoot = containerRef.current.attachShadow({ mode: "open" });

    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "/css/2cfc5f73f17d6511.css";
    shadowRoot.appendChild(styleLink);

    shadowRoot.innerHTML += `
     <style>
.gradient-overlay {
  pointer-events: none;  
  position: absolute;              
  bottom: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  height: 340px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1) 50%); 
}

@media (max-width: 1024px) {  
  .gradient-overlay {
    height: 250px;
  }
}

@media (max-width: 768px) {   /* md */
  .gradient-overlay {
    height: 176px; /* md:h-44 ~ 11rem = 176px */
  }
}

@media (max-width: 640px) {   /* sm */
  .gradient-overlay {
    left: 0;
    width: 107%;
    height: 170px;
  }
}

@media (max-width: 480px) {   /* xs */
  .gradient-overlay {
    height: 28%;
  }
}


@media (max-width: 768px) {
  .hero-overlay {
    pointer-events: none;  
    position: absolute;        
    top: 0;
    left: 0;
    z-index: 20;
    width: 100%;
    height: 200px;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 1) 50%
    ); 
  }
}

.h1 {
margin-top:20px;
  font-size: clamp(32px, 5vw, 72px);
}
    </style>
     <main>
    <section
      class="hero relative h-[1438px] overflow-hidden bg-grey-1 pt-[184px] px-safe lg:h-[1078px] lg:pt-28 md:h-auto md:pt-24 sm:pt-[92px]"
    >
    <div class="hero-overlay"></div>
      <div class="container relative flex h-full flex-col">
        <h1
          class="relative title h1  z-30 max-w-[616px] text-white font-title font-bold leading-[0.9] tracking-tight text-transparent lg:max-w-[528px] lg:text-72 md:max-w-[441px] md:text-56 sm:max-w-64 sm:text-32"
        >
         ${t("Hero.h1")}
        </h1>
        <p
          class="relative title z-30 mt-5 max-w-md text-18 leading-snug tracking-tight text-grey-90 lg:mt-4 md:mt-3.5 md:text-16 sm:mt-3 sm:max-w-[248px] sm:text-15"
        >
         ${t("Hero.p")}
          </p>

        <div class="mt-11 lg:mt-9 md:mt-7 sm:mt-5">
      <div class="button-wrapper"></div>
      </div>

        <div
          class="absolute bottom-0 left-6 aspect-[1.067842] w-[1574px] max-w-none lg:-bottom-[39px] lg:left-0 lg:w-[1220px] md:relative md:bottom-0 md:top-7 md:mb-6 md:mt-[-36%] md:w-[120%] sm:-top-3 sm:mb-[-15%] sm:mt-0 sm:w-full xs:top-1.5 xs:mb-2 xs:min-h-[350px] 2xs:aspect-auto"
          style="--hero-mask-x: 951.5px; --hero-mask-y: 241px"
        >
          <div
            class="absolute -left-[344px] bottom-0 z-0 aspect-[1.335187] w-[1920px] max-w-none mix-blend-lighten lg:bottom-[23px] lg:left-[-253px] lg:w-[1620px] md:bottom-[-2.1%] md:left-[-27%] md:w-[147%] sm:bottom-[5.4%] sm:left-[-34.95%] sm:w-[189%] xs:bottom-[1.9%] xs:left-[-36.2%] xs:w-[190%] xs:min-w-[704px] 2xs:bottom-[18px] 2xs:left-[-132px] before:absolute before:top-0 before:z-10 before:hidden before:h-20 before:w-full before:bg-gradient-to-b before:from-grey-1 before:to-grey-1/0 sm:before:block"
          >
         <video
  class="absolute inset-0 w-full h-full"
  width="1920"
  height="1438"
  autoplay
  loop
  muted
  playsinline
  style="opacity: 1"
>
  <source src="/uploads/videos/background/bg-light.mp4" type="video/mp4" />
</video>

          </div> 
          <img
            alt=""
            fetchpriority="high"
            width="1024"
            height="569"
            decoding="async"
            data-nimg="1"
            class="absolute  bottom-[141px] left-2 z-2 rounded-t-[10px] lg:bottom-[138px] lg:left-9 lg:w-[873px] md:bottom-[9.5%] md:left-0 md:w-[78.4%] md:rounded-t-md sm:relative sm:bottom-auto sm:mt-[18.7%] sm:w-[100.5%] sm:min-w-[100.5%] sm:rounded-t xs:mt-[21.6%] xs:w-full xs:min-w-[376px] 2xs:mt-[70px]"
            style="color: transparent"
            sizes="100vw"
            srcset="
              /uploads/images/background/bg.png  640w,
              /uploads/images/background/bg.png  750w,
              /uploads/images/background/bg.png  828w,
              /uploads/images/background/bg.png 1080w,
              /uploads/images/background/bg.png 1200w,
              /uploads/images/background/bg.png 1920w,
              /uploads/images/background/bg.png 2048w,
              /uploads/images/background/bg.png 3840w
            "
            src=/uploads/images/background/bg.png
          />
        
        </div>
        <div
          class="absolute bottom-[88px] z-30 overflow-hidden text-14 tracking-snugger lg:bottom-14 md:bottom-12 md:text-13 sm:bottom-9 sm:left-5 sm:right-0 sm:text-12 xs:left-0 xs:before:absolute xs:before:bottom-0 xs:before:left-0 xs:before:z-10 xs:before:h-5 xs:before:w-[90px] xs:before:bg-[linear-gradient(90deg,#090A0C_28.3%,rgba(9,10,12,0)_100%)] xs:after:absolute xs:after:bottom-0 xs:after:right-0 xs:after:z-10 xs:after:h-5 xs:after:w-[90px] xs:after:bg-[linear-gradient(270deg,#090A0C_28.3%,rgba(9,10,12,0)_100%)]"
        >
          <p
            class="mb-3.5 font-light leading-none text-white/60 will-change-transform md:mb-3 xs:pl-5"
          >
           ${t("Hero.tagline")}
          </p>
          <div class="w-full xs:flex xs:overflow-hidden">
             <ul
              class="flex flex-shrink-0 leading-dense text-white will-change-transform xs:animate-infinityScroll"
            >
              ${featuresPC}
            </ul>
            <ul
              class="hidden flex-shrink-0 leading-dense text-white will-change-transform xs:flex xs:animate-infinityScroll"
            >
              ${featuresMB}
            </ul>
          </div>
        </div>
      </div>

    <div class="gradient-overlay"></div>

    </section>
  </main>
  `;
    const buttonWrapper =
      shadowRoot.querySelector<HTMLDivElement>(".button-wrapper");
    if (buttonWrapper) {
      const root = createRoot(buttonWrapper);
      root.render(
        <Button
          text={t("Source")}
          svg={true}
          onClick={() => router.push("/pages/products")}
          width_MB={230}
          width_PC={300}
          initialX_PC={115}
          initialX_MB={86}
          style={{ fontSize: "13px" }}
        />,
      );
    }
  }, []);

  return <div ref={containerRef}></div>;
};

export default Hero;
