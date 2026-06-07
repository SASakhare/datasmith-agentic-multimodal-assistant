import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 font-semibold tracking-tight ${className}`}>
      <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L3 7l9 5 9-5-9-5z" />
          <path d="M3 17l9 5 9-5" />
          <path d="M3 12l9 5 9-5" />
        </svg>
      </span>
      <span className="text-lg">DataSmith</span>
    </Link>
  );
}
