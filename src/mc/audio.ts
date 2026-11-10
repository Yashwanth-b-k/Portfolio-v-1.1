/**
 * Sound, synthesised live with the Web Audio API — there are no audio files.
 *
 * - `play(name)` fires a one-shot effect.
 * - An original, generative ambient track plays underneath: sparse bell-like
 *   notes picked at random from a scale, with a long echo. It never repeats.
 *
 * Browsers only allow audio after a user gesture, so everything starts on the
 * first click / key press. The on/off choice is remembered.
 */

const KEY = "portfolio-sound";
let on = typeof window !== "undefined" && window.localStorage.getItem(KEY) !== "off";
const subs = new Set<() => void>();

let ctx: AudioContext | null = null;
let sfx: GainNode, music: GainNode, echo: DelayNode;
let musicTimer = 0;

export const isSoundOn = () => on;
export function subscribeSound(fn: () => void) {
  subs.add(fn);
  return () => subs.delete(fn);
}
export function setSound(next: boolean) {
  on = next;
  window.localStorage.setItem(KEY, next ? "on" : "off");
  if (ctx) ctx[next ? "resume" : "suspend"]();
  if (next) { audio(); startMusic(); } else window.clearTimeout(musicTimer);
  subs.forEach((f) => f());
}

function audio(): AudioContext | null {
  if (!on) return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0.8;
    master.connect(ctx.destination);
    sfx = ctx.createGain();
    sfx.gain.value = 0.9;
    sfx.connect(master);
    music = ctx.createGain();
    music.gain.value = 0.5;
    music.connect(master);
    // Echo for the music: delay → low-pass → feedback.
    echo = ctx.createDelay(1);
    echo.delayTime.value = 0.46;
    const fb = ctx.createGain(), lp = ctx.createBiquadFilter();
    fb.gain.value = 0.42;
    lp.type = "lowpass";
    lp.frequency.value = 1800;
    echo.connect(lp).connect(fb).connect(echo);
    lp.connect(music);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Building blocks                                                     */
/* ------------------------------------------------------------------ */

interface Tone { type?: OscillatorType; f: number; f2?: number; dur: number; vol?: number; at?: number; attack?: number; vib?: number; to?: AudioNode }
function tone({ type = "sine", f, f2, dur, vol = 0.2, at = 0, attack = 0.006, vib = 0, to }: Tone) {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + at, o = c.createOscillator(), g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  if (vib) {
    const l = c.createOscillator(), lg = c.createGain();
    l.frequency.value = 9;
    lg.gain.value = vib;
    l.connect(lg).connect(o.frequency);
    l.start(t);
    l.stop(t + dur);
  }
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(to ?? sfx);
  o.start(t);
  o.stop(t + dur + 0.02);
}

let noiseBuf: AudioBuffer | null = null;
interface Noise { dur: number; vol?: number; kind?: BiquadFilterType; f: number; f2?: number; q?: number; at?: number; attack?: number }
function noise({ dur, vol = 0.2, kind = "lowpass", f, f2, q = 1, at = 0, attack = 0.004 }: Noise) {
  const c = audio();
  if (!c) return;
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const t = c.currentTime + at, s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain();
  s.buffer = noiseBuf;
  s.loop = true;
  fl.type = kind;
  fl.Q.value = q;
  fl.frequency.setValueAtTime(f, t);
  if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(fl).connect(g).connect(sfx);
  s.start(t, Math.random());
  s.stop(t + dur + 0.02);
}

const jit = (v: number, a = 0.08) => v * (1 - a + Math.random() * a * 2);

/* ------------------------------------------------------------------ */
/* Effects                                                             */
/* ------------------------------------------------------------------ */

const SFX = {
  /** Pickaxe tick on any click. */
  dig() { noise({ dur: 0.07, vol: 0.16, kind: "bandpass", f: jit(1100), f2: 500, q: 2 }); tone({ type: "square", f: jit(150), f2: 80, dur: 0.05, vol: 0.05 }); },
  ui() { tone({ type: "square", f: 620, dur: 0.04, vol: 0.05 }); tone({ type: "square", f: 930, dur: 0.05, vol: 0.05, at: 0.04 }); },
  pop() { tone({ f: jit(520), f2: 1100, dur: 0.13, vol: 0.16 }); },
  chime() { [660, 880, 1320].forEach((f, i) => tone({ type: "triangle", f, dur: 0.5, vol: 0.1, at: i * 0.09 })); },
  /** Low double grunt. */
  capy() { tone({ type: "sawtooth", f: jit(150), f2: 92, dur: 0.16, vol: 0.09 }); tone({ type: "sawtooth", f: jit(165), f2: 100, dur: 0.2, vol: 0.09, at: 0.2 }); },
  /** Two quick yips. */
  fox() { tone({ type: "square", f: jit(720), f2: 1150, dur: 0.07, vol: 0.07 }); tone({ type: "square", f: jit(820), f2: 1350, dur: 0.09, vol: 0.07, at: 0.11 }); },
  /** A wobbly bleat. */
  woolly() { tone({ type: "sawtooth", f: jit(340), f2: 300, dur: 0.55, vol: 0.07, vib: 26, attack: 0.04 }); },
  /** "Hm-hm." */
  peep() { tone({ type: "triangle", f: jit(190), f2: 160, dur: 0.12, vol: 0.14 }); tone({ type: "triangle", f: jit(240), f2: 205, dur: 0.16, vol: 0.14, at: 0.15 }); },
  squish() { noise({ dur: 0.16, vol: 0.3, f: 2200, f2: 180 }); tone({ f: 300, f2: 55, dur: 0.14, vol: 0.2 }); },
  /** Hinge creak, then the lid knocks back. */
  chestOpen() {
    tone({ type: "sawtooth", f: 82, f2: 170, dur: 0.38, vol: 0.06, vib: 7, attack: 0.05 });
    noise({ dur: 0.3, vol: 0.05, kind: "bandpass", f: 700, f2: 1500, q: 6 });
    tone({ f: 130, f2: 70, dur: 0.1, vol: 0.2, at: 0.36 });
    [988, 1319, 1760].forEach((f, i) => tone({ type: "triangle", f, dur: 0.35, vol: 0.05, at: 0.42 + i * 0.07 }));
  },
  chestClose() { tone({ f: 140, f2: 48, dur: 0.14, vol: 0.28 }); noise({ dur: 0.08, vol: 0.18, f: 500, f2: 120 }); },
  /** A falling shimmer, then a rising one. */
  warp() {
    [0, 7, -5].forEach((d, i) => tone({ type: "sine", f: 1400 + d * 20, f2: 180, dur: 0.38, vol: 0.09, at: i * 0.03, vib: 40 }));
    noise({ dur: 0.45, vol: 0.07, kind: "highpass", f: 5000, f2: 800 });
    [0, 5].forEach((d, i) => tone({ type: "triangle", f: 200 + d * 15, f2: 1600, dur: 0.34, vol: 0.08, at: 0.34 + i * 0.04 }));
  },
  fuse() { noise({ dur: 1.25, vol: 0.09, kind: "highpass", f: 2500, f2: 8000, attack: 0.2 }); tone({ type: "square", f: 300, f2: 900, dur: 1.2, vol: 0.02, attack: 0.3 }); },
  boom() {
    noise({ dur: 1.3, vol: 0.9, f: 1500, f2: 50 });
    noise({ dur: 0.25, vol: 0.5, kind: "highpass", f: 1200, f2: 300 });
    tone({ f: 95, f2: 26, dur: 1.0, vol: 0.9 });
    tone({ type: "triangle", f: 60, f2: 30, dur: 1.4, vol: 0.4, at: 0.05 });
  },
  /** A block dropping into place. */
  place() { tone({ type: "triangle", f: jit(310, 0.2), f2: 170, dur: 0.07, vol: 0.16 }); noise({ dur: 0.05, vol: 0.1, f: 800, f2: 300 }); },
  done() { [523, 659, 784, 1047].forEach((f, i) => tone({ type: "triangle", f, dur: 0.4, vol: 0.1, at: i * 0.08 })); },
};

export type Sound = keyof typeof SFX;
export function play(name: Sound) {
  if (on && ctx) SFX[name]();
}

/* ------------------------------------------------------------------ */
/* Generative ambient music                                            */
/* ------------------------------------------------------------------ */

const hz = (semi: number) => 220 * Math.pow(2, semi / 12);
// Semitones above A3. Day: a bright six-note scale. Night: a darker minor one.
const DAY = [5, 7, 9, 12, 14, 16, 19, 21, 24];
const NIGHT = [0, 2, 3, 7, 9, 10, 12, 14, 15];
let last = 4;

function bell(f: number, at: number, vol: number) {
  const dur = 4 + Math.random() * 2.5;
  tone({ f, dur, vol, at, attack: 0.02, to: music });
  tone({ type: "triangle", f: f * 2, dur: dur * 0.5, vol: vol * 0.25, at, attack: 0.02, to: music });
  tone({ f, dur: dur * 0.8, vol: vol * 0.5, at, attack: 0.02, to: echo });
}

function phrase() {
  if (!on || !ctx) return;
  if (!document.hidden) {
    const scale = document.documentElement.classList.contains("dark") ? NIGHT : DAY;
    const n = 1 + Math.floor(Math.random() * 3);
    let t = 0;
    for (let i = 0; i < n; i++) {
      // Mostly step-wise motion so it sounds like a line, not noise.
      last = Math.max(0, Math.min(scale.length - 1, last + Math.round((Math.random() - 0.5) * 4)));
      bell(hz(scale[last]), t, 0.1);
      t += 0.5 + Math.random() * 0.9;
    }
    if (Math.random() < 0.4) {
      // A soft low drone under the phrase.
      const root = hz(scale[0] - 12);
      tone({ f: root, dur: 9, vol: 0.06, attack: 3, to: music });
      tone({ f: root * 1.5, dur: 9, vol: 0.03, attack: 3.5, to: music });
    }
  }
  musicTimer = window.setTimeout(phrase, 2600 + Math.random() * 3800);
}

function startMusic() {
  window.clearTimeout(musicTimer);
  musicTimer = window.setTimeout(phrase, 600);
}

if (typeof window !== "undefined") {
  const unlock = () => {
    if (!on || ctx) return;
    if (audio()) startMusic();
  };
  window.addEventListener("pointerdown", unlock, { capture: true });
  window.addEventListener("keydown", unlock, { capture: true });
}
