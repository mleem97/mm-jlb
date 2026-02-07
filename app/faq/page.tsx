"use client";

import { motion } from "motion/react";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
  {
    question: "Warum ist Job Letter Builder Local‑First?",
    answer:
      "Alle Bewerbungsdaten werden lokal im Browser gespeichert. Das minimiert Datentransfers und gibt dir volle Kontrolle.",
  },
  {
    question: "Wie funktioniert die Speicherung (IndexedDB)?",
    answer:
      "Deine Daten werden in einer lokalen Browser‑Datenbank (IndexedDB) abgelegt. Sie bleibt auch nach dem Schließen des Browsers erhalten.",
  },
  {
    question: "Wie exportiere ich meine Bewerbung?",
    answer:
      "Du kannst deine Daten als PDF, JSON oder ZIP exportieren. So hast du eine druckfertige Version und ein Backup für spätere Anpassungen.",
  },
  {
    question: "Wie importiere ich bestehende Daten?",
    answer:
      "Über den Import kannst du eine zuvor exportierte JSON wieder einlesen und weiterbearbeiten.",
  },
];

export default function FaqPage() {
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
            FAQ & Hilfe
          </motion.h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Local‑First‑Architektur, Export/Import und die wichtigsten Antworten.
          </p>
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((item) => (
            <Card key={item.question} className="border-border/50">
              <CardContent className="p-6 space-y-2">
                <h2 className="text-lg font-semibold">{item.question}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}