"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

gsap.registerPlugin(useGSAP);

interface ProjectCardProps {
  index: number;
  title: string;
  description: string;
  link?: string;
  image: string;
  tags: string[];
  status?: string;
  /** Themed animated layer drawn over the screenshot */
  overlay?: React.ReactNode;
  flip?: boolean;
}

export default function ProjectCard({ index, title, description, link, image, tags, status, overlay, flip }: ProjectCardProps) {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);

  // Tilt the stage toward the pointer; overlays sit forward in Z so they parallax over the screenshot
  const { contextSafe } = useGSAP({ scope: root });
  const onMove = contextSafe((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card.current, { rotationY: x * 10, rotationX: -y * 8, duration: 0.6, ease: "power3.out", overwrite: "auto" });
    card.current?.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
    card.current?.style.setProperty("--my", `${(y + 0.5) * 100}%`);
  });
  const onLeave = contextSafe(() => {
    gsap.to(card.current, { rotationY: 0, rotationX: 0, duration: 0.9, ease: "elastic.out(1, 0.6)", overwrite: "auto" });
  });

  return (
    <article
      ref={root}
      className={`grid items-center gap-10 lg:gap-16 ${
        flip ? "lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]" : "lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]"
      }`}
    >
      <div data-reveal className={`[perspective:1400px] ${flip ? "lg:order-2" : ""}`} onPointerMove={onMove} onPointerLeave={onLeave}>
        <div
          ref={card}
          className="group/stage relative aspect-[16/10] rounded-[20px] border border-line bg-raised shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)] [transform-style:preserve-3d]"
        >
          <div className="absolute inset-0 overflow-hidden rounded-[20px]">
            <Image
              src={image}
              alt={`${title} screenshot`}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 760px, 100vw"
            />
            <div className="absolute inset-0 bg-[radial-gradient(500px_circle_at_var(--mx,50%)_var(--my,50%),rgba(255,255,255,0.14),transparent_60%)] opacity-0 transition-opacity duration-300 group-hover/stage:opacity-100" />
          </div>
          {overlay}
        </div>
      </div>

      <div data-reveal className={flip ? "lg:order-1" : ""}>
        <div className="flex items-center gap-3 font-mono text-[12px] text-fg-3">
          <span className="text-accent-ink tabular-nums">P{String(index).padStart(2, "0")}</span>
          <span className="h-px w-8 bg-line-strong" aria-hidden />
          {status && <span>{status}</span>}
        </div>
        <h3 className="mt-5 text-[clamp(34px,4vw,56px)] leading-[1] font-medium tracking-[-0.04em] text-fg">{title}</h3>
        <p className="mt-5 text-lg leading-[1.6] text-fg-2">{description}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t} className="rounded-md border border-line px-2.5 py-1 font-mono text-[12px] text-fg-2">
              {t}
            </li>
          ))}
        </ul>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4 text-[15px] font-medium text-fg transition-colors duration-150 hover:border-accent hover:bg-raised"
          >
            View project
            <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        )}
      </div>
    </article>
  );
}
