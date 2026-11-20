import { FC } from "react";
import Section from "./Section";
import ProjectCard from "./ProjectCard";
import PoseOverlay from "./decor/PoseOverlay";
import RadarOverlay from "./decor/RadarOverlay";
import FlameOverlay from "./decor/FlameOverlay";

const projects = [
  {
    title: "JumpCade",
    description:
      "Motion-controlled fitness game that turns a phone camera and a TV into a hands-free cardio arcade, using real-time on-device pose detection.",
    image: "/projects/jumpcade-gameplay.png",
    tags: ["Three.js", "TensorFlow.js", "Computer vision"],
    status: "In development",
    overlay: <PoseOverlay />,
  },
  {
    title: "CognifyEdu",
    description: "Education platform that uses AI analysis to follow students' cognitive and behavioral development.",
    link: "https://github.com/MohamadSharafeddine/cognifyedu",
    image: "/projects/cognifyedu.jpg",
    tags: ["React", "Laravel", "AI"],
    status: "Open source",
    overlay: <RadarOverlay />,
  },
  {
    title: "Red Flame & Blue Flame",
    description: "Interactive browser game built from scratch in HTML, CSS, and JavaScript.",
    link: "https://redflameblueflame.vercel.app/",
    image: "/projects/redflameblueflame.jpg",
    tags: ["JavaScript", "Game dev"],
    status: "Live",
    overlay: <FlameOverlay />,
  },
];

const Projects: FC = () => {
  return (
    <Section id="projects" layer={4} title="Projects" comment="selected work">
      <div className="space-y-28 lg:space-y-40">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} index={i + 1} flip={i % 2 === 1} {...project} />
        ))}
      </div>
    </Section>
  );
};

export default Projects;
