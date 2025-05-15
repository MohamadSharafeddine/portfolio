"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="w-1/2">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <button
            className="md:hidden z-50 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div
              className={`w-6 h-0.5 bg-white mb-1.5 transition-all duration-300 ${
                isMenuOpen ? "transform rotate-45 translate-y-2" : ""
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-white mb-1.5 transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            ></div>
            <div
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? "transform -rotate-45 -translate-y-2" : ""
              }`}
            ></div>
          </button>

          <div
            className={`md:hidden fixed inset-0 bg-black bg-opacity-90 transition-transform duration-300 ease-in-out ${
              isMenuOpen
                ? "transform translate-x-0"
                : "transform translate-x-full"
            }`}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              <Link
                href="#about"
                onClick={scrollToSection}
                className="text-gray-100 text-xl hover:text-gray-50 hover:font-semibold"
              >
                About Me
              </Link>
              <Link
                href="#skills"
                onClick={scrollToSection}
                className="text-gray-100 text-xl hover:text-gray-50 hover:font-semibold"
              >
                Skills
              </Link>
              <Link
                href="#projects"
                onClick={scrollToSection}
                className="text-gray-100 text-xl hover:text-gray-50 hover:font-semibold"
              >
                Projects
              </Link>
              <Link
                href="#contact"
                onClick={scrollToSection}
                className="text-gray-100 text-xl hover:text-gray-50 hover:font-semibold"
              >
                Contact Me
              </Link>
            </div>
          </div>

          <div className="hidden md:flex w-1/2 justify-between items-center px-16">
            <Link
              href="#about"
              onClick={scrollToSection}
              className="text-gray-100 hover:text-gray-50 hover:font-semibold"
            >
              About Me
            </Link>
            <Link
              href="#skills"
              onClick={scrollToSection}
              className="text-gray-100 hover:text-gray-50 hover:font-semibold"
            >
              Skills
            </Link>
            <Link
              href="#projects"
              onClick={scrollToSection}
              className="text-gray-100 hover:text-gray-50 hover:font-semibold"
            >
              Projects
            </Link>
            <Link
              href="#contact"
              onClick={scrollToSection}
              className="text-gray-100 hover:text-gray-50 hover:font-semibold"
            >
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
