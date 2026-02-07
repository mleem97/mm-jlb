import type { TemplateId } from "@/types/layoutConfig";

export interface TemplateInfo {
  id: TemplateId;
  name: string;
  description: string;
  previewColors: { bg: string; accent: string; text: string };
  features: string[];
}

export const templates: TemplateInfo[] = [
  {
    id: "classic",
    name: "Klassisch",
    description: "Konservatives, zeitloses Layout — ideal für traditionelle Branchen wie Banken, Recht und Verwaltung.",
    previewColors: { bg: "#fdf8f0", accent: "#1a365d", text: "#1a202c" },
    features: [
      "Klare Struktur",
      "Serifenfreundlich",
      "ATS-optimiert",
      "Dezente Farbakzente",
    ],
  },
  {
    id: "modern",
    name: "Modern",
    description: "Zeitgemäßes Design mit Akzent-Seitenleiste — perfekt für Tech, Marketing und Beratung.",
    previewColors: { bg: "#f7fafc", accent: "#0d9488", text: "#1a202c" },
    features: [
      "Seitenleisten-Akzent",
      "Sans-Serif-Typografie",
      "Farbige Abschnitte",
      "Modernes Raster",
    ],
  },
  {
    id: "creative",
    name: "Kreativ",
    description: "Auffälliges Layout mit Infografik-Elementen — für Design, Medien und kreative Berufe.",
    previewColors: { bg: "#ffffff", accent: "#e05d44", text: "#2d3748" },
    features: [
      "Infografik-Elemente",
      "Kreative Seitenleiste",
      "Auffällige Farben",
      "Individuelle Akzente",
    ],
  },
];
