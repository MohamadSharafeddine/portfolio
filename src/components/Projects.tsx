import { FC } from "react";
import Title from "./Title";

const projects = [
  {
    title: "CognifyEdu",
    description:
      "Advanced educational platform integrating AI-driven analysis to enhance student cognitive and behavioral development.",
    link: "https://github.com/MohamadSharafeddine/cognifyedu",
  },
  {
    title: "Red Flame Blue Flame",
    description:
      "An Interactive web based game utilizing advanced HTML, CSS, and JavaScript techniques to deliver a compelling user experience.",
    link: "https://github.com/MohamadSharafeddine/fireboy-watergirl-game",
  },
];

const Projects: FC = () => {
  return (
    <section id="projects" className="py-16 px-6 ">
      <Title>Projects</Title>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {projects.map(({ title, description, link }) => (
          <div
            key={title}
            className="p-6 rounded-lg shadow hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold ">{title}</h3>
            <p className=" my-2">{description}</p>
            <a
              href={link}
              target="_blank"
              className="text-blue-500 hover:underline"
            >
              View Project →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
