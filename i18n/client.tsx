"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { Locale } from "./config";
import { defaultLocale } from "./config";

type Messages = Record<string, unknown>;

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Messages;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

// Dynamic import of message files
async function loadMessages(locale: Locale): Promise<Messages> {
  switch (locale) {
    case "de":
      return (await import("@/messages/de.json")).default;
    case "en":
      return (await import("@/messages/en.json")).default;
    case "fr":
      return (await import("@/messages/fr.json")).default;
    default:
      return (await import("@/messages/de.json")).default;
  }
}

// Get nested value from object by dot-notation key
function getNestedValue(obj: unknown, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== "object"
    ) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

// Interpolate {variables} in a string
function interpolate(
  template: string,
  values?: Record<string, string | number>,
): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return values[key] !== undefined ? String(values[key]) : `{${key}}`;
  });
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Messages>({});
  const [isLoading, setIsLoading] = useState(true);

  // Read locale from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("jlb:locale");
    if (stored && (stored === "de" || stored === "en" || stored === "fr")) {
      setLocaleState(stored as Locale);
    }
  }, []);

  // Load messages when locale changes
  useEffect(() => {
    setIsLoading(true);
    loadMessages(locale).then((msgs) => {
      setMessages(msgs);
      setIsLoading(false);
    });
  }, [locale]);

  // Update localStorage and html lang attribute when locale changes
  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("jlb:locale", newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, messages, isLoading }),
    [locale, setLocale, messages, isLoading],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): {
  locale: Locale;
  setLocale: (locale: Locale) => void;
} {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return { locale: context.locale, setLocale: context.setLocale };
}

export function useTranslations(namespace?: string) {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useTranslations must be used within a LocaleProvider");
  }

  const t = useCallback(
    (key: string, values?: Record<string, string | number>): string => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      const value = getNestedValue(context.messages, fullKey);
      if (value === undefined) {
        // Fallback: return the key itself in development
        if (process.env.NODE_ENV === "development") {
          console.warn(
            `[i18n] Missing translation: "${fullKey}" for locale "${context.locale}"`,
          );
        }
        return fullKey;
      }
      return interpolate(value, values);
    },
    [context.messages, context.locale, namespace],
  );

  return t;
}
