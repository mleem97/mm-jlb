"use client";

import { motion } from "motion/react";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { Card, CardContent } from "@/components/ui/card";

const roadmap = [
  {
    quarter: "Q1",
    items: ["Mehrsprachige Vorlagen", "Public Template Gallery"],
  },
  {
    quarter: "Q2",
    items: ["Collaborative Review Links", "Smart Sections"],
  },
  {
    quarter: "Q3",
    items: ["ATS‑Score Check", "Cover Letter Variants"],
  },
];

export default function RoadmapPage() {
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
            Roadmap
          </motion.h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Was als nächstes geplant ist.
          </p>
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid gap-4 sm:grid-cols-3">
          {roadmap.map((block) => (
            <Card key={block.quarter} className="border-border/50">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold">{block.quarter}</h2>
                <ul className="mt-3 list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {block.items.map((item) => (
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