import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { profile, socials } from "@/data/resume";
import { SocialIcon } from "@/components/SocialIcon";
import { isValidEmail, cn } from "@/utils";
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
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 6000);
  };

  const field =
    "w-full rounded-2xl border-0 bg-white/[0.07] px-5 py-4 text-[15px] text-white outline-none ring-1 ring-white/10 transition placeholder:text-white/35 focus:bg-white/10 focus:ring-2 focus:ring-[#2997ff]";

  return (
    <section id="contact" className="relative scroll-mt-12 overflow-hidden bg-black py-28 text-white sm:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60vh]"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 100%, rgba(94,92,230,0.35), transparent 70%)",
        }}
      />

      <div className="shell-wide relative grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.p variants={fadeUp} className="eyebrow !text-white/50">
            Contact
          </motion.p>
          <motion.h2 variants={fadeUp} className="display mt-4">
            Let's talk.
          </motion.h2>
          <motion.p variants={fadeUp} className="lede mt-6 max-w-md !text-white/60">
            Open to software engineering and backend roles. Replies within a day.
          </motion.p>

          <motion.ul variants={fadeUp} className="mt-10 space-y-1">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between border-b border-white/10 py-4 text-[19px] transition-colors hover:text-[#2997ff]"
                >
                  <span className="flex items-center gap-4">
                    <SocialIcon icon={s.icon} size={18} />
                    {s.label}
                  </span>
                  <ArrowUpRight
                    size={20}
                    className="text-white/40 transition-transform duration-300 ease-apple group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#2997ff]"
                  />
                </a>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.form
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 self-center"
        >
          {(["name", "email"] as const).map((k) => (
            <div key={k}>
              <label htmlFor={k} className="sr-only">
                {k === "name" ? "Your name" : "Your email"}
              </label>
              <input
                id={k}
                type={k === "email" ? "email" : "text"}
                autoComplete={k}
                placeholder={k === "name" ? "Name" : "Email"}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                className={cn(field, errors[k] && "ring-[#ff453a]")}
                aria-invalid={Boolean(errors[k])}
              />
              {errors[k] && <p className="mt-2 px-1 text-[13px] text-[#ff453a]">{errors[k]}</p>}
            </div>
          ))}
          <div>
            <label htmlFor="message" className="sr-only">Message</label>
            <textarea
              id="message"
              rows={6}
              placeholder="What are you building?"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={cn(field, "resize-none", errors.message && "ring-[#ff453a]")}
              aria-invalid={Boolean(errors.message)}
            />
            {errors.message && (
              <p className="mt-2 px-1 text-[13px] text-[#ff453a]">{errors.message}</p>
            )}
          </div>
          <button type="submit" className="btn-light w-full">
            {sent ? (
              <>
                <CheckCircle2 size={16} /> Opening your mail app
              </>
            ) : (
              "Send message"
            )}
          </button>
          <p className="text-center text-[12px] text-white/35">
            Opens your mail client with the message pre-filled.
          </p>
        </motion.form>
      </div>
    </section>
  );
}
