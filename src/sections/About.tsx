import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { aboutHighlights, profile, stats } from "@/data/resume";
import { fadeUp, stagger, viewportOnce } from "@/utils/motion";

export function About() {
  return (
    <Section id="about" muted>
      <SectionHeader
        eyebrow="About"
        title="Engineering reliable systems at scale"
        description="A snapshot of where my strengths lie and the value I bring to a backend engineering team."
      />

      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-5 text-base leading-relaxed text-light-text/80 dark:text-dark-text/80 sm:text-lg"
        >
          <motion.p variants={fadeUp}>{profile.summary}</motion.p>
          <motion.p variants={fadeUp}>
            My focus is the backend: designing services around{" "}
            <strong className="font-semibold text-light-text dark:text-dark-text">
              CQRS architecture
            </strong>{" "}
            in ASP.NET Core, keeping{" "}
            <strong className="font-semibold text-light-text dark:text-dark-text">
              PostgreSQL and MongoDB
            </strong>{" "}
            data consistent across environments, and resolving live production
            issues through disciplined log analysis and root-cause debugging.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 pt-2">
            {aboutHighlights.map((tech) => (
              <Badge key={tech} strong>
                {tech}
              </Badge>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 gap-4 self-start"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="rounded-2xl border border-light-border bg-light-bg p-6 text-center shadow-apple dark:border-dark-border dark:bg-dark-bg dark:shadow-apple-dark"
            >
              <div className="text-3xl font-semibold tracking-tight text-light-accent dark:text-dark-accent sm:text-4xl">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-light-text/60 dark:text-dark-text/60">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}
