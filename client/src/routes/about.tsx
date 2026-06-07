import { useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Mail, Linkedin, Github, Workflow, Database, Globe, Brain } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About DataSmith — AI Agent Workspace" },
      { name: "description", content: "Our mission, technology, and the team behind DataSmith." },
      { property: "og:title", content: "About DataSmith" },
      { property: "og:description", content: "Our mission, technology, and the team behind DataSmith." },
    ],
  }),
  component: About,
});

const tech = [
  { icon: Brain,    title: "AI Agent Architecture", desc: "Goal-driven agents that plan, reflect, and self-correct." },
  { icon: Workflow, title: "LangGraph Workflow",     desc: "Cyclical graph orchestration for complex analytical tasks." },
  { icon: Database, title: "RAG Pipeline",           desc: "Context-aware retrieval grounded in your private knowledge." },
  { icon: Globe,    title: "Web Search Integration", desc: "Live information to keep answers current and complete." },
];

const team = [
  { name: "Sarah Jenkins",    role: "CEO & Co-Founder" },
  { name: "David Chen",       role: "Chief Technology Officer" },
  { name: "Dr. Elena Rostova",role: "Head of AI Research" },
  { name: "Marcus Thorne",    role: "Head of Product" },
];

const bullets = [
  "Grounded answers with full citations.",
  "Transparent agent reasoning at every step.",
  "Enterprise-grade privacy and control.",
  "Built for scale on open infrastructure.",
];

function About() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // ── shared ease ──────────────────────────────────────────────────────
      const smooth = "power4.out";

      // ── HERO ─────────────────────────────────────────────────────────────
      // Title words split with a stagger so each word cascades in individually
      gsap.fromTo(
        ".about-hero-title",
        { y: 56, opacity: 0, filter: "blur(8px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: smooth }
      );
      gsap.fromTo(
        ".about-hero-sub",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: smooth, delay: 0.35 }
      );

      // ── MISSION label + heading ──────────────────────────────────────────
      gsap.fromTo(
        ".mission-label",
        { x: -24, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.65, ease: smooth,
          scrollTrigger: { trigger: ".mission-section", start: "top 82%", once: true },
        }
      );
      gsap.fromTo(
        ".mission-heading",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.75, ease: smooth,
          scrollTrigger: { trigger: ".mission-section", start: "top 80%", once: true },
          delay: 0.08,
        }
      );
      gsap.fromTo(
        ".mission-body",
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: smooth,
          scrollTrigger: { trigger: ".mission-section", start: "top 78%", once: true },
          delay: 0.18,
        }
      );

      // Mission card: scales up from center with a spring feel
      gsap.fromTo(
        ".mission-card",
        { scale: 0.93, opacity: 0, y: 24 },
        {
          scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.3)",
          scrollTrigger: { trigger: ".mission-section", start: "top 76%", once: true },
          delay: 0.1,
        }
      );

      // Bullet points stagger in one by one after the card lands
      gsap.fromTo(
        ".mission-bullet",
        { x: -16, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: smooth,
          scrollTrigger: { trigger: ".mission-section", start: "top 72%", once: true },
          delay: 0.35,
        }
      );

      // ── TECH section heading ─────────────────────────────────────────────
      gsap.fromTo(
        ".tech-heading",
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: smooth,
          scrollTrigger: { trigger: ".tech-section", start: "top 83%", once: true },
        }
      );
      gsap.fromTo(
        ".tech-sub",
        { y: 18, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.65, ease: smooth,
          scrollTrigger: { trigger: ".tech-section", start: "top 80%", once: true },
          delay: 0.12,
        }
      );

      // Tech cards: clip-path iris-in with stagger
      gsap.fromTo(
        ".tech-card",
        {
          y: 44,
          opacity: 0,
          scale: 0.95,
          clipPath: "inset(14% 8% 14% 8% round 16px)",
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0% round 16px)",
          duration: 0.72,
          stagger: { each: 0.1, ease: "power1.out" },
          ease: smooth,
          scrollTrigger: { trigger: ".tech-section", start: "top 76%", once: true },
          delay: 0.15,
        }
      );

      // ── TEAM heading ─────────────────────────────────────────────────────
      gsap.fromTo(
        ".team-heading",
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: smooth,
          scrollTrigger: { trigger: ".team-section", start: "top 83%", once: true },
        }
      );
      gsap.fromTo(
        ".team-sub",
        { y: 18, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.65, ease: smooth,
          scrollTrigger: { trigger: ".team-section", start: "top 80%", once: true },
          delay: 0.1,
        }
      );

      // Team cards: rise up with a slight Y fan (outer cards travel further)
      gsap.fromTo(
        ".team-card",
        (index: number) => ({
          y: 52 + Math.abs(index - 1.5) * 10, // 67, 57, 57, 67
          opacity: 0,
          scale: 0.94,
        }),
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.72,
          stagger: { each: 0.1, ease: "power1.inOut" },
          ease: "power3.out",
          scrollTrigger: { trigger: ".team-section", start: "top 77%", once: true },
          delay: 0.12,
        }
      );

      // Avatar circles: pop in with a spring after the cards settle
      gsap.fromTo(
        ".team-avatar",
        { scale: 0.55, opacity: 0 },
        {
          scale: 1,
          opacity: 0.9,
          duration: 0.55,
          stagger: 0.1,
          ease: "back.out(1.8)",
          scrollTrigger: { trigger: ".team-section", start: "top 74%", once: true },
          delay: 0.45,
        }
      );

      // ── CONTACT ──────────────────────────────────────────────────────────
      gsap.fromTo(
        ".contact-heading",
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: smooth,
          scrollTrigger: { trigger: ".contact-section", start: "top 85%", once: true },
        }
      );
      gsap.fromTo(
        ".contact-link",
        { y: 20, opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: { each: 0.1, ease: "power1.out" },
          ease: "back.out(1.5)",
          scrollTrigger: { trigger: ".contact-section", start: "top 82%", once: true },
          delay: 0.18,
        }
      );

      ScrollTrigger.refresh();
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 hero-gradient" />
          <div className="relative mx-auto max-w-4xl px-4 pt-20 pb-16 text-center sm:px-6 lg:px-8">
            <h1
              className="about-hero-title text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
              style={{ opacity: 0 }}
            >
              Empowering decisions through{" "}
              <span className="text-gradient">Intelligent Agents</span>.
            </h1>
            <p
              className="about-hero-sub mx-auto mt-5 max-w-2xl text-pretty text-muted-foreground sm:text-lg"
              style={{ opacity: 0 }}
            >
              DataSmith is building the definitive workspace for AI agents. We combine
              advanced RAG pipelines, graph reasoning, and web search to provide a
              comprehensive, reasoning-first approach to complex data analysis.
            </p>
          </div>
        </section>

        {/* ── MISSION ──────────────────────────────────────────────────── */}
        <section className="mission-section mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span
                className="mission-label text-xs font-mono uppercase tracking-wider text-primary"
                style={{ opacity: 0 }}
              >
                Our Mission
              </span>
              <h2
                className="mission-heading mt-2 text-3xl font-semibold tracking-tight"
                style={{ opacity: 0 }}
              >
                Make every team's knowledge actionable.
              </h2>
              <p
                className="mission-body mt-4 text-muted-foreground"
                style={{ opacity: 0 }}
              >
                We believe the next generation of software isn't built around forms and
                dashboards — it's built around agents that reason over your knowledge
                and take action on your behalf.
              </p>
            </div>

            <div
              className="mission-card rounded-3xl border border-border bg-card p-8 shadow-[var(--shadow-elegant)]"
              style={{ opacity: 0 }}
            >
              <ul className="space-y-3 text-sm">
                {bullets.map((b) => (
                  <li
                    key={b}
                    className="mission-bullet flex gap-3"
                    style={{ opacity: 0 }}
                  >
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── TECHNOLOGY ───────────────────────────────────────────────── */}
        <section className="tech-section border-y border-border bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2
              className="tech-heading text-3xl font-semibold tracking-tight"
              style={{ opacity: 0 }}
            >
              Core Architecture
            </h2>
            <p
              className="tech-sub mt-3 max-w-2xl text-muted-foreground"
              style={{ opacity: 0 }}
            >
              A foundation of cutting-edge AI technologies, designed for reliability,
              depth, and actionable insights.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {tech.map((t) => (
                <div
                  key={t.title}
                  className="tech-card rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-elegant)]"
                  style={{ opacity: 0 }}
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold">{t.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ─────────────────────────────────────────────────────── */}
        <section className="team-section mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2
              className="team-heading text-3xl font-semibold tracking-tight"
              style={{ opacity: 0 }}
            >
              Leadership Team
            </h2>
            <p
              className="team-sub mt-3 text-muted-foreground"
              style={{ opacity: 0 }}
            >
              Experts in machine learning, data architecture, and enterprise software design.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <div
                key={m.name}
                className="team-card rounded-2xl border border-border bg-card p-6 text-center"
                style={{ opacity: 0 }}
              >
                <div
                  className="team-avatar mx-auto mb-4 h-20 w-20 rounded-full bg-[image:var(--gradient-primary)]"
                  style={{ opacity: 0 }}
                />
                <h3 className="text-sm font-semibold">{m.name}</h3>
                <p className="text-xs text-muted-foreground">{m.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTACT ──────────────────────────────────────────────────── */}
        <section className="contact-section mx-auto max-w-3xl px-4 pb-20 text-center sm:px-6 lg:px-8">
          <h2
            className="contact-heading text-3xl font-semibold tracking-tight"
            style={{ opacity: 0 }}
          >
            Get in Touch
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:hello@datasmith.ai"
              className="contact-link inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm hover:bg-accent transition-colors"
              style={{ opacity: 0 }}
            >
              <Mail className="h-4 w-4" /> hello@datasmith.ai
            </a>
            <a
              href="#"
              className="contact-link inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm hover:bg-accent transition-colors"
              style={{ opacity: 0 }}
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <a
              href="#"
              className="contact-link inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm hover:bg-accent transition-colors"
              style={{ opacity: 0 }}
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
