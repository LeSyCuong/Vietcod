"use client";

import { motion, useReducedMotion } from "framer-motion";
import type React from "react";

function FadeInStagger({
  className,
  ...props
}: {
  className?: string;
  [key: string]: any;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "0px 0px 0px 0px" }}
      transition={{ staggerChildren: 0.15 }}
      className={`w-full flex justify-center items-center ${className || ""}`}
      {...props}
    />
  );
}

export const Wordmark: React.FC<{ className?: string }> = ({ className }) => {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 120 },
    visible: { opacity: 1, y: 0 },
  };

  const transition = {
    duration: 1.5,
    ease: "easeOut",
    type: "spring",
    stiffness: 180,
    damping: 30,
  };

  const word = "Vietcod";

  return (
    <FadeInStagger className={className}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-full"
      >
        <text
          x="50%"
          y="65%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="200"
          fontWeight="550"
          fontFamily="Inter, sans-serif"
          letterSpacing="0.05em"
          fill="url(#vietcod_dark_gradient)"
          style={{ textTransform: "none" }}
        >
          {word.split("").map((letter, index) => (
            <motion.tspan
              key={index}
              variants={variants}
              transition={transition}
              style={{ display: "inline-block" }}
            >
              {letter}
            </motion.tspan>
          ))}
        </text>

        <defs>
          <linearGradient
            id="vietcod_dark_gradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="#27272a" stopOpacity="0.95" />

            <stop offset="100%" stopColor="#09090b" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>
    </FadeInStagger>
  );
};
