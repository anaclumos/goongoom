import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Message01Icon } from "@hugeicons/core-free-icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavAuthButtons } from "@/components/auth/auth-buttons";

export function GlobalNav() {
  return (
    <nav
      aria-label="Global navigation"
      className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-lg shadow-orange-500/30"
            style={{ background: "var(--gradient-sunset)" }}
          >
            <HugeiconsIcon icon={Message01Icon} size={18} strokeWidth={3} />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            궁금닷컴
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <NavAuthButtons />
        </div>
      </div>
    </nav>
  );
}
