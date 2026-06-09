import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus, Search, Settings, LogOut, PanelLeftClose, PanelLeftOpen,
  PanelRightClose, PanelRightOpen, Send, Paperclip, Copy, RefreshCw,
  Sparkles, FileText, Globe, Bot, Database, Activity, Link2, CheckCheck,
} from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ConversationStore } from "@/store/useChatStore";
import { useUserStore } from "#/store/useUserStore";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat — DataSmith" },
      { name: "description", content: "Chat with your AI agent." },
    ],
  }),
  component: ChatPage,
});

const conversations = [
  { id: "1", title: "Q3 revenue analysis", time: "2m ago", active: true },
  { id: "2", title: "Summarize onboarding docs", time: "1h ago" },
  { id: "3", title: "Competitor research", time: "Yesterday" },
  { id: "4", title: "Draft launch announcement", time: "2d ago" },
  { id: "5", title: "Pull metrics from MongoDB", time: "1w ago" },
];

const suggestions = [
  { icon: FileText, title: "Summarize a document", desc: "Drop a PDF and get the gist" },
  { icon: Globe, title: "Research a topic", desc: "Combine web + knowledge base" },
  { icon: Sparkles, title: "Brainstorm ideas", desc: "Generate a structured plan" },
  { icon: Bot, title: "Build a workflow", desc: "Design a multi-step agent" },
];

type Msg = { id: string; role: "user" | "assistant"; content: string; copied?: boolean };

// ─── Typing dots ────────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-3 typing-row">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
        <Bot className="h-4 w-4" />
      </div>
      <div className="flex items-center rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-primary/60 typing-dot"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Single message bubble ───────────────────────────────────────────────────
function MessageBubble({ msg, onCopy }: { msg: Msg; onCopy: (id: string) => void }) {
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    if (msg.role === "user") {
      gsap.fromTo(
        el,
        { x: 40, opacity: 0, scale: 0.95 },
        { x: 0, opacity: 1, scale: 1, duration: 0.42, ease: "power3.out" }
      );
    } else {
      // Assistant: clip-path wipe from the left + rise
      gsap.fromTo(
        el,
        { clipPath: "inset(0 100% 0 0)", opacity: 0, y: 12 },
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
        }
      );
    }
  }, []);

  return (
    <li ref={ref} style={{ opacity: 0 }}>
      {msg.role === "user" ? (
        <div className="flex justify-end">
          <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-(image:--gradient-primary) px-4 py-2.5 text-sm text-primary-foreground shadow-(--shadow-elegant)">
            {msg.content}
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
            <Bot className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3 text-sm shadow-sm">
            <p className="leading-relaxed">{msg.content}</p>
            <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs">
              <code>{`agent.run(query="Q3 revenue", sources=["docs", "web"])`}</code>
            </pre>
            <div className="mt-3 flex items-center gap-1 text-muted-foreground">
              <button
                onClick={() => onCopy(msg.id)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors hover:bg-accent hover:text-foreground"
              >
                {msg.copied
                  ? <><CheckCheck className="h-3 w-3 text-emerald-500" /> Copied</>
                  : <><Copy className="h-3 w-3" /> Copy</>
                }
              </button>
              <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors hover:bg-accent hover:text-foreground">
                <RefreshCw className="h-3 w-3" /> Regenerate
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
function ChatPage() {
  const {logout}=useUserStore();
  const { create_new_conversation } = ConversationStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sidebarRef = useRef<HTMLElement>(null);
  const contextRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNewChat = async (e: any) => {

    await create_new_conversation();

  }

  const handleLogout=async (e:any)=>{
    await logout();

  }

  // ── Sidebar open/close animation ──────────────────────────────────────────
  const prevSidebar = useRef(sidebarOpen);
  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;
    if (sidebarOpen && !prevSidebar.current) {
      // Opening: expand width then fade in children
      gsap.fromTo(el, { width: 0 }, { width: 288, duration: 0.32, ease: "power3.out" });
      gsap.fromTo(el.children, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.28, stagger: 0.04, ease: "power2.out", delay: 0.15 });
    } else if (!sidebarOpen && prevSidebar.current) {
      // Closing: fade out children then collapse
      gsap.to(el.children, { opacity: 0, x: -8, duration: 0.18, stagger: 0.02, ease: "power2.in" });
      gsap.to(el, { width: 0, duration: 0.28, ease: "power3.in", delay: 0.12 });
    }
    prevSidebar.current = sidebarOpen;
  }, [sidebarOpen]);

  // ── Context panel open/close animation ────────────────────────────────────
  const prevContext = useRef(contextOpen);
  useEffect(() => {
    const el = contextRef.current;
    if (!el) return;
    if (contextOpen && !prevContext.current) {
      gsap.fromTo(el, { width: 0 }, { width: 320, duration: 0.32, ease: "power3.out" });
      gsap.fromTo(el.children, { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.28, stagger: 0.04, ease: "power2.out", delay: 0.15 });
    } else if (!contextOpen && prevContext.current) {
      gsap.to(el.children, { opacity: 0, x: 8, duration: 0.18, stagger: 0.02, ease: "power2.in" });
      gsap.to(el, { width: 0, duration: 0.28, ease: "power3.in", delay: 0.12 });
    }
    prevContext.current = contextOpen;
  }, [contextOpen]);

  // ── Auto-scroll to bottom on new messages ─────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    gsap.to(el, { scrollTop: el.scrollHeight, duration: 0.45, ease: "power2.inOut" });
  }, [messages, isTyping]);

  // ── Animate suggestion cards on first mount ───────────────────────────────
  useGSAP(
    () => {
      gsap.fromTo(
        ".suggestion-card",
        { y: 28, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.55, stagger: 0.08, ease: "power3.out",
          delay: 0.1,
        }
      );
      gsap.fromTo(
        ".empty-icon",
        { scale: 0.6, opacity: 0, rotation: -15 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.65, ease: "back.out(1.7)" }
      );
      gsap.fromTo(
        ".empty-title, .empty-desc",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.2 }
      );
    },
    { scope: containerRef, dependencies: [messages.length === 0] }
  );

  // ── Send message ──────────────────────────────────────────────────────────
  const send = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    const uid = crypto.randomUUID();
    setMessages((m) => [...m, { id: uid, role: "user", content: text }]);
    setInput("");
    setIsTyping(true);

    // Simulate agent latency 1.2–2s\

    // * here we call and get response from the agent 
    setTimeout(
      () => {
        setIsTyping(false);
        setMessages((m) => [
          ...m,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              "Here's a grounded answer based on your knowledge base and live web sources. I cross-referenced 4 internal documents and 2 web results to produce this synthesis.",
          },
        ]);
      },
      1200 + Math.random() * 800
    );
  }, [input]);

  // ── Copy handler ──────────────────────────────────────────────────────────
  const handleCopy = useCallback((id: string) => {
    setMessages((m) => m.map((msg) => msg.id === id ? { ...msg, copied: true } : msg));
    setTimeout(() => setMessages((m) => m.map((msg) => msg.id === id ? { ...msg, copied: false } : msg)), 1800);
  }, []);

  return (
    <>
      {/* Typing dot keyframes */}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        .typing-dot { animation: typingBounce 1.2s ease-in-out infinite; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .typing-row { animation: fadeUp 0.3s ease-out both; }
      `}</style>

      <div ref={containerRef} className="flex h-screen overflow-hidden bg-background">

        {/* ── Left Sidebar ─────────────────────────────────────────────── */}
        <aside
          ref={sidebarRef}
          className="flex flex-col border-r border-border bg-surface overflow-hidden shrink-0"
          style={{ width: sidebarOpen ? 288 : 0 }}
        >
          <div className="flex items-center justify-between p-4 shrink-0">
            <Logo />
          </div>

          <div className="px-3 shrink-0">
            <button onClick={handleNewChat} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-(image:--gradient-primary) px-3 py-2 text-sm font-medium text-primary-foreground shadow-(--shadow-elegant) hover:scale-[1.01] transition-transform">
              <Plus className="h-4 w-4" /> New Chat
            </button>
          </div>

          <div className="px-3 pt-3 shrink-0">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search conversations"
                className="w-full rounded-lg border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <nav className="mt-4 flex-1 overflow-y-auto px-2 pb-2 min-w-70">
            <div className="px-2 pb-2 text-xs font-medium text-muted-foreground">Recent</div>
            <ul className="space-y-0.5">
              {conversations.map((c) => (
                <li key={c.id}>
                  <button className={`group flex w-full items-start justify-between gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-accent ${c.active ? "bg-accent" : ""}`}>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{c.title}</div>
                      <div className="text-xs text-muted-foreground">{c.time}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-border p-3 shrink-0 min-w-70">
            <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent">
              <div className="h-8 w-8 rounded-full bg-(image:--gradient-primary) shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">Jane Doe</div>
                <div className="truncate text-xs text-muted-foreground">jane@datasmith.ai</div>
              </div>
              <button className="rounded-md p-1.5 text-muted-foreground hover:bg-card hover:text-foreground shrink-0" aria-label="Settings">
                <Settings className="h-4 w-4" />
              </button>
              <div onClick={handleLogout} className="rounded-md p-1.5 text-muted-foreground hover:bg-card hover:text-foreground shrink-0" aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main area ────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col min-w-0">

          {/* Header */}
          <header className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen((s) => !s)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                {sidebarOpen
                  ? <PanelLeftClose className="h-4 w-4" />
                  : <PanelLeftOpen className="h-4 w-4" />}
              </button>
              <div>
                {/* // * showing the title of Chat */}
                <div className="text-sm font-semibold">Q3 revenue analysis</div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {/* //* showing the agent state */}
                  </span>
                  Agent ready
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setContextOpen((s) => !s)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                aria-label="Toggle context panel"
              >
                {contextOpen
                  ? <PanelRightClose className="h-4 w-4" />
                  : <PanelRightOpen className="h-4 w-4" />}
              </button>
            </div>
          </header>

          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            {messages.length === 0 && !isTyping ? (
              <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6 text-center">
                <div className="empty-icon mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-(image:--gradient-primary) text-primary-foreground shadow-(--shadow-glow)" style={{ opacity: 0 }}>
                  <Sparkles className="h-6 w-6" />
                </div>
                <h2 className="empty-title text-2xl font-semibold tracking-tight" style={{ opacity: 0 }}>
                  How can I help you today?
                </h2>
                <p className="empty-desc mt-2 text-sm text-muted-foreground" style={{ opacity: 0 }}>
                  Ask anything, upload files, or pick a suggested prompt below.
                </p>
                <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
                  {suggestions.map((s) => (
                    <button
                      key={s.title}
                      onClick={() => setInput(s.title)}
                      className="suggestion-card group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-(--shadow-elegant)"
                      style={{ opacity: 0 }}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                        <s.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{s.title}</div>
                        <div className="text-xs text-muted-foreground">{s.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-3xl px-4 py-8">
                <ul className="space-y-6">
                  {messages.map((m) => (
                    <MessageBubble key={m.id} msg={m} onCopy={handleCopy} />
                  ))}
                  {isTyping && <TypingIndicator />}
                </ul>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="border-t border-border bg-background p-4 shrink-0">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-(--shadow-elegant) focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 transition-shadow">
                <button
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  aria-label="Attach file"
                >
                  <Paperclip className="h-4 w-4" />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={1}
                  placeholder="Message DataSmith…"
                  className="max-h-40 flex-1 resize-none bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  onClick={send}
                  disabled={!input.trim() || isTyping}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-(image:--gradient-primary) text-primary-foreground shadow-(--shadow-elegant) transition-transform hover:scale-105 disabled:opacity-40 disabled:scale-100"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Agents may produce inaccurate information. Verify important answers.
              </p>
            </div>
          </div>
        </div>

        {/* ── Right context panel ───────────────────────────────────────── */}
        <aside
          ref={contextRef}
          className="flex flex-col border-l border-border bg-surface overflow-hidden shrink-0"
          style={{ width: contextOpen ? 320 : 0 }}
        >
          <div className="border-b border-border px-4 py-3 shrink-0 min-w-77.5">
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Context & Activity
            </div>
          </div>

          {/* //* here showing the agent state what it use and sources cites */}
          <div className="flex-1 overflow-y-auto p-4 min-w-77.5">
            {/* Active Sources */}
            <div className="mb-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <Link2 className="h-3.5 w-3.5" /> Active Sources
              </div>
              <div className="space-y-2">
                {[
                  { icon: Database, label: "production_db", sub: "PostgreSQL v14" },
                  { icon: FileText, label: "Onboarding.pdf", sub: "14 pages · indexed" },
                  { icon: Globe, label: "Web Search", sub: "2 results cited" },
                ].map((src) => (
                  <div key={src.label} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-primary shrink-0">
                      <src.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{src.label}</div>
                      <div className="truncate text-xs text-muted-foreground">{src.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* //* agent trace */}
            {/* Agent trace */}
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <Activity className="h-3.5 w-3.5" /> Agent Trace
              </div>
              <ol className="relative space-y-3 border-l border-border pl-4">
                {[
                  { t: "10:42:15 AM", label: "Parsed user intent", note: "Scope detected: SQL + Python" },
                  { t: "10:42:16 AM", label: "Queried schema info", note: "SELECT table_name FROM …" },
                  { t: "10:42:18 AM", label: "Generated Python script", note: "psycopg2 connector" },
                ].map((s, i) => (
                  <li key={i} className="relative">
                    <span
                      className={`absolute -left-5.25 top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-surface ${i === 2 ? "bg-emerald-500" : "bg-primary"
                        }`}
                    />
                    <div className="text-[11px] font-mono text-muted-foreground">{s.t}</div>
                    <div className="text-sm font-medium">{s.label}</div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">{s.note}</div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}