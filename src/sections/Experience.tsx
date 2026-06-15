import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, ChevronDown, MapPin, TrendingUp } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { experiences } from "@/data/resume";
import { cn } from "@/utils";
import { fadeUp, stagger, viewportOnce } from "@/utils/motion";

export function Experience() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <Section id="experience">
      <SectionHeader
        eyebrow="Experience"
        title="Where I've worked"
        description="Roles spanning production development, full-stack internships, and intensive engineering training. Click any role to expand details."
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="relative"
      >
        {/* Timeline rail */}
        <div className="absolute left-[19px] top-2 hidden h-[calc(100%-1rem)] w-px bg-light-border dark:bg-dark-border sm:block" />

        <div className="space-y-5">
          {experiences.map((exp, i) => {
            const open = openIndex === i;
            return (
              <motion.div key={exp.company} variants={fadeUp} className="relative sm:pl-14">
                {/* Timeline node */}
                <span className="absolute left-[11px] top-7 hidden h-4 w-4 rounded-full border-2 border-light-accent bg-light-bg dark:border-dark-accent dark:bg-dark-bg sm:block" />

                <div className="overflow-hidden rounded-2xl border border-light-border bg-light-bg shadow-apple transition-colors dark:border-dark-border dark:bg-dark-secondary dark:shadow-apple-dark">
                  <button
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    aria-expanded={open}
                    className="flex w-full items-center gap-4 p-6 text-left"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-light-secondary text-light-accent dark:bg-dark-bg dark:text-dark-accent">
                      <Briefcase size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-semibold">{exp.role}</span>
                        <Badge>{exp.type}</Badge>
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-light-text/60 dark:text-dark-text/60">
                        <span className="font-medium text-light-text/80 dark:text-dark-text/80">
                          {exp.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={13} /> {exp.location}
                        </span>
                        <span>{exp.duration}</span>
                      </span>
                    </span>
                    <ChevronDown
                      size={20}
                      className={cn(
                        "shrink-0 text-light-text/50 transition-transform duration-300 dark:text-dark-text/50",
                        open && "rotate-180"
                      )}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-light-border px-6 pb-6 pt-5 dark:border-dark-border">
                          <ul className="space-y-2.5">
                            {exp.highlights.map((h, hi) => (
                              <li
                                key={hi}
                                className="flex gap-3 text-sm leading-relaxed text-light-text/75 dark:text-dark-text/75"
                              >
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-light-accent dark:bg-dark-accent" />
                                {h}
                              </li>
                            ))}
                          </ul>

                          <div className="mt-5">
                            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-light-text/50 dark:text-dark-text/50">
                              <TrendingUp size={14} /> Impact
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {exp.impact.map((m) => (
                                <Badge key={m} strong>
                                  {m}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </Section>
  );
}
