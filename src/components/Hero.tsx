"use client";

import Image from "next/image";
import personalImage from "../../public/Personal-Image.png";
import heroBackgroundImage from "../../public/hero-background.png";

export default function Hero() {
  return (
    <div
      id="hero"
      className="relative min-h-[100svh] max-h-[100svh] flex flex-col md:flex-row justify-between overflow-hidden"
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

      <div className="w-full md:w-1/2 z-20 flex flex-col justify-center min-h-[40vh] p-4 pt-20 md:p-8 md:pl-40 text-center md:text-left">
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

      <div className="relative z-20 min-w-[300px] min-h-[300px] max-w-[400px] max-h-[400px] md:min-w-[600px] md:min-h-[600px] md:max-w-[800px] md:max-h-[800px] mx-auto md:mr-20 self-end">
        <Image
          src={personalImage}
          alt="Personal Image"
          fill
          quality={100}
          sizes="(max-width: 768px) 400px, 800px"
          className="object-contain mix-blend-multiply"
          priority
        />
      </div>
    </div>
  );
}
