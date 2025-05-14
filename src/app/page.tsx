import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Hero />
      <section id="about" className="py-24 bg-gray-100 text-center">
        <h2>About Me</h2>
      </section>
      <section id="skills" className="py-24 bg-white text-center">
        <h2>Skills</h2>
      </section>
      <section id="contact" className="py-24 bg-gray-100 text-center">
        <h2>Contact Me</h2>
      </section>
    </main>
  );
}
