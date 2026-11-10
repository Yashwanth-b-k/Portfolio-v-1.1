import { navLinks, profile, socials } from "@/data/resume";
import { currentYear, scrollToSection } from "@/utils";

/** Bedrock. You can't dig any further. */
export function Footer() {
  return (
    <footer className="layer layer-bedrock text-[19px] text-white/70" data-mat="deep">
      <div className="layer-shade" />
      <div className="layer-body shell pb-36 pt-12">
        <p className="label text-[#f2c84b]">Bedrock — you've reached the bottom.</p>
        <p className="mt-4 max-w-2xl leading-tight">
          Stack: ASP.NET Core, C#, CQRS, PostgreSQL, MongoDB, SQL Server, React. Figures (12,000+ users, 100+
          organizations) refer to the CRM platform maintained at Eruna Technologies.
        </p>
        <div className="my-6 h-1 w-full bg-white/15" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {profile.name}
          </p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {navLinks.map((l) => (
              <li key={l.id}>
                <button onClick={() => scrollToSection(l.id, 24)} className="hover:text-white hover:underline">
                  {l.label}
                </button>
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
                  className="hover:text-white hover:underline"
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
