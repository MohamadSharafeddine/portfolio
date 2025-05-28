"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import personalImage from "../../public/Personal-Image.png";
import heroBackgroundImage from "../../public/hero-background.png";

export default function Hero() {
  return (
    <div
      id="hero"
      className="relative h-[100svh] flex flex-col lg:flex-row justify-between overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        <Image
          src={heroBackgroundImage}
          alt="Hero Background"
          fill
          objectFit="cover"
          priority
        />
      </motion.div>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full lg:w-1/2 min-h-[30svh] z-20 flex flex-col justify-center p-4 pt-20 lg:p-40 text-center lg:text-left"
      >
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-xl lg:text-2xl font-bold mb-4 lg:mb-8 bg-gradient-to-r from-gray-800 via-gray-400 to-gray-200 lg:bg-none text-transparent lg:text-gray-800 bg-clip-text lg:bg-clip-border"
        >
          Hello, I am
        </motion.p>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 via-gray-400 to-gray-200 lg:bg-none text-transparent lg:text-gray-800 bg-clip-text lg:bg-clip-border"
        >
          Mohamad Sharafeddine
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-base lg:text-lg font-bold bg-gradient-to-r from-gray-800 via-gray-400 to-gray-200 lg:bg-none text-transparent lg:text-gray-500 bg-clip-text lg:bg-clip-border"
        >
          Full-Stack Web & Mobile Developer
        </motion.p>
      </motion.div>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-20 w-full h-[60vh] lg:h-[90vh] max-w-[600px] mx-auto self-end"
      >
        <Image
          src={personalImage}
          alt="Personal Image"
          fill
          quality={100}
          className="object-contain object-bottom mix-blend-multiply"
          priority
        />
      </motion.div>
    </div>
  );
}
