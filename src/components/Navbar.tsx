"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";

const navLinks = [
  { href: "#about", text: "About Me" },
  { href: "#skills", text: "Skills" },
  { href: "#projects", text: "Projects" },
  { href: "#contact", text: "Contact Me" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);

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
    isFixed ? "fixed bg-black shadow-md" : ""
  }`;

  const linkClasses = `text-gray-100 font-medium hover:text-gray-50 hover:font-semibold`;
  const mobileLinkClasses = `text-gray-100 font-medium text-xl hover:text-gray-50 hover:font-semibold`;
  const burgerBarClasses = `w-6 h-0.5 bg-white mb-1.5 transition-all duration-300`;

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="w-1/2" onClick={scrollToTop}>
            <Logo isFixed={isFixed} onClick={scrollToTop} />
          </div>

          <button
            className="md:hidden z-50 p-2"
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
            className={`md:hidden fixed inset-0 bg-black/90 transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {navLinks.map(({ href, text }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={scrollToSection}
                  className={mobileLinkClasses}
                >
                  {text}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex w-1/2 justify-between items-center px-16">
            {navLinks.map(({ href, text }) => (
              <Link
                key={href}
                href={href}
                onClick={scrollToSection}
                className={linkClasses}
              >
                {text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
