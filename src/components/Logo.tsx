import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image src="/logo.png" alt="logo" width={48} height={48} priority />
    </div>
  );
}
