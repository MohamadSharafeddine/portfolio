import { FC } from "react";
import Title from "./Title";
import {
  SiJavascript,
  SiTypescript,
  SiPhp,
  SiPython,
  SiMongodb,
  SiMysql,
  SiSqlite,
  SiMariadb,
  SiReact,
  SiNextdotjs,
  SiRedux,
  SiNodedotjs,
  SiExpress,
  SiLaravel,
  SiTailwindcss,
  SiBootstrap,
  SiGit,
  SiGithub,
  SiFigma,
  SiPostman,
  SiAmazon,
  SiFirebase,
} from "react-icons/si";

const skills = {
  Languages: [
    { name: "JavaScript", icon: <SiJavascript color="#f7df1e" /> },
    { name: "TypeScript", icon: <SiTypescript color="#3178c6" /> },
    { name: "PHP", icon: <SiPhp color="#777bb4" /> },
    { name: "Python", icon: <SiPython color="#3776ab" /> },
    { name: "SQL", icon: <SiMysql color="#4479a1" /> },
  ],
  Databases: [
    { name: "MySQL", icon: <SiMysql color="#4479a1" /> },
    { name: "SQLite", icon: <SiSqlite color="#003b57" /> },
    { name: "MariaDB", icon: <SiMariadb color="#003545" /> },
    { name: "MongoDB", icon: <SiMongodb color="#47a248" /> },
  ],
  "Frameworks & Libraries": [
    { name: "React", icon: <SiReact color="#61dafb" /> },
    { name: "Next.js", icon: <SiNextdotjs color="#000000" /> },
    { name: "React Native", icon: <SiReact color="#61dafb" /> },
    { name: "Redux", icon: <SiRedux color="#764abc" /> },
    { name: "Node.js", icon: <SiNodedotjs color="#339933" /> },
    { name: "Express", icon: <SiExpress color="#000000" /> },
    { name: "Laravel", icon: <SiLaravel color="#ff2d20" /> },
    { name: "Tailwind CSS", icon: <SiTailwindcss color="#06b6d4" /> },
    { name: "Bootstrap", icon: <SiBootstrap color="#7952b3" /> },
  ],
  "Tools & Services": [
    { name: "Git", icon: <SiGit color="#f05032" /> },
    { name: "GitHub", icon: <SiGithub color="#181717" /> },
    { name: "Figma", icon: <SiFigma color="#f24e1e" /> },
    { name: "Postman", icon: <SiPostman color="#ff6c37" /> },
    { name: "AWS", icon: <SiAmazon color="#ff9900" /> },
    { name: "Firebase", icon: <SiFirebase color="#ffca28" /> },
  ],
};

const Skills: FC = () => {
  return (
    <section id="skills" className="py-10 px-6">
      <Title>Skills</Title>
      <div className="max-w-5xl mx-auto space-y-12">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-xl font-bold mb-4 text-center">{category}</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {items.map(({ name, icon }) => (
                <div
                  key={name}
                  className="p-4 flex flex-col items-center justify-center min-w-[120px]"
                >
                  <div className="text-4xl">{icon}</div>
                  <span className="mt-2 text-sm font-medium">{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
