import type { ReactNode } from "react";
import { cn } from "@/utils";

export function Card({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-light-border bg-light-bg p-6 shadow-apple transition-all duration-500 dark:border-dark-border dark:bg-dark-secondary dark:shadow-apple-dark sm:p-8",
        interactive &&
          "hover:-translate-y-1 hover:border-light-accent/40 hover:shadow-apple-lg dark:hover:border-dark-accent/40",
        className
      )}
    >
      {children}
    </div>
  );
}
