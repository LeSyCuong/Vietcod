"use client";

import { useEffect, useRef } from "react";

export default function VantaNetScript() {
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });

    Promise.all([
      loadScript("/libs/three.r134.min.js"),
      loadScript("/libs/vanta.net.min.js"),
    ])
      .then(() => {
        const THREE = (window as any).THREE;
        const VANTA = (window as any).VANTA;

        if (VANTA && VANTA.NET && THREE && vantaRef.current) {
          VANTA.NET({
            el: vantaRef.current,
            THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: window.innerHeight,
            minWidth: window.innerWidth,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0xffffff,
            backgroundColor: 0x000000,
            maxDistance: 25.0,
            spacing: 20.0,
          });
        } else {
          console.error("VANTA.NET or THREE not available");
        }
      })
      .catch((err) => {
        console.error("Vanta.NET loading error:", err);
      });
  }, []);

  return (
    <div
      ref={vantaRef}
      style={{
        width: "100%",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    />
  );
}
