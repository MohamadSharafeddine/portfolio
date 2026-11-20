"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Fades and lifts every [data-reveal] element inside it once, as it scrolls into view.
// Elements already on screen at load are left alone, so nothing visible ever flashes.
export default function Reveal({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils
          .toArray<HTMLElement>("[data-reveal]")
          .filter((el) => el.getBoundingClientRect().top > window.innerHeight);
        if (!items.length) return;

        gsap.set(items, { autoAlpha: 0, y: 12 });
        ScrollTrigger.batch(items, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
              stagger: 0.05,
              overwrite: true,
            }),
        });
      });
    },
    { scope: root }
  );

  return <div ref={root}>{children}</div>;
}
