"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { pauseOffscreen } from "@/lib/pauseOffscreen";

gsap.registerPlugin(useGSAP);

const AXES = ["Attention", "Memory", "Reasoning", "Social", "Emotional"];
// Two illustrative student profiles the chart morphs between
const PROFILES = [
  [0.82, 0.6, 0.74, 0.45, 0.68],
  [0.55, 0.85, 0.5, 0.78, 0.62],
];
const C = 100;
const R = 70;

const pt = (i: number, v: number) => {
  const a = -Math.PI / 2 + (i / AXES.length) * Math.PI * 2;
  return [C + Math.cos(a) * R * v, C + Math.sin(a) * R * v] as const;
};
const poly = (vals: number[]) => vals.map((v, i) => pt(i, v).join(",")).join(" ");

export default function RadarOverlay() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const shape = root.current!.querySelector<SVGPolygonElement>("[data-shape]")!;
      const dots = Array.from(root.current!.querySelectorAll<SVGCircleElement>("[data-dot]"));
      const label = root.current!.querySelector<HTMLElement>("[data-student]")!;
      const state = { t: 0 };
      const draw = () => {
        const vals = PROFILES[0].map((a, i) => a + (PROFILES[1][i] - a) * state.t);
        shape.setAttribute("points", poly(vals));
        dots.forEach((d, i) => {
          const [x, y] = pt(i, vals[i]);
          d.setAttribute("cx", x.toFixed(2));
          d.setAttribute("cy", y.toFixed(2));
        });
        label.textContent = state.t < 0.5 ? "Student A" : "Student B";
      };
      draw();
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        pauseOffscreen(root.current, [
          gsap.to(state, { t: 1, duration: 1.4, ease: "power3.inOut", repeat: -1, yoyo: true, repeatDelay: 1.4, onUpdate: draw }),
        ]);
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]">
      <div
        className="absolute bottom-[8%] left-[4%] w-[40%] min-w-[170px] rounded-xl border border-white/15 bg-[#0a1220]/80 p-3 shadow-2xl backdrop-blur-sm"
        style={{ transform: "translateZ(60px)" }}
      >
        <div className="flex items-center justify-between gap-2 font-mono text-[10px] whitespace-nowrap text-white/60">
          <span>cognitive profile</span>
          <span data-student className="text-[#8cc8ff]">Student A</span>
        </div>
        <svg viewBox="-28 -6 256 212" className="mt-1 block w-full">
          {[0.25, 0.5, 0.75, 1].map((r) => (
            <polygon key={r} points={poly(AXES.map(() => r))} fill="none" stroke="#ffffff" strokeOpacity={0.12} />
          ))}
          {AXES.map((a, i) => {
            const [x, y] = pt(i, 1);
            const [lx, ly] = pt(i, 1.24);
            return (
              <g key={a}>
                <line x1={C} y1={C} x2={x} y2={y} stroke="#ffffff" strokeOpacity={0.12} />
                <text x={lx} y={ly} fill="#ffffff" fillOpacity={0.55} fontSize={10} textAnchor="middle" dominantBaseline="middle" className="font-mono">
                  {a}
                </text>
              </g>
            );
          })}
          <polygon data-shape fill="#5fb0ff" fillOpacity={0.22} stroke="#8cc8ff" strokeWidth={1.6} strokeLinejoin="round" />
          {AXES.map((a) => (
            <circle key={a} data-dot r={3} fill="#ffffff" />
          ))}
        </svg>
      </div>
    </div>
  );
}
