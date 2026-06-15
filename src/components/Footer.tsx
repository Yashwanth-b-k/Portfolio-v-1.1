import { profile } from "@/data/resume";
import { currentYear, scrollToSection } from "@/utils";

export function Footer() {
  return (
    <footer className="border-t border-light-border bg-light-secondary py-12 dark:border-dark-border dark:bg-dark-secondary">
      <div className="section-shell flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <button
            onClick={() => scrollToSection("home")}
            className="text-base font-semibold tracking-tight"
          >
            {profile.name}
          </button>
          <p className="mt-1 text-sm text-light-text/60 dark:text-dark-text/60">
            {profile.title}
          </p>
        </div>
        <a
          href={`mailto:${profile.email}`}
          className="text-sm text-light-text/60 transition-colors hover:text-light-accent dark:text-dark-text/60 dark:hover:text-dark-accent"
        >
          {profile.email}
        </a>
      </div>

      <div className="section-shell mt-8 flex flex-col items-center justify-between gap-2 border-t border-light-border pt-6 text-xs text-light-text/50 dark:border-dark-border dark:text-dark-text/50 sm:flex-row">
        <p>
          © {currentYear} {profile.name}. All rights reserved.
        </p>
        <p>Built with React + Vite, TypeScript, Tailwind &amp; Framer Motion.</p>
      </div>
    </footer>
  );
}
