import About from "@/components/About";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Reveal from "@/components/Reveal";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <>
      <Hero />
      <Reveal>
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </Reveal>
    </>
  );
}
