import { FC } from "react";
import Title from "./Title";

const About: FC = () => {
  return (
    <section id="about" className="py-10 px-6">
      <Title>About Me</Title>
      <div className="max-w-3xl mx-auto text-center space-y-6 text-base sm:text-lg">
        <p>
          I started out studying how people think, feel, and behave, and
          somewhere along the way, I realized I wanted to build things that made
          their lives a little easier, smoother, and more delightful. That path
          led me <b>from Psychology into software development</b>, where
          I&apos;ve found the perfect blend of logic, creativity, and human
          insight.
        </p>
        <p>
          I care about the little details, not just in code, but in how things
          feel to use. I enjoy solving problems, learning how things work, and
          turning ideas into thoughtful digital experiences. Whether I&apos;m
          working solo or collaborating with a team,{" "}
          <b>
            I like to bring curiosity, empathy, and a healthy dose of obsession
            with doing things right.
          </b>
        </p>
      </div>
    </section>
  );
};

export default About;
