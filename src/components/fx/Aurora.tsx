/** Animated mesh-gradient background: three slow-drifting blurred blobs + grain. */
export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="blob blob-a" />
      <div className="blob blob-b" />
      <div className="blob blob-c" />
      <div className="grain" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_30%,#000_95%)]" />
    </div>
  );
}
