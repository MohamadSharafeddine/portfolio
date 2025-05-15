"use client";

import { ChevronUpIcon } from "@heroicons/react/24/outline";

export default function Footer() {
  const scrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-black text-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={scrollToTop}
            className="flex flex-col items-center gap-2 px-4 py-2 hover:text-gray-50 hover:font-semibold cursor-pointer"
            aria-label="Scroll to top"
          >
            <ChevronUpIcon className="h-5 w-5" />
            <span>BACK TO TOP</span>
          </button>
          <p>&copy; 2024 Mohamad Sharafeddine. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
