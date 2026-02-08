"use client";

import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLocale } from "@/i18n/client";
import { locales, localeLabels, localeFlags, type Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 p-2 rounded-full hover:bg-muted transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
        aria-label="Switch language"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{localeFlags[locale]}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[160px] rounded-lg border border-border bg-popover p-1 shadow-lg z-50">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => {
                setLocale(loc);
                setOpen(false);
              }}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-colors ${
                loc === locale
                  ? "bg-accent text-accent-foreground font-medium"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              <span>{localeFlags[loc]}</span>
              <span>{localeLabels[loc]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
