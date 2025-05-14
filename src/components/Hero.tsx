import Image from "next/image";
import personalImage from "../../public/Personal-Image.png";
import heroBackgroundImage from "../../public/hero-background.png";

export default function Hero() {
  return (
    <div className="relative h-screen flex overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBackgroundImage}
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
      <div className="md:w-1/2 text-black flex flex-col justify-center p-8 md:pl-40 z-20">
        <p className="text-lg mb-10">Hi, I am</p>
        <h1 className="text-4xl font-bold mb-4">Mohamad Sharafeddine</h1>
        <p className="text-lg">Full-Stack Web & Mobile Developer</p>
      </div>

      <div className="md:w-1/2 flex items-end justify-center md:pr-20 z-20">
        <div className="relative w-80 h-80 md:w-[600px] md:h-[600px] overflow-hidden shadow-2xl">
          <Image
            src={personalImage}
            alt="Personal Image"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    </div>
  );
}
