"use client";

import { motion } from "motion/react";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { Card, CardContent } from "@/components/ui/card";

const examples = [
  {
    title: "Berufseinsteiger:in",
    description: "Kurze, klare Struktur mit Fokus auf Motivation & Potenzial.",
  },
  {
    title: "Senior‑Profile",
    description: "Mehr Projekttiefe, Kennzahlen, Verantwortungen und Leadership.",
  },
  {
    title: "Quereinstieg",
    description: "Transferable Skills und überzeugende Argumentation.",
  },
  {
    title: "Teilzeit / Remote",
    description: "Rahmenbedingungen präzise kommuniziert, Tonalität professionell.",
  },
];

export default function ExamplesPage() {
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
            Beispiele
          </motion.h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Praxisnahe Muster, die du direkt anpassen kannst.
          </p>
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid gap-4 sm:grid-cols-2">
          {examples.map((example) => (
            <Card key={example.title} className="border-border/50">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold">{example.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{example.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}