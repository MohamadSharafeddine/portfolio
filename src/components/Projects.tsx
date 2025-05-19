"use client";

import { FC } from "react";
import Title from "./Title";
import ProjectCard from "./ProjectCard";

const projects = [
  {
    title: "CognifyEdu",
    description:
      "Advanced educational platform integrating AI-driven analysis to enhance student cognitive and behavioral development.",
    link: "https://github.com/MohamadSharafeddine/cognifyedu",
    image: "/projects/cognifyedu.jpg",
    tags: ["React", "Laravel", "AI", "Education"],
  },
  {
    title: "Red Flame & Blue Flame",
    description:
      "An Interactive web based game utilizing advanced HTML, CSS, and JavaScript techniques to deliver a compelling user experience.",
    link: "https://fireboy-watergirl-game.vercel.app/",
    image: "/projects/redflameblueflame.jpg",
    tags: ["JavaScript", "Game Dev", "Interactive"],
  },
];

const Projects: FC = () => {
  return (
    <section id="projects" className="py-10 px-6">
      <Title>Projects</Title>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-8 justify-center">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            More Projects Coming Soon
          </h3>
          <p className="text-gray-500">Stay tuned for future updates!</p>
        </div>
      </div>
    </section>
  );
};

export default Projects;
