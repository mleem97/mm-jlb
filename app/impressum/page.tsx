"use client";

import { motion } from "motion/react";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { ObfuscatedText } from "@/components/ObfuscatedText";
import { Card, CardContent } from "@/components/ui/card";

export default function ImpressumPage() {
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
            Impressum
          </motion.h1>
          <p className="mt-4 text-muted-foreground text-lg animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)
          </p>
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">Diensteanbieter</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <ObfuscatedText
                    encoded="TWV5ZXIgTWVkaWEKQW0gRnJpZWRyaWNoLUViZXJ0LVBhcmsgMWEKMzExNTcgU2Fyc3RlZHQKRGV1dHNjaGxhbmQ="
                    multiline
                    revealLabel="Adresse anzeigen"
                  />
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Kontaktmöglichkeiten</h2>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  <ObfuscatedText
                    label="E-Mail-Adresse:"
                    encoded="a29udGFrdEBtZXllcm1lZGlhLmV1"
                    asLinkType="mailto"
                    revealLabel="E-Mail anzeigen"
                  />
                  <ul className="mt-2 space-y-1">
                    <li>Kontaktformular: Über diese Website verfügbar</li>
                    <li>
                      GitHub Issue:
                      <a
                        href="https://github.com/mleem97/mm-jlb/issues/new/choose"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-indigo-500 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-sm"
                      >
                        Issue erstellen
                      </a>
                    </li>
                    <li>Reaktionszeit: i.d.R. innerhalb von 24 Stunden an Werktagen</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Vertretungsberechtigte Person</h2>
                <p className="text-sm text-muted-foreground">Marvin Lee Meyer</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">Umsatzsteuer</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Kleinunternehmen gemäß § 19 UStG<br />
                  Keine Umsatzsteuer-ID erforderlich
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Zuständige Kammer</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <ObfuscatedText
                    encoded="SUhLIEhhbm5vdmVyClNjaGlmZmdyYWJlbiA0OSwgMzAxNzUgSGFubm92ZXI="
                    multiline
                    revealLabel="Adresse anzeigen"
                  />
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <ObfuscatedText
                    encoded="TWFydmluIExlZSBNZXllcgpBbSBGcmllZHJpY2gtRWJlcnQtUGFyayAxYQozMTE1NyBTYXJzdGVkdA=="
                    multiline
                    revealLabel="Adresse anzeigen"
                  />
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold mb-2">EU-Streitschlichtung</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                  <br />
                  <a
                    href="https://ec.europa.eu/consumers/odr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-sm"
                  >
                    EU-Online-Streitbeilegung (OS) Plattform
                  </a>
                  <br />
                  Unsere E-Mail-Adresse finden Sie oben im Impressum.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                  Verbraucherschlichtungsstelle teilzunehmen.
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