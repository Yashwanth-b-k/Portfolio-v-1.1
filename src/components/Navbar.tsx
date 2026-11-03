import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, profile } from "@/data/resume";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn, scrollToSection } from "@/utils";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const sectionIds = ["home", ...navLinks.map((l) => l.id)];

export function Navbar({ theme, toggleTheme }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNav = (id: string) => {
    setOpen(false);
    scrollToSection(id, 60);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Apple-style: always dark translucent bar, 48px tall, tiny 12px links */}
      <div className="glass-dark text-white/85">
        <nav
          className="shell flex h-12 items-center justify-between"
          aria-label="Primary"
        >
          <button
            onClick={() => handleNav("home")}
            className="text-[15px] font-semibold tracking-tight text-white"
            aria-label="Go to top"
          >
            Y<span className="text-white/50">.</span>
          </button>

          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => handleNav(link.id)}
                  className={cn(
                    "text-[12px] tracking-[-0.01em] transition-colors duration-300",
                    active === link.id
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  )}
                  aria-current={active === link.id ? "true" : undefined}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={profile.resume}
              download
              className="hidden rounded-full bg-light-accent px-3.5 py-1 text-[12px] font-medium text-white transition hover:brightness-110 md:inline-flex"
            >
              Resume
            </a>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center text-white md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass-dark fixed inset-x-0 top-12 bottom-0 overflow-y-auto text-white md:hidden"
          >
            <ul className="shell flex flex-col pt-6">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-white/10"
                >
                  <button
                    onClick={() => handleNav(link.id)}
                    className="w-full py-4 text-left text-[28px] font-semibold tracking-tight"
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
              <li className="pt-6">
                <a href={profile.resume} download className="btn-primary w-full">
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
