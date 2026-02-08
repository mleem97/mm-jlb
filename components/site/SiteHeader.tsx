"use client";

import { motion } from "motion/react";
import { FileText, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/features/LanguageSwitcher";
import { useTranslations } from "@/i18n/client";

export default function SiteHeader() {
  const t = useTranslations("nav");

  const links = [
    { href: "/features", label: t("features") },
    { href: "/templates", label: t("templates") },
    { href: "/faq", label: t("faq") },
    { href: "/kontakt", label: t("contact") },
  ];
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-sky-500 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">Job Letter Builder</span>
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-sm"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <a
              href="https://github.com/mleem97/mm-jlb"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-muted rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
              aria-label="GitHub Repository"
            >
              <Github className="w-5 h-5" />
            </a>
            <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700">
              <a href="/builder">{t("startNow")}</a>
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}