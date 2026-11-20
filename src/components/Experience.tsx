"use client";

import { FC, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Section from "./Section";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Role {
  company: string;
  title: string;
  start: string;
  end: string;
  points: string[];
  stats?: { value: string; label: string }[];
}

const roles: Role[] = [
  {
    company: "Freelance",
    title: "Software Engineer",
    start: "Oct 2025",
    end: "Present",
    points: [
      "Built agentic AI systems and LLM-powered pipelines that automate analysis and decision-making.",
      "Developed interactive dashboards and data visualizations using modern TypeScript frameworks and WebGL.",
      "Built an LLM-powered knowledge engine that turns technical documents into a searchable, cited wiki.",
      "Delivered secure authentication, real-time data integrations, and third-party API connections.",
    ],
  },
  {
    company: "Remote Digital",
    title: "Software Engineer",
    start: "Dec 2025",
    end: "Present",
    stats: [
      { value: "−60%", label: "slicing run time" },
      { value: "−92%", label: "peak memory" },
      { value: "1 px", label: "match to reference G-code" },
    ],
    points: [
      "Architected a cloud slicing engine for medical devices, turning patient scans into print-ready jobs.",
      "Developed custom G-code for medical-grade SLA printers, matching reference output within 1 px.",
      "Re-engineered the slicing pipeline, cutting run time by up to 60% and peak memory by up to 92%.",
      "Built in-browser 3D editing tools using Three.js, including cutting, hollowing, and engraving.",
      "Managed cross-platform development using Windows/WSL 2 and deployed slicing pipelines to AWS.",
    ],
  },
  {
    company: "Remote Digital",
    title: "Full-Stack Developer Intern",
    start: "Sep 2025",
    end: "Dec 2025",
    points: [
      "Built a browser-based 3D slicer MVP using Three.js for mesh visualization and parsing.",
      "Translated resin material requirements into functional layer-processing logic.",
    ],
  },
];

// A stable, git-looking short hash per role (decorative)
function commitHash(role: Role) {
  let h = 2166136261;
  for (const c of role.company + role.title + role.start) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

const Experience: FC = () => {
  const root = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const trigger = { trigger: root.current, start: "top 60%", end: "bottom 60%", scrub: 0.4 };
        gsap.fromTo("[data-path-fill]", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: trigger });
        gsap.fromTo("[data-nozzle]", { top: "0%" }, { top: "100%", ease: "none", scrollTrigger: trigger });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-path-fill]", { scaleY: 1 });
        gsap.set("[data-nozzle]", { autoAlpha: 0 });
      });
      gsap.utils.toArray<HTMLElement>("[data-role]").forEach((el) => {
        ScrollTrigger.create({ trigger: el, start: "top 60%", toggleClass: { targets: el, className: "is-reached" } });
      });
    },
    { scope: root }
  );

  return (
    <Section id="experience" layer={2} title="Experience" comment="git log --graph">
      <ol ref={root} className="relative pl-10 sm:pl-16">
        {/* Commit graph: the branch line fills as you scroll, and a HEAD marker rides its tip */}
        <div className="absolute top-2 bottom-2 left-[7px] w-px bg-line-strong" aria-hidden>
          <div data-path-fill className="absolute inset-0 origin-top bg-gradient-to-b from-fg via-fg-2 to-fg" />
          <div data-nozzle className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="block h-2.5 w-2.5 rounded-full bg-fg shadow-[0_0_12px_3px_rgba(255,255,255,0.45)]" />
          </div>
        </div>

        {roles.map((role, i) => {
          const current = role.end === "Present";
          return (
            <li key={`${role.company}-${role.title}`} data-role className="group relative pb-20 last:pb-0">
              <span
                className="absolute top-[3px] -left-10 h-[15px] w-[15px] rounded-full border-2 border-line-strong bg-bg transition-[background-color,border-color] duration-300 group-[.is-reached]:border-fg group-[.is-reached]:bg-fg sm:-left-16"
                aria-hidden
              />
              <p data-reveal className="font-mono text-[12px] text-fg-3">
                <span className="text-fg-2">{commitHash(role)}</span>
                {i === 0 && <span className="ml-2 text-fg">(HEAD → main)</span>}
                <span className="ml-2">{current ? "ongoing" : "merged"}</span>
              </p>
              <div data-reveal className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
                <h3 className="text-[clamp(26px,3vw,40px)] leading-[1.1] font-medium tracking-[-0.03em] text-fg">
                  {role.title}
                  <span className="text-fg-3"> · {role.company}</span>
                </h3>
                <p className="flex shrink-0 items-center gap-2 font-mono text-[13px] text-fg-2 tabular-nums">
                  {current && <span className="h-1.5 w-1.5 rounded-full bg-fg shadow-[0_0_8px_rgba(255,255,255,0.6)]" aria-hidden />}
                  {role.start} – {role.end}
                </p>
              </div>

              {role.stats && (
                <dl data-reveal className="mt-8 grid max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-line bg-line">
                  {role.stats.map((s) => (
                    <div key={s.label} className="flex flex-col bg-surface p-4 sm:p-6">
                      <dt className="order-2 mt-2 text-[13px] text-fg-3">{s.label}</dt>
                      <dd className="text-[clamp(26px,3.4vw,44px)] leading-none font-medium tracking-[-0.03em] text-fg tabular-nums">
                        {s.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              <ul data-reveal className="mt-8 grid max-w-4xl gap-x-10 gap-y-3 text-[15px] leading-[1.65] text-fg-2 md:grid-cols-2">
                {role.points.map((point) => (
                  <li key={point} className="grid grid-cols-[18px_minmax(0,1fr)]">
                    <span className="font-mono text-fg-3" aria-hidden>
                      ›
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </Section>
  );
};

export default Experience;
