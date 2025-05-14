import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="w-1/2">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          <div className="hidden md:flex w-1/2 justify-between items-center px-16">
            <Link href="#about" className="hover:text-gray-800">
              About Me
            </Link>
            <Link href="#skills" className="hover:text-gray-800">
              Skills
            </Link>
            <Link href="#contact" className="hover:text-gray-800">
              Contact Me
            </Link>
            <Link href="#contact" className="hover:text-gray-800">
              Misc.
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
