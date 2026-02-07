"use client";

import { motion } from "motion/react";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { Card, CardContent } from "@/components/ui/card";

const releases = [
  {
    version: "0.3.0",
    date: "2026‑02‑01",
    items: ["Silk Hero Background", "Neue rechtliche Seiten", "Template‑Galerie"],
  },
  {
    version: "0.2.0",
    date: "2026‑01‑15",
    items: ["Export: PDF/JSON", "Local‑First Storage", "Motion‑Animationen"],
  },
];

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
          >
            Changelog
          </motion.h1>
          <p className="mt-4 text-muted-foreground text-lg">Transparente Updates & neue Features.</p>
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {releases.map((release) => (
            <Card key={release.version} className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">v{release.version}</h2>
                  <span className="text-sm text-muted-foreground">{release.date}</span>
                </div>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {release.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}