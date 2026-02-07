"use client";

import { motion } from "motion/react";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "ATS‑freundlich",
    description: "Klare Struktur, saubere Typografie und exportiert als PDF.",
  },
  {
    title: "Local‑First",
    description: "Alle Daten bleiben lokal im Browser. Kein Konto nötig.",
  },
  {
    title: "Templates & Varianten",
    description: "Mehrere Layouts und Tonalitäten für verschiedene Branchen.",
  },
  {
    title: "Schnelle Anpassungen",
    description: "Sektionen ein‑/ausblenden, Reihenfolge ändern, sofort exportieren.",
  },
];

export default function FeaturesPage() {
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
            Features
          </motion.h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Die wichtigsten Bausteine für überzeugende Bewerbungen.
          </p>
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/50">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}