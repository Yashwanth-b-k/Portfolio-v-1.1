import { motion } from "framer-motion";
import {
  Cloud,
  Database,
  Layers,
  LayoutGrid,
  Server,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { skillCategories } from "@/data/resume";
import type { SkillCategory } from "@/types";
import { cn } from "@/utils";
import { scaleIn, stagger, viewportOnce } from "@/utils/motion";

const iconMap: Record<SkillCategory["icon"], LucideIcon> = {
  server: Server,
  layout: LayoutGrid,
  database: Database,
  layers: Layers,
  cloud: Cloud,
  wrench: Wrench,
};

export function Skills() {
  return (
    <Section id="skills" muted>
      <SectionHeader
        eyebrow="Skills"
        title="Technical toolkit"
        description="Organized by discipline, with my strongest technologies highlighted in accent."
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {skillCategories.map((cat) => {
          const Icon = iconMap[cat.icon];
          return (
            <motion.div
              key={cat.category}
              variants={scaleIn}
              className="group rounded-2xl border border-light-border bg-light-bg p-6 shadow-apple transition-all duration-500 hover:-translate-y-1 hover:shadow-apple-lg dark:border-dark-border dark:bg-dark-bg dark:shadow-apple-dark"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-light-accent/10 text-light-accent transition-colors group-hover:bg-light-accent group-hover:text-white dark:bg-dark-accent/15 dark:text-dark-accent dark:group-hover:bg-dark-accent dark:group-hover:text-black">
                  <Icon size={20} />
                </span>
                <h3 className="text-lg font-semibold">{cat.category}</h3>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                      skill.strong
                        ? "bg-light-accent/10 text-light-accent dark:bg-dark-accent/15 dark:text-dark-accent"
                        : "bg-light-secondary text-light-text/75 dark:bg-dark-secondary dark:text-dark-text/75"
                    )}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </Section>
  );
}
