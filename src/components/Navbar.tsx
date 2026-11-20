"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { useTheme } from "@/contexts/ThemeContext";
import { SunIcon, MoonIcon, Bars2Icon, XMarkIcon } from "@heroicons/react/24/outline";

// Each href must match a section id rendered in src/app/page.tsx
const navItems = [
  { href: "#about", text: "About" },
  { href: "#experience", text: "Experience" },
  { href: "#skills", text: "Skills" },
  { href: "#projects", text: "Projects" },
  { href: "#contact", text: "Contact" },
];

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-2 transition-colors duration-150 hover:bg-raised hover:text-fg cursor-pointer"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {/* site-dark, not dark: over the hero the bar is scoped dark, but the icon must show the site's theme */}
      <MoonIcon className="h-[18px] w-[18px] site-dark:hidden" />
      <SunIcon className="hidden h-[18px] w-[18px] site-dark:block" />
    </button>
  );
}

const NAV_HEIGHT = 64;
// Anchor links land a section exactly at the bar's edge. With browser zoom or display scaling that edge
// falls on fractional pixels (e.g. 64.4), so the threshold allows for rounding.
const EDGE_TOLERANCE = 4;

/**
 * One scroll tracker for everything the bar reacts to, so its cues start together.
 * - `scrolled`: the page has moved at all (the bar gets its solid background)
 * - `pastHero`: the hero has left the bar. Both the name and the section highlight start here; the hero
 *   already shows the name in large type, and nothing is "current" until you've entered a section.
 * - `active`: after that, the last section whose top has passed 40% of the viewport (or the last section
 *   at the page bottom, since Contact is shorter than the screen).
 */
function useScrollState(ids: string[]) {
  const [state, setState] = useState({ scrolled: false, pastHero: false, active: null as string | null });
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const hero = document.getElementById("hero");
      const pastHero = hero ? hero.getBoundingClientRect().bottom <= NAV_HEIGHT + EDGE_TOLERANCE : true;
      let active: string | null = null;
      if (pastHero) {
        const line = window.innerHeight * 0.4;
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= line) active = id;
        }
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        if (atBottom || !active) active = atBottom ? ids[ids.length - 1] : ids[0];
      }
      const scrolled = window.scrollY > 8;
      setState((prev) =>
        prev.scrolled === scrolled && prev.pastHero === pastHero && prev.active === active
          ? prev
          : { scrolled, pastHero, active }
      );
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [ids]);
  return state;
}

const SECTION_IDS = navItems.map((item) => item.href.slice(1));

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrolled: isScrolled, pastHero, active } = useScrollState(SECTION_IDS);

  // A single indicator line that slides under the active link
  const linksRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);
  const measure = useCallback(() => {
    const link = active ? linksRef.current?.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
    setIndicator(link ? { x: link.offsetLeft + 12, w: link.offsetWidth - 24 } : null);
  }, [active]);
  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    // Link widths change once the web font loads, and on resize
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  const solid = isScrolled || isMenuOpen;

  return (
    <header
      // Over the black hero the bar uses the dark tokens, whatever the site theme
      data-theme={solid ? undefined : "dark"}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
        solid ? "border-line bg-bg" : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-6 lg:px-8">
        <a
          href="#hero"
          aria-label="Mohamad Sharafeddine, back to top"
          className="flex items-center gap-3 rounded-md"
          onClick={() => setIsMenuOpen(false)}
        >
          <Logo size={28} />
          <span
            aria-hidden
            className={`text-[15px] font-medium tracking-tight text-fg transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              pastHero ? "translate-x-0 opacity-100" : "pointer-events-none -translate-x-1 opacity-0"
            }`}
          >
            Mohamad Sharafeddine
          </span>
        </a>

        <div ref={linksRef} className="relative hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive = active === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "location" : undefined}
                className={`rounded-lg px-3 py-2 text-sm transition-colors duration-200 hover:text-fg ${
                  isActive ? "text-fg" : "text-fg-2"
                }`}
              >
                {item.text}
              </a>
            );
          })}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-0.5 left-0 h-px origin-left bg-fg transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: 1,
              opacity: indicator ? 0.9 : 0,
              transform: indicator ? `translateX(${indicator.x}px) scaleX(${indicator.w})` : "translateX(0) scaleX(0)",
            }}
          />
          <div className="ml-2 h-5 w-px bg-line" aria-hidden />
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-fg transition-colors duration-150 hover:bg-raised cursor-pointer"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars2Icon className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-16 bottom-0 bg-bg px-6 transition-[opacity,transform] duration-200 ease-out lg:hidden ${
          isMenuOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <ul className="pt-4">
          {navItems.map((item) => {
            const isActive = active === item.href.slice(1);
            return (
              <li key={item.href} className="border-b border-line">
                <a
                  href={item.href}
                  tabIndex={isMenuOpen ? 0 : -1}
                  aria-current={isActive ? "location" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex h-14 items-center justify-between text-2xl font-medium tracking-tight ${
                    isActive || !active ? "text-fg" : "text-fg-2"
                  }`}
                >
                  {item.text}
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-fg" aria-hidden />}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
