import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Plus, Search, Settings, LogOut, PanelLeftClose, PanelLeftOpen,
  PanelRightClose, PanelRightOpen, Send, Paperclip, Copy, RefreshCw,
  Sparkles, FileText, Globe, Bot, Database, Activity, Link2, CheckCheck,
  ImageIcon,
  Music,
  X,
} from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ConversationStore } from "@/store/useChatStore";
import { useUserStore } from "@/store/useUserStore";
import MarkdownMessage from "@/components/MardownReact";

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

type Msg = { message_id: string; conversation_id: string; role: string; content: string; created_at: string; copied?: boolean; };

// message_id: string,

// conversation_id: string,

// role: string,

// content: string,

// created_at: string,

// updated_at: string,

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
            <MarkdownMessage content={msg.content} />
            <div className="mt-3 flex items-center gap-1 text-muted-foreground">
              <button
                onClick={() => onCopy(msg.message_id)}
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
  const { logout } = useUserStore();
  const { get_conversation, create_new_conversation, all_conversations, get_all_conversation, conversation, messages, generate_response, create_message, current_conversation, agentState } = ConversationStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  // const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sidebarRef = useRef<HTMLElement>(null);
  const contextRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNewChat = async (e: any) => {

    await create_new_conversation();

  }

  const handleLogout = async (e: any) => {
    await logout();

  }

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);

  }

  useEffect(() => {
    // console.log(attachedFiles);
    attachedFiles.forEach(file => {
      console.log(file.name, file.type, file.size);

    })

  }, [attachedFiles])


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
    { scope: containerRef, dependencies: [Array.isArray(messages) && messages.length === 0] }
  );

  //* ── Send message ──────────────────────────────────────────────────────────
  const send = useCallback(async () => {
    const text = input.trim();

    if (!text) return;

    await create_message({ query: text, conversation_id: current_conversation, role: 'user' });

    setInput("");
    setIsTyping(true);

    const formData = new FormData();
    formData.append("query", text)

    attachedFiles.forEach((file) => {
      formData.append("files", file);
    })

    await generate_response(formData, current_conversation);
    setIsTyping(false)
    setAttachedFiles([]);

  }, [input]);

  //* ── Copy handler ──────────────────────────────────────────────────────────
  const handleCopy = useCallback((id: string) => {
    // setMessages((m) => m.map((msg) => msg.id === id ? { ...msg, copied: true } : msg));
    // setTimeout(() => setMessages((m) => m.map((msg) => msg.id === id ? { ...msg, copied: false } : msg)), 1800);

  }, []);

  const handleGetConversation = async (conversation_id: string) => {
    // console.log(conversation_id);
    await get_conversation(conversation_id);

  }

  // add the function at the top of your component or in a utils file
  const formatDate = (dateStr: string) => {
    // handle backend format without Z (not UTC-marked)
    const date = new Date(dateStr + "Z")  // ← add Z to treat as UTC
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
  }

  useEffect(() => {
    get_all_conversation();
  }, [])

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
              {all_conversations.map((c) => (
                <li key={c.conversation_id} onClick={() => { handleGetConversation(c.conversation_id) }}>
                  <button className={`group flex w-full items-start justify-between gap-2 rounded-lg px-2 py-2 text-left transition-colors hover:bg-accent ${c.active ? "bg-accent" : ""}`}>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{c.title}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(c.created_at)}</div>
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
                <div className="text-sm font-semibold">{conversation?.title}</div>
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
            {(Array.isArray(messages)) && messages.length === 0 && !isTyping ? (
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
                  {(Array.isArray(messages)) && messages.map((m) => (
                    // type Msg = { id: string; role: "user" | "assistant"; content: string; copied?: boolean };
                    <MessageBubble key={m.message_id} msg={m} onCopy={handleCopy} />
                  ))}
                  {isTyping && <TypingIndicator />}
                </ul>
              </div>
            )}
          </div>

          {/* Input bar */}
          {/* Preview attached files */}

          <div className="border-t border-border bg-background p-4 shrink-0">
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 px-3 py-2">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-1 bg-accent rounded-md px-2 py-1 text-xs">

                    {/* Icon based on file type */}
                    {file.type.startsWith("image/") && <ImageIcon className="h-3 w-3" />}
                    {file.type.startsWith("audio/") && <Music className="h-3 w-3" />}
                    {file.type === "application/pdf" && <FileText className="h-3 w-3" />}

                    <span className="max-w-25 truncate">{file.name}</span>

                    {/* Remove button */}
                    <button
                      onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== index))}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mx-auto max-w-3xl">
              <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-(--shadow-elegant) focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20 transition-shadow">

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,audio/*,application/pdf"
                  onChange={handleFileChange}
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
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
          <div className="flex-1 overflow-y-auto p-4 min-w-77.5">

            {/* Active Sources — derived from agent_state */}
            <div className="mb-5">
              <div className="mb-2 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <Link2 className="h-3.5 w-3.5" /> Active Sources
              </div>
              <div className="space-y-2">

                {/* Web Search — show only if used */}
                {agentState?.need_web_search && (
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-primary shrink-0">
                      <Globe className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">Web Search</div>
                      <div className="truncate text-xs text-muted-foreground">{agentState.web_context || "No results"}</div>
                    </div>
                  </div>
                )}

                {/* RAG / Knowledge Base — show if used */}
                {agentState?.plan?.need_rag && (
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-primary shrink-0">
                      <Database className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">Knowledge Base</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {agentState.retrieved_context || "No context retrieved"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Available Knowledge files */}
                {agentState?.available_knowledge?.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-primary shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{item}</div>
                    </div>
                  </div>
                ))}

                {/* Fallback if nothing was used */}
                {!agentState?.need_web_search && !agentState?.plan?.need_rag && agentState?.available_knowledge?.length === 0 && (
                  <div className="text-xs text-muted-foreground">No external sources used</div>
                )}
              </div>
            </div>

            {/* Agent Trace — from plan + steps */}
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <Activity className="h-3.5 w-3.5" /> Agent Trace
              </div>
              <ol className="relative space-y-3 border-l border-border pl-4">

                {/* Intent */}
                <li className="relative">
                  <span className="absolute -left-5.25 top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-surface bg-primary" />
                  <div className="text-[11px] font-mono text-muted-foreground">Step 0</div>
                  <div className="text-sm font-medium">Parsed Intent</div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    {agentState?.plan?.intent ?? "—"}
                  </div>
                </li>

                {/* Plan steps */}
                {agentState?.plan?.steps?.map((step: any, i: number) => (
                  <li key={i} className="relative">
                    <span className={`absolute -left-5.25 top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-surface ${i === (agentState.plan.steps.length - 1) ? "bg-emerald-500" : "bg-primary"
                      }`} />
                    <div className="text-[11px] font-mono text-muted-foreground">Step {i + 1}</div>
                    <div className="text-sm font-medium">{step.name ?? step.action ?? `Step ${i + 1}`}</div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">{step.description ?? "—"}</div>
                  </li>
                ))}

                {/* Final answer confirmation */}
                <li className="relative">
                  <span className="absolute -left-5.25 top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-surface bg-emerald-500" />
                  <div className="text-[11px] font-mono text-muted-foreground">Final</div>
                  <div className="text-sm font-medium">Response Generated</div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    {agentState?.final_answer?.slice(0, 60)}...
                  </div>
                </li>

              </ol>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}