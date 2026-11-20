import Image from "next/image";

interface LogoProps {
  size?: number;
  className?: string;
}

// Both marks are rendered; CSS picks the one that matches data-theme,
// so the logo is correct on first paint.
export default function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <span className={`relative inline-block shrink-0 ${className}`} style={{ width: size, height: size }}>
      <Image src="/logo.png" alt="Mohamad Sharafeddine" width={size} height={size} priority className="dark:hidden" />
      <Image
        src="/logo-inverted.png"
        alt="Mohamad Sharafeddine"
        width={size}
        height={size}
        priority
        className="hidden dark:block"
      />
    </span>
  );
}
