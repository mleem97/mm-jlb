"use client";

import { motion } from "motion/react";

import SplitText from "@/components/SplitText";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const values = [
	{
		title: "Datenschutz zuerst",
		description:
			"Alle Bewerbungsdaten bleiben lokal in deinem Browser. Keine Cloud, kein Tracking, keine Weitergabe.",
	},
	{
		title: "Einfach & schnell",
		description:
			"Von der Idee bis zur fertigen Bewerbung in Minuten – mit klaren Formularen und Live-Vorschau.",
	},
	{
		title: "Open Source",
		description:
			"Transparenter Code, nachvollziehbare Funktionen und ein Projekt, das mit der Community wächst.",
	},
];

const milestones = [
	"MVP mit Anschreiben- und Lebenslauf-Builder",
	"PDF-Export & lokale Speicherung",
	"Vorlagen, Import/Export und Workflow-Tools",
	"Optionale KI-Features mit eigenem API-Key",
];

export default function AboutPage() {
	return (
		<main className="min-h-screen bg-background">
			<SiteHeader />
			<section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
				<div className="max-w-5xl mx-auto text-center">
					<SplitText
						tag="h1"
						text="Über Job Letter Builder"
						className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight"
						splitType="chars"
					/>
					<p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
						Job Letter Builder ist ein datenschutzfreundlicher Bewerbungsgenerator, der
						professionelle Anschreiben und Lebensläufe direkt im Browser erstellt – schnell,
						modern und ohne Server.
					</p>
					<div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
						<Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
							<a href="/functions">Funktionen ansehen</a>
						</Button>
						<Button asChild variant="outline" size="lg">
							<a href="/impressum">Impressum</a>
						</Button>
					</div>
				</div>
			</section>

			<section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
				<div className="max-w-6xl mx-auto">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-12"
					>
						<h2 className="text-3xl sm:text-4xl font-bold">Unsere Werte</h2>
						<p className="text-muted-foreground mt-3">
							Entwickelt für Menschen, die Kontrolle über ihre Bewerbungsdaten behalten wollen.
						</p>
					</motion.div>
					<div className="grid gap-6 md:grid-cols-3">
						{values.map((value) => (
							<motion.div
								key={value.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
							>
								<Card className="h-full border-border/50">
									<CardContent className="p-6">
										<h3 className="text-lg font-semibold mb-2">{value.title}</h3>
										<p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			<section className="py-16 px-4 sm:px-6 lg:px-8">
				<div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-[2fr_1fr] items-start">
					<motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
						<h2 className="text-3xl font-bold mb-4">Wie wir arbeiten</h2>
						<p className="text-muted-foreground leading-relaxed">
							Wir bauen bewusst client-seitig: Dein Browser ist der Server. Das reduziert
							Komplexität, spart Kosten und schützt deine Daten. Jede neue Funktion wird zuerst
							auf Datenschutz, Nachvollziehbarkeit und Benutzerfreundlichkeit geprüft.
						</p>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className="bg-muted/40 rounded-2xl p-6 border border-border/50"
					>
						<h3 className="text-lg font-semibold mb-3">Meilensteine</h3>
						<ul className="space-y-3 text-sm text-muted-foreground">
							{milestones.map((item) => (
								<li key={item} className="flex items-start gap-2">
									<span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</motion.div>
				</div>
			</section>
			<SiteFooter />
		</main>
	);
}
