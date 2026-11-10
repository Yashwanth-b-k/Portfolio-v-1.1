import { Hero } from "@/sections/Hero";
import { Statement } from "@/sections/Statement";
import { About } from "@/sections/About";
import { Experience } from "@/sections/Experience";
import { Skills } from "@/sections/Skills";
import { Projects } from "@/sections/Projects";
import { Education } from "@/sections/Education";
import { Contact } from "@/sections/Contact";
import { Roamers } from "@/mc/Roamers";

export default function Home() {
  return (
    <main id="main" className="relative">
      <Hero />
      <Statement />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      <Contact />
      <Roamers />
    </main>
  );
}
