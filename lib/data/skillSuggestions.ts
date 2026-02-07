import type { SkillCategory } from "@/types/skills";

// ─── Skill Suggestion Types ────────────────────────────────
export interface SkillSuggestion {
  name: string;
  category: SkillCategory;
  subcategory?: string;
}

// ─── Skill Category Descriptions ──────────────────────────
export interface SkillCategoryInfo {
  category: SkillCategory;
  icon: string;
  title: string;
  description: string;
  howToIdentify: string;
}

export const skillCategoryDescriptions: SkillCategoryInfo[] = [
  {
    category: "hard",
    icon: "🔧",
    title: "Hard Skills (Fachkompetenzen)",
    description:
      "Hard Skills sind erlernbare, messbare Fähigkeiten, die Sie durch Ausbildung, Studium, Weiterbildungen oder Berufserfahrung erworben haben. Sie sind fachspezifisch und lassen sich durch Zertifikate, Zeugnisse oder Arbeitsproben nachweisen.",
    howToIdentify:
      "Fragen Sie sich: Was habe ich in meiner Ausbildung oder im Beruf konkret gelernt? Welche Methoden, Verfahren oder Fachkenntnisse setze ich täglich ein? Welche Aufgaben kann ich nachweislich erledigen? Schauen Sie in Ihre Zeugnisse, Zertifikate und Stellenbeschreibungen — dort finden Sie Ihre Hard Skills.",
  },
  {
    category: "digital",
    icon: "💻",
    title: "Digitale Kompetenzen",
    description:
      "Digitale Skills umfassen alle Fähigkeiten im Umgang mit Software, Programmiersprachen, Tools und digitalen Technologien. Sie sind 2026 in nahezu jeder Branche unverzichtbar — von Office-Anwendungen über Cloud-Dienste bis hin zu KI-Tools.",
    howToIdentify:
      "Welche Software nutzen Sie regelmäßig? Können Sie programmieren oder mit Datenbanken arbeiten? Nutzen Sie KI-Tools wie ChatGPT oder Copilot? Denken Sie an alle Programme und digitalen Werkzeuge, die Sie in Ihrem Arbeitsalltag verwenden — jedes davon ist ein digitaler Skill.",
  },
  {
    category: "green",
    icon: "🌱",
    title: "Green Skills (Nachhaltigkeitskompetenzen)",
    description:
      "Green Skills sind Fähigkeiten rund um Nachhaltigkeit, Umweltschutz und verantwortungsvolle Unternehmensführung. Mit der wachsenden Bedeutung von ESG-Kriterien und Klimaschutz werden diese Skills immer gefragter — branchenübergreifend.",
    howToIdentify:
      "Haben Sie sich mit Nachhaltigkeitsthemen beschäftigt? Kennen Sie sich mit Energieeffizienz, Kreislaufwirtschaft oder ESG-Reporting aus? Auch wenn Sie in einem \u201enicht-grünen\u201c Beruf arbeiten, können Sie Green Skills besitzen — z.\u00a0B. wenn Sie in Ihrem Unternehmen Müll reduziert, Prozesse energieeffizienter gestaltet oder an Nachhaltigkeitsprojekten mitgewirkt haben.",
  },
  {
    category: "soft",
    icon: "🤝",
    title: "Soft Skills (Soziale & Persönliche Kompetenzen)",
    description:
      "Soft Skills sind überfachliche Kompetenzen, die Ihre Persönlichkeit, Ihr Sozialverhalten und Ihre Arbeitsweise betreffen. Sie sind nicht an eine bestimmte Branche gebunden und gelten als Schlüsselqualifikationen für Teamarbeit, Führung und beruflichen Erfolg.",
    howToIdentify:
      "Fragen Sie Kollegen oder Freunde: Was schätzen sie an Ihrer Zusammenarbeit? Wie gehen Sie mit Konflikten um? Können Sie gut präsentieren, organisieren oder andere motivieren? Denken Sie an Situationen, in denen Sie erfolgreich im Team gearbeitet, Probleme gelöst oder unter Druck Ruhe bewahrt haben — das sind Ihre Soft Skills.",
  },
];

// ─── Hard Skills ───────────────────────────────────────────
export const hardSkillSuggestions: SkillSuggestion[] = [
  // Management
  { name: "Projektmanagement", category: "hard", subcategory: "Management" },
  { name: "Prozessoptimierung", category: "hard", subcategory: "Management" },
  { name: "Change Management", category: "hard", subcategory: "Management" },
  { name: "Strategische Planung", category: "hard", subcategory: "Management" },
  { name: "Business Development", category: "hard", subcategory: "Management" },
  { name: "Stakeholder-Management", category: "hard", subcategory: "Management" },
  { name: "Risikomanagement", category: "hard", subcategory: "Management" },
  { name: "Agiles Projektmanagement (Scrum/Kanban)", category: "hard", subcategory: "Management" },
  { name: "PRINCE2", category: "hard", subcategory: "Management" },
  { name: "OKR-Methodik", category: "hard", subcategory: "Management" },

  // Kaufmännisch
  { name: "Buchhaltung", category: "hard", subcategory: "Kaufmännisch" },
  { name: "Controlling", category: "hard", subcategory: "Kaufmännisch" },
  { name: "Bilanzierung (HGB/IFRS)", category: "hard", subcategory: "Kaufmännisch" },
  { name: "Kostenrechnung", category: "hard", subcategory: "Kaufmännisch" },
  { name: "Budgetplanung", category: "hard", subcategory: "Kaufmännisch" },
  { name: "Einkauf & Beschaffung", category: "hard", subcategory: "Kaufmännisch" },
  { name: "Auftragsabwicklung", category: "hard", subcategory: "Kaufmännisch" },
  { name: "Rechnungswesen", category: "hard", subcategory: "Kaufmännisch" },
  { name: "Steuerwesen", category: "hard", subcategory: "Kaufmännisch" },
  { name: "Lohn- und Gehaltsabrechnung", category: "hard", subcategory: "Kaufmännisch" },

  // Marketing & Vertrieb
  { name: "Marketing", category: "hard", subcategory: "Marketing & Vertrieb" },
  { name: "Vertrieb", category: "hard", subcategory: "Marketing & Vertrieb" },
  { name: "Key Account Management", category: "hard", subcategory: "Marketing & Vertrieb" },
  { name: "Marktforschung", category: "hard", subcategory: "Marketing & Vertrieb" },
  { name: "Wettbewerbsanalyse", category: "hard", subcategory: "Marketing & Vertrieb" },
  { name: "CRM-Management", category: "hard", subcategory: "Marketing & Vertrieb" },
  { name: "Angebotskalkulation", category: "hard", subcategory: "Marketing & Vertrieb" },
  { name: "Preisgestaltung", category: "hard", subcategory: "Marketing & Vertrieb" },
  { name: "Produktmanagement", category: "hard", subcategory: "Marketing & Vertrieb" },
  { name: "Eventmanagement", category: "hard", subcategory: "Marketing & Vertrieb" },

  // HR & Personal
  { name: "Personalwesen", category: "hard", subcategory: "HR & Personal" },
  { name: "Recruiting", category: "hard", subcategory: "HR & Personal" },
  { name: "Personalentwicklung", category: "hard", subcategory: "HR & Personal" },
  { name: "Employer Branding", category: "hard", subcategory: "HR & Personal" },
  { name: "Arbeitsrecht", category: "hard", subcategory: "HR & Personal" },
  { name: "Onboarding-Prozesse", category: "hard", subcategory: "HR & Personal" },
  { name: "Mitarbeitergespräche", category: "hard", subcategory: "HR & Personal" },
  { name: "Betriebliches Gesundheitsmanagement", category: "hard", subcategory: "HR & Personal" },

  // Qualität
  { name: "Qualitätsmanagement", category: "hard", subcategory: "Qualität" },
  { name: "ISO 9001", category: "hard", subcategory: "Qualität" },
  { name: "Six Sigma", category: "hard", subcategory: "Qualität" },
  { name: "Lean Management", category: "hard", subcategory: "Qualität" },
  { name: "FMEA", category: "hard", subcategory: "Qualität" },
  { name: "Auditierung", category: "hard", subcategory: "Qualität" },
  { name: "KVP (Kontinuierlicher Verbesserungsprozess)", category: "hard", subcategory: "Qualität" },

  // Logistik
  { name: "Supply Chain Management", category: "hard", subcategory: "Logistik" },
  { name: "Lagerverwaltung", category: "hard", subcategory: "Logistik" },
  { name: "Transportlogistik", category: "hard", subcategory: "Logistik" },
  { name: "Zollabwicklung", category: "hard", subcategory: "Logistik" },
  { name: "Bestandsmanagement", category: "hard", subcategory: "Logistik" },
  { name: "Warenwirtschaftssysteme", category: "hard", subcategory: "Logistik" },
  { name: "Staplerschein / Flurförderzeuge", category: "hard", subcategory: "Logistik" },
  { name: "Disposition", category: "hard", subcategory: "Logistik" },

  // Ingenieurwesen
  { name: "CAD-Konstruktion", category: "hard", subcategory: "Ingenieurwesen" },
  { name: "Maschinenbau", category: "hard", subcategory: "Ingenieurwesen" },
  { name: "Elektrotechnik", category: "hard", subcategory: "Ingenieurwesen" },
  { name: "Automatisierungstechnik", category: "hard", subcategory: "Ingenieurwesen" },
  { name: "SPS-Programmierung", category: "hard", subcategory: "Ingenieurwesen" },
  { name: "Technische Zeichnung", category: "hard", subcategory: "Ingenieurwesen" },
  { name: "Werkstoffkunde", category: "hard", subcategory: "Ingenieurwesen" },
  { name: "Verfahrenstechnik", category: "hard", subcategory: "Ingenieurwesen" },
  { name: "Fertigungstechnik", category: "hard", subcategory: "Ingenieurwesen" },
  { name: "Messtechnik", category: "hard", subcategory: "Ingenieurwesen" },
  { name: "Arbeitssicherheit", category: "hard", subcategory: "Ingenieurwesen" },

  // Gesundheitswesen
  { name: "Pflegedokumentation", category: "hard", subcategory: "Gesundheitswesen" },
  { name: "Medizinische Terminologie", category: "hard", subcategory: "Gesundheitswesen" },
  { name: "Hygienemaßnahmen", category: "hard", subcategory: "Gesundheitswesen" },
  { name: "Wundversorgung", category: "hard", subcategory: "Gesundheitswesen" },
  { name: "Medikamentenmanagement", category: "hard", subcategory: "Gesundheitswesen" },
  { name: "Labordiagnostik", category: "hard", subcategory: "Gesundheitswesen" },
  { name: "Patientenbetreuung", category: "hard", subcategory: "Gesundheitswesen" },
  { name: "Notfallmedizin", category: "hard", subcategory: "Gesundheitswesen" },
  { name: "Medizingeräte-Bedienung", category: "hard", subcategory: "Gesundheitswesen" },

  // Finanzen
  { name: "Finanzanalyse", category: "hard", subcategory: "Finanzen" },
  { name: "Portfoliomanagement", category: "hard", subcategory: "Finanzen" },
  { name: "Kreditprüfung", category: "hard", subcategory: "Finanzen" },
  { name: "Versicherungswesen", category: "hard", subcategory: "Finanzen" },
  { name: "Risikobewertung", category: "hard", subcategory: "Finanzen" },
  { name: "Wertpapierhandel", category: "hard", subcategory: "Finanzen" },
  { name: "Compliance", category: "hard", subcategory: "Finanzen" },
  { name: "Geldwäscheprävention (AML)", category: "hard", subcategory: "Finanzen" },

  // Recht
  { name: "Vertragsrecht", category: "hard", subcategory: "Recht" },
  { name: "Datenschutz (DSGVO)", category: "hard", subcategory: "Recht" },
  { name: "Verwaltungsrecht", category: "hard", subcategory: "Recht" },
  { name: "Vertragsgestaltung", category: "hard", subcategory: "Recht" },
  { name: "Rechtsrecherche", category: "hard", subcategory: "Recht" },
  { name: "Notariat", category: "hard", subcategory: "Recht" },

  // Handwerk
  { name: "Sanitär-/Heizungstechnik", category: "hard", subcategory: "Handwerk" },
  { name: "Elektroinstallation", category: "hard", subcategory: "Handwerk" },
  { name: "Holzbearbeitung / Tischlerei", category: "hard", subcategory: "Handwerk" },
  { name: "Schweißtechnik", category: "hard", subcategory: "Handwerk" },
  { name: "CNC-Fräsen/Drehen", category: "hard", subcategory: "Handwerk" },
  { name: "Bautechnik", category: "hard", subcategory: "Handwerk" },
  { name: "Malerarbeiten", category: "hard", subcategory: "Handwerk" },
  { name: "Kfz-Mechatronik", category: "hard", subcategory: "Handwerk" },
  { name: "Dachdeckerei", category: "hard", subcategory: "Handwerk" },

  // Gastronomie
  { name: "Küchenorganisation", category: "hard", subcategory: "Gastronomie" },
  { name: "Speisekalkulation", category: "hard", subcategory: "Gastronomie" },
  { name: "HACCP-Richtlinien", category: "hard", subcategory: "Gastronomie" },
  { name: "Barista-Kenntnisse", category: "hard", subcategory: "Gastronomie" },
  { name: "Sommelier-Wissen", category: "hard", subcategory: "Gastronomie" },
  { name: "Reservierungsmanagement", category: "hard", subcategory: "Gastronomie" },
  { name: "Patisserie", category: "hard", subcategory: "Gastronomie" },

  // Wissenschaft
  { name: "Statistische Auswertung", category: "hard", subcategory: "Wissenschaft" },
  { name: "Literaturrecherche", category: "hard", subcategory: "Wissenschaft" },
  { name: "Labortechniken", category: "hard", subcategory: "Wissenschaft" },
  { name: "Wissenschaftliches Schreiben", category: "hard", subcategory: "Wissenschaft" },
  { name: "Forschungsdesign", category: "hard", subcategory: "Wissenschaft" },
  { name: "Peer Review", category: "hard", subcategory: "Wissenschaft" },
  { name: "Datenanalyse (SPSS/R)", category: "hard", subcategory: "Wissenschaft" },

  // Bildung
  { name: "Didaktik", category: "hard", subcategory: "Bildung" },
  { name: "Lehrplanerstellung", category: "hard", subcategory: "Bildung" },
  { name: "E-Learning-Konzeption", category: "hard", subcategory: "Bildung" },
  { name: "Prüfungskonzeption", category: "hard", subcategory: "Bildung" },
  { name: "Trainingsmoderation", category: "hard", subcategory: "Bildung" },
  { name: "Sprachförderung", category: "hard", subcategory: "Bildung" },

  // Medien
  { name: "Öffentlichkeitsarbeit (PR)", category: "hard", subcategory: "Medien" },
  { name: "Journalismus", category: "hard", subcategory: "Medien" },
  { name: "Redaktionsarbeit", category: "hard", subcategory: "Medien" },
  { name: "Krisenkommunikation", category: "hard", subcategory: "Medien" },
  { name: "Corporate Communications", category: "hard", subcategory: "Medien" },
  { name: "Technische Dokumentation", category: "hard", subcategory: "Medien" },
];

// ─── Digital Skills ────────────────────────────────────────
export const digitalSkillSuggestions: SkillSuggestion[] = [
  // Programmierung
  { name: "Python", category: "digital", subcategory: "Programmierung" },
  { name: "JavaScript", category: "digital", subcategory: "Programmierung" },
  { name: "TypeScript", category: "digital", subcategory: "Programmierung" },
  { name: "Java", category: "digital", subcategory: "Programmierung" },
  { name: "C#", category: "digital", subcategory: "Programmierung" },
  { name: "C++", category: "digital", subcategory: "Programmierung" },
  { name: "Go", category: "digital", subcategory: "Programmierung" },
  { name: "Rust", category: "digital", subcategory: "Programmierung" },
  { name: "PHP", category: "digital", subcategory: "Programmierung" },
  { name: "Ruby", category: "digital", subcategory: "Programmierung" },
  { name: "Swift", category: "digital", subcategory: "Programmierung" },
  { name: "Kotlin", category: "digital", subcategory: "Programmierung" },
  { name: "R", category: "digital", subcategory: "Programmierung" },
  { name: "MATLAB", category: "digital", subcategory: "Programmierung" },
  { name: "Scala", category: "digital", subcategory: "Programmierung" },

  // Web
  { name: "HTML5 / CSS3", category: "digital", subcategory: "Web" },
  { name: "React", category: "digital", subcategory: "Web" },
  { name: "Angular", category: "digital", subcategory: "Web" },
  { name: "Vue.js", category: "digital", subcategory: "Web" },
  { name: "Next.js", category: "digital", subcategory: "Web" },
  { name: "Node.js", category: "digital", subcategory: "Web" },
  { name: "Tailwind CSS", category: "digital", subcategory: "Web" },
  { name: "REST-APIs", category: "digital", subcategory: "Web" },
  { name: "GraphQL", category: "digital", subcategory: "Web" },
  { name: "WordPress", category: "digital", subcategory: "Web" },

  // Mobile
  { name: "React Native", category: "digital", subcategory: "Mobile" },
  { name: "Flutter", category: "digital", subcategory: "Mobile" },
  { name: "iOS-Entwicklung (Swift/SwiftUI)", category: "digital", subcategory: "Mobile" },
  { name: "Android-Entwicklung (Kotlin)", category: "digital", subcategory: "Mobile" },

  // Datenbanken
  { name: "SQL", category: "digital", subcategory: "Datenbanken" },
  { name: "PostgreSQL", category: "digital", subcategory: "Datenbanken" },
  { name: "MySQL", category: "digital", subcategory: "Datenbanken" },
  { name: "MongoDB", category: "digital", subcategory: "Datenbanken" },
  { name: "Redis", category: "digital", subcategory: "Datenbanken" },
  { name: "Oracle DB", category: "digital", subcategory: "Datenbanken" },
  { name: "Elasticsearch", category: "digital", subcategory: "Datenbanken" },

  // Cloud & DevOps
  { name: "AWS (Amazon Web Services)", category: "digital", subcategory: "Cloud & DevOps" },
  { name: "Microsoft Azure", category: "digital", subcategory: "Cloud & DevOps" },
  { name: "Google Cloud Platform", category: "digital", subcategory: "Cloud & DevOps" },
  { name: "Docker", category: "digital", subcategory: "Cloud & DevOps" },
  { name: "Kubernetes", category: "digital", subcategory: "Cloud & DevOps" },
  { name: "CI/CD (Jenkins/GitHub Actions)", category: "digital", subcategory: "Cloud & DevOps" },
  { name: "Terraform", category: "digital", subcategory: "Cloud & DevOps" },
  { name: "Linux-Administration", category: "digital", subcategory: "Cloud & DevOps" },
  { name: "Git / Versionskontrolle", category: "digital", subcategory: "Cloud & DevOps" },
  { name: "Ansible", category: "digital", subcategory: "Cloud & DevOps" },

  // KI & Data Science
  { name: "Machine Learning", category: "digital", subcategory: "KI & Data Science" },
  { name: "Deep Learning (TensorFlow/PyTorch)", category: "digital", subcategory: "KI & Data Science" },
  { name: "Natural Language Processing (NLP)", category: "digital", subcategory: "KI & Data Science" },
  { name: "Computer Vision", category: "digital", subcategory: "KI & Data Science" },
  { name: "Prompt Engineering", category: "digital", subcategory: "KI & Data Science" },
  { name: "ChatGPT / KI-Tools", category: "digital", subcategory: "KI & Data Science" },
  { name: "GitHub Copilot", category: "digital", subcategory: "KI & Data Science" },
  { name: "Datenvisualisierung", category: "digital", subcategory: "KI & Data Science" },
  { name: "Big Data (Hadoop/Spark)", category: "digital", subcategory: "KI & Data Science" },
  { name: "ETL-Prozesse", category: "digital", subcategory: "KI & Data Science" },

  // BI & Analyse
  { name: "Tableau", category: "digital", subcategory: "BI & Analyse" },
  { name: "Power BI", category: "digital", subcategory: "BI & Analyse" },
  { name: "Google Analytics", category: "digital", subcategory: "BI & Analyse" },
  { name: "Looker Studio", category: "digital", subcategory: "BI & Analyse" },
  { name: "Datenanalyse", category: "digital", subcategory: "BI & Analyse" },

  // Office & Produktivität
  { name: "Microsoft Office", category: "digital", subcategory: "Office & Produktivität" },
  { name: "Excel (Fortgeschritten)", category: "digital", subcategory: "Office & Produktivität" },
  { name: "Microsoft 365", category: "digital", subcategory: "Office & Produktivität" },
  { name: "Google Workspace", category: "digital", subcategory: "Office & Produktivität" },
  { name: "Notion", category: "digital", subcategory: "Office & Produktivität" },
  { name: "SharePoint", category: "digital", subcategory: "Office & Produktivität" },

  // ERP & Business
  { name: "SAP", category: "digital", subcategory: "ERP & Business" },
  { name: "SAP S/4HANA", category: "digital", subcategory: "ERP & Business" },
  { name: "Salesforce", category: "digital", subcategory: "ERP & Business" },
  { name: "HubSpot", category: "digital", subcategory: "ERP & Business" },
  { name: "DATEV", category: "digital", subcategory: "ERP & Business" },
  { name: "Lexware", category: "digital", subcategory: "ERP & Business" },
  { name: "Navision / Dynamics", category: "digital", subcategory: "ERP & Business" },

  // PM-Tools
  { name: "Jira", category: "digital", subcategory: "PM-Tools" },
  { name: "Confluence", category: "digital", subcategory: "PM-Tools" },
  { name: "Asana", category: "digital", subcategory: "PM-Tools" },
  { name: "Trello", category: "digital", subcategory: "PM-Tools" },
  { name: "Monday.com", category: "digital", subcategory: "PM-Tools" },
  { name: "Microsoft Project", category: "digital", subcategory: "PM-Tools" },
  { name: "Miro", category: "digital", subcategory: "PM-Tools" },

  // Design-Tools
  { name: "Adobe Creative Suite", category: "digital", subcategory: "Design-Tools" },
  { name: "Figma", category: "digital", subcategory: "Design-Tools" },
  { name: "Sketch", category: "digital", subcategory: "Design-Tools" },
  { name: "Adobe Photoshop", category: "digital", subcategory: "Design-Tools" },
  { name: "Adobe Illustrator", category: "digital", subcategory: "Design-Tools" },
  { name: "Adobe InDesign", category: "digital", subcategory: "Design-Tools" },
  { name: "Adobe Premiere Pro", category: "digital", subcategory: "Design-Tools" },
  { name: "Adobe After Effects", category: "digital", subcategory: "Design-Tools" },
  { name: "Canva", category: "digital", subcategory: "Design-Tools" },
  { name: "Blender (3D)", category: "digital", subcategory: "Design-Tools" },
  { name: "AutoCAD", category: "digital", subcategory: "Design-Tools" },
  { name: "SolidWorks", category: "digital", subcategory: "Design-Tools" },
  { name: "CATIA", category: "digital", subcategory: "Design-Tools" },

  // Marketing-Tools
  { name: "SEO / Suchmaschinenoptimierung", category: "digital", subcategory: "Marketing-Tools" },
  { name: "SEA / Google Ads", category: "digital", subcategory: "Marketing-Tools" },
  { name: "Social Media Management", category: "digital", subcategory: "Marketing-Tools" },
  { name: "Content Management Systeme (CMS)", category: "digital", subcategory: "Marketing-Tools" },
  { name: "E-Mail-Marketing (Mailchimp/Brevo)", category: "digital", subcategory: "Marketing-Tools" },
  { name: "Affiliate Marketing", category: "digital", subcategory: "Marketing-Tools" },
  { name: "Marketing Automation", category: "digital", subcategory: "Marketing-Tools" },

  // IT-Sicherheit
  { name: "IT-Sicherheit / Cybersecurity", category: "digital", subcategory: "IT-Sicherheit" },
  { name: "Penetration Testing", category: "digital", subcategory: "IT-Sicherheit" },
  { name: "Netzwerksicherheit", category: "digital", subcategory: "IT-Sicherheit" },
  { name: "SIEM (Security Information & Event Management)", category: "digital", subcategory: "IT-Sicherheit" },
  { name: "IT-Forensik", category: "digital", subcategory: "IT-Sicherheit" },

  // IT-Administration
  { name: "Active Directory", category: "digital", subcategory: "IT-Administration" },
  { name: "Windows Server", category: "digital", subcategory: "IT-Administration" },
  { name: "Netzwerkadministration", category: "digital", subcategory: "IT-Administration" },
  { name: "Virtualisierung (VMware/Hyper-V)", category: "digital", subcategory: "IT-Administration" },
  { name: "IT-Support / Helpdesk", category: "digital", subcategory: "IT-Administration" },
  { name: "ITIL", category: "digital", subcategory: "IT-Administration" },
];

// ─── Green Skills ──────────────────────────────────────────
export const greenSkillSuggestions: SkillSuggestion[] = [
  // Strategie
  { name: "Nachhaltigkeitsmanagement", category: "green", subcategory: "Strategie" },
  { name: "ESG-Reporting", category: "green", subcategory: "Strategie" },
  { name: "CSR (Corporate Social Responsibility)", category: "green", subcategory: "Strategie" },
  { name: "Nachhaltigkeitsstrategie", category: "green", subcategory: "Strategie" },
  { name: "GRI-Standards", category: "green", subcategory: "Strategie" },
  { name: "EU-Taxonomie", category: "green", subcategory: "Strategie" },
  { name: "CSRD-Berichterstattung", category: "green", subcategory: "Strategie" },
  { name: "SDG-Implementierung", category: "green", subcategory: "Strategie" },

  // Energie & Klima
  { name: "CO₂-Bilanzierung", category: "green", subcategory: "Energie & Klima" },
  { name: "Energieeffizienz", category: "green", subcategory: "Energie & Klima" },
  { name: "Erneuerbare Energien", category: "green", subcategory: "Energie & Klima" },
  { name: "Energieaudit", category: "green", subcategory: "Energie & Klima" },
  { name: "Klimaneutralitätsstrategie", category: "green", subcategory: "Energie & Klima" },
  { name: "Gebäudeenergieberatung", category: "green", subcategory: "Energie & Klima" },
  { name: "Photovoltaik-Planung", category: "green", subcategory: "Energie & Klima" },
  { name: "Wärmepumpen-Technik", category: "green", subcategory: "Energie & Klima" },

  // Kreislauf & Ressourcen
  { name: "Kreislaufwirtschaft", category: "green", subcategory: "Kreislauf & Ressourcen" },
  { name: "Abfallmanagement", category: "green", subcategory: "Kreislauf & Ressourcen" },
  { name: "Ressourceneffizienz", category: "green", subcategory: "Kreislauf & Ressourcen" },
  { name: "Recycling-Technologien", category: "green", subcategory: "Kreislauf & Ressourcen" },
  { name: "Ökobilanzierung (LCA)", category: "green", subcategory: "Kreislauf & Ressourcen" },
  { name: "Nachhaltige Beschaffung", category: "green", subcategory: "Kreislauf & Ressourcen" },
  { name: "Green Procurement", category: "green", subcategory: "Kreislauf & Ressourcen" },

  // Umwelt
  { name: "Umweltmanagement", category: "green", subcategory: "Umwelt" },
  { name: "ISO 14001", category: "green", subcategory: "Umwelt" },
  { name: "Umweltverträglichkeitsprüfung", category: "green", subcategory: "Umwelt" },
  { name: "Naturschutz", category: "green", subcategory: "Umwelt" },
  { name: "Biodiversitätsmanagement", category: "green", subcategory: "Umwelt" },
  { name: "Wassermanagement", category: "green", subcategory: "Umwelt" },

  // Green Finance & Mobilität
  { name: "Sustainable Finance", category: "green", subcategory: "Green Finance" },
  { name: "Green Bonds", category: "green", subcategory: "Green Finance" },
  { name: "Impact Investing", category: "green", subcategory: "Green Finance" },
  { name: "Nachhaltige Mobilität", category: "green", subcategory: "Mobilität" },
  { name: "E-Mobilität", category: "green", subcategory: "Mobilität" },
  { name: "Nachhaltige Stadtplanung", category: "green", subcategory: "Mobilität" },
];

// ─── Soft Skills ───────────────────────────────────────────
export const softSkillSuggestions: SkillSuggestion[] = [
  // Kommunikation
  { name: "Kommunikation", category: "soft", subcategory: "Kommunikation" },
  { name: "Aktives Zuhören", category: "soft", subcategory: "Kommunikation" },
  { name: "Präsentationsfähigkeit", category: "soft", subcategory: "Kommunikation" },
  { name: "Verhandlungsgeschick", category: "soft", subcategory: "Kommunikation" },
  { name: "Überzeugungskraft", category: "soft", subcategory: "Kommunikation" },
  { name: "Moderation", category: "soft", subcategory: "Kommunikation" },
  { name: "Storytelling", category: "soft", subcategory: "Kommunikation" },
  { name: "Schriftliche Ausdrucksfähigkeit", category: "soft", subcategory: "Kommunikation" },
  { name: "Interkulturelle Kompetenz", category: "soft", subcategory: "Kommunikation" },

  // Führung
  { name: "Führungskompetenz", category: "soft", subcategory: "Führung" },
  { name: "Teamfähigkeit", category: "soft", subcategory: "Führung" },
  { name: "Delegationsfähigkeit", category: "soft", subcategory: "Führung" },
  { name: "Mentoring", category: "soft", subcategory: "Führung" },
  { name: "Coaching-Kompetenz", category: "soft", subcategory: "Führung" },
  { name: "Konfliktlösung", category: "soft", subcategory: "Führung" },
  { name: "Motivationsfähigkeit", category: "soft", subcategory: "Führung" },
  { name: "Feedbackkultur", category: "soft", subcategory: "Führung" },

  // Denken
  { name: "Analytisches Denken", category: "soft", subcategory: "Denken" },
  { name: "Problemlösung", category: "soft", subcategory: "Denken" },
  { name: "Kritisches Denken", category: "soft", subcategory: "Denken" },
  { name: "Kreativität", category: "soft", subcategory: "Denken" },
  { name: "Entscheidungsfähigkeit", category: "soft", subcategory: "Denken" },
  { name: "Strategisches Denken", category: "soft", subcategory: "Denken" },
  { name: "Design Thinking", category: "soft", subcategory: "Denken" },
  { name: "Lösungsorientierung", category: "soft", subcategory: "Denken" },

  // Organisation
  { name: "Zeitmanagement", category: "soft", subcategory: "Organisation" },
  { name: "Selbstorganisation", category: "soft", subcategory: "Organisation" },
  { name: "Priorisierung", category: "soft", subcategory: "Organisation" },
  { name: "Multitasking", category: "soft", subcategory: "Organisation" },
  { name: "Stressresistenz", category: "soft", subcategory: "Organisation" },
  { name: "Belastbarkeit", category: "soft", subcategory: "Organisation" },
  { name: "Eigeninitiative", category: "soft", subcategory: "Organisation" },
  { name: "Selbstmotivation", category: "soft", subcategory: "Organisation" },

  // Persönlichkeit
  { name: "Empathie", category: "soft", subcategory: "Persönlichkeit" },
  { name: "Zuverlässigkeit", category: "soft", subcategory: "Persönlichkeit" },
  { name: "Anpassungsfähigkeit", category: "soft", subcategory: "Persönlichkeit" },
  { name: "Lernbereitschaft", category: "soft", subcategory: "Persönlichkeit" },
  { name: "Verantwortungsbewusstsein", category: "soft", subcategory: "Persönlichkeit" },
  { name: "Durchsetzungsvermögen", category: "soft", subcategory: "Persönlichkeit" },
  { name: "Resilienz", category: "soft", subcategory: "Persönlichkeit" },
  { name: "Flexibilität", category: "soft", subcategory: "Persönlichkeit" },
  { name: "Kundenorientierung", category: "soft", subcategory: "Persönlichkeit" },
  { name: "Gewissenhaftigkeit", category: "soft", subcategory: "Persönlichkeit" },
  { name: "Diplomatisches Geschick", category: "soft", subcategory: "Persönlichkeit" },
  { name: "Neugier", category: "soft", subcategory: "Persönlichkeit" },
];

// ─── Language Suggestions ──────────────────────────────────
export const languageSuggestions: string[] = [
  "Deutsch",
  "Englisch",
  "Französisch",
  "Spanisch",
  "Italienisch",
  "Portugiesisch",
  "Russisch",
  "Chinesisch (Mandarin)",
  "Japanisch",
  "Arabisch",
  "Türkisch",
  "Polnisch",
  "Niederländisch",
  "Koreanisch",
  "Tschechisch",
  "Schwedisch",
  "Dänisch",
  "Norwegisch",
  "Finnisch",
  "Griechisch",
  "Ungarisch",
  "Rumänisch",
  "Kroatisch",
  "Serbisch",
  "Ukrainisch",
  "Hindi",
  "Vietnamesisch",
  "Thai",
  "Persisch (Farsi)",
  "Hebräisch",
  "Indonesisch",
  "Gebärdensprache (DGS)",
];

// ─── All Skill Suggestions ────────────────────────────────
export const allSkillSuggestions: SkillSuggestion[] = [
  ...hardSkillSuggestions,
  ...digitalSkillSuggestions,
  ...greenSkillSuggestions,
  ...softSkillSuggestions,
];

// ─── Helper: Get suggestions by category ──────────────────
const suggestionsByCategory: Record<SkillCategory, SkillSuggestion[]> = {
  hard: hardSkillSuggestions,
  digital: digitalSkillSuggestions,
  green: greenSkillSuggestions,
  soft: softSkillSuggestions,
};

export function getSkillSuggestions(category: SkillCategory): string[] {
  return suggestionsByCategory[category].map((s) => s.name);
}

// ─── Helper: Get unique subcategories for a category ──────
export function getSubcategories(category: SkillCategory): string[] {
  const subs = new Set<string>();
  for (const s of suggestionsByCategory[category]) {
    if (s.subcategory) subs.add(s.subcategory);
  }
  return Array.from(subs);
}

// ─── Helper: Get suggestions filtered by subcategory ──────
export function getSkillsBySubcategory(
  category: SkillCategory,
  subcategory: string,
): string[] {
  return suggestionsByCategory[category]
    .filter((s) => s.subcategory === subcategory)
    .map((s) => s.name);
}
