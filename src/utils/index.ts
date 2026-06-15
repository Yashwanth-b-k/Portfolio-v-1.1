/** Tailwind-friendly className joiner. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Smoothly scroll to a section by id, accounting for the fixed navbar. */
export function scrollToSection(id: string, offset = 72): void {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

/** Basic RFC-5322-ish email validation. */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export const currentYear = new Date().getFullYear();
