import { FC } from "react";
import Title from "./Title";

const About: FC = () => {
  return (
    <section id="about" className="py-10 px-6 ">
      <Title>About Me</Title>
      <div className="max-w-3xl mx-auto text-center ">
        <p>
          I&apos;m a passionate Full-Stack Developer with a background in
          psychology, blending technical expertise with a deep understanding of
          user behavior. I thrive on creating clean, scalable web and mobile
          applications using modern tools like React, Next.js, and TypeScript.
        </p>
      </div>
    </section>
  );
};

export default About;
