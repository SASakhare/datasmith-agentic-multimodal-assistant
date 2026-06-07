import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { ArrowRight, Menu } from "lucide-react";

const links: { to: string; label: string; hash?: boolean }[] = [
  { to: "/", label: "Home" },
  { to: "/#features", label: "Features", hash: true },
  { to: "/#how", label: "How it Works", hash: true },
  { to: "/about", label: "About" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.to}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <MobileNavbar />
      </div>
    </header>
  );
}


export const MobileNavbar = () => {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />

      <Link
        to="/register"
        className="hidden sm:inline-flex items-center rounded-xl bg-(image:--gradient-primary) px-4 py-2 text-sm font-medium text-primary-foreground shadow-(--shadow-elegant)"
      >
        Get Started
      </Link>

      <Sheet>
        <SheetTrigger asChild>
          <button
            className="
              md:hidden
              flex h-11 w-11 items-center justify-center
              rounded-xl
              border border-border/60
              bg-card/60
              backdrop-blur-md
              transition-all duration-300
              hover:scale-105
              hover:border-primary/40
            "
          >
            <Menu className="h-5 w-5" />
          </button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="
            w-[320px]
            border-l border-border/50
            bg-background/95
            backdrop-blur-xl
            p-0
            flex flex-col
          "
        >
          {/* Header */}
          <SheetHeader className="border-b border-border/50">
            <SheetTitle>
              <div className="p-6">
                <Logo />
              </div>
            </SheetTitle>

            <SheetDescription>
              <p className="px-6 pb-5 text-sm text-muted-foreground">
                Agentic RAG workspace for modern teams.
              </p>
            </SheetDescription>
          </SheetHeader>

          {/* Navigation */}
          <div className="flex-1 p-4">
            <div className="space-y-2">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.to}
                  className="
                    group
                    flex items-center justify-between
                    rounded-xl
                    px-4 py-3
                    text-sm font-medium
                    transition-all duration-300
                    hover:bg-accent
                    hover:text-foreground
                    hover:translate-x-1
                  "
                >
                  <span>{link.label}</span>

                  <ArrowRight
                    className="
                      h-4 w-4
                      opacity-0
                      -translate-x-1
                      transition-all duration-300
                      group-hover:opacity-100
                      group-hover:translate-x-0
                    "
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Bottom CTA Section */}
          <div className="border-t border-border/50 p-4">
            <div className="space-y-3">
              <Link
                to="/login"
                className="
                  flex items-center justify-center
                  rounded-xl
                  border border-border
                  py-3
                  text-sm font-medium
                  transition-all duration-300
                  hover:bg-accent
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                  flex items-center justify-center gap-2
                  rounded-xl
                  bg-(image:--gradient-primary)
                  py-3
                  text-sm font-semibold
                  text-primary-foreground
                  shadow-(--shadow-glow)
                  transition-all duration-300
                  hover:scale-[1.02]
                "
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* AI Card */}
            <div className="mt-4 glass rounded-2xl p-4">
              <p className="text-sm font-medium">
                Build AI agents faster
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Upload files, search knowledge, and generate grounded answers.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};