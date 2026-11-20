import { FC } from "react";
import Section from "./Section";
import AttentionMap from "./decor/AttentionMap";

const Em = ({ children }: { children: React.ReactNode }) => <span className="text-fg">{children}</span>;

const About: FC = () => {
  return (
    <Section id="about" layer={1} title="About" comment="psychology → AI">
      <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-24">
        <div>
          <p data-reveal className="text-[clamp(24px,2.6vw,34px)] leading-[1.3] tracking-[-0.02em] text-fg">
            I started out studying how people think, feel, and behave, and somewhere along the way, I realized I wanted
            to build things that made their lives a little easier, smoother, and more delightful.
          </p>

          <div data-reveal className="my-12 flex items-center gap-4 font-mono text-[13px] text-fg-3">
            <span>Psychology</span>
            <span className="relative h-px flex-1 bg-gradient-to-r from-line-strong via-fg-3 to-fg">
              <span className="absolute top-1/2 left-[72%] h-2 w-2 -translate-y-1/2 rounded-full bg-fg shadow-[0_0_10px_rgba(255,255,255,0.6)]" />
            </span>
            <span className="text-fg">AI engineering</span>
          </div>

          <div className="space-y-6 text-lg leading-[1.7] text-fg-2">
            <p data-reveal>
              That path led me <Em>from psychology to software development</Em>, where I&apos;ve found the perfect
              blend of logic, creativity, and human insight.
            </p>
            <p data-reveal>
              Today I work as a <Em>Software Engineer</Em>, building <Em>AI-driven systems</Em>, full-stack applications,
              and 3D processing pipelines that automate real business work, from agentic workflows powered by large
              language models to cloud slicing engines for medical 3D printing.
            </p>
            <p data-reveal>
              I care about the little details, not just in code, but in how things feel to use. I enjoy solving
              problems, learning how things work, and turning ideas into thoughtful digital experiences. Whether I&apos;m
              working solo or collaborating with a team,{" "}
              <Em>I like to bring curiosity, empathy, and a healthy dose of obsession with doing things right.</Em>
            </p>
          </div>
        </div>
        <div data-reveal className="mx-auto w-full max-w-[480px]">
          <AttentionMap />
        </div>
      </div>
    </Section>
  );
};

export default About;
