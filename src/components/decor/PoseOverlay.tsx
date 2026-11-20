"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { pauseOffscreen } from "@/lib/pauseOffscreen";

gsap.registerPlugin(useGSAP);

type P = [number, number];
// Keypoints for a jumping jack: arms down / legs together, then arms up / legs apart
const DOWN: Record<string, P> = {
  head: [50, 18], neck: [50, 30], ls: [40, 32], rs: [60, 32], le: [36, 48], re: [64, 48],
  lw: [35, 63], rw: [65, 63], lh: [44, 64], rh: [56, 64], lk: [44, 85], rk: [56, 85], la: [44, 106], ra: [56, 106],
};
const UP: Record<string, P> = {
  head: [50, 12], neck: [50, 24], ls: [40, 26], rs: [60, 26], le: [27, 14], re: [73, 14],
  lw: [22, 0], rw: [78, 0], lh: [44, 58], rh: [56, 58], lk: [35, 80], rk: [65, 80], la: [28, 102], ra: [72, 102],
};
const BONES: [string, string][] = [
  ["neck", "ls"], ["neck", "rs"], ["ls", "le"], ["le", "lw"], ["rs", "re"], ["re", "rw"],
  ["ls", "lh"], ["rs", "rh"], ["lh", "rh"], ["lh", "lk"], ["lk", "la"], ["rh", "rk"], ["rk", "ra"], ["head", "neck"],
];
const KEYS = Object.keys(DOWN);

export default function PoseOverlay() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const svg = root.current!.querySelector("svg")!;
      const dots = KEYS.map((k) => svg.querySelector<SVGCircleElement>(`[data-k="${k}"]`)!);
      const lines = BONES.map((_, i) => svg.querySelector<SVGLineElement>(`[data-b="${i}"]`)!);
      const conf = root.current!.querySelector<HTMLElement>("[data-conf]")!;
      const state = { t: 0 };
      const draw = () => {
        const pos: Record<string, P> = {};
        for (const k of KEYS) {
          pos[k] = [DOWN[k][0] + (UP[k][0] - DOWN[k][0]) * state.t, DOWN[k][1] + (UP[k][1] - DOWN[k][1]) * state.t];
        }
        KEYS.forEach((k, i) => {
          dots[i].setAttribute("cx", pos[k][0].toFixed(2));
          dots[i].setAttribute("cy", pos[k][1].toFixed(2));
        });
        BONES.forEach(([a, b], i) => {
          lines[i].setAttribute("x1", pos[a][0].toFixed(2));
          lines[i].setAttribute("y1", pos[a][1].toFixed(2));
          lines[i].setAttribute("x2", pos[b][0].toFixed(2));
          lines[i].setAttribute("y2", pos[b][1].toFixed(2));
        });
        conf.textContent = (0.93 + Math.sin(state.t * Math.PI) * 0.05).toFixed(2);
      };
      draw();
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        pauseOffscreen(root.current, [
          gsap.to(state, { t: 1, duration: 0.42, ease: "power2.inOut", repeat: -1, yoyo: true, onUpdate: draw }),
          gsap.fromTo("[data-scanline]", { yPercent: -100 }, { yPercent: 900, duration: 2.6, ease: "none", repeat: -1 }),
        ]);
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]">
      {/* Bracket around the in-game runner */}
      <div className="absolute top-[57%] left-[46%] h-[27%] w-[8%]">
        {["top-0 left-0 border-t border-l", "top-0 right-0 border-t border-r", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map(
          (c) => (
            <span key={c} className={`absolute h-3 w-3 border-[#c8ff6a] ${c}`} />
          )
        )}
        <span className="absolute -top-6 left-0 font-mono text-[10px] whitespace-nowrap text-[#c8ff6a]">player 1</span>
      </div>

      {/* Picture-in-picture "camera" feed with the detected skeleton */}
      <div
        className="absolute top-[10%] right-[4%] w-[30%] min-w-[130px] overflow-hidden rounded-xl border border-white/15 bg-[#0d0f0c]/85 shadow-2xl backdrop-blur-sm"
        style={{ transform: "translateZ(60px)" }}
      >
        <div className="flex items-center justify-between px-3 pt-2.5 font-mono text-[10px] text-white/60">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a4a]" />
            camera
          </span>
          <span>
            pose <span data-conf className="text-[#c8ff6a] tabular-nums">0.97</span>
          </span>
        </div>
        <div className="relative px-3 pt-1 pb-3">
          <div className="relative overflow-hidden rounded-md bg-[radial-gradient(circle_at_50%_40%,#1d2419,#0b0d0a)]">
            <div data-scanline className="absolute inset-x-0 top-0 h-[12%] bg-gradient-to-b from-transparent via-[#c8ff6a]/15 to-transparent" />
            <svg viewBox="-5 -8 110 122" className="relative block w-full">
              {BONES.map((_, i) => (
                <line key={i} data-b={i} stroke="#c8ff6a" strokeOpacity={0.75} strokeWidth={2.2} strokeLinecap="round" />
              ))}
              {KEYS.map((k) => (
                <circle key={k} data-k={k} r={k === "head" ? 6 : 2.8} fill={k === "head" ? "none" : "#ffffff"} stroke="#c8ff6a" strokeWidth={k === "head" ? 2 : 1} />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
