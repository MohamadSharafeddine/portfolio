"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// An attention head from where I started to what I build: each query token attends to the keys it shaped
const QUERIES = ["people", "cognition", "behavior", "empathy", "psychology"];
const KEYS = ["products", "LLMs", "agents", "interfaces", "software"];
const WEIGHTS = [
  [0.85, 0.1, 0.2, 0.55, 0.3],
  [0.15, 0.9, 0.45, 0.1, 0.25],
  [0.2, 0.35, 0.9, 0.3, 0.15],
  [0.6, 0.1, 0.15, 0.85, 0.2],
  [0.4, 0.45, 0.4, 0.35, 0.9],
];

const W = 420;
const H = 460;
const X0 = 150;
const X1 = 270;
const STEP_SECONDS = 2.2;
const RESUME_SECONDS = 1.6; // after the mouse leaves a word
const TAP_RESUME_SECONDS = 3; // after a tap, click or keyboard focus (there is no "leave" to wait for)
const rowY = (i: number) => 70 + i * 80;
const curve = (i: number, j: number) =>
  `M${X0},${rowY(i)} C${(X0 + X1) / 2},${rowY(i)} ${(X0 + X1) / 2},${rowY(j)} ${X1},${rowY(j)}`;

type Focus = { side: "q" | "k"; index: number };

/**
 * Fig. 01. Plays through the query tokens on its own; hovering, tapping or focusing a token on
 * either side takes over (queries show what they attend to, keys show what attends to them),
 * and autoplay resumes shortly after. Every edge stays faintly visible, so the whole web reads at a glance.
 */
export default function AttentionMap() {
  const root = useRef<HTMLDivElement>(null);
  const api = useRef<{ hoverStart: (f: Focus) => void; hoverEnd: () => void; select: (f: Focus) => void } | null>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current!;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const dur = reduce ? 0 : 0.5;
      const q$ = (sel: string) => el.querySelectorAll(sel);

      const setWeightLabels = (labels: (number | null)[], side: "q" | "k") => {
        q$(`[data-${side}weight]`).forEach((node, i) => {
          const w = labels[i];
          node.textContent = w === null ? "" : w.toFixed(2);
        });
        // Only the side being read shows numbers
        gsap.to(q$(`[data-${side === "q" ? "k" : "q"}weight]`), { opacity: 0, duration: dur });
        gsap.to(q$(`[data-${side}weight]`), { opacity: 1, duration: dur });
      };

      // Header readout: makes it obvious whether the figure is playing itself or being explored
      const statusMode = el.querySelector<HTMLElement>("[data-status-mode]");
      const statusWord = el.querySelector<HTMLElement>("[data-status-word]");
      const setStatus = (mode: "auto" | "user", word: string) => {
        if (statusMode) {
          statusMode.textContent = mode === "auto" ? "▸ auto" : "● exploring";
          statusMode.style.color = mode === "auto" ? "" : "#ececf0";
        }
        if (statusWord) statusWord.textContent = word;
      };

      const focus = ({ side, index }: Focus, mode: "auto" | "user" = "auto") => {
        setStatus(mode, side === "q" ? QUERIES[index] : KEYS[index]);
        gsap.to(q$("[data-edge]"), { opacity: 0.06, strokeWidth: 1, duration: dur, overwrite: "auto" });
        gsap.to(q$("[data-qpill], [data-kpill]"), { opacity: 0, duration: dur, overwrite: "auto" });
        gsap.to(q$(`[data-${side}pill="${index}"]`), { opacity: 1, duration: dur, overwrite: "auto" });

        if (side === "q") {
          const row = WEIGHTS[index];
          gsap.to(q$("[data-qtoken]"), { opacity: 0.4, duration: dur, overwrite: "auto" });
          gsap.to(q$(`[data-qtoken="${index}"]`), { opacity: 1, duration: dur, overwrite: "auto" });
          row.forEach((w, k) => {
            gsap.to(q$(`[data-q="${index}"][data-k="${k}"]`), { opacity: 0.15 + w * 0.85, strokeWidth: 0.6 + w * 3, duration: dur + 0.1, overwrite: "auto" });
            gsap.to(q$(`[data-ktoken="${k}"]`), { opacity: 0.35 + w * 0.65, duration: dur + 0.1, overwrite: "auto" });
          });
          setWeightLabels(row, "k");
        } else {
          const col = WEIGHTS.map((r) => r[index]);
          gsap.to(q$("[data-ktoken]"), { opacity: 0.4, duration: dur, overwrite: "auto" });
          gsap.to(q$(`[data-ktoken="${index}"]`), { opacity: 1, duration: dur, overwrite: "auto" });
          col.forEach((w, q) => {
            gsap.to(q$(`[data-q="${q}"][data-k="${index}"]`), { opacity: 0.15 + w * 0.85, strokeWidth: 0.6 + w * 3, duration: dur + 0.1, overwrite: "auto" });
            gsap.to(q$(`[data-qtoken="${q}"]`), { opacity: 0.35 + w * 0.65, duration: dur + 0.1, overwrite: "auto" });
          });
          setWeightLabels(col, "q");
        }
      };

      // ---- Autoplay: one query at a time, only while on screen and not being explored ----
      let next = 0;
      let onScreen = false;
      let userControl = false;
      let timer: gsap.core.Tween | null = null;
      const schedule = (delay: number) => {
        timer?.kill();
        if (reduce || !onScreen || userControl) return;
        timer = gsap.delayedCall(delay, () => {
          focus({ side: "q", index: next });
          next = (next + 1) % QUERIES.length;
          schedule(STEP_SECONDS);
        });
      };

      focus({ side: "q", index: 0 });
      next = 1;

      if (!reduce) {
        gsap.fromTo(
          q$("[data-edge]"),
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: "power2.out",
            stagger: 0.02,
            scrollTrigger: { trigger: el, start: "top 75%", once: true },
          }
        );
      } else {
        gsap.set(q$("[data-edge]"), { strokeDashoffset: 0 });
      }

      ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          onScreen = self.isActive;
          if (onScreen) schedule(STEP_SECONDS);
          else timer?.kill();
        },
      });

      // Interaction always ends in autoplay resuming: hovering holds the selection until the mouse
      // leaves; taps, clicks and keyboard focus hold it for a few seconds, restarted by each new one.
      let hovering = false;
      const take = (f: Focus) => {
        userControl = true;
        timer?.kill();
        focus(f, "user");
        if (f.side === "q") next = (f.index + 1) % QUERIES.length;
      };
      const resumeAfter = (delay: number) => {
        userControl = false;
        schedule(delay);
      };

      api.current = {
        hoverStart: contextSafe!((f: Focus) => {
          hovering = true;
          take(f);
        }),
        hoverEnd: contextSafe!(() => {
          hovering = false;
          resumeAfter(RESUME_SECONDS);
        }),
        select: contextSafe!((f: Focus) => {
          take(f);
          if (!hovering) resumeAfter(TAP_RESUME_SECONDS);
        }),
      };

      return () => timer?.kill();
    },
    { scope: root }
  );

  const tokenProps = (side: "q" | "k", index: number, label: string) => ({
    role: "button",
    tabIndex: 0,
    "aria-label": side === "q" ? `Show what “${label}” attends to` : `Show what attends to “${label}”`,
    className: "cursor-pointer outline-none [&:focus-visible_rect]:stroke-white",
    // Hover is mouse-only; on touch the tap arrives as focus + click, handled by `select`
    onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && api.current?.hoverStart({ side, index }),
    onPointerLeave: (e: React.PointerEvent) => e.pointerType === "mouse" && api.current?.hoverEnd(),
    onFocus: () => api.current?.select({ side, index }),
    onClick: () => api.current?.select({ side, index }),
  });

  return (
    <figure ref={root}>
      <div
        data-theme="dark"
        className="relative overflow-hidden rounded-[24px] border border-line bg-plate"
        style={{ backgroundImage: "radial-gradient(80% 60% at 50% 40%, #16171a 0%, #050506 75%)" }}
      >
        <div className="flex items-center justify-between gap-4 px-6 pt-5 font-mono text-[11px] text-fg-3">
          <span>layer 12 · head 3</span>
          <span aria-hidden className="flex items-center gap-1.5 whitespace-nowrap">
            <span data-status-mode>▸ auto</span>
            <span>·</span>
            <span data-status-word className="text-fg-2">people</span>
          </span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full select-none">
          <defs>
            {/* userSpaceOnUse: same-row edges are perfectly horizontal, and a bounding-box gradient
                on a zero-height path paints nothing */}
            <linearGradient id="edge" gradientUnits="userSpaceOnUse" x1={X0} y1={0} x2={X1} y2={0}>
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="1" stopColor="#9da1ab" />
            </linearGradient>
          </defs>
          <g aria-hidden>
            {QUERIES.map((_, q) =>
              KEYS.map((__, k) => (
                <path
                  key={`${q}-${k}`}
                  d={curve(q, k)}
                  data-edge
                  data-q={q}
                  data-k={k}
                  pathLength={1}
                  strokeDasharray="1 1"
                  fill="none"
                  stroke="url(#edge)"
                  strokeLinecap="round"
                  opacity={0.25}
                />
              ))
            )}
          </g>
          {QUERIES.map((t, q) => (
            <g key={t} {...tokenProps("q", q, t)}>
              {/* generous invisible hit area */}
              <rect x={0} y={rowY(q) - 30} width={X0 + 6} height={60} fill="transparent" />
              <rect
                data-qpill={q}
                x={30}
                y={rowY(q) - 15}
                width={X0 - 36}
                height={30}
                rx={15}
                fill="#ffffff"
                fillOpacity={0.08}
                stroke="#ffffff"
                strokeOpacity={0.3}
                opacity={0}
              />
              <text data-qtoken={q} x={X0 - 18} y={rowY(q)} textAnchor="end" dominantBaseline="middle" fill="#ececf0" fontSize={15} className="font-mono">
                {t}
              </text>
              <text data-qweight={q} x={X0 - 18} y={rowY(q) + 22} textAnchor="end" dominantBaseline="middle" fill="#7d7d86" fontSize={11} opacity={0} className="font-mono tabular-nums" />
              <circle cx={X0} cy={rowY(q)} r={3.5} fill="#ececf0" />
            </g>
          ))}
          {KEYS.map((t, k) => (
            <g key={t} {...tokenProps("k", k, t)}>
              <rect x={X1 - 6} y={rowY(k) - 30} width={W - X1 + 6} height={60} fill="transparent" />
              <rect
                data-kpill={k}
                x={X1 + 8}
                y={rowY(k) - 24}
                width={128}
                height={48}
                rx={14}
                fill="#ffffff"
                fillOpacity={0.08}
                stroke="#ffffff"
                strokeOpacity={0.3}
                opacity={0}
              />
              <circle cx={X1} cy={rowY(k)} r={3.5} fill="#ececf0" />
              <text data-ktoken={k} x={X1 + 18} y={rowY(k) - 6} dominantBaseline="middle" fill="#ececf0" fontSize={15} className="font-mono">
                {t}
              </text>
              <text data-kweight={k} x={X1 + 18} y={rowY(k) + 13} dominantBaseline="middle" fill="#7d7d86" fontSize={11} opacity={0} className="font-mono tabular-nums" />
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="mt-4 flex flex-wrap justify-between gap-x-6 gap-y-1 font-mono text-[12px] text-fg-3">
        <span>fig. 01: where I started, attending to what I build</span>
        <span className="text-fg-2">
          <span className="hidden [@media(hover:hover)]:inline">Hover</span>
          <span className="[@media(hover:hover)]:hidden">Tap</span> a word to explore
        </span>
      </figcaption>
    </figure>
  );
}
