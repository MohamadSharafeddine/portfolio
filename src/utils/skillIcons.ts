import { type FC, SVGProps } from "react";
import { DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiPython,
} from "react-icons/si";

type IconType = FC<SVGProps<SVGSVGElement>>;

interface SkillIconMap {
  [key: string]: IconType;
}

const skillIcons: SkillIconMap = {
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  React: SiReact,
  "Next.js": SiNextdotjs,
  "Node.js": SiNodedotjs,
  "Tailwind CSS": SiTailwindcss,
  Express: SiExpress,
  MongoDB: SiMongodb,
  PostgreSQL: SiPostgresql,
  Git: SiGit,
  Python: SiPython,
  "React Native": DevicePhoneMobileIcon,
};

export default skillIcons;
