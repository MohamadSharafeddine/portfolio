import { FC } from "react";
import Title from "./Title";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { HiMail } from "react-icons/hi";

const Contact: FC = () => {
  return (
    <section id="contact" className="py-10 px-6">
      <Title>Contact Me</Title>
      <div className="max-w-md mx-auto text-center">
        <p className="font-semibold">I&#39;d love to hear from you!</p>
        <p className="font-semibold mb-8">
          Feel free to reach out on any of these platforms.
        </p>
        <div className="flex justify-center items-center gap-8">
          <a
            href="https://github.com/MohamadSharafeddine"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-600 transition-colors"
            aria-label="GitHub Profile"
          >
            <SiGithub className="w-8 h-8" style={{ transform: "scale(1)" }} />
          </a>
          <a
            href="https://www.linkedin.com/in/mohamad-sharafeddine/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-600 transition-colors"
            aria-label="LinkedIn Profile"
          >
            <SiLinkedin className="w-8 h-8" style={{ transform: "scale(1)" }} />
          </a>
          <a
            href="mailto:mhsharafeddine@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-gray-600 transition-colors"
            aria-label="Send email"
          >
            <HiMail className="w-8 h-8" style={{ transform: "scale(1.25)" }} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
