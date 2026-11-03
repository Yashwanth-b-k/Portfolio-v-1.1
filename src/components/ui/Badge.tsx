import type { ReactNode } from "react";
import { cn } from "@/utils";

export function Badge({
  children,
  strong = false,
  onDark = false,
}: {
  children: ReactNode;
  strong?: boolean;
  onDark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[12px] font-medium",
        onDark
          ? strong
            ? "bg-white text-black"
            : "bg-white/10 text-white/80 ring-1 ring-white/10"
          : strong
            ? "bg-light-text text-white dark:bg-white dark:text-black"
            : "bg-black/[0.06] text-light-text/80 dark:bg-white/10 dark:text-dark-text/80"
      )}
    >
      {children}
    </span>
  );
}
