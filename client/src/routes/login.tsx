import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useUserStore } from "#/store/useUserStore";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — DataSmith" },
      { name: "description", content: "Sign in to your DataSmith workspace." },
    ],
  }),
  component: LoginPage,
});

// ─── Shared Field component ──────────────────────────────────────────────────
export function Field({
  icon: Icon,
  label,
  value,
  setValue,
  ...props
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);

  return (
    <label className="field-item block">
      <span
        className="mb-1.5 block text-xs font-medium transition-colors duration-200"
        style={{ color: focused ? "var(--color-primary, hsl(var(--primary)))" : undefined }}
      >
        {label}
      </span>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200"
          style={{
            color: focused
              ? "var(--color-primary, hsl(var(--primary)))"
              : "hsl(var(--muted-foreground))",
          }}
        />
        <input
          {...props}
          value={value}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          onChange={(e) => { setValue(e.target.value) }}
          className="w-full rounded-lg border border-input bg-surface-elevated py-2.5 pl-10 pr-3 text-sm outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {/* Animated bottom-line accent that grows on focus */}
        <span
          className="pointer-events-none absolute bottom-0 left-1/2 h-px rounded-full bg-primary transition-all duration-300"
          style={{
            width: focused ? "calc(100% - 8px)" : "0%",
            transform: "translateX(-50%)",
            opacity: focused ? 1 : 0,
          }}
        />
      </div>
    </label>
  );
}

// ─── Google SVG ─────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4-5.5 4-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z"
      />
    </svg>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
function LoginPage() {

  const navigate = useNavigate();

  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { login, loading, done, isAuthenticated } = useUserStore();

  // ── Mount animation ────────────────────────────────────────────────────────
  useGSAP(
    () => {
      const ease = "power4.out";

      // Header items slide in from top
      gsap.fromTo(
        ".login-header",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease }
      );

      // Card rises with a blur-dissolve + scale
      gsap.fromTo(
        cardRef.current,
        { y: 48, opacity: 0, scale: 0.96, filter: "blur(6px)" },
        { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.85, ease }
      );

      // Inner elements stagger in after the card arrives
      const tl = gsap.timeline({ delay: 0.45, defaults: { ease } });

      tl.fromTo(
        ".card-heading",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55 }
      )
        .fromTo(
          ".card-sub",
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45 },
          "-=0.35"
        )
        .fromTo(
          ".google-btn",
          { y: 14, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)" },
          "-=0.25"
        )
        .fromTo(
          ".divider",
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.45 },
          "-=0.2"
        )
        .fromTo(
          ".field-item",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.1 },
          "-=0.2"
        )
        .fromTo(
          ".forgot-link",
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          "-=0.1"
        )
        .fromTo(
          ".submit-btn",
          { y: 10, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.3)" },
          "-=0.15"
        )
        .fromTo(
          ".signup-link",
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.4 },
          "-=0.15"
        );
    },
    { scope: rootRef }
  );

  // ── Submit handler ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || done) return;


    // Animate the card to slightly scale down while loading
    gsap.to(cardRef.current, {
      scale: 0.985,
      duration: 0.25,
      ease: "power2.out",
    });


    // * api implementation :


    const user = {
      email: email,
      password: password,
    }
    await login(user);

    // navigate({ to: "/", replace: true })


  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/', replace: true })

    }
  }, [isAuthenticated])

  return (
    <>
      {/* Keyframes for the spinner and shimmer */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinning { animation: spin 0.8s linear infinite; }

        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        .btn-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.18) 40%,
            rgba(255,255,255,0.32) 50%,
            rgba(255,255,255,0.18) 60%,
            transparent 100%
          );
          background-size: 400px 100%;
          animation: shimmer 1.4s infinite;
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
        }
      `}</style>

      <div ref={rootRef} className="relative flex min-h-screen flex-col">
        {/* Background gradient */}
        <div className="pointer-events-none absolute inset-0 hero-gradient" />

        {/* Header */}
        <header className="login-header relative z-10 flex items-center justify-between p-5" style={{ opacity: 0 }}>
          <Logo />
          <ThemeToggle />
        </header>

        {/* Card */}
        <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
          <div
            ref={cardRef}
            className="w-full max-w-md rounded-3xl border border-border bg-card/80 p-8 shadow-(--shadow-elegant) backdrop-blur"
            style={{ opacity: 0 }}
          >
            {/* Heading */}
            <h1 className="card-heading text-2xl text-center font-semibold tracking-tight" style={{ opacity: 0 }}>
              Welcome To DataSmith
            </h1>
            <p className="card-sub mt-1 text-sm text-center text-muted-foreground" style={{ opacity: 0 }}>
              Sign in to continue to your workspace.
            </p>

            {/* Google button */}

            {/* //* button to trigger the sing in with google */}
            <button
              className="google-btn mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent hover:scale-[1.01] active:scale-[0.99]"
              style={{ opacity: 0 }}
            >
              <GoogleIcon /> Continue with Google
            </button>

            {/* Divider */}
            <div
              className="divider my-5 flex items-center gap-3 text-xs text-muted-foreground"
              style={{ opacity: 0 }}
            >
              <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Field icon={Mail} label="Email" value={email} setValue={setEmail} type="email" placeholder="you@company.com" />
              <Field icon={Lock} label="Password" value={password} setValue={setPassword} type="password" placeholder="••••••••" />

              <div className="forgot-link flex justify-end" style={{ opacity: 0 }}>

                {/* // * we have to add forgot password functionality */}
                <a
                  href="#"
                  className="text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || done}
                className="submit-btn relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-80"
                style={{ opacity: 0 }}
              >
                {/* Shimmer overlay while loading */}
                {/* //* showing the status of sining */}
                {loading && <span className="btn-shimmer" />}

                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 spinning" />
                    Signing in…
                  </>
                ) : done ? (
                  <>
                    ✓ Signed in
                  </>
                ) : (
                  <>
                    Login <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Sign-up link */}
            <p className="signup-link mt-6 text-center text-sm text-muted-foreground" style={{ opacity: 0 }}>
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}