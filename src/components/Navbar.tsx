import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, profile, socials } from "@/data/resume";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn, scrollToSection } from "@/utils";
import { ThemeToggle } from "./ThemeToggle";
import { SocialIcon } from "./SocialIcon";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const sectionIds = ["home", ...navLinks.map((l) => l.id)];
// Social platforms shown in the top bar (exclude the portfolio/globe link).
const topSocials = socials.filter((s) => s.icon !== "globe");

export function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNav = (id: string) => {
    setOpen(false);
    scrollToSection(id);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-light-border/70 bg-light-bg/80 backdrop-blur-xl dark:border-dark-border/70 dark:bg-dark-bg/70"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        className="section-shell flex h-16 items-center justify-between gap-4"
        aria-label="Primary"
      >
        <button
          onClick={() => handleNav("home")}
          className="text-base font-semibold tracking-tight"
        >
          Yashwanth<span className="text-light-accent dark:text-dark-accent">.</span>
        </button>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.id}>
              <button
                onClick={() => handleNav(link.id)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active === link.id
                    ? "text-light-accent dark:text-dark-accent"
                    : "text-light-text/70 hover:text-light-text dark:text-dark-text/70 dark:hover:text-dark-text"
                )}
                aria-current={active === link.id ? "true" : undefined}
              >
                {link.label}
                {active === link.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-light-accent/15 ring-1 ring-light-accent/20 dark:bg-dark-accent/20 dark:ring-dark-accent/25"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* Social platform links — shown on top */}
          <div className="hidden items-center gap-1 sm:flex">
            {topSocials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-light-border text-light-text/70 transition-colors hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:text-dark-text/70 dark:hover:border-dark-accent dark:hover:text-dark-accent"
              >
                <SocialIcon icon={s.icon} size={16} />
              </a>
            ))}
          </div>

          <a
            href={profile.resume}
            download
            className="hidden rounded-full bg-light-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 dark:bg-dark-accent dark:text-black lg:inline-flex"
          >
            Resume
          </a>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-light-border text-light-text dark:border-dark-border dark:text-dark-text md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-light-border bg-light-bg/95 backdrop-blur-xl dark:border-dark-border dark:bg-dark-bg/95 md:hidden"
          >
            <ul className="section-shell flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNav(link.id)}
                    className={cn(
                      "w-full rounded-xl px-4 py-3 text-left text-base font-medium transition-colors",
                      active === link.id
                        ? "bg-light-accent/15 text-light-accent dark:bg-dark-accent/20 dark:text-dark-accent"
                        : "text-light-text/80 hover:bg-light-secondary dark:text-dark-text/80 dark:hover:bg-dark-secondary"
                    )}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li className="mt-3 flex items-center gap-2 px-1">
                {topSocials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-light-border text-light-text/70 dark:border-dark-border dark:text-dark-text/70"
                  >
                    <SocialIcon icon={s.icon} size={18} />
                  </a>
                ))}
              </li>
              <li>
                <a
                  href={profile.resume}
                  download
                  className="mt-2 block rounded-xl bg-light-accent px-4 py-3 text-center text-base font-medium text-white dark:bg-dark-accent dark:text-black"
                >
                  Download Resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
