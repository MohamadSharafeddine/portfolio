"use client";

import { useEffect, useState } from "react";
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

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        <a href="#hero" className="flex items-center gap-3 rounded-md" onClick={() => setIsMenuOpen(false)}>
          <Logo size={28} />
          <span className="text-[15px] font-medium tracking-tight text-fg">Mohamad Sharafeddine</span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm text-fg-2 transition-colors duration-150 hover:text-fg"
            >
              {item.text}
            </a>
          ))}
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
          {navItems.map((item) => (
            <li key={item.href} className="border-b border-line">
              <a
                href={item.href}
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={() => setIsMenuOpen(false)}
                className="flex h-14 items-center text-2xl font-medium tracking-tight text-fg"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
