"use client";

import { motion } from "motion/react";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { ObfuscatedAction, ObfuscatedText } from "@/components/ObfuscatedText";
import { Card, CardContent } from "@/components/ui/card";

export default function KontaktPage() {
  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />
      <section className="pt-28 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight"
          >
            Kontakt
          </motion.h1>
          <p className="mt-4 text-muted-foreground text-lg animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            Wir antworten innerhalb von 24 Stunden an Werktagen.
          </p>
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">Kontaktmöglichkeiten</h2>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  <ul className="space-y-1">
                    <li>
                      <ObfuscatedText
                        label="E-Mail:"
                        encoded="a29udGFrdEBtZXllcm1lZGlhLmV1"
                        asLinkType="mailto"
                        revealLabel="E-Mail anzeigen"
                      />
                    </li>
                    <li>Kontaktformular: Über diese Website verfügbar</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <ObfuscatedAction
                  encoded="a29udGFrdEBtZXllcm1lZGlhLmV1"
                  actionType="mailto"
                  label="E-Mail schreiben"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                />
                <a
                  href="https://github.com/mleem97/mm-jlb/issues/new/choose"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                >
                  GitHub Issue erstellen
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">Hinweis</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Kontakt ist ausschließlich per E-Mail, Kontaktformular oder GitHub Issue möglich.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}