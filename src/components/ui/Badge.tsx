import type { ReactNode } from "react";
import { cn } from "@/utils";

export function Badge({
  children,
  strong = false,
}: {
  children: ReactNode;
  strong?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        strong
          ? "border-light-accent/30 bg-light-accent/10 text-light-accent dark:border-dark-accent/30 dark:bg-dark-accent/15 dark:text-dark-accent"
          : "border-light-border bg-light-bg text-light-text/80 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text/80"
      )}
    >
      {children}
    </span>
  );
}
