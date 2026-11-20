"use client";

import { FC, ReactNode, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Section from "./Section";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiMongodb,
  SiPostgresql,
  SiSupabase,
  SiRedis,
  SiReact,
  SiNextdotjs,
  SiAngular,
  SiNodedotjs,
  SiExpress,
  SiDotnet,
  SiThreedotjs,
  SiTailwindcss,
  SiMapbox,
  SiDocker,
  SiAmazonwebservices,
  SiGooglegemini,
  SiClaude,
  SiGit,
  SiGithub,
  SiLinux,
  SiFigma,
  SiPostman,
} from "react-icons/si";
import { TbBrandCSharp, TbSql, TbRobot, TbPlugConnected, TbDatabaseSearch } from "react-icons/tb";
import { DiMsqlServer } from "react-icons/di";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Icons inherit currentColor, so the whole wall stays in one tone
const categories: { name: string; items: { name: string; icon: ReactNode }[] }[] = [
  {
    name: "Languages",
    items: [
      { name: "TypeScript", icon: <SiTypescript /> },
      { name: "JavaScript", icon: <SiJavascript /> },
      { name: "Python", icon: <SiPython /> },
      { name: "C#", icon: <TbBrandCSharp /> },
      { name: "SQL", icon: <TbSql /> },
    ],
  },
  {
    name: "Frameworks and libraries",
    items: [
      { name: "Next.js", icon: <SiNextdotjs /> },
      { name: "React", icon: <SiReact /> },
      { name: "Angular", icon: <SiAngular /> },
      { name: "Node.js", icon: <SiNodedotjs /> },
      { name: "Express", icon: <SiExpress /> },
      { name: ".NET", icon: <SiDotnet /> },
      { name: "Three.js", icon: <SiThreedotjs /> },
      { name: "Mapbox GL", icon: <SiMapbox /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss /> },
    ],
  },
  {
    name: "Cloud and databases",
    items: [
      { name: "AWS", icon: <SiAmazonwebservices /> },
      { name: "Supabase", icon: <SiSupabase /> },
      { name: "PostgreSQL", icon: <SiPostgresql /> },
      { name: "SQL Server", icon: <DiMsqlServer /> },
      { name: "MongoDB", icon: <SiMongodb /> },
      { name: "Redis", icon: <SiRedis /> },
      { name: "Docker", icon: <SiDocker /> },
    ],
  },
  {
    name: "AI and LLMs",
    items: [
      { name: "Agentic workflows", icon: <TbRobot /> },
      { name: "Gemini / Vertex AI", icon: <SiGooglegemini /> },
      { name: "Claude Code", icon: <SiClaude /> },
      { name: "MCP", icon: <TbPlugConnected /> },
      { name: "RAG", icon: <TbDatabaseSearch /> },
    ],
  },
  {
    name: "Tools and environment",
    items: [
      { name: "Git", icon: <SiGit /> },
      { name: "GitHub", icon: <SiGithub /> },
      { name: "WSL / Linux", icon: <SiLinux /> },
      { name: "Postman", icon: <SiPostman /> },
      { name: "Figma", icon: <SiFigma /> },
    ],
  },
];

const n = categories.length;

function LayerStack({ active }: { active: number }) {
  return (
    <div className="relative h-[340px] [perspective:1400px] sm:h-[460px] xl:h-[560px]" aria-hidden>
      <div
        data-stage
        className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
        style={{ ["--gap" as string]: "56px", transform: "rotateX(58deg) rotateZ(-40deg)" }}
      >
        {categories.map((cat, idx) => {
          const i = n - 1 - idx; // first category sits on top
          const isActive = idx === active;
          return (
            <div
              key={cat.name}
              className={`absolute top-0 left-0 h-[190px] w-[190px] rounded-2xl border p-4 transition-[transform,border-color,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-[250px] sm:w-[250px] xl:h-[300px] xl:w-[300px] ${
                isActive
                  ? "border-accent bg-surface/95 shadow-[0_30px_70px_-20px_rgba(220,226,240,0.35)]"
                  : "border-line-strong bg-surface/70"
              }`}
              style={{
                transform: `translate(-50%, -50%) translateZ(calc(${i} * var(--gap) - 2 * var(--gap) + ${isActive ? 36 : 0}px))`,
              }}
            >
              <p className={`font-mono text-[11px] ${isActive ? "text-accent-ink" : "text-fg-3"}`}>
                L{String(idx + 1).padStart(2, "0")}
              </p>
              <div className="mt-3 grid grid-cols-5 gap-1.5">
                {cat.items.map((s) => (
                  <span
                    key={s.name}
                    className={`aspect-square rounded-[3px] transition-colors duration-500 ${
                      isActive ? "bg-accent" : "bg-fg/15"
                    }`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const Skills: FC = () => {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-stage]",
          { "--gap": "8px", rotationX: 64, rotation: -52 },
          {
            "--gap": "64px",
            rotationX: 56,
            rotation: -32,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top 85%", end: "center 40%", scrub: 0.6 },
          }
        );
      });
      // While scrolling, the row nearest the middle of the screen drives the stack
      gsap.utils.toArray<HTMLElement>("[data-category]").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
    },
    { scope: root }
  );

  return (
    <Section id="skills" layer={3} title="Skills" comment="five layers, one model">
      <div ref={root} className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <LayerStack active={active} />
          <p className="mt-2 text-center font-mono text-[12px] text-fg-3">
            Layer {String(active + 1).padStart(2, "0")} · <span className="text-fg">{categories[active].name}</span>
          </p>
        </div>

        <ol className="divide-y divide-line border-y border-line">
          {categories.map((cat, i) => (
            <li
              key={cat.name}
              data-category
              data-reveal
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="py-8"
            >
              <div className="flex items-baseline gap-4">
                <span
                  className={`font-mono text-[12px] tabular-nums transition-colors duration-300 ${
                    i === active ? "text-accent-ink" : "text-fg-3"
                  }`}
                >
                  L{String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className={`text-2xl font-medium tracking-[-0.02em] transition-colors duration-300 ${
                    i === active ? "text-fg" : "text-fg-2"
                  }`}
                >
                  {cat.name}
                </h3>
                <span className="ml-auto font-mono text-[12px] text-fg-3 tabular-nums">{cat.items.length}</span>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2 pl-10">
                {cat.items.map(({ name, icon }) => (
                  <li
                    key={name}
                    className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-sm transition-colors duration-300 ${
                      i === active ? "border-line-strong bg-surface text-fg" : "border-line bg-transparent text-fg-2"
                    }`}
                  >
                    <span
                      className={`flex w-4 justify-center text-base transition-colors duration-300 ${
                        i === active ? "text-accent-ink" : "text-fg-3"
                      }`}
                      aria-hidden
                    >
                      {icon}
                    </span>
                    {name}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
};

export default Skills;
