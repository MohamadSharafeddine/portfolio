import { FC } from "react";
import Title from "./Title";
import skillIcons from "@/utils/skillIcons";

const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Tailwind CSS",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Git",
  "Python",
  "React Native",
];

const Skills: FC = () => {
  return (
    <section id="skills" className="py-16 px-6">
      <Title>Skills</Title>
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
        {skills.map((skill) => {
          const Icon = skillIcons[skill];
          if (!Icon) return null;

          return (
            <div
              key={skill}
              className="p-4 rounded-lg shadow-md flex flex-col items-center justify-center hover:shadow-lg transition-shadow"
            >
              <Icon width="2rem" height="2rem" />
              <span className="mt-2">{skill}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;
