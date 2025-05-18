import Image from "next/image";

interface LogoProps {
  isFixed?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

export default function Logo({ isFixed, onClick, className = "" }: LogoProps) {
  return (
    <div
      className={`flex items-center ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
      onClick={onClick}
    >
      <Image
        src={isFixed ? "/logo-inverted.png" : "/logo.png"}
        alt="logo"
        width={44}
        height={44}
        priority
      />
    </div>
  );
}
