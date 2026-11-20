"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { BuildHud, Framing } from "./three/ChromeLogo";
import personalImage from "../../public/Personal-Image.png";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// WebGL only runs in the browser, and keeping three.js out of the first chunk keeps the page fast
const ChromeLogo = dynamic(() => import("./three/ChromeLogo"), { ssr: false });

// The canvas shares the figure's box with the portrait, so these are relative to the portrait:
// the monogram is centered on it and sits behind the head and shoulders (head spans ~5-35% of the box).
// Desktop: a large monogram whose letters flank the head and shoulders. Phones: smaller, so it stays on screen.
const FIGURE_DESKTOP: Framing = { x: 0.5, y: 0.42, fill: 0.78, maxW: 0.95 };
const FIGURE_PHONE: Framing = { x: 0.5, y: 0.37, fill: 0.5, maxW: 0.9 };

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const hud = useRef<BuildHud>({ step: null, percent: null, bar: null, status: null });
  const [isDesktop, setIsDesktop] = useState(false);

  // Matches Tailwind's lg breakpoint, where the figure moves to the right column
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const framing = isDesktop ? FIGURE_DESKTOP : FIGURE_PHONE;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-hero-item='name']", { autoAlpha: 1 });
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.fromTo("[data-hero-item='stage']", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.4 }, 0)
          .fromTo(
            "[data-hero-item='portrait']",
            { autoAlpha: 0, y: 40, filter: "brightness(0.2)" },
            { autoAlpha: 1, y: 0, filter: "brightness(1)", duration: 1.6 },
            0.1
          )
          .fromTo("[data-hero-line]", { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.1 }, 0.25)
          .fromTo(
            "[data-hero-item='text']",
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08 },
            0.55
          );
        // The portrait drifts up a little and the stage darkens as the hero scrolls away
        gsap.to("[data-hero-item='portrait']", {
          yPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="hero"
      data-theme="dark"
      className="relative isolate overflow-hidden bg-[#050506] text-fg"
    >
      {/* Spotlight and floor glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
        style={{
          background:
            "radial-gradient(55% 60% at 72% 42%, #1e1f24 0%, rgba(5,5,6,0) 70%), radial-gradient(40% 25% at 66% 100%, #15161a 0%, rgba(5,5,6,0) 100%)",
        }}
      />
      {/* Phones: the spotlight sits behind the head and has fallen off to black before the copy starts */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[min(58svh,520px)] lg:hidden"
        style={{ background: "radial-gradient(70% 55% at 50% 30%, #1c1d21 0%, rgba(5,5,6,0) 100%)" }}
      />

      {/* Figure: monogram + portrait locked in one box, sized by viewport height.
          Phones: top of the screen, poster style. Desktop: centered on the right column, standing on the floor. */}
      <div
        className="pointer-events-none absolute top-16 left-1/2 aspect-[4/3] h-[min(48svh,440px)] -translate-x-1/2 lg:top-auto lg:bottom-0 lg:left-[calc(50%+min(1320px,100vw)/4)] lg:h-[min(92svh,1000px)]"
      >
        <div data-hero-item="stage" className="absolute inset-0">
          <ChromeLogo hud={hud} wide={framing} tall={framing} />
        </div>
        <div
          data-hero-item="portrait"
          className="absolute inset-x-0 bottom-0 mx-auto aspect-[3/4] h-full"
          style={{ filter: "drop-shadow(0 0 40px rgba(0,0,0,0.85))" }}
        >
          <Image
            src={personalImage}
            alt="Portrait of Mohamad Sharafeddine"
            fill
            priority
            quality={90}
            sizes="(min-width: 1024px) 750px, 80vw"
            className="object-contain object-bottom"
          />
        </div>
        {/* Phones: the chest fades into black so the name can start on it */}
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#050506] via-[#050506]/80 to-transparent lg:hidden" />

        {/* Generation readout (desktop) */}
        <div
          data-hero-item="text"
          className="absolute bottom-10 left-[2%] z-10 hidden w-[200px] font-mono text-[11px] text-fg-3 lg:block"
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-fg-2">
              <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span ref={(el) => void (hud.current.status = el)}>Generating</span>
            </span>
            <span ref={(el) => void (hud.current.percent = el)} className="tabular-nums">
              0%
            </span>
          </div>
          <div className="mt-2 h-px overflow-hidden bg-white/10">
            <div ref={(el) => void (hud.current.bar = el)} className="h-full origin-left scale-x-0 bg-white/80" />
          </div>
          <p className="mt-2">
            ms-logo · step{" "}
            <span ref={(el) => void (hud.current.step = el)} className="text-fg-2 tabular-nums">
              000
            </span>{" "}
            / 480
          </p>
        </div>
      </div>

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1320px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Copy */}
        <div className="relative z-20 flex flex-col justify-center px-6 pt-[calc(64px+min(48svh,440px)*0.8)] pb-16 lg:px-8 lg:pt-16 lg:pb-16">
          <p data-hero-item="text" className="flex items-center gap-3 font-mono text-[13px] text-fg-3">
            <span className="inline-block h-px w-8 bg-gradient-to-r from-white/80 to-white/10" aria-hidden />
            Software Engineer · AI systems
          </p>
          <h1
            data-hero-item="name"
            className="mt-5 text-[clamp(46px,5.6vw,88px)] lg:mt-6 leading-[0.9] font-medium tracking-[-0.05em]"
          >
            <span className="block overflow-x-visible overflow-y-clip pb-[0.08em]">
              <span data-hero-line className="chrome-text block">
                Mohamad
              </span>
            </span>
            <span className="block overflow-x-visible overflow-y-clip pb-[0.08em]">
              <span data-hero-line className="chrome-text block">
                Sharafeddine
              </span>
            </span>
          </h1>
          <p data-hero-item="text" className="mt-6 max-w-[31rem] text-[17px] leading-[1.6] text-fg-2 lg:mt-8 lg:text-xl lg:leading-[1.55]">
            I build AI systems that do real work: agentic workflows, LLM pipelines, and the full-stack and 3D software
            around them. A background in psychology keeps the people using them in view.
          </p>
          <div data-hero-item="text" className="mt-8 flex flex-wrap items-center gap-3 lg:mt-10">
            <a
              href="#projects"
              className="btn-metal inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-medium transition-[background,transform] duration-150 active:scale-[0.98]"
            >
              See my work
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center rounded-full border border-line-strong px-6 text-[15px] font-medium text-fg transition-[background-color,border-color,transform] duration-150 hover:border-white/40 hover:bg-white/5 active:scale-[0.98]"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>

      {/* Fade the bottom edge so the portrait settles into the floor */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-[#050506] to-transparent" />
    </section>
  );
}
