import { useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import {
  Bot,
  Database,
  Globe,
  Layers,
  MessageSquare,
  UserCheck,
  Cpu,
  Upload,
  Brain,
  Search,
  Sparkles,
  ArrowRight,
  Zap,
  FileText,
} from "lucide-react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useUserStore } from "#/store/useUserStore";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DataSmith — Build, Search & Chat with Your Knowledge" },
      {
        name: "description",
        content:
          "An agentic AI workspace combining RAG retrieval, web search, and reasoning to chat with your data.",
      },
      { property: "og:title", content: "DataSmith — AI Agent Workspace" },
      {
        property: "og:description",
        content:
          "An agentic AI workspace combining RAG retrieval, web search, and reasoning.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Bot,
    title: "Agentic AI",
    desc: "Autonomous agents that plan, reason, and act across multi-step workflows.",
  },
  {
    icon: Database,
    title: "RAG Retrieval",
    desc: "Hybrid vector + keyword retrieval grounded in your private knowledge base.",
  },
  {
    icon: Globe,
    title: "Web Search",
    desc: "Live web augmentation so answers stay current with the real world.",
  },
  {
    icon: Layers,
    title: "Multi-Modal Inputs",
    desc: "Documents, images, code, and structured data — all in one workspace.",
  },
  {
    icon: MessageSquare,
    title: "Conversation Memory",
    desc: "Persistent context across sessions for stateful reasoning.",
  },
  {
    icon: UserCheck,
    title: "Human-in-the-Loop",
    desc: "Approve, edit, and steer agent decisions when accuracy matters.",
  },
  {
    icon: Cpu,
    title: "FastAPI + LangGraph",
    desc: "Production-grade architecture built for scale and reliability.",
  },
  {
    icon: Sparkles,
    title: "Reasoning-First",
    desc: "Explainable steps so you always see how an answer was derived.",
  },
];

const steps = [
  {
    icon: Upload,
    title: "Upload Documents",
    desc: "Drop PDFs, notes, and data into a secure workspace.",
  },
  {
    icon: Brain,
    title: "Agent Plans Tasks",
    desc: "LangGraph decomposes your goal into actionable steps.",
  },
  {
    icon: Database,
    title: "Retrieve Knowledge",
    desc: "RAG pipeline surfaces the most relevant context.",
  },
  {
    icon: Search,
    title: "Search Web",
    desc: "Augments internal knowledge with live web data.",
  },
  {
    icon: Sparkles,
    title: "Generate Answer",
    desc: "Synthesized, cited, and ready to act on.",
  },
];

const stack = ["FastAPI", "LangGraph", "Qdrant", "MongoDB", "React", "TypeScript"];

function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useUserStore();

  useGSAP(
    () => {
      // ─── HERO ─────────────────────────────────────────────────────────────
      // Elements start invisible (set in inline style). GSAP animates to visible.
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .fromTo(".hero-badge", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 })
        .fromTo(".hero-title", { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, "-=0.3")
        .fromTo(".hero-copy", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.45")
        .fromTo(".hero-actions", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.35")
        .fromTo(".hero-graphic", { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.3");

      // ─── FEATURES heading ─────────────────────────────────────────────────
      // Slides in from the left with a slight fade
      gsap.fromTo(
        ".feature-heading",
        { x: -32, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-section",
            start: "top 82%",
            once: true,
          },
        }
      );

      // ─── FEATURES cards ───────────────────────────────────────────────────
      // Each card rises with a slight Y offset and a clip-path reveal (iris-in effect)
      gsap.fromTo(
        ".feature-card",
        {
          y: 48,
          opacity: 0,
          scale: 0.96,
          clipPath: "inset(12% 8% 12% 8% round 16px)",
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0% round 16px)",
          duration: 0.7,
          stagger: {
            each: 0.09,
            ease: "power1.out",
          },
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-section",
            start: "top 76%",
            once: true,
          },
        }
      );

      // ─── HOW IT WORKS heading ─────────────────────────────────────────────
      gsap.fromTo(
        ".how-heading",
        { x: -32, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: {
            trigger: ".how-section",
            start: "top 82%",
            once: true,
          },
        }
      );

      // ─── STEP cards ───────────────────────────────────────────────────────
      // Cards fan in sequentially: first card comes from left, last from right
      // creating a "spreading" reveal effect
      gsap.fromTo(
        ".step-card",
        (index: number) => ({
          x: (index - 2) * 18,   // -36, -18, 0, 18, 36 — fan spread
          y: 52,
          opacity: 0,
          scale: 0.94,
        }),
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          stagger: {
            each: 0.1,
            ease: "power1.inOut",
          },
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".how-section",
            start: "top 76%",
            once: true,
          },
        }
      );

      // ─── STACK heading ────────────────────────────────────────────────────
      gsap.fromTo(
        ".stack-heading",
        { x: -32, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: {
            trigger: ".stack-section",
            start: "top 82%",
            once: true,
          },
        }
      );

      // ─── STACK chips ──────────────────────────────────────────────────────
      // Pop in with a subtle scale bounce
      gsap.fromTo(
        ".stack-chip",
        { y: 28, opacity: 0, scale: 0.88 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: { each: 0.07, ease: "power1.out" },
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".stack-section",
            start: "top 80%",
            once: true,
          },
        }
      );

      // ─── CTA card ─────────────────────────────────────────────────────────
      // Scale-up from very slightly smaller with a clip-path reveal from the bottom
      gsap.fromTo(
        ".cta-card",
        {
          y: 48,
          opacity: 0,
          scale: 0.97,
          clipPath: "inset(6% 4% 6% 4% round 24px)",
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-section",
            start: "top 84%",
            once: true,
          },
        }
      );

      // Refresh after all triggers are registered
      ScrollTrigger.refresh();
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative min-h-screen flex flex-col">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 hero-gradient" />
        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div
              className="hero-badge mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
              style={{ opacity: 0 }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Agentic RAG for production teams
            </div>

            <h1
              className="hero-title text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
              style={{ opacity: 0 }}
            >
              Build, Search, Analyze, and{" "}
              <span className="text-gradient">Chat with Your Knowledge</span>
            </h1>

            <p
              className="hero-copy mx-auto mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg"
              style={{ opacity: 0 }}
            >
              DataSmith is an AI Agent workspace that combines advanced RAG retrieval,
              graph reasoning, and live web search to deliver grounded, explainable answers.
            </p>

            <div
              className="hero-actions mt-8 flex flex-wrap items-center justify-center gap-3"
              style={{ opacity: 0 }}
            >
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-lg bg-(image:--gradient-primary) px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-(--shadow-elegant) transition-transform hover:scale-[1.02]"
              >
                Start Chatting <ArrowRight className="h-4 w-4" />
              </Link>
              {
                !isAuthenticated && (
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    Create Account
                  </Link>

                )
              }
            </div>
          </div>

          {/* Hero illustration */}
          <div
            className="hero-graphic mx-auto mt-[100px] max-w-5xl"
            style={{ opacity: 0 }}
          >
            <div className="glass rounded-2xl p-6 shadow-(--shadow-elegant)">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {[
                  { icon: Upload, label: "Upload Files" },
                  { icon: Brain, label: "Agent Planning" },
                  { icon: Database, label: "Retrieval" },
                  { icon: Globe, label: "Web Search" },
                  { icon: Sparkles, label: "Final Answer" },
                ].map((s, i) => (
                  <div
                    key={s.label}
                    className="relative flex flex-col items-center gap-2 rounded-xl border border-border bg-surface-elevated/60 p-4 text-center"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium">{s.label}</span>
                    {i < 4 && (
                      <ArrowRight className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-muted-foreground sm:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="features-section mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="feature-heading mb-12 max-w-2xl" style={{ opacity: 0 }}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything your agents need
          </h2>
          <p className="mt-3 text-muted-foreground">
            A complete toolkit for retrieval, reasoning, and real-world action.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="feature-card group relative rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20"
              style={{ opacity: 0 }}
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="how-section border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="how-heading mb-12 max-w-2xl" style={{ opacity: 0 }}>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Five steps from raw documents to reasoned answers.
            </p>
          </div>

          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <li
                key={s.title}
                className="step-card relative rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20"
                style={{ opacity: 0 }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">
                    0{i + 1}
                  </span>
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-sm font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* STACK */}
      <section className="stack-section mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="stack-heading mb-10 max-w-2xl" style={{ opacity: 0 }}>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Built on a modern stack
          </h2>
          <p className="mt-3 text-muted-foreground">
            Battle-tested tools that scale from prototype to production.
          </p>
        </div>

        <div className="stack-chips flex flex-wrap gap-3">
          {stack.map((s) => (
            <div
              key={s}
              className="stack-chip flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:-translate-y-1 hover:border-primary/20"
              style={{ opacity: 0 }}
            >
              <Zap className="h-4 w-4 text-primary" /> {s}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div
          className="cta-card relative overflow-hidden rounded-3xl border border-border bg-(image:--gradient-primary) p-10 text-center text-primary-foreground sm:p-14"
          style={{ opacity: 0 }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at top right, white, transparent 60%)",
            }}
          />
          <div className="relative">
            <FileText className="mx-auto mb-4 h-8 w-8" />
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Bring your knowledge to life
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm opacity-90 sm:text-base">
              Start chatting with your data in minutes — no setup, no infrastructure.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-lg bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
              >
                Start Chatting
              </Link>
              {
                !isAuthenticated && (

                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur transition-colors hover:bg-white/20"
                  >
                    Create Account
                  </Link>
                )
              }
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}