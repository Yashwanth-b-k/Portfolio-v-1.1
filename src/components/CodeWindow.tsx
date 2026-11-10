import { motion } from "framer-motion";

const lines: string[] = [
  "public sealed record CreateShiftCommand(",
  "    Guid TenantId, string Code, TimeOnly Start, TimeOnly End",
  ") : IRequest<Result<ShiftDto>>;",
  "",
  "public sealed class CreateShiftHandler",
  "    : IRequestHandler<CreateShiftCommand, Result<ShiftDto>>",
  "{",
  "    public async Task<Result<ShiftDto>> Handle(",
  "        CreateShiftCommand cmd, CancellationToken ct)",
  "    {",
  "        var shift = Shift.Create(cmd.TenantId, cmd.Code, cmd.Start, cmd.End);",
  "        _db.Shifts.Add(shift);",
  "        await _db.SaveChangesAsync(ct);          // PostgreSQL — source of truth",
  "        await _readModel.UpsertAsync(shift, ct);  // MongoDB — read projection",
  "        return Result.Ok(shift.ToDto());",
  "    }",
  "}",
];

function colorize(line: string) {
  // Lightweight token colouring — no library.
  const parts = line.split(/(\/\/.*$|"[^"]*"|\b(?:public|sealed|record|class|async|await|var|return|new)\b|\b[A-Z][A-Za-z]+\b)/);
  return parts.map((p, i) => {
    if (!p) return null;
    if (p.startsWith("//")) return <span key={i} className="text-[#7f8a6a]">{p}</span>;
    if (/^"/.test(p)) return <span key={i} className="text-[#f2c84b]">{p}</span>;
    if (/^(public|sealed|record|class|async|await|var|return|new)$/.test(p))
      return <span key={i} className="text-[#ef7a6c]">{p}</span>;
    if (/^[A-Z][A-Za-z]+$/.test(p)) return <span key={i} className="text-[#5fe0d8]">{p}</span>;
    return <span key={i}>{p}</span>;
  });
}

/** A command block: the handler types itself out, line by line, when scrolled into view. */
export function CodeWindow() {
  return (
    <div className="mc-panel mc-panel-dark text-left" data-mat="deep">
      <div className="flex items-center gap-2 border-b-4 border-[#0e0e11] px-4 py-3">
        <span className="h-3 w-3 bg-[#ef5a4c]" />
        <span className="h-3 w-3 bg-[#f2c84b]" />
        <span className="h-3 w-3 bg-[#3fd16a]" />
        <span className="label ml-2 truncate text-white/50">CreateShiftHandler.cs — master_service</span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 font-mono text-[17px] leading-[1.25] text-white/90 sm:px-5 sm:text-[19px]">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.15 + i * 0.05, duration: 0.3 }}
            className="flex"
          >
            <span className="mr-4 w-6 shrink-0 select-none text-right text-white/25">{i + 1}</span>
            <span className="whitespace-pre">{colorize(l)}</span>
            {i === lines.length - 1 && <span className="caret ml-1 inline-block h-[1em] w-[0.5em] bg-[#8fe34a]" />}
          </motion.div>
        ))}
      </pre>
    </div>
  );
}
