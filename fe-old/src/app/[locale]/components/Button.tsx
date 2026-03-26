"use client";

import { FC, useRef, useEffect } from "react";

interface ButtonProps {
  text: string;
  icon?: string;
  svg?: boolean;
  onClick?: (e: MouseEvent) => void;
  disabled?: boolean;
  initialX_PC?: number;
  initialX_MB?: number;
  width_PC?: number | "full";
  width_MB?: number | "full";
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset";
}

const Button: FC<ButtonProps> = ({
  text,
  icon = "",
  svg = false,
  onClick,
  disabled = false,
  initialX_PC = 160,
  initialX_MB = 120,
  width_PC = 300,
  width_MB = 230,
  style = {},
  type = "button",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!containerRef.current) return;

    if (containerRef.current.shadowRoot) return;

    const shadowRoot = containerRef.current.attachShadow({ mode: "open" });

    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "/css/2cfc5f73f17d6511.css";
    shadowRoot.appendChild(styleLink);

    const isMobile = window.innerWidth <= 767;
    const startX = isMobile ? initialX_MB : initialX_PC;
    const width = isMobile ? width_MB : width_PC;

    const computedWidth =
      width === "full"
        ? "100%"
        : typeof width === "number"
          ? `${width}px`
          : "300px";

    const inlineStyle = Object.entries(style)
      .map(([key, value]) => {
        const cssKey = key.replace(
          /[A-Z]/g,
          (match) => `-${match.toLowerCase()}`,
        );
        return `${cssKey}: ${value}`;
      })
      .join("; ");

    shadowRoot.innerHTML += `
     <style>
      .border-button-light-blur {
        position: absolute;
        left: 50%;
        top: 50%;
        height: calc(100% + 12px);
        width: calc(100% + 10px);
        transform: translate(-50%, -50%);
        border-radius: 9999px;
        opacity: 0;
        transition: opacity 0.1s;
        pointer-events: none;
      }

      .dynamic-width {
        width: ${computedWidth};
      }

      .px-15 {
        padding-left: 4rem;
        padding-right: 4rem;
      }

      @media (max-width: 767px) {
        .px-15 {
          padding-left: 2rem;
          padding-right: 2rem;
        }
      }

      .disabled {
        opacity: 0.5;
        cursor: not-allowed;
        pointer-events: none;
      }
    </style>
        <div class="relative inline-flex items-center z-10 dynamic-width">
          <div
            class="border-button-light-blur absolute left-1/2 top-1/2 rounded-full will-change-transform"
            style="opacity: 0; transform: translate(-50%, -50%) scale(-1, 1);"
          >
            <div class="border-button-light relative h-full w-full rounded-full"></div>
          </div>
          <div
            class="border-button-light-blur absolute left-1/2 top-1/2 scale-x-[-1] transform rounded-full will-change-transform"
            style="opacity: 0.82951"
          >
            <div class="border-button-light relative h-full w-full rounded-full"></div>
          </div>
         <button
  id="shadow-btn"
    type="${type}"
  style="${inlineStyle}"
  class="uppercase font-bold flex items-center justify-center h-10 text-12 text-black relative z-10 overflow-hidden rounded-full border border-white/60 bg-[#d1d1d1] space-x-1 px-15 dynamic-width ${
    disabled ? "disabled" : ""
  }"
  ${disabled ? "disabled" : ""}
>
            <div
              class="absolute -z-10 flex items-center justify-center dynamic-width"
              style="transform: translateX(${startX}px) translateZ(0px)"
            >
              <div
                class="absolute top-1/2 h-[121px] -translate-y-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,#FFFFF5_3.5%,_#FFAA81_26.5%,#FFDA9F_37.5%,rgba(255,170,129,0.50)_49%,rgba(210,106,58,0.00)_92.5%)] dynamic-width"
              ></div>
              <div
                class="absolute top-1/2 h-[103px] -translate-y-1/2 bg-[radial-gradient(43.3%_44.23%_at_50%_49.51%,_#FFFFF7_29%,_#FFFACD_48.5%,_#F4D2BF_60.71%,rgba(214,211,210,0.00)_100%)] blur-[5px] dynamic-width"
              ></div>
            </div>
            <span class="text-[#5A250A]">${text}</span>
            ${icon}
            ${
              svg
                ? `<svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 9"
              class="h-[9px] w-[17px] text-[#5A250A]"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="m12.495 0 4.495 4.495-4.495 4.495-.99-.99 2.805-2.805H0v-1.4h14.31L11.505.99z"
                clip-rule="evenodd"
              ></path>
            </svg>`
                : ""
            }
          </button>
        </div>
      </div>
  `;

    const btn = shadowRoot.querySelector<HTMLButtonElement>("#shadow-btn");
    if (btn) {
      // Shadow -> React event bridge
      btn.addEventListener("click", () => {
        containerRef.current?.dispatchEvent(
          new CustomEvent("button-click", { bubbles: true }),
        );
      });
    }

    const buttons = shadowRoot.querySelectorAll<HTMLButtonElement>("button");
    buttons.forEach((button) => {
      if (disabled) return;

      const glowContainer = button.querySelector<HTMLDivElement>(
        "div.absolute.-z-10.flex",
      );
      const borderBlurRight =
        button.previousElementSibling as HTMLElement | null;
      const borderBlurLeft = button.previousElementSibling
        ?.previousElementSibling as HTMLElement | null;

      if (!glowContainer || !borderBlurRight || !borderBlurLeft) return;

      borderBlurLeft.style.transform = "translate(-50%, -50%) scale(-1, 1)";

      let mousePosition = { x: startX, y: 0 };
      let targetMousePosition = { x: startX, y: 0 };
      const speed = 0.15;
      const padding = 200;
      let isHovered = false;
      let rafId: number | null = null;

      const animate = () => {
        mousePosition.x += (targetMousePosition.x - mousePosition.x) * speed;
        mousePosition.y += (targetMousePosition.y - mousePosition.y) * speed;

        glowContainer.style.transform = `translateX(${mousePosition.x}px) translateY(0px) translateZ(0px)`;

        const normalizedX = mousePosition.x / (button.offsetWidth / 2);
        borderBlurRight.style.opacity = Math.max(
          0,
          Math.min(1, normalizedX),
        ).toString();
        borderBlurLeft.style.opacity = Math.max(
          0,
          Math.min(1, -normalizedX),
        ).toString();

        rafId = requestAnimationFrame(animate);
      };
      animate();

      button.addEventListener("mousemove", (e) => {
        const rect = button.getBoundingClientRect();
        const centerX = rect.width / 2;

        let mouseX = e.clientX - rect.left - centerX;
        let mouseY = 0;

        const maxDistance = startX + 5;
        mouseX = Math.max(-maxDistance, Math.min(maxDistance, mouseX));

        targetMousePosition = { x: mouseX, y: mouseY };
        isHovered = true;
      });

      document.addEventListener("mousemove", (e) => {
        if (!isHovered) return;

        const rect = button.getBoundingClientRect();
        const insideX =
          e.clientX >= rect.left - padding && e.clientX <= rect.right + padding;
        const insideY =
          e.clientY >= rect.top - padding && e.clientY <= rect.bottom + padding;

        if (!insideX || !insideY) {
          isHovered = false;
          targetMousePosition = { x: startX, y: 0 };
        }
      });

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
      };
    });
  }, [
    text,
    icon,
    svg,
    onClick,
    disabled,
    initialX_MB,
    initialX_PC,
    width_MB,
    width_PC,
  ]);

  useEffect(() => {
    const current = containerRef.current;
    if (!current) return;

    const handleShadowClick = (e: Event) => {
      if (!disabled && onClick) onClick(e as unknown as MouseEvent);
    };

    current.addEventListener("button-click", handleShadowClick);
    return () => current.removeEventListener("button-click", handleShadowClick);
  }, [onClick, disabled]);
  return <div ref={containerRef}></div>;
};

export default Button;
