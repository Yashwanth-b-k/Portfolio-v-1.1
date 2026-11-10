import { useEffect, useSyncExternalStore } from "react";
import { Download, Volume2, VolumeX } from "lucide-react";
import { navLinks, profile } from "@/data/resume";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { cn, scrollToSection } from "@/utils";
import { GrassCube } from "@/mc/models";
import { gem, icons } from "@/mc/sprites";
import { isSoundOn, play, setSound, subscribeSound } from "@/mc/audio";

interface NavbarProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const sectionIds = ["home", ...navLinks.map((l) => l.id)];

/** What each depth of the page is called on the HUD. */
const BIOMES: Record<string, string> = {
  home: "Surface",
  about: "Topsoil",
  experience: "Stone mine",
  skills: "Ore cavern",
  projects: "Deep vault",
  education: "Buried library",
  contact: "Base camp",
};

const slotIcon = (id: string): string =>
  ({
    about: icons.book,
    experience: icons.pick,
    skills: gem("#5fe0d8"),
    projects: icons.chest,
    education: icons.cap,
    contact: icons.mail,
  })[id] ?? icons.book;

/**
 * The HUD. Top-left: logo + depth read-out. Top-right: résumé + day/night.
 * Bottom: a hotbar — one slot per section (keys 1–6 work too) with the
 * scroll position drawn as an XP bar above it.
 */
export function Navbar({ theme, toggleTheme }: NavbarProps) {
  const active = useActiveSection(sectionIds);
  const progress = useScrollProgress();
  const depth = Math.round(64 - progress * 128);
  const sound = useSyncExternalStore(subscribeSound, isSoundOn, () => true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey || t?.closest("input,textarea,[contenteditable]")) return;
      const link = navLinks[Number(e.key) - 1];
      if (link) scrollToSection(link.id, 24);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between gap-3 p-3 sm:p-4">
        <button
          onClick={() => scrollToSection("home", 0)}
          className="pointer-events-auto flex min-w-0 items-center gap-2 text-left"
          aria-label="Back to the surface"
        >
          <GrassCube size={22} />
          <span className="hud-text whitespace-nowrap leading-[1.7]">
            <span className="hidden sm:block">{profile.name}</span>
            <span className="block text-[#ffe94a]">
              Y: {depth}
              <span className="hidden sm:inline"> · </span>
              <span className="block sm:inline">{BIOMES[active] ?? "Surface"}</span>
            </span>
          </span>
        </button>

        <div className="pointer-events-auto flex flex-none items-center gap-1.5 sm:gap-2">
          <a href={profile.resume} download className="mc-btn mc-btn-sm mc-btn-green" aria-label="Download résumé">
            <Download size={16} strokeWidth={3} />
            <span className="hidden sm:inline">Résumé</span>
          </a>
          <button
            type="button"
            onClick={() => setSound(!sound)}
            className="mc-btn mc-btn-sm !px-2"
            aria-pressed={sound}
            aria-label={sound ? "Mute music and sounds" : "Turn on music and sounds"}
            title={sound ? "Mute" : "Sound on"}
          >
            {sound ? <Volume2 size={20} strokeWidth={3} /> : <VolumeX size={20} strokeWidth={3} />}
          </button>
          <button
            type="button"
            onClick={() => { toggleTheme(); play("chime"); }}
            className="mc-btn mc-btn-sm !px-2"
            aria-label={`Switch to ${theme === "dark" ? "day" : "night"}`}
            title={theme === "dark" ? "Make it day" : "Make it night"}
          >
            <img src={theme === "dark" ? icons.sun : icons.moon} alt="" width={22} height={22} />
          </button>
        </div>
      </header>

      <nav className="hotbar" aria-label="Sections">
        <div className="xp" role="progressbar" aria-label="Scroll depth" aria-valuenow={Math.round(progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <i style={{ transform: `scaleX(${progress})` }} />
        </div>
        <ul className="slots">
          {navLinks.map((link, i) => (
            <li key={link.id}>
              <button
                onClick={() => { play("ui"); scrollToSection(link.id, 24); }}
                className={cn("slot", active === link.id && "on")}
                aria-current={active === link.id ? "true" : undefined}
                aria-label={link.label}
              >
                <img src={slotIcon(link.id)} alt="" />
                <span className="key" aria-hidden>{i + 1}</span>
                <span className="slot-tip" aria-hidden>{link.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
