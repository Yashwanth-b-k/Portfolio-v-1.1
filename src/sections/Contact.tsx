import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { profile, socials } from "@/data/resume";
import { SocialIcon } from "@/components/SocialIcon";
import { Layer, Panel } from "@/components/ui/Section";
import { isValidEmail, cn } from "@/utils";
import { fadeUp, stagger, viewportOnce } from "@/utils/motion";
import { Campfire, Ores } from "@/mc/Ambient";
import { Guide } from "@/mc/Guide";

interface FormState {
  name: string;
  email: string;
  message: string;
}
type Errors = Partial<Record<keyof FormState, string>>;

/** Base camp, at the bottom of the dig: a fire, a courier, and a sign to write on. */
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
    else if (form.message.trim().length < 10) next.message = "Message should be at least 10 characters.";
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

  return (
    <Layer id="contact" material="deep" wide fx={<Ores kinds={["ruby", "lapis", "amethyst"]} seed={21} density={0.3} />}>
      <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.p variants={fadeUp} className="mb-8">
            <span className="sign">Contact</span>
          </motion.p>
          <motion.h2 variants={fadeUp} className="title-3d !text-[clamp(1.6rem,5vw,3.4rem)]">
            Let's talk.
          </motion.h2>
          <motion.p variants={fadeUp} className="lede mt-6 max-w-md">
            Open to software engineering and backend roles. Replies within a day.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex items-end gap-5">
            <Campfire />
            <Guide look="courier" name="Courier" say={["Mail's fast down here.", "I only deliver good news."]}>
              Write it on the sign. <b>I'll run it up.</b>
            </Guide>
          </motion.div>

          <motion.ul variants={fadeUp} className="mt-6 flex flex-wrap gap-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="mc-btn"
                >
                  <SocialIcon icon={s.icon} size={18} />
                  {s.label}
                  <ArrowUpRight size={18} strokeWidth={3} />
                </a>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportOnce} className="self-center">
          <Panel className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <p className="label mute">Write a message</p>
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
                    className={cn("field", errors[k] && "field-bad")}
                    aria-invalid={Boolean(errors[k])}
                  />
                  {errors[k] && <p className="mt-1.5 text-[19px] text-[#d23a2c]">{errors[k]}</p>}
                </div>
              ))}
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="What are you building?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={cn("field resize-none", errors.message && "field-bad")}
                  aria-invalid={Boolean(errors.message)}
                />
                {errors.message && <p className="mt-1.5 text-[19px] text-[#d23a2c]">{errors.message}</p>}
              </div>
              <button type="submit" className="mc-btn mc-btn-green w-full">
                {sent ? (
                  <>
                    <CheckCircle2 size={18} strokeWidth={3} /> Opening your mail app
                  </>
                ) : (
                  "Send message"
                )}
              </button>
              <p className="mute text-center text-[18px]">Opens your mail client with the message pre-filled.</p>
            </form>
          </Panel>
        </motion.div>
      </div>
    </Layer>
  );
}
