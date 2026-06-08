import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { Field } from "./login";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useUserStore } from "#/store/useUserStore";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — DataSmith" },
      { name: "description", content: "Create your DataSmith workspace." },
    ],
  }),
  component: RegisterPage,
});

// ── Password strength meter ──────────────────────────────────────────────────
function StrengthMeter({ password }: { password: string }) {
  const score = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (password.length >= 12) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const label = ["", "Weak", "Fair", "Good", "Strong", "Very strong"][score];
  const color = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"][score];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5 strength-meter">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-400"
            style={{ background: i <= score ? color : "hsl(var(--border))" }}
          />
        ))}
      </div>
      <p className="text-xs transition-colors duration-300" style={{ color }}>
        {label}
      </p>
    </div>
  );
}

// ── Google SVG ───────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4-5.5 4-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z" />
    </svg>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
function RegisterPage() {

  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [password, setPassword] = useState("");
  const [cpassword, csetPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { loading, done, singup, isRegistered } = useUserStore();


  useEffect(() => {
    if (isRegistered) {
      navigate({ to: "/login", replace: true })

    }
  }, [isRegistered])

  // ── Mount animation ────────────────────────────────────────────────────────
  useGSAP(
    () => {
      const ease = "power4.out";

      // Header
      gsap.fromTo(
        ".reg-header",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease }
      );

      // Card blur-rise
      gsap.fromTo(
        cardRef.current,
        { y: 52, opacity: 0, scale: 0.96, filter: "blur(7px)" },
        { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.9, ease }
      );

      // Inner content cascade — fires after card settles
      const tl = gsap.timeline({ delay: 0.48, defaults: { ease } });

      tl.fromTo(".reg-heading", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 },)
        .fromTo(".reg-sub", { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, "-=0.35",)
        .fromTo(".reg-google", { y: 14, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)" }, "-=0.25",)
        .fromTo(".reg-divider", { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.4 }, "-=0.2",)
        .fromTo(
          ".reg-field",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.48, stagger: 0.09 },
          "-=0.2"
        )
        .fromTo(".reg-submit", { y: 10, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.3)" }, "-=0.1",)
        .fromTo(".reg-login", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.15",);
    },
    { scope: rootRef }
  );

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || done) return;

    gsap.to(cardRef.current, { scale: 0.984, duration: 0.22, ease: "power2.out" });

    // * api implementation :

    const user = {
      name,
      email,
      password,
    }

    await singup(user);

    // navigate({
    //   to: "/login",
    //   replace: true,
    // })

  };

  return (
    <>
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
            rgba(255,255,255,0.3) 50%,
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
        @keyframes checkPop {
          0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
          60%  { transform: scale(1.2) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg);   opacity: 1; }
        }
        .check-pop { animation: checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      <div ref={rootRef} className="relative flex min-h-screen flex-col">
        <div className="pointer-events-none absolute inset-0 hero-gradient" />

        {/* Header */}
        <header className="reg-header relative z-10 flex items-center justify-between p-5" style={{ opacity: 0 }}>
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
            <h1 className="reg-heading text-2xl text-center font-semibold tracking-tight" style={{ opacity: 0 }}>
              Create your account
            </h1>
            <p className="reg-sub mt-1 text-sm text-center text-muted-foreground" style={{ opacity: 0 }}>
              Start chatting with your knowledge in minutes.
            </p>

            {/* Google */}
            <button
              className="reg-google mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-accent hover:scale-[1.01] active:scale-[0.99]"
              style={{ opacity: 0 }}
            >
              <GoogleIcon /> Continue with Google
            </button>

            {/* Divider */}
            <div className="reg-divider my-5 flex items-center gap-3 text-xs text-muted-foreground" style={{ opacity: 0 }}>
              <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>

              {/* Name */}
              <div className="reg-field" style={{ opacity: 0 }}>
                <Field icon={User} label="Full name" value={name} setValue={setName} placeholder="Jane Doe" />
              </div>

              {/* Email */}
              <div className="reg-field" style={{ opacity: 0 }}>
                <Field icon={Mail} label="Email" value={email} setValue={setEmail} type="email" placeholder="you@company.com" />
              </div>

              {/* Password + strength meter */}
              <div className="reg-field" style={{ opacity: 0 }}>
                <Field
                  icon={Lock}
                  label="Password"
                  value={password}
                  setValue={setPassword}
                  type="password"
                  placeholder="At least 8 characters"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <StrengthMeter password={password} />
              </div>

              {/* Confirm password */}
              <div className="reg-field" style={{ opacity: 0 }}>
                <Field icon={Lock} label="Confirm password" value={cpassword} setValue={csetPassword} type="password" placeholder="Repeat password" />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || done}
                className="reg-submit relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-elegant)] transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-80"
                style={{ opacity: 0 }}
              >
                {loading && <span className="btn-shimmer" />}

                {loading ? (
                  <><Loader2 className="h-4 w-4 spinning" /> Creating account…</>
                ) : done ? (
                  <><CheckCircle2 className="h-4 w-4 check-pop" /> Account created!</>
                ) : (
                  <>Create Account <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="reg-login mt-6 text-center text-sm text-muted-foreground" style={{ opacity: 0 }}>
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>
        </main>
      </div>
    </>
  );
}