"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { useTheme } from "@/contexts/ThemeContext";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const navItems = [
  { href: "#about", text: "About Me", type: "link" },
  { href: "#skills", text: "Skills", type: "link" },
  { href: "#projects", text: "Projects", type: "link" },
  { href: "#contact", text: "Contact Me", type: "link" },
  { type: "theme" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero");
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        const scrollPosition = window.scrollY;

        if (scrollPosition >= heroHeight && !isFixed) {
          setIsFixed(true);
        } else if (scrollPosition < heroHeight && isFixed) {
          setIsFixed(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isFixed]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (!href?.startsWith("#")) return;

    const section = document.querySelector(href);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navClasses = `absolute top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
    isFixed ? "fixed shadow-md" : ""
  }`;
  
  const navBackgroundClass = isFixed ? "bg-black" : "";

  const linkClasses = `text-white font-medium hover:text-gray-50 hover:font-semibold transition-all duration-200`;
  const mobileLinkClasses = `text-white font-medium text-xl hover:text-gray-50 hover:font-semibold transition-all duration-200`;
  const burgerBarClasses = `w-6 h-0.5 bg-white mb-1.5 transition-all duration-300`;

  return (
    <nav className={`${navClasses} ${navBackgroundClass}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="w-1/2" onClick={scrollToTop}>
            <Logo isFixed={isFixed} onClick={scrollToTop} />
          </div>

          <button
            className="lg:hidden z-50 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div
              className={`${burgerBarClasses} ${
                isMenuOpen ? "transform rotate-45 translate-y-2" : ""
              }`}
            />
            <div
              className={`${burgerBarClasses} ${isMenuOpen ? "opacity-0" : ""}`}
            />
            <div
              className={`${burgerBarClasses} ${
                isMenuOpen ? "transform -rotate-45 -translate-y-2" : ""
              }`}
            />
            </button>

          <div
            className={`lg:hidden fixed inset-0 bg-black transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {navItems.map((item) => {
                if (item.type === "link" && item.href) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={scrollToSection}
                      className={mobileLinkClasses}
                    >
                      {item.text}
                    </Link>
                  );
                } else if (item.type === "theme") {
                  return (
                    <button
                      key="theme"
                      onClick={toggleTheme}
                      className={`${mobileLinkClasses} flex items-center justify-center cursor-pointer`}
                      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                    >
                      {theme === "light" ? (
                        <MoonIcon className="w-6 h-6 hover:w-7 hover:h-7 transition-all duration-200" />
                      ) : (
                        <SunIcon className="w-6 h-6 hover:w-7 hover:h-7 transition-all duration-200" />
                      )}
                    </button>
                  );
                }
                return null;
              })}
            </div>
          </div>

          <div className="hidden lg:flex w-1/2 justify-between items-center px-16">
            {navItems.map((item) => {
              if (item.type === "link" && item.href) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={scrollToSection}
                    className={linkClasses}
                  >
                    {item.text}
                  </Link>
                );
              } else if (item.type === "theme") {
                return (
                  <button
                    key="theme"
                    onClick={toggleTheme}
                    className={`${linkClasses} flex items-center justify-center cursor-pointer`}
                    aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                  >
                    {theme === "light" ? (
                      <MoonIcon className="w-5 h-5 hover:w-6 hover:h-6 transition-all duration-200" />
                    ) : (
                      <SunIcon className="w-5 h-5 hover:w-6 hover:h-6 transition-all duration-200" />
                    )}
                  </button>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
