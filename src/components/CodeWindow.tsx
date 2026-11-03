import { motion } from "framer-motion";

const lines: { t: string; c?: string }[] = [
  { t: "public sealed record CreateShiftCommand(", c: "kw" },
  { t: "    Guid TenantId, string Code, TimeOnly Start, TimeOnly End" },
  { t: ") : IRequest<Result<ShiftDto>>;" },
  { t: "" },
  { t: "public sealed class CreateShiftHandler", c: "kw" },
  { t: "    : IRequestHandler<CreateShiftCommand, Result<ShiftDto>>" },
  { t: "{" },
  { t: "    public async Task<Result<ShiftDto>> Handle(" },
  { t: "        CreateShiftCommand cmd, CancellationToken ct)" },
  { t: "    {" },
  { t: "        var shift = Shift.Create(cmd.TenantId, cmd.Code, cmd.Start, cmd.End);" },
  { t: "        _db.Shifts.Add(shift);" },
  { t: "        await _db.SaveChangesAsync(ct);          // PostgreSQL — source of truth", c: "cm" },
  { t: "        await _readModel.UpsertAsync(shift, ct);  // MongoDB — read projection", c: "cm" },
  { t: "        return Result.Ok(shift.ToDto());" },
  { t: "    }" },
  { t: "}" },
];

function colorize(line: string) {
  // Lightweight token colouring — no library.
  const parts = line.split(/(\/\/.*$|"[^"]*"|\b(?:public|sealed|record|class|async|await|var|return|new)\b|\b[A-Z][A-Za-z]+\b)/);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.startsWith("//")) return <span key={i} className="text-white/35">{p}</span>;
    if (/^"/.test(p)) return <span key={i} className="text-[#ff9f0a]">{p}</span>;
    if (/^(public|sealed|record|class|async|await|var|return|new)$/.test(p))
      return <span key={i} className="text-[#ff7ab2]">{p}</span>;
    if (/^[A-Z][A-Za-z]+$/.test(p)) return <span key={i} className="text-[#64d2ff]">{p}</span>;
    return <span key={i}>{p}</span>;
  });
}

export function CodeWindow() {
  return (
    <div className="relative mx-auto w-full max-w-4xl">
      {/* Glow */}
      <div
        aria-hidden
        className="absolute -inset-x-10 -bottom-16 top-10 -z-10 rounded-[3rem] opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(50% 60% at 30% 40%, rgba(94,92,230,0.55), transparent 70%), radial-gradient(50% 60% at 75% 60%, rgba(10,132,255,0.5), transparent 70%)",
        }}
      />
      <div className="overflow-hidden rounded-[22px] bg-[#1c1c1e] text-left shadow-window ring-1 ring-white/10">
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-[12px] text-white/40">
            CreateShiftHandler.cs — master_service
          </span>
        </div>
        <pre className="overflow-x-auto px-5 py-5 font-mono text-[12px] leading-[1.7] text-white/85 sm:text-[13px]">
          {lines.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + i * 0.045, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex"
            >
              <span className="mr-5 w-5 shrink-0 select-none text-right text-white/20">
                {i + 1}
              </span>
              <span className="whitespace-pre">{colorize(l.t)}</span>
              {i === lines.length - 1 && (
                <span className="caret ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[2px] bg-white/70" />
              )}
            </motion.div>
          ))}
        </pre>
      </div>
    </div>
  );
}
