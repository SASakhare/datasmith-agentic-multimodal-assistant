import { useThemeStore } from "#/store/useThemesStore";
import { useState, useEffect, use } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MarkdownMessage({ content }: { content: string }) {

    const { theme } = useThemeStore();
    const [isDark, setIsDark] = useState<boolean>(false)

    useEffect(() => {
        setIsDark(theme == 'dark');
    }, [theme])

    const components: Components = {
        code({ className, children }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
                <div className="my-2 rounded-lg overflow-hidden border border-border text-sm">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-zinc-800 border-b border-border">
                        <span className="text-xs font-mono text-muted-foreground">{match[1]}</span>
                        <button
                            onClick={() => navigator.clipboard.writeText(String(children))}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Copy
                        </button>
                    </div>
                    <SyntaxHighlighter
                        style={isDark ? oneDark : oneLight}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, borderRadius: 0, fontSize: "0.8rem", padding: "1rem" }}
                    >
                        {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                </div>
            ) : (
                <code className="rounded bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 font-mono text-xs text-rose-500 dark:text-rose-400">
                    {children}
                </code>
            );
        },
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="mb-2 list-disc pl-4 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="mb-2 list-decimal pl-4 space-y-1">{children}</ol>,
        li: ({ children }) => <li className="text-sm">{children}</li>,
        h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
        h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
        blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-primary pl-3 italic text-muted-foreground">{children}</blockquote>
        ),
        table: ({ children }) => (
            <div className="overflow-x-auto my-2">
                <table className="w-full text-sm border-collapse border border-border">{children}</table>
            </div>
        ),
        th: ({ children }) => (
            <th className="border border-border bg-gray-100 dark:bg-zinc-800 px-3 py-2 text-left font-semibold text-xs">{children}</th>
        ),
        td: ({ children }) => (
            <td className="border border-border px-3 py-2 text-xs">{children}</td>
        ),
        a: ({ href, children }) => (
            <a href={href ?? "#"} target="_blank" rel="noopener noreferrer"
                className="text-primary underline hover:opacity-80 transition-opacity">
                {children}
            </a>
        ),
        hr: () => <hr className="border-border my-3" />,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
    };

    return (
        // ✅ className goes on the wrapper div, NOT on ReactMarkdown
        <div className="leading-relaxed prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown components={components}>
                {content}
            </ReactMarkdown>
        </div>
    );
}