import { motion } from "framer-motion";
import { Github, Sparkles } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { projects } from "@/data/resume";
import { scaleIn, stagger, viewportOnce } from "@/utils/motion";

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeader
        eyebrow="Projects"
        title="Selected work"
        description="A few projects that best represent my backend and database work."
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <motion.article
            key={project.name}
            variants={scaleIn}
            className="group flex flex-col rounded-2xl border border-light-border bg-light-bg p-6 shadow-apple transition-all duration-500 hover:-translate-y-1.5 hover:border-light-accent/40 hover:shadow-apple-lg dark:border-dark-border dark:bg-dark-secondary dark:shadow-apple-dark dark:hover:border-dark-accent/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  {project.featured && (
                    <Sparkles
                      size={14}
                      className="shrink-0 text-light-accent dark:text-dark-accent"
                    />
                  )}
                  <h3 className="text-lg font-semibold tracking-tight">
                    {project.name}
                  </h3>
                </div>
                <p className="mt-0.5 text-sm font-medium text-light-accent dark:text-dark-accent">
                  {project.tagline}
                  {project.date && (
                    <span className="text-light-text/40 dark:text-dark-text/40">
                      {" · "}
                      {project.date}
                    </span>
                  )}
                </p>
              </div>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${project.name} on GitHub`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-light-border text-light-text/70 transition-colors hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:text-dark-text/70 dark:hover:border-dark-accent dark:hover:text-dark-accent"
                >
                  <Github size={16} />
                </a>
              )}
            </div>

            <ul className="mt-4 space-y-2">
              {project.achievements.slice(0, 2).map((a, ai) => (
                <li
                  key={ai}
                  className="flex gap-2 text-sm leading-snug text-light-text/75 dark:text-dark-text/75"
                >
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-light-accent dark:bg-dark-accent" />
                  {a}
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
              {project.technologies.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </motion.article>
        ))}
      </motion.div>
    </Section>
  );
}
