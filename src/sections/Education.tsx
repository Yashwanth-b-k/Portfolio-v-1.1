import { motion } from "framer-motion";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { education } from "@/data/resume";
import { fadeUp, stagger, viewportOnce } from "@/utils/motion";

export function Education() {
  return (
    <Section id="education" tone="grey">
      <SectionHeader eyebrow="Education" title="Foundations." sub="Built on fundamentals." />

      {education.map((e) => (
        <motion.div
          key={e.institution}
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start"
        >
          <motion.div variants={fadeUp}>
            <p className="eyebrow">{e.duration}</p>
            <h3 className="mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.1] tracking-tight">
              {e.institution}
            </h3>
            <p className="mt-2 text-[19px] text-light-muted dark:text-dark-muted">
              {e.degree}
            </p>
            <p className="text-[15px] text-light-muted/80 dark:text-dark-muted/80">{e.location}</p>

            {e.courses && (
              <div className="mt-8 flex flex-wrap gap-2">
                {e.courses.map((c) => (
                  <Badge key={c}>{c}</Badge>
                ))}
              </div>
            )}
          </motion.div>

          {e.gpa && (
            <motion.div
              variants={fadeUp}
              className="tile-dark flex min-w-[220px] flex-col justify-between p-8"
            >
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/50">
                CGPA
              </p>
              <p className="text-gradient-cool mt-6 text-6xl font-semibold tracking-tightest">
                {e.gpa.split(" ")[0]}
              </p>
              <p className="mt-1 text-white/50">out of 10</p>
            </motion.div>
          )}
        </motion.div>
      ))}
    </Section>
  );
}
