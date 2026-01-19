"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Sun03Icon, Moon02Icon, ComputerIcon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";

export function ThemeToggleMobile() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getThemeLabel = () => {
    if (theme === "light") return "라이트";
    if (theme === "dark") return "다크";
    return "시스템";
  };

  if (!mounted) {
    return (
      <Button
        aria-label="테마 전환"
        className="h-auto flex-col gap-1 px-3 py-2 text-muted-foreground"
        size="sm"
        variant="ghost"
      >
        <HugeiconsIcon icon={ComputerIcon} className="size-5" aria-hidden="true" />
        <span className="text-xs">테마</span>
      </Button>
    );
  }

  return (
    <Button
      aria-label={`테마 전환 (현재: ${getThemeLabel()})`}
      className="h-auto flex-col gap-1 px-3 py-2 text-muted-foreground"
      onClick={cycleTheme}
      size="sm"
      variant="ghost"
    >
      {theme === "light" ? (
        <HugeiconsIcon icon={Sun03Icon} className="size-5" aria-hidden="true" />
      ) : theme === "dark" ? (
        <HugeiconsIcon icon={Moon02Icon} className="size-5" aria-hidden="true" />
      ) : (
        <HugeiconsIcon icon={ComputerIcon} className="size-5" aria-hidden="true" />
      )}
      <span className="text-xs">{getThemeLabel()}</span>
    </Button>
  );
}
