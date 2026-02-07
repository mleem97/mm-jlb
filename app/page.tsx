// app/page.tsx
"use client";

import { motion } from "motion/react";
import {
  FileText,
  Shield,
  Zap,
  Download,
  Sparkles,
  Lock,
  ChevronRight,
  Github,
  ArrowRight,
} from "lucide-react";
import Silk from "@/components/Silk";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

const features = [
  {
    icon: FileText,
    title: "Anschreiben & Lebenslauf",
    description: "Erstelle professionelle Bewerbungsunterlagen mit Live-Vorschau. Intuitive Formulare für verschiedene Anschreiben-Typen.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10"
  },
  {
    icon: Shield,
    title: "100% Datenschutz",
    description: "Alle Daten bleiben in deinem Browser. Keine Cloud, keine Server, keine Weitergabe. Volle Kontrolle über deine Bewerbungsdaten.",
    color: "text-sky-500",
    bgColor: "bg-sky-500/10"
  },
  {
    icon: Download,
    title: "PDF & JSON Export",
    description: "Exportiere als hochwertiges PDF oder JSON für spätere Bearbeitung. ZIP-Export für komplette Bewerbungsmappen.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10"
  },
  {
    icon: Sparkles,
    title: "KI-Assistent",
    description: "Nutze deinen eigenen API-Key für KI-gestützte Textgenerierung. Optimiere Anschreiben für ATS-Systeme.",
    color: "text-sky-500",
    bgColor: "bg-sky-500/10"
  },
  {
    icon: Lock,
    title: "Lokale Speicherung",
    description: "IndexedDB-basierte Datenspeicherung direkt im Browser. Offline-fähig und performant.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10"
  },
  {
    icon: Zap,
    title: "Blitzschnell",
    description: "Next.js 16, Tailwind 4 und moderne Web-Technologien für eine reaktive, blitzschnelle Benutzererfahrung.",
    color: "text-sky-500",
    bgColor: "bg-sky-500/10"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Section */}
      <section id="start" className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="h-full w-full opacity-70">
            <Silk color="#6D7EF7" scale={1.2} speed={4} noiseIntensity={1.2} rotation={0.35} />
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-background/70 via-background/40 to-background" />
        </div>
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 text-indigo-600 text-sm font-medium mb-6 border border-indigo-500/20">
              <Sparkles className="w-4 h-4" />
              Open Source & Datenschutz-freundlich
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              Professionelle Bewerbungen{" "}
              <span className="bg-linear-to-r from-indigo-500 via-sky-500 to-indigo-500 bg-clip-text text-transparent">
                in Minuten
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Erstelle Anschreiben, Lebensläufe und komplette Bewerbungsmappen 
              direkt im Browser. 100% offline-fähig. Keine Daten auf externen Servern.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 text-base group"
              >
                <a href="/builder">
                  Kostenlos starten
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base border-gunmetal/20"
              >
                <a href="https://github.com/mleem97/mm-jlb" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  Auf GitHub ansehen
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="absolute inset-0 bg-linear-to-r from-indigo-500/20 to-sky-500/20 blur-3xl rounded-full" />
            <Card className="relative border border-border/50 shadow-2xl overflow-hidden bg-card/50 backdrop-blur">
              <CardContent className="p-0">
                <div className="aspect-video bg-linear-to-br from-muted via-background to-muted flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-linear-to-br from-indigo-500 to-sky-500 flex items-center justify-center shadow-lg">
                      <FileText className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-muted-foreground">Editor-Vorschau</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Alles was du brauchst
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Von der Idee bis zur versendeten Bewerbung – alle Tools an einem Ort, 
              direkt in deinem Browser.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border-border/50 hover:border-indigo-500/30 transition-colors group hover:shadow-lg hover:shadow-indigo-500/5">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Privacy Section */}
      <section id="privacy" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 text-sky-600 text-sm font-medium mb-6 border border-sky-500/20">
                <Lock className="w-4 h-4" />
                Zero-Server-Architecture
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Deine Daten bleiben deine Daten
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Im Gegensatz zu anderen Tools speichern wir nichts auf unseren Servern. 
                Alle deine Bewerbungsdaten werden lokal in deinem Browser gespeichert – 
                sicher, verschlüsselt und nur für dich zugänglich.
              </p>
              <ul className="space-y-3">
                {[
                  "Keine Registrierung nötig",
                  "Keine Datenweitergabe an Dritte",
                  "JSON-Export für volle Portabilität",
                  "Ein-Klick-Löschung aller Daten"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                      <ChevronRight className="w-3 h-3 text-indigo-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-linear-to-r from-sky-500/20 to-indigo-500/20 blur-3xl rounded-full" />
              <Card className="relative border border-border/50 shadow-xl">
                <CardContent className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-muted rounded w-3/4 mb-2" />
                        <div className="h-2 bg-muted rounded w-1/2" />
                      </div>
                      <div className="text-xs text-green-500 font-medium">Lokal</div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                      <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center">
                        <Download className="w-5 h-5 text-sky-500" />
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-muted rounded w-2/3 mb-2" />
                        <div className="h-2 bg-muted rounded w-1/3" />
                      </div>
                      <div className="text-xs text-green-500 font-medium">Export</div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-lg border-2 border-dashed border-indigo-500/30 bg-indigo-500/5">
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Kein Server involviert</p>
                        <p className="text-xs text-muted-foreground">100% Client-seitig</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-muted/30 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Bereit für deine nächste Bewerbung?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Starte jetzt kostenlos und erstelle deine erste professionelle Bewerbung 
              in weniger als 10 Minuten.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 text-base"
              >
                <a href="/builder">
                  Editor öffnen
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <ul className="text-xs text-muted-foreground flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
                <li>Open Source auf MIT-Lizenz</li>
                <li aria-hidden="true">•</li>
                <li>Keine Kosten</li>
                <li aria-hidden="true">•</li>
                <li>Keine Registrierung</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}