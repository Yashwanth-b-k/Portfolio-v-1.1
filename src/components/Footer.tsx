import { navLinks, profile, socials } from "@/data/resume";
import { currentYear, scrollToSection } from "@/utils";

export function Footer() {
  return (
    <footer className="panel text-[12px] text-light-muted dark:text-dark-muted">
      <div className="shell py-10">
        <p className="max-w-2xl leading-relaxed">
          Stack: ASP.NET Core, C#, CQRS, PostgreSQL, MongoDB, SQL Server, React.
          Figures (12,000+ users, 100+ organizations) refer to the CRM platform
          maintained at Eruna Technologies.
        </p>
        <div className="divider my-5" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Copyright © {currentYear} {profile.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center">
            {navLinks.map((l, i) => (
              <li key={l.id} className="flex items-center">
                <button
                  onClick={() => scrollToSection(l.id, 60)}
                  className="hover:text-light-text dark:hover:text-dark-text"
                >
                  {l.label}
                </button>
                {i < navLinks.length - 1 && (
                  <span className="mx-2.5 h-3 w-px bg-light-border dark:bg-dark-border" />
                )}
              </li>
            ))}
          </ul>
          <ul className="flex items-center gap-4">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="hover:text-light-text dark:hover:text-dark-text"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
