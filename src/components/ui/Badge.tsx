import type { ReactNode } from "react";
import { cn } from "@/utils";

export function Badge({ children, strong = false }: { children: ReactNode; strong?: boolean; onDark?: boolean }) {
  return <span className={cn("chip", strong && "chip-strong")}>{children}</span>;
}
