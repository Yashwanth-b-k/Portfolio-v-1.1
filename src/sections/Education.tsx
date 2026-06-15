import { motion } from "framer-motion";
import { Award, GraduationCap, MapPin } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { education } from "@/data/resume";
import { fadeUp, stagger, viewportOnce } from "@/utils/motion";

export function Education() {
  return (
    <Section id="education" muted>
      <SectionHeader
        eyebrow="Education"
        title="Academic background"
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="space-y-5"
      >
        {education.map((edu) => (
          <motion.div
            key={edu.institution}
            variants={fadeUp}
            className="rounded-2xl border border-light-border bg-light-bg p-7 shadow-apple dark:border-dark-border dark:bg-dark-bg dark:shadow-apple-dark sm:p-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-light-accent/10 text-light-accent dark:bg-dark-accent/15 dark:text-dark-accent">
                  <GraduationCap size={24} />
                </span>
                <div>
                  <h3 className="text-lg font-semibold sm:text-xl">
                    {edu.institution}
                  </h3>
                  <p className="mt-1 text-base text-light-text/75 dark:text-dark-text/75">
                    {edu.degree}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-sm text-light-text/60 dark:text-dark-text/60">
                    <MapPin size={13} /> {edu.location}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                <span className="text-sm text-light-text/60 dark:text-dark-text/60">
                  {edu.duration}
                </span>
                {edu.gpa && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-light-accent/10 px-3 py-1 text-sm font-semibold text-light-accent dark:bg-dark-accent/15 dark:text-dark-accent">
                    <Award size={14} /> GPA {edu.gpa}
                  </span>
                )}
              </div>
            </div>

            {edu.courses && (
              <div className="mt-6 border-t border-light-border pt-5 dark:border-dark-border">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-light-text/50 dark:text-dark-text/50">
                  Relevant Coursework
                </p>
                <div className="flex flex-wrap gap-2">
                  {edu.courses.map((c) => (
                    <Badge key={c}>{c}</Badge>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </Section>
  );
}
