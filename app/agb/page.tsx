"use client";

import { motion } from "motion/react";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { Card, CardContent } from "@/components/ui/card";

export default function AgbPage() {
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
            Allgemeine Geschäftsbedingungen
          </motion.h1>
          <p className="mt-4 text-muted-foreground text-lg animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            Gültig ab dem 01.01.2025
          </p>
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">§ 1 Geltungsbereich</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                1.1 Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB") gelten für alle von
                Meyer Media erbrachten Leistungen.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                1.2 Abweichende, entgegenstehende oder ergänzende Allgemeine Geschäftsbedingungen werden,
                selbst bei Kenntnis, nicht Vertragsbestandteil, es sei denn, ihrer Geltung wird ausdrücklich
                schriftlich zugestimmt.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">§ 2 Vertragsschluss</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">2.1 Angebote sind freibleibend und unverbindlich.</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                2.2 Ein Vertrag kommt durch schriftliche Auftragsbestätigung oder durch Beginn der
                Leistungserbringung zustande.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                2.3 Änderungen und Ergänzungen bedürfen der Schriftform.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">§ 3 Leistungsumfang</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                3.1 Meyer Media erbringt Dienstleistungen in den Bereichen System Administration,
                Web Development, IT-Support und verwandte IT-Dienstleistungen.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                3.2 Der konkrete Leistungsumfang ergibt sich aus der jeweiligen Auftragsbestätigung
                oder dem individuellen Vertrag.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                3.3 Zusätzliche Leistungen werden gesondert berechnet.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">§ 4 Vergütung und Zahlungsbedingungen</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                4.1 Die Vergütung richtet sich nach der jeweiligen Vereinbarung oder dem aktuellen Stundensatz.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                4.2 Rechnungen sind binnen 14 Tagen nach Rechnungsstellung ohne Abzug zur Zahlung fällig.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                4.3 Bei Zahlungsverzug werden Verzugszinsen in Höhe von 9 Prozentpunkten über dem
                Basiszinssatz berechnet.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                4.4 Aufrechnungsrechte bestehen nur bei unbestrittenen oder rechtskräftig festgestellten Forderungen.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">§ 5 Mitwirkungspflichten des Auftraggebers</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                5.1 Der Auftraggeber stellt alle erforderlichen Informationen und Zugänge rechtzeitig zur Verfügung.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                5.2 Der Auftraggeber führt regelmäßige Datensicherungen durch.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                5.3 Verzögerungen durch unzureichende Mitwirkung gehen zu Lasten des Auftraggebers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">§ 6 Haftung</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                6.1 Die Haftung für Schäden ist ausgeschlossen, soweit gesetzlich zulässig.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                6.2 Dies gilt nicht für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit,
                die auf einer vorsätzlichen oder fahrlässigen Pflichtverletzung beruhen.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                6.3 Die Haftung für sonstige Schäden ist auf Fälle des Vorsatzes und der groben Fahrlässigkeit beschränkt.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                6.4 Im Falle der einfachen Fahrlässigkeit haften wir nur bei Verletzung einer wesentlichen Vertragspflicht
                und der Höhe nach begrenzt auf den vertragstypischen, vorhersehbaren Schaden.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">§ 7 Geheimhaltung</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                7.1 Beide Parteien verpflichten sich zur Geheimhaltung aller vertraulichen Informationen.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                7.2 Diese Verpflichtung besteht auch nach Beendigung des Vertragsverhältnisses fort.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">§ 8 Kündigung</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                8.1 Dauerschuldverhältnisse können von beiden Seiten mit einer Frist von 4 Wochen zum Monatsende gekündigt werden.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                8.2 Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">§ 9 Schlussbestimmungen</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                9.1 Es gilt das Recht der Bundesrepublik Deutschland.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                9.2 Erfüllungsort und Gerichtsstand ist Hannover.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                9.3 Sollten einzelne Bestimmungen unwirksam sein, berührt dies die Wirksamkeit der übrigen Bestimmungen nicht.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}