import Image from "next/image";

interface LogoProps {
  isFixed: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export default function Logo({ isFixed, onClick }: LogoProps) {
  return (
    <div className="flex items-center cursor-pointer" onClick={onClick}>
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
