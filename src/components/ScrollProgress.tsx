import { useScrollProgress } from "@/hooks/useScrollProgress";

export function ScrollProgress() {
  const progress = useScrollProgress();
  return (
    <div
      className="fixed left-0 top-0 z-[60] h-0.5 w-full"
      aria-hidden="true"
    >
      <div
        className="h-full origin-left bg-light-accent transition-transform duration-150 ease-out dark:bg-dark-accent"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
