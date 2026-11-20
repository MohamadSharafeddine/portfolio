"use client";

import { FC, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Section from "./Section";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const EMAIL = "mhsharafeddine@gmail.com";

const profiles = [
  { name: "GitHub", handle: "MohamadSharafeddine", href: "https://github.com/MohamadSharafeddine", icon: SiGithub },
  {
    name: "LinkedIn",
    handle: "mohamad-sharafeddine",
    href: "https://www.linkedin.com/in/mohamad-sharafeddine/",
    icon: SiLinkedin,
  },
];

// [prompt, text, status]
const RUN: [string, string, string][] = [
  ["$", "agent run reach-out --to mohamad", ""],
  ["›", "parsing intent", "ok"],
  ["›", "matching skills to project", "ok"],
  ["›", "drafting a reply", "ok"],
  ["✓", "ready. say hi →", ""],
];

const Contact: FC = () => {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
        tl.fromTo("[data-gline]", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.45, ease: "steps(18)", stagger: 0.35 })
          .fromTo("[data-ready]", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power4.out" }, "-=0.1");
      });
    },
    { scope: root }
  );

  return (
    <Section id="contact" layer={5} title="Contact" comment="open a thread">
      <div ref={root} className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div
          data-theme="dark"
          className="self-start rounded-[20px] border border-line bg-plate p-6 font-mono text-[13px] leading-7 text-fg-3 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]"
          style={{ backgroundImage: "linear-gradient(180deg, #121215 0%, #050506 100%)" }}
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="ml-3 text-[12px]">~/portfolio — zsh</span>
          </div>
          {RUN.map(([prompt, text, status]) => (
            <p key={text} data-gline className="flex gap-3 whitespace-nowrap">
              <span className={prompt === "✓" ? "text-fg" : "text-fg-3"}>{prompt}</span>
              <span className={prompt === "$" || prompt === "✓" ? "text-fg" : ""}>{text}</span>
              {status && (
                <>
                  <span className="mb-2 min-w-6 flex-1 border-b border-dotted border-fg-3/50" aria-hidden />
                  <span className="text-fg-2">{status}</span>
                </>
              )}
            </p>
          ))}
          <p className="mt-1">
            <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-fg motion-reduce:animate-none" />
          </p>
        </div>

        <div data-ready>
          <p className="text-[clamp(28px,3.4vw,44px)] leading-[1.15] tracking-[-0.03em] text-fg">
            Have something that needs building? <span className="text-fg-3">Email is the quickest way to reach me.</span>
          </p>
          <a
            href={`mailto:${EMAIL}`}
            // A web mail handler (e.g. Gmail set as the browser's mailto handler) opens in a new tab
            // instead of replacing the portfolio. Mail apps open as usual.
            target="_blank"
            rel="noopener noreferrer"
            className="btn-metal group mt-10 inline-flex max-w-full items-center gap-3 rounded-full px-7 py-5 text-[clamp(17px,2.2vw,28px)] font-medium tracking-[-0.02em] break-all transition-[background,transform] duration-150 active:scale-[0.99]"
          >
            {EMAIL}
            <ArrowUpRightIcon className="h-6 w-6 shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
          <ul className="mt-10 max-w-[30rem] divide-y divide-line border-y border-line">
            {profiles.map(({ name, handle, href, icon: Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-14 items-center gap-3 text-[15px] text-fg"
                >
                  <Icon className="h-[18px] w-[18px] text-fg-3 transition-colors duration-150 group-hover:text-fg" aria-hidden />
                  <span className="w-24">{name}</span>
                  <span className="truncate font-mono text-[13px] text-fg-3">{handle}</span>
                  <ArrowUpRightIcon className="ml-auto h-4 w-4 shrink-0 text-fg-3 transition-[transform,color] duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};

export default Contact;
