"use client";

import { ChevronUpIcon } from "@heroicons/react/24/outline";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-8" style={{ backgroundColor: 'var(--footer-background)', color: 'var(--footer-text)' }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={scrollToTop}
            className="flex flex-col items-center gap-2 px-4 py-2 hover:opacity-70 font-medium hover:font-semibold cursor-pointer group transition-all duration-200"
            style={{ color: 'var(--footer-text)' }}
            aria-label="Scroll to top"
          >
            <ChevronUpIcon className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
            <span>BACK TO TOP</span>
          </button>
          <Logo isFixed={true} className="w-8 h-8" />
          <p style={{ color: 'var(--footer-text)', opacity: 0.7 }}>
            &copy; {currentYear} Mohamad Sharafeddine
          </p>
        </div>
      </div>
    </footer>
  );
}
