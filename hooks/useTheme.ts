"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

export type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "jlb-theme";

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const storedTheme = localStorage.getItem(STORAGE_KEY);
  return isTheme(storedTheme) ? storedTheme : "system";
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

function applyTheme(resolvedTheme: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(resolvedTheme);
}

let listeners: Array<() => void> = [];
let currentTheme: Theme = "system";

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((candidate) => candidate !== listener);
  };
}

function getSnapshot(): Theme {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return "system";
}

let initialized = false;
function initTheme() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  currentTheme = getStoredTheme();
  applyTheme(resolveTheme(currentTheme));

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (currentTheme === "system") {
        applyTheme(getSystemTheme());
        emitChange();
      }
    });
}

export function useTheme(): {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
} {
  const [ready] = useState(() => {
    initTheme();
    return typeof window !== "undefined";
  });

  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setTheme = useCallback((nextTheme: Theme) => {
    currentTheme = nextTheme;
    localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(resolveTheme(nextTheme));
    emitChange();
  }, []);

  const resolvedTheme: ResolvedTheme = ready
    ? resolveTheme(theme)
    : "dark";

  return { theme, setTheme, resolvedTheme };
}
