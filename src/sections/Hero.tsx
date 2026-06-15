import { motion } from "framer-motion";
import { ArrowDown, Download, Mail, MapPin } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { profile } from "@/data/resume";
import { fadeUp, stagger } from "@/utils/motion";
import { scrollToSection } from "@/utils";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
      aria-label="Introduction"
    >
      {/* Premium ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-light-accent/10 blur-[120px] dark:bg-dark-accent/15" />
        <div className="absolute bottom-[-15%] right-[-5%] h-[380px] w-[380px] rounded-full bg-light-accent/5 blur-[120px] dark:bg-dark-accent/10" />
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="section-shell"
      >
        <motion.span
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-light-border bg-light-secondary/60 px-4 py-1.5 text-sm text-light-text/70 dark:border-dark-border dark:bg-dark-secondary/60 dark:text-dark-text/70"
        >
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Available for software engineering roles
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          {profile.name}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-4 text-xl font-medium text-light-accent dark:text-dark-accent sm:text-2xl"
        >
          {profile.title}
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mt-6 max-w-2xl text-base leading-relaxed text-light-text/70 dark:text-dark-text/70 sm:text-lg"
        >
          {profile.valueProp}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-6 flex items-center gap-2 text-sm text-light-text/60 dark:text-dark-text/60"
        >
          <MapPin size={16} />
          {profile.location}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
          <a href={profile.resume} download className="btn-primary">
            <Download size={16} /> Download Resume
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <FaGithub size={16} /> GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <FaLinkedinIn size={16} /> LinkedIn
          </a>
          <button onClick={() => scrollToSection("contact")} className="btn-ghost">
            <Mail size={16} /> Contact
          </button>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={() => scrollToSection("about")}
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-light-text/40 dark:text-dark-text/40"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block"
        >
          <ArrowDown size={22} />
        </motion.span>
      </motion.button>
    </section>
  );
}
