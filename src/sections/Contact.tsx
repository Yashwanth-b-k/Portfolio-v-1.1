import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Send } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { profile, socials } from "@/data/resume";
import { SocialIcon } from "@/components/SocialIcon";
import { isValidEmail } from "@/utils";
import { fadeUp, stagger, viewportOnce } from "@/utils/motion";

interface FormState {
  name: string;
  email: string;
  message: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

export function Contact() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) next.email = "Please enter your email.";
    else if (!isValidEmail(form.email)) next.email = "Please enter a valid email.";
    if (!form.message.trim()) next.message = "Please enter a message.";
    else if (form.message.trim().length < 10)
      next.message = "Message should be at least 10 characters.";
    return next;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // Open the user's mail client with prefilled content.
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 6000);
  };

  const fieldClasses =
    "w-full rounded-xl border bg-light-bg px-4 py-3 text-sm outline-none transition-colors placeholder:text-light-text/40 focus:border-light-accent dark:bg-dark-bg dark:placeholder:text-dark-text/40 dark:focus:border-dark-accent";

  return (
    <Section id="contact">
      <SectionHeader
        eyebrow="Contact"
        title="Let's build something reliable"
        description="Open to software engineering roles and backend opportunities. Reach out directly or send a message below."
        align="center"
      />

      <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[1fr_1.3fr]">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-3"
        >
          {socials.map((s) => (
            <motion.a
              key={s.label}
              variants={fadeUp}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-light-border bg-light-bg p-4 transition-all hover:-translate-y-0.5 hover:border-light-accent/40 hover:shadow-apple dark:border-dark-border dark:bg-dark-secondary dark:hover:border-dark-accent/40"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-light-accent/10 text-light-accent dark:bg-dark-accent/15 dark:text-dark-accent">
                <SocialIcon icon={s.icon} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{s.label}</span>
                <span className="block truncate text-xs text-light-text/60 dark:text-dark-text/60">
                  {s.href.replace("mailto:", "").replace("https://", "")}
                </span>
              </span>
            </motion.a>
          ))}
        </motion.div>

        <motion.form
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 rounded-2xl border border-light-border bg-light-bg p-7 shadow-apple dark:border-dark-border dark:bg-dark-secondary dark:shadow-apple-dark sm:p-8"
        >
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={`${fieldClasses} ${
                errors.name
                  ? "border-red-500 dark:border-red-500"
                  : "border-light-border dark:border-dark-border"
              }`}
              placeholder="Jane Doe"
            />
            {errors.name && (
              <p id="name-error" className="mt-1.5 text-xs text-red-500">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`${fieldClasses} ${
                errors.email
                  ? "border-red-500 dark:border-red-500"
                  : "border-light-border dark:border-dark-border"
              }`}
              placeholder="jane@example.com"
            />
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-xs text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={`${fieldClasses} resize-none ${
                errors.message
                  ? "border-red-500 dark:border-red-500"
                  : "border-light-border dark:border-dark-border"
              }`}
              placeholder="Tell me about the role or project…"
            />
            {errors.message && (
              <p id="message-error" className="mt-1.5 text-xs text-red-500">
                {errors.message}
              </p>
            )}
          </div>

          <button type="submit" className="btn-primary w-full">
            {sent ? (
              <>
                <CheckCircle2 size={16} /> Opening your mail app…
              </>
            ) : (
              <>
                <Send size={16} /> Send Message
              </>
            )}
          </button>
          <p className="text-center text-xs text-light-text/50 dark:text-dark-text/50">
            This form opens your email client with the message prefilled.
          </p>
        </motion.form>
      </div>
    </Section>
  );
}
