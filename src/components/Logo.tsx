import Image from "next/image";
import logo from "../../public/logo.png";

export default function Logo() {
  return (
    <div className="flex items-center">
      <Image src={logo} alt="logo" width={88} height={88} />
    </div>
  );
}
