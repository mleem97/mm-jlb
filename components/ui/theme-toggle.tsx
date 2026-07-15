"use client";

import { Monitor, Moon, Sun, type LucideIcon } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

function getThemePresentation(theme: Theme): {
  icon: LucideIcon;
  label: string;
  nextTheme: Theme;
} {
  switch (theme) {
    case "light":
      return { icon: Sun, label: "Helles Design", nextTheme: "dark" };
    case "dark":
      return { icon: Moon, label: "Dunkles Design", nextTheme: "system" };
    case "system":
      return {
        icon: Monitor,
        label: "Systemeinstellung",
        nextTheme: "light",
      };
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const presentation = getThemePresentation(theme);
  const Icon = presentation.icon;

  return (
    <button
      type="button"
      onClick={() => {
        setTheme(presentation.nextTheme);
      }}
      aria-label={presentation.label}
      title={presentation.label}
      className={cn(
        "rounded-full p-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
        className,
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}
