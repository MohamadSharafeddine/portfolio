"use client";

import Image from "next/image";
import personalImage from "../../public/Personal-Image.png";
import heroBackgroundImage from "../../public/hero-background.png";

export default function Hero() {
  return (
    <div
      id="hero"
      className="relative h-[100svh] flex flex-col md:flex-row justify-between overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={heroBackgroundImage}
          alt="Hero Background"
          fill
          objectFit="cover"
          priority
        />
      </div>

      <div className="w-full md:w-1/2 min-h-[30svh] z-20 flex flex-col justify-center p-4 pt-20 md:p-40 text-center md:text-left">
        <p className="text-xl md:text-2xl font-bold mb-4 md:mb-8 bg-gradient-to-r from-gray-800 via-gray-400 to-gray-200 md:bg-none text-transparent md:text-gray-800 bg-clip-text md:bg-clip-border">
          Hi, I am
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 via-gray-400 to-gray-200 md:bg-none text-transparent md:text-gray-800 bg-clip-text md:bg-clip-border">
          Mohamad Sharafeddine
        </h1>
        <p className="text-base md:text-lg font-bold bg-gradient-to-r from-gray-800 via-gray-400 to-gray-200 md:bg-none text-transparent md:text-gray-500 bg-clip-text md:bg-clip-border">
          Full-Stack Web & Mobile Developer
        </p>
      </div>

      <div className="relative z-20 min-w-[400px] min-h-[533px] max-w-[600px] max-h-[800px] md:min-w-[450px] md:min-h-[600px] md:max-w-[600px] md:max-h-[800px] mx-auto self-end">
        <Image
          src={personalImage}
          alt="Personal Image"
          fill
          quality={100}
          className="object-contain mix-blend-multiply"
          priority
        />
      </div>
    </div>
  );
}
