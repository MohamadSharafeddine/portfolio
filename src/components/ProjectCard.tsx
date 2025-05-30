"use client";

import Image from "next/image";

interface ProjectCardProps {
  title: string;
  description: string;
  link: string;
  image: string;
  tags: string[];
}

export default function ProjectCard({ title, description, link, image, tags }: ProjectCardProps) {
  return (
    <div className="group relative overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 w-full sm:w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] flex-grow basis-80">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/80 z-10" />
      <div className="relative h-[300px] w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover brightness-75 group-hover:scale-110 transition-all duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
        <div className="flex gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-2 py-1 bg-white/20 rounded-full text-white"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-200 mb-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {description}
        </p>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white hover:font-bold"
        >
          View Project
          <svg
            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </a>
      </div>
    </div>
  );
} 