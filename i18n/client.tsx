"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
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

const BLOCKED_MESSAGE_KEYS = new Set([
  "__proto__",
  "prototype",
  "constructor",
]);

function getNestedValue(obj: unknown, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (
      BLOCKED_MESSAGE_KEYS.has(key) ||
      current === null ||
      typeof current !== "object" ||
      !Object.hasOwn(current, key)
    ) {
      return undefined;
    }

    current = Reflect.get(current, key);
  }

  return typeof current === "string" ? current : undefined;
}

function interpolate(
  template: string,
  values?: Record<string, string | number>,
): string {
  if (!values) return template;

  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    Object.hasOwn(values, key)
      ? String(Reflect.get(values, key))
      : `{${key}}`,
  );
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Messages>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("jlb:locale");
    if (stored === "de" || stored === "en" || stored === "fr") {
      setLocaleState(stored);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    void loadMessages(locale)
      .then((loadedMessages) => {
        if (!cancelled) setMessages(loadedMessages);
      })
      .catch((error: unknown) => {
        console.error("[i18n] Failed to load messages", error);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

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

  return useCallback(
    (key: string, values?: Record<string, string | number>): string => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      const value = getNestedValue(context.messages, fullKey);
      if (value === undefined) {
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
}
