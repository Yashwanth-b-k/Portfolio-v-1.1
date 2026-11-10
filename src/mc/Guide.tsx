import type { ReactNode } from "react";
import { cn } from "@/utils";
import { Habitat } from "./Habitat";

/** A peep who stands beside the content, watches the cursor, and has something to say. */
export function Guide({
  look,
  name,
  children,
  say,
  flip,
  className,
}: {
  look: string;
  name: string;
  children: ReactNode;
  say?: string[];
  flip?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end gap-4", flip && "flex-row-reverse", className)}>
      <Habitat mode="guide" mobs={[{ id: `guide-${look}`, kind: "peep", look, still: true, say }]} />
      <div className={cn("speech", flip && "speech-flip")}>
        <p className="label mb-1 text-[9px] opacity-60">{name}</p>
        {children}
      </div>
    </div>
  );
}
