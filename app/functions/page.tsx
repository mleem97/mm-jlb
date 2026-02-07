"use client";

import { motion } from "motion/react";
import { FileText, Sparkles, Shield, Download, Layers, Zap } from "lucide-react";
import Link from "next/link";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const functions = [
	{
		title: "Anschreiben & Lebenslauf",
		description:
			"Bearbeite Anschreiben und Lebensläufe mit strukturierten Formularen, Live-Vorschau und anpassbaren Layouts.",
		icon: FileText,
	},
	{
		title: "KI-Unterstützung (optional)",
		description:
			"Nutze deinen eigenen API-Key für Textvorschläge und ATS-Optimierung – direkt im Browser.",
		icon: Sparkles,
	},
	{
		title: "Datenschutz by Design",
		description:
			"Alle Daten bleiben lokal gespeichert. Keine Registrierung und keine Server-Speicherung.",
		icon: Shield,
	},
	{
		title: "Export & Weitergabe",
		description:
			"PDF-, JSON- und ZIP-Export für komplette Bewerbungsmappen und Backups.",
		icon: Download,
	},
	{
		title: "Vorlagen & Design",
		description:
			"Branchen-spezifische Templates, Farben, Schriften und Layouts anpassen.",
		icon: Layers,
	},
	{
		title: "Performance",
		description:
			"Next.js 16, Tailwind 4 und moderne Animationen für eine flüssige User Experience.",
		icon: Zap,
	},
];

export default function FunctionsPage() {
	return (
		<main className="min-h-screen bg-background">
			<SiteHeader />
			<section className="pt-28 pb-14 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto text-center">
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
						<h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Funktionen</h1>
						<p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
							Alles, was du für professionelle Bewerbungen brauchst – ohne Datenabgabe und mit voller Kontrolle.
						</p>
					</motion.div>
					<div className="mt-8 flex justify-center">
						<Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
							<Link href="/">Zur Startseite</Link>
						</Button>
					</div>
				</div>
			</section>

			<section className="pb-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{functions.map((item, index) => (
						<motion.div
							key={item.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.05 }}
						>
							<Card className="h-full border-border/50 hover:border-indigo-500/30 transition-colors">
								<CardContent className="p-6">
									<div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4">
										<item.icon className="w-6 h-6" />
									</div>
									<h3 className="text-lg font-semibold mb-2">{item.title}</h3>
									<p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</section>
			<SiteFooter />
		</main>
	);
}
