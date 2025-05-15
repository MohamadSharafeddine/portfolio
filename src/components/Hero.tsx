"use client";

import Image from "next/image";
import personalImage from "../../public/Personal-Image.png";
import heroBackgroundImage from "../../public/hero-background.png";

export default function Hero() {
  return (
    <div
      id="hero"
      className="relative min-h-screen flex md:flex-row flex-col justify-between overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBackgroundImage}
          alt="Hero Background"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      <div className="w-full md:w-1/2 flex flex-col justify-center p-4 md:p-8 md:pl-40 z-20 pt-24 md:pt-0 text-center md:text-left">
        <p className="text-xl md:text-2xl font-bold mb-4 md:mb-8 bg-gradient-to-r from-gray-700 via-gray-400 to-gray-200 md:bg-none text-transparent md:text-black bg-clip-text md:bg-clip-border">
          Hi, I am
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-700 via-gray-400 to-gray-200 md:bg-none text-transparent md:text-black bg-clip-text md:bg-clip-border">
          Mohamad Sharafeddine
        </h1>
        <p className="text-base md:text-lg font-bold bg-gradient-to-r from-gray-700 via-gray-400 to-gray-200 md:bg-none text-transparent md:text-gray-500 bg-clip-text md:bg-clip-border">
          Full-Stack Web & Mobile Developer
        </p>
      </div>

      <div className="w-[280px] h-[280px] md:w-[600px] md:h-[600px] relative z-20 mx-auto md:mr-20 self-end">
        <Image
          src={personalImage}
          alt="Personal Image"
          fill
          className="object-contain mix-blend-multiply"
          priority
        />
      </div>
    </div>
  );
}
