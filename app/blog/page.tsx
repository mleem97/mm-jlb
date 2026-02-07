"use client";

import { motion } from "motion/react";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { Card, CardContent } from "@/components/ui/card";

const posts = [
  {
    title: "Bewerbung in 2026: Worauf achten Recruiter?",
    excerpt: "Konkrete Tipps für Struktur, Tonalität und ATS‑Kompatibilität.",
    date: "2026‑01‑10",
  },
  {
    title: "Die perfekte Einleitung",
    excerpt: "So startest du dein Anschreiben ohne Floskeln.",
    date: "2026‑01‑05",
  },
  {
    title: "Fehler, die dich Chancen kosten",
    excerpt: "Die häufigsten Stolperfallen – und wie du sie vermeidest.",
    date: "2025‑12‑20",
  },
];

export default function BlogPage() {
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
            Blog
          </motion.h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Insights, Tipps und Updates rund um Bewerbungen.
          </p>
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <Card key={post.title} className="border-border/50">
              <CardContent className="p-6">
                <div className="text-xs text-muted-foreground">{post.date}</div>
                <h2 className="mt-2 text-lg font-semibold">{post.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}