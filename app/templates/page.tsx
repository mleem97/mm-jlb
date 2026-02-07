"use client";

import { motion } from "motion/react";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { Card, CardContent } from "@/components/ui/card";

const templates = [
  { name: "Klassisch", description: "Seriöses Layout für traditionelle Branchen." },
  { name: "Modern", description: "Klare Linien, viel Weißraum, zeitgemäß." },
  { name: "Kreativ", description: "Mehr Persönlichkeit für kreative Rollen." },
  { name: "Minimal", description: "Schlankes Layout, Fokus auf Inhalte." },
  { name: "ATS‑Optimiert", description: "Struktur für maximale Lesbarkeit." },
  { name: "Tech", description: "Für Entwickler‑ und IT‑Profile." },
];

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
          >
            Vorlagen‑Galerie
          </motion.h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Entdecke Layouts für unterschiedliche Branchen und Stile.
          </p>
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.name} className="border-border/50">
              <CardContent className="p-6">
                <div className="h-32 rounded-lg bg-muted/50 mb-4" />
                <h2 className="text-lg font-semibold mb-2">{template.name}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{template.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}