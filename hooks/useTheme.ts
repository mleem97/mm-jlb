"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "jlb-theme";

/* ─── Helpers ──────────────────────────────────────────────── */
function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  return (localStorage.getItem(STORAGE_KEY) as Theme) ?? "system";
}

function resolve(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolved);
}

/* ─── External store for SSR-safe subscription ─────────────── */
let listeners: Array<() => void> = [];
let currentTheme: Theme = "system";

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): Theme {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return "system";
}

/* ─── Init (runs once in browser) ──────────────────────────── */
let initialized = false;
function initTheme() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  currentTheme = getStoredTheme();
  applyTheme(resolve(currentTheme));

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (currentTheme === "system") {
        applyTheme(getSystemTheme());
        emitChange();
      }
    });
}

/* ─── Hook ─────────────────────────────────────────────────── */
export function useTheme(): {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
} {
  // Ensure initialisation on first render (client)
  const [ready] = useState(() => {
    initTheme();
    return typeof window !== "undefined";
  });

  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    currentTheme = next;
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(resolve(next));
    emitChange();
  }, []);

  const resolvedTheme: ResolvedTheme = ready ? resolve(theme) : "dark";

  return { theme, setTheme, resolvedTheme };
}
