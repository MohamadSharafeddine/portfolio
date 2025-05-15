"use client";

import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");
    if (!href?.startsWith("#")) return;

    const section = document.querySelector(href);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
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
