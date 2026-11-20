"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { pauseOffscreen } from "@/lib/pauseOffscreen";

gsap.registerPlugin(useGSAP);

const FLAME = "M50 4 C62 30 86 44 84 76 C83 100 68 116 50 116 C32 116 17 100 16 76 C15 56 30 46 34 26 C40 40 44 44 48 46 C50 30 46 18 50 4 Z";
const CORE = "M50 46 C58 62 70 72 68 90 C67 104 60 112 50 112 C40 112 33 104 32 90 C31 76 42 68 50 46 Z";

function Flame({ id, outer, inner, side }: { id: string; outer: [string, string]; inner: string; side: "left" | "right" }) {
  return (
    <div
      className={`absolute bottom-[6%] w-[18%] min-w-[70px] ${side === "left" ? "left-[14%]" : "right-[14%]"}`}
      style={{ transform: "translateZ(70px)" }}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={i}
          data-ember={id}
          className="absolute bottom-[40%] left-1/2 h-1.5 w-1.5 rounded-full"
          style={{ background: outer[0], boxShadow: `0 0 8px ${outer[0]}` }}
        />
      ))}
      <div className="absolute inset-x-[10%] bottom-0 h-[30%] rounded-full blur-2xl" style={{ background: outer[0], opacity: 0.45 }} />
      <svg data-flame={id} viewBox="0 0 100 120" className="relative block w-full origin-bottom">
        <defs>
          <linearGradient id={`g-${id}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={outer[1]} />
            <stop offset="1" stopColor={outer[0]} stopOpacity={0.9} />
          </linearGradient>
        </defs>
        <path d={FLAME} fill={`url(#g-${id})`} />
        <path data-core={id} d={CORE} fill={inner} className="origin-bottom" style={{ transformBox: "fill-box" }} />
      </svg>
    </div>
  );
}

export default function FlameOverlay() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const loops: gsap.core.Animation[] = [];
        for (const id of ["red", "blue"]) {
          loops.push(gsap.to(`[data-flame="${id}"]`, {
            scaleY: () => gsap.utils.random(0.9, 1.08),
            scaleX: () => gsap.utils.random(0.94, 1.04),
            skewX: () => gsap.utils.random(-4, 4),
            duration: 0.18,
            ease: "sine.inOut",
            repeat: -1,
            repeatRefresh: true,
          }));
          loops.push(gsap.to(`[data-core="${id}"]`, {
            scaleY: () => gsap.utils.random(0.82, 1.1),
            duration: 0.14,
            ease: "sine.inOut",
            repeat: -1,
            repeatRefresh: true,
          }));
          gsap.utils.toArray<HTMLElement>(`[data-ember="${id}"]`).forEach((el, i) => {
            loops.push(gsap.fromTo(
              el,
              { x: 0, y: 0, autoAlpha: 0, scale: 1 },
              {
                keyframes: [
                  { autoAlpha: 1, duration: 0.15 },
                  {
                    x: () => gsap.utils.random(-40, 40),
                    y: () => gsap.utils.random(-140, -70),
                    autoAlpha: 0,
                    scale: 0.3,
                    duration: () => gsap.utils.random(1, 1.8),
                    ease: "power1.out",
                  },
                ],
                repeat: -1,
                repeatRefresh: true,
                delay: i * 0.17,
              }
            ));
          });
        }
        pauseOffscreen(root.current, loops);
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]">
      <Flame id="red" outer={["#ff5a2e", "#ffd36b"]} inner="#fff1c9" side="left" />
      <Flame id="blue" outer={["#2f8cff", "#a8f0ff"]} inner="#eafcff" side="right" />
    </div>
  );
}
