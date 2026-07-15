"use client";

import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";

import { useLocale } from "@/i18n/client";
import { locales, type Locale } from "@/i18n/config";

function getLocalePresentation(locale: Locale): {
  flag: string;
  label: string;
} {
  switch (locale) {
    case "de":
      return { flag: "🇩🇪", label: "Deutsch" };
    case "en":
      return { flag: "🇬🇧", label: "English" };
    case "fr":
      return { flag: "🇫🇷", label: "Français" };
  }
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const currentLocale = getLocalePresentation(locale);

  useEffect(() => {
    function closeWhenClickingOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeWhenClickingOutside);
    return () => {
      document.removeEventListener("mousedown", closeWhenClickingOutside);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((isOpen) => !isOpen);
        }}
        className="flex items-center gap-1.5 rounded-full p-2 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        aria-label="Sprache wechseln"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Globe className="size-4" />
        <span className="hidden sm:inline">{currentLocale.flag}</span>
      </button>
      {open ? (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-border bg-popover p-1 shadow-lg"
          role="menu"
        >
          {locales.map((localeOption) => {
            const option = getLocalePresentation(localeOption);
            return (
              <button
                key={localeOption}
                type="button"
                role="menuitemradio"
                aria-checked={localeOption === locale}
                onClick={() => {
                  setLocale(localeOption);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  localeOption === locale
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <span>{option.flag}</span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
