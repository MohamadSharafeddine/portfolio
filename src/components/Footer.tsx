import { ArrowUpIcon } from "@heroicons/react/24/outline";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mx-auto max-w-6xl px-6 lg:px-8">
      <div className="flex h-20 items-center justify-between border-t border-line">
        <div className="flex items-center gap-3">
          <Logo size={20} />
          <p className="text-[13px] text-fg-3 tabular-nums">&copy; {currentYear} Mohamad Sharafeddine</p>
        </div>
        <a
          href="#hero"
          className="group inline-flex items-center gap-1.5 text-[13px] text-fg-2 transition-colors duration-150 hover:text-fg"
        >
          Back to top
          <ArrowUpIcon className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </footer>
  );
}
