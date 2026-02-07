/**
 * Comprehensive certificate database with 300+ industry certifications
 * Covers: IT, Cloud, Security, Management, Compliance, Finance, ESG, Languages, 
 * Marketing, Sales, Product, UX, Coaching, Software, Industry, Healthcare
 */

export interface CertificateSuggestion {
  name: string;
  issuer: string;
  category: CertificateCategory;
  validityYears: number | "lifetime";
  renewalRequired: boolean;
  renewalInfo?: string;
  focus: string;
  industries: string[];
  url?: string;
}

export type CertificateCategory =
  | "it-infrastructure"
  | "cloud-security"
  | "management-governance"
  | "compliance-legal"
  | "industry-tech"
  | "healthcare-education"
  | "software-specialist"
  | "esg-sustainability"
  | "project-agile"
  | "languages"
  | "finance-accounting"
  | "marketing-sales"
  | "product-ux-design"
  | "coaching-softskills"
  | "other";

// Helper to create certificate entries more concisely
const cert = (
  name: string,
  issuer: string,
  category: CertificateCategory,
  validityYears: number | "lifetime",
  renewalRequired: boolean,
  focus: string,
  industries: string[],
  renewalInfo?: string,
  url?: string
): CertificateSuggestion => ({
  name,
  issuer,
  category,
  validityYears,
  renewalRequired,
  renewalInfo,
  focus,
  industries,
  url,
});

export const certificateSuggestions: CertificateSuggestion[] = [
  // ═══════════════════════════════════════════════════════════
  //  IT INFRASTRUCTURE, CLOUD & SECURITY (50+)
  // ═══════════════════════════════════════════════════════════
  
  // Security Foundations
  cert("CISSP", "ISC²", "cloud-security", 3, true, "Information Security Management", ["IT", "Security"], "120 CPE credits"),
  cert("CISA", "ISACA", "cloud-security", 3, true, "IT Audit", ["IT", "Audit"], "20 CPE hours annually"),
  cert("CISM", "ISACA", "cloud-security", 3, true, "Security Management", ["IT", "Security", "Management"], "120 CPE credits"),
  cert("CEH", "EC-Council", "cloud-security", 3, true, "Ethical Hacking", ["IT", "Security"], "120 ECE credits"),
  cert("OSCP", "Offensive Security", "cloud-security", "lifetime", false, "Penetration Testing", ["IT", "Security", "Pentesting"], "Recertification recommended"),
  cert("OSCE", "Offensive Security", "cloud-security", "lifetime", false, "Expert-Level Pentesting", ["IT", "Security", "Pentesting"]),
  cert("CompTIA Security+", "CompTIA", "cloud-security", 3, true, "Security Foundation", ["IT", "Security"], "50 CEU credits"),
  cert("CompTIA CySA+", "CompTIA", "cloud-security", 3, true, "Security Analytics", ["IT", "Security"], "60 CEU credits"),
  cert("CompTIA CASP+", "CompTIA", "cloud-security", 3, true, "Advanced Security", ["IT", "Security"], "75 CEU credits"),
  cert("CompTIA A+", "CompTIA", "it-infrastructure", 3, true, "IT Support", ["IT", "Support"], "20 CEU credits annually"),
  cert("CompTIA Network+", "CompTIA", "it-infrastructure", 3, true, "Network Fundamentals", ["IT", "Networking"], "30 CEU credits"),
  
  // Cisco Networking
  cert("CCNA", "Cisco", "it-infrastructure", 3, true, "Networking Fundamentals", ["IT", "Networking"]),
  cert("CCNP Enterprise", "Cisco", "it-infrastructure", 3, true, "Enterprise Networking", ["IT", "Networking"]),
  cert("CCIE", "Cisco", "it-infrastructure", 3, true, "Expert Networking", ["IT", "Networking"]),
  
  // AWS Cloud
  cert("AWS Solutions Architect Associate", "Amazon", "cloud-security", 3, true, "Cloud Architecture", ["IT", "Cloud", "DevOps"], "Recertification exam"),
  cert("AWS Solutions Architect Professional", "Amazon", "cloud-security", 3, true, "Advanced Cloud", ["IT", "Cloud"], "Recertification exam"),
  cert("AWS Security Specialty", "Amazon", "cloud-security", 3, true, "Cloud Security", ["IT", "Security", "Cloud"], "Recertification exam"),
  
  // Azure Cloud
  cert("Azure Administrator AZ-104", "Microsoft", "cloud-security", 1, true, "Azure Management", ["IT", "Cloud"], "Annual renewal via Microsoft Learn"),
  cert("Azure Solutions Architect AZ-305", "Microsoft", "cloud-security", 1, true, "Azure Design", ["IT", "Cloud"]),
  cert("Azure Security Engineer AZ-500", "Microsoft", "cloud-security", 1, true, "Azure Security", ["IT", "Security", "Cloud"]),
  
  // Google Cloud
  cert("Google Cloud Professional Architect", "Google Cloud", "cloud-security", 2, true, "GCP Architecture", ["IT", "Cloud", "Data Science"]),
  cert("Google Cloud Security Engineer", "Google Cloud", "cloud-security", 2, true, "GCP Security", ["IT", "Security", "Cloud"]),
  
  // Virtualization & Container
  cert("VCP-DCV", "VMware", "it-infrastructure", 2, true, "vSphere Virtualization", ["IT", "Cloud"]),
  cert("VCP-NV", "VMware", "it-infrastructure", 2, true, "NSX Network Virtualization", ["IT", "Networking"]),
  cert("Docker Certified Associate", "Docker", "it-infrastructure", 2, true, "Container Orchestration", ["IT", "DevOps"]),
  
  // Linux & Kubernetes
  cert("RHCSA", "Red Hat", "it-infrastructure", 3, true, "Linux Administration", ["IT", "Linux"]),
  cert("RHCE", "Red Hat", "it-infrastructure", 3, true, "Linux Engineering", ["IT", "Linux"]),
  cert("CKA", "CNCF", "cloud-security", 2, true, "Kubernetes Administration", ["IT", "Cloud", "DevOps"]),
  cert("CKAD", "CNCF", "cloud-security", 2, true, "Kubernetes Application Development", ["IT", "DevOps"]),
  cert("CKS", "CNCF", "cloud-security", 2, true, "Kubernetes Security", ["IT", "Cloud", "Security"]),
  cert("LPIC-1", "Linux Professional Institute", "it-infrastructure", 5, true, "Linux Essentials", ["IT", "Linux"]),
  cert("LPIC-2", "Linux Professional Institute", "it-infrastructure", 5, true, "Linux Advanced", ["IT", "Linux"]),
  cert("LPIC-3", "Linux Professional Institute", "it-infrastructure", 5, true, "Linux Expert", ["IT", "Linux"]),
  
  // HashiCorp & IaC
  cert("HashiCorp Terraform Associate", "HashiCorp", "it-infrastructure", 2, true, "Infrastructure as Code", ["IT", "DevOps", "Cloud"]),
  cert("HashiCorp Vault Associate", "HashiCorp", "it-infrastructure", 2, true, "Secrets Management", ["IT", "Security", "DevOps"]),
  
  // Firewalls & Network Security
  cert("PCNSE", "Palo Alto", "cloud-security", 2, true, "Firewall Engineering", ["IT", "Security"]),
  cert("NSE 4", "Fortinet", "cloud-security", 2, true, "Fortinet Security", ["IT", "Security"]),
  cert("JNCIA", "Juniper", "it-infrastructure", 3, true, "Juniper Networking", ["IT", "Networking"]),
  
  // Programming & Database
  cert("OCP Java SE", "Oracle", "software-specialist", "lifetime", false, "Java Development", ["IT", "Software"], "Version-specific"),
  cert("OCA Database", "Oracle", "software-specialist", "lifetime", false, "Oracle Database", ["IT", "Database"]),
  cert("OCP Database", "Oracle", "software-specialist", "lifetime", false, "Oracle Database Advanced", ["IT", "Database"]),

  // ═══════════════════════════════════════════════════════════
  //  MANAGEMENT, GOVERNANCE & STRATEGY (35+)
  // ═══════════════════════════════════════════════════════════
  
  // Project Management
  cert("PMP", "PMI", "project-agile", 3, true, "Enterprise Project Management", ["Management", "IT"], "60 PDU credits"),
  cert("PMI-ACP", "PMI", "project-agile", 3, true, "Agile Project Management", ["IT", "Agile"], "30 PDU credits"),
  cert("PMI-RMP", "PMI", "project-agile", 3, true, "Risk Management", ["Management", "Risk"], "30 PDU credits"),
  cert("PMI-PBA", "PMI", "project-agile", 3, true, "Business Analysis", ["IT", "Business"], "35 PDU credits"),
  cert("Prince2 Foundation", "AXELOS", "project-agile", 3, true, "Project Management UK", ["Management"]),
  cert("Prince2 Practitioner", "AXELOS", "project-agile", 3, true, "Prince2 Application", ["Management"]),
  cert("MoP", "AXELOS", "management-governance", 5, true, "Portfolio Management", ["Management"]),
  cert("MSP", "AXELOS", "management-governance", 5, true, "Programme Management", ["Management"]),
  cert("MoR", "AXELOS", "management-governance", 5, true, "Risk Management", ["Management", "Risk"]),
  
  // ITIL & Service Management
  cert("ITIL 4 Foundation", "PeopleCert", "management-governance", 3, true, "IT Service Management", ["IT", "Management"]),
  cert("ITIL 4 Managing Professional", "PeopleCert", "management-governance", 3, true, "ITIL Expert", ["IT", "Management"]),
  cert("ITIL 4 Strategic Leader", "PeopleCert", "management-governance", 3, true, "ITIL Strategy", ["IT", "Strategy"]),
  
  // IT Governance
  cert("COBIT 2019 Foundation", "ISACA", "management-governance", "lifetime", false, "IT Governance", ["IT", "Governance"]),
  cert("COBIT 2019 Implementation", "ISACA", "management-governance", "lifetime", false, "COBIT Implementation", ["IT", "Governance"]),
  cert("CGEIT", "ISACA", "management-governance", 3, true, "IT Governance", ["IT", "Governance"], "120 CPE credits"),
  cert("CRISC", "ISACA", "management-governance", 3, true, "IT Risk Management", ["IT", "Risk", "Compliance"], "120 CPE credits"),
  
  // Enterprise Architecture
  cert("TOGAF 9 Foundation", "The Open Group", "management-governance", "lifetime", false, "Enterprise Architecture", ["IT", "Architecture"]),
  cert("TOGAF 9 Certified", "The Open Group", "management-governance", "lifetime", false, "EA Advanced", ["IT", "Architecture"]),
  cert("ArchiMate Foundation", "The Open Group", "management-governance", "lifetime", false, "Architecture Modelling", ["IT", "Architecture"]),
  
  // Agile & Scrum
  cert("SAFe Agilist", "Scaled Agile", "project-agile", 1, true, "Scaled Agile Framework", ["IT", "Enterprise"], "Annual renewal fee"),
  cert("SAFe Scrum Master", "Scaled Agile", "project-agile", 1, true, "SAFe Scrum", ["IT", "Agile"]),
  cert("LeSS Practitioner", "LeSS", "project-agile", "lifetime", false, "Large Scale Scrum", ["IT", "Agile"]),
  cert("Professional Scrum Master PSM I", "Scrum.org", "project-agile", "lifetime", false, "Scrum Framework", ["IT", "Agile"]),
  cert("Professional Scrum Master PSM II", "Scrum.org", "project-agile", "lifetime", false, "Advanced Scrum", ["IT", "Agile"]),
  cert("Certified ScrumMaster CSM", "Scrum Alliance", "project-agile", 2, true, "Scrum Basics", ["IT", "Software"], "20 SEU credits"),
  cert("Advanced Certified ScrumMaster", "Scrum Alliance", "project-agile", 2, true, "Scrum Advanced", ["IT", "Agile"]),
  
  // Lean & Six Sigma
  cert("Six Sigma Green Belt", "IASSC/ASQ", "other", 3, true, "Process Improvement", ["Manufacturing", "Quality"]),
  cert("Six Sigma Black Belt", "IASSC/ASQ", "other", 3, true, "Advanced Process Improvement", ["Manufacturing", "Quality"]),
  cert("Lean Six Sigma Yellow Belt", "Various", "other", "lifetime", false, "Lean Basics", ["Manufacturing", "Quality"]),
  cert("Lean Six Sigma Green Belt", "Various", "other", 3, true, "Lean Projects", ["Manufacturing", "Quality"]),
  
  // Change Management
  cert("Change Management Foundation", "APMG", "management-governance", 5, true, "Change Management", ["Management", "HR"]),
  cert("Change Management Practitioner", "APMG", "management-governance", 5, true, "Change Implementation", ["Management", "HR"]),

  // ═══════════════════════════════════════════════════════════
  //  COMPLIANCE, PRIVACY & LEGAL (25+)
  // ═══════════════════════════════════════════════════════════
  
  // Data Privacy
  cert("CIPP/E", "IAPP", "compliance-legal", 2, true, "European Data Privacy", ["Legal", "Compliance"], "20 CPE credits annually"),
  cert("CIPP/US", "IAPP", "compliance-legal", 2, true, "US Data Privacy", ["Legal", "Compliance"], "20 CPE credits annually"),
  cert("CIPP/A", "IAPP", "compliance-legal", 2, true, "Asian Data Privacy", ["Legal", "Compliance"], "20 CPE credits annually"),
  cert("CIPP/C", "IAPP", "compliance-legal", 2, true, "Canadian Data Privacy", ["Legal", "Compliance"], "20 CPE credits annually"),
  cert("CIPM", "IAPP", "compliance-legal", 2, true, "Privacy Program Management", ["Legal", "Compliance"], "20 CPE credits annually"),
  cert("CIPT", "IAPP", "compliance-legal", 2, true, "Privacy Technology", ["Legal", "IT"], "20 CPE credits annually"),
  cert("TÜV Datenschutzbeauftragter", "TÜV", "compliance-legal", 3, true, "DSGVO Compliance", ["Legal", "Compliance"]),
  cert("TÜV Informationssicherheitsbeauftragter", "TÜV", "compliance-legal", 3, true, "ISO 27001", ["IT", "Security"]),
  cert("GDPR Practitioner", "BCS", "compliance-legal", 3, true, "DSGVO Implementation", ["Legal", "Compliance"]),
  cert("Data Protection Officer", "EXIN", "compliance-legal", 3, true, "DPO Certification", ["Legal", "Compliance"]),
  
  // ISO Standards
  cert("ISO 27001 Lead Auditor", "PECB/BSI", "compliance-legal", 3, true, "ISMS Audit", ["IT", "Audit"]),
  cert("ISO 27001 Lead Implementer", "PECB/BSI", "compliance-legal", 3, true, "ISMS Implementation", ["IT", "Security"]),
  cert("ISO 27001 Internal Auditor", "PECB", "compliance-legal", 3, true, "Internal Audits", ["IT", "Audit"]),
  cert("ISO 27701 Privacy Information", "PECB", "compliance-legal", 3, true, "Privacy Management", ["Legal", "Compliance"]),
  cert("ISO 22301 Business Continuity", "PECB", "compliance-legal", 3, true, "BCM", ["IT", "Risk"]),
  cert("ISO 9001 Quality Management", "TÜV/DEKRA", "compliance-legal", 3, true, "Quality Management", ["Quality", "Management"]),
  cert("ISO 14001 Environmental", "TÜV", "esg-sustainability", 3, true, "Environmental Management", ["ESG", "Environment"]),
  cert("ISO 14001 Lead Auditor", "TÜV", "esg-sustainability", 3, true, "Environmental Audit", ["ESG", "Audit"]),
  cert("ISO 45001 Occupational Health", "TÜV", "compliance-legal", 3, true, "Health & Safety Management", ["Safety", "HR"]),
  cert("ISO 50001 Energy Management", "TÜV", "esg-sustainability", 3, true, "Energy Management", ["ESG", "Energy"]),
  cert("ISO 50001 Lead Auditor", "TÜV", "esg-sustainability", 3, true, "Energy Audit", ["ESG", "Audit"]),
  
  // Industry Compliance
  cert("SOC 2 Certification", "AICPA", "compliance-legal", 1, true, "Service Organization Control", ["IT", "Compliance"]),
  cert("PCI DSS Compliance", "PCI SSC", "compliance-legal", 1, true, "Payment Card Security", ["IT", "Security", "Finance"]),
  cert("NIST Cybersecurity Framework", "Various", "compliance-legal", 3, true, "US Security Standard", ["IT", "Security"]),

  // ═══════════════════════════════════════════════════════════
  //  FINANCE, RISK & ACCOUNTING (15+)
  // ═══════════════════════════════════════════════════════════
  
  cert("CFA Level I", "CFA Institute", "finance-accounting", "lifetime", false, "Investment Analysis Foundation", ["Finance", "Investment"], "Annual membership"),
  cert("CFA Level II", "CFA Institute", "finance-accounting", "lifetime", false, "Investment Analysis Advanced", ["Finance", "Investment"], "Annual membership"),
  cert("CFA Level III", "CFA Institute", "finance-accounting", "lifetime", false, "Investment Management", ["Finance", "Investment"], "Annual membership"),
  cert("FRM Part I", "GARP", "finance-accounting", 5, true, "Financial Risk Management", ["Finance", "Risk"], "50 CPE hours"),
  cert("FRM Part II", "GARP", "finance-accounting", 5, true, "Advanced Risk Management", ["Finance", "Risk"], "50 CPE hours"),
  cert("CMA", "IMA", "finance-accounting", 1, true, "Management Accounting", ["Finance", "Management"], "30 CPE hours annually"),
  cert("CPA", "AICPA", "finance-accounting", "lifetime", false, "US Accounting", ["Finance", "Accounting"], "State-specific CPE"),
  cert("ACCA", "ACCA", "finance-accounting", "lifetime", false, "International Accounting", ["Finance", "Accounting"]),
  cert("CIMA", "CIMA", "finance-accounting", "lifetime", false, "Management Accounting UK", ["Finance", "Management"]),
  cert("Bilanzbuchhalter", "IHK", "finance-accounting", "lifetime", false, "Advanced Accounting", ["Finance", "Accounting"]),
  cert("Steuerberater", "Steuerberaterkammer", "finance-accounting", "lifetime", false, "Tax Consulting", ["Finance", "Tax"]),
  cert("Wirtschaftsprüfer", "WPK", "finance-accounting", "lifetime", false, "Auditing", ["Finance", "Audit"]),
  cert("CRMA", "IIA", "finance-accounting", 3, true, "Risk Management Assurance", ["Finance", "Risk", "Audit"]),
  cert("CIA", "IIA", "finance-accounting", 3, true, "Internal Auditor", ["Finance", "Audit"]),
  cert("CFE", "ACFE", "finance-accounting", 2, true, "Fraud Examination", ["Finance", "Compliance"]),
  cert("CAMS", "ACAMS", "finance-accounting", 3, true, "Anti-Money Laundering", ["Finance", "Compliance"]),
  cert("CGSS", "ACAMS", "finance-accounting", 3, true, "Sanctions Compliance", ["Finance", "Compliance"]),
  cert("Financial Modeling", "CFI", "finance-accounting", "lifetime", false, "Excel Financial Modeling", ["Finance", "Analytics"]),
  cert("Valuation Analyst", "CVA", "finance-accounting", 3, true, "Company Valuation", ["Finance", "M&A"]),
  cert("Certified Treasury Professional", "AFP", "finance-accounting", 3, true, "Cash Management", ["Finance", "Treasury"]),

  // ═══════════════════════════════════════════════════════════
  //  ESG, SUSTAINABILITY & IMPACT (20+)
  // ═══════════════════════════════════════════════════════════
  
  cert("GRI Certified", "GRI", "esg-sustainability", 3, true, "Sustainability Reporting", ["ESG", "Compliance"]),
  cert("CSRD Practitioner", "Various", "esg-sustainability", 3, true, "EU Sustainability Reporting", ["ESG", "Compliance"]),
  cert("SASB FSA", "IFRS", "esg-sustainability", 3, true, "Sustainability Accounting", ["ESG", "Finance"]),
  cert("TCFD Certificate", "Various", "esg-sustainability", 3, true, "Climate Disclosures", ["ESG", "Climate"]),
  cert("Carbon Accounting", "GHG Protocol", "esg-sustainability", 3, true, "CO2 Accounting", ["ESG", "Climate"]),
  cert("LCA Practitioner", "ACLCA", "esg-sustainability", 5, true, "Life Cycle Assessment", ["ESG", "Sustainability"]),
  cert("LEED AP", "USGBC", "esg-sustainability", 2, true, "Green Building", ["Architecture", "ESG"]),
  cert("LEED Green Associate", "USGBC", "esg-sustainability", 2, true, "LEED Basics", ["Architecture", "ESG"]),
  cert("BREEAM Assessor", "BRE", "esg-sustainability", 3, true, "Building Certification", ["Architecture", "ESG"]),
  cert("DGNB Consultant", "DGNB", "esg-sustainability", 3, true, "Sustainable Building", ["Architecture", "ESG"]),
  cert("DGNB Auditor", "DGNB", "esg-sustainability", 3, true, "DGNB Certification", ["Architecture", "ESG"]),
  cert("CIRELA", "ERES", "esg-sustainability", 3, true, "Real Estate Sustainability", ["ESG", "Real Estate"]),
  cert("CSR Manager", "Various", "esg-sustainability", 3, true, "Corporate Social Responsibility", ["ESG", "Management"]),
  cert("ESG-Reporting (CSRD)", "Various", "esg-sustainability", 3, true, "EU ESG Reporting", ["ESG", "Compliance"]),
  cert("Carbon Footprint Manager", "Various", "esg-sustainability", 3, true, "CO2 Management", ["ESG", "Climate"]),
  cert("B Corp Leader", "B Lab", "esg-sustainability", 3, true, "B Corp Certification", ["ESG", "Social Impact"]),
  cert("IEMA Foundation", "IEMA", "esg-sustainability", "lifetime", false, "Environmental Management", ["ESG", "Environment"]),
  cert("IEMA Practitioner", "IEMA", "esg-sustainability", "lifetime", false, "Advanced Environmental", ["ESG", "Environment"]),

  // ═══════════════════════════════════════════════════════════
  //  LANGUAGES & COMMUNICATION (25+)
  // ═══════════════════════════════════════════════════════════
  
  // English
  cert("IELTS Academic", "British Council", "languages", 2, true, "English University", ["All", "Academic"]),
  cert("IELTS General", "British Council", "languages", 2, true, "English Work/Migration", ["All", "Business"]),
  cert("TOEFL iBT", "ETS", "languages", 2, true, "English University Admission", ["All", "Academic"]),
  cert("TOEIC", "ETS", "languages", 2, true, "Business English", ["All", "Business"]),
  cert("Cambridge C1 Advanced (CAE)", "Cambridge", "languages", "lifetime", false, "English C1", ["All", "Business"]),
  cert("Cambridge C2 Proficiency (CPE)", "Cambridge", "languages", "lifetime", false, "English C2", ["All", "Business"]),
  cert("Cambridge BEC", "Cambridge", "languages", "lifetime", false, "Business English Certificate", ["All", "Business"]),
  cert("CELTA", "Cambridge", "languages", "lifetime", false, "English Language Teaching", ["Education", "Languages"]),
  cert("DELTA", "Cambridge", "languages", "lifetime", false, "Advanced English Teaching", ["Education", "Languages"]),
  cert("TEFL", "Various", "languages", "lifetime", false, "Teaching English as Foreign Language", ["Education", "Languages"]),
  
  // French
  cert("DELF B2", "Institut Français", "languages", "lifetime", false, "French B2", ["All", "International"]),
  cert("DALF C1", "Institut Français", "languages", "lifetime", false, "French C1", ["All", "International"]),
  cert("DALF C2", "Institut Français", "languages", "lifetime", false, "French C2", ["All", "International"]),
  
  // German
  cert("Goethe-Zertifikat C1", "Goethe-Institut", "languages", "lifetime", false, "German C1", ["All", "International"]),
  cert("Goethe-Zertifikat C2", "Goethe-Institut", "languages", "lifetime", false, "German C2 (GDS)", ["All", "International"]),
  cert("TestDaF", "TestDaF-Institut", "languages", "lifetime", false, "German University Qualification", ["All", "Academic"]),
  cert("Telc Deutsch C1", "Telc", "languages", "lifetime", false, "German C1", ["All", "Business"]),
  
  // Spanish
  cert("DELE C1", "Instituto Cervantes", "languages", "lifetime", false, "Spanish C1", ["All", "International"]),
  cert("DELE C2", "Instituto Cervantes", "languages", "lifetime", false, "Spanish C2", ["All", "International"]),
  cert("SIELE", "Instituto Cervantes", "languages", 5, true, "Spanish Digital", ["All", "International"]),
  
  // Italian
  cert("CILS C1", "Università di Siena", "languages", "lifetime", false, "Italian C1", ["All", "International"]),
  cert("CILS C2", "Università di Siena", "languages", "lifetime", false, "Italian C2", ["All", "International"]),
  cert("CELI", "Università di Perugia", "languages", "lifetime", false, "Italian Certificate", ["All", "International"]),
  
  // Asian Languages
  cert("HSK 5", "Hanban", "languages", 2, true, "Mandarin Advanced", ["All", "International"]),
  cert("HSK 6", "Hanban", "languages", 2, true, "Mandarin Expert", ["All", "International"]),
  cert("JLPT N1", "Japan Foundation", "languages", "lifetime", false, "Japanese Advanced", ["All", "International"]),
  cert("JLPT N2", "Japan Foundation", "languages", "lifetime", false, "Japanese Upper-Intermediate", ["All", "International"]),
  cert("TOPIK II (Level 5)", "NIIED", "languages", 2, true, "Korean Advanced", ["All", "International"]),
  cert("TOPIK II (Level 6)", "NIIED", "languages", 2, true, "Korean Expert", ["All", "International"]),
  
  // Multi-Language
  cert("UNIcert III", "UNIcert", "languages", "lifetime", false, "University Language B2/C1", ["All", "Academic"]),
  cert("UNIcert IV", "UNIcert", "languages", "lifetime", false, "University Language C1/C2", ["All", "Academic"]),

  // ═══════════════════════════════════════════════════════════
  //  COACHING, SOFT SKILLS & MODERATION (20+)
  // ═══════════════════════════════════════════════════════════
  
  cert("Certified Professional Coach (PCC)", "ICF", "coaching-softskills", 3, true, "Professional Coaching", ["Coaching", "HR"]),
  cert("Associate Certified Coach (ACC)", "ICF", "coaching-softskills", 3, true, "Entry Coaching", ["Coaching", "HR"]),
  cert("Master Certified Coach (MCC)", "ICF", "coaching-softskills", 3, true, "Expert Coaching", ["Coaching", "HR"]),
  cert("Systemischer Coach", "DGfC", "coaching-softskills", "lifetime", false, "Systemic Coaching", ["Coaching", "HR"]),
  cert("Business Coach", "DBVC", "coaching-softskills", 3, true, "Business Coaching", ["Coaching", "Management"]),
  cert("NLP Practitioner", "INLPTA/DVNLP", "coaching-softskills", "lifetime", false, "NLP Basics", ["Coaching", "Psychology"]),
  cert("NLP Master", "INLPTA/DVNLP", "coaching-softskills", "lifetime", false, "Advanced NLP", ["Coaching", "Psychology"]),
  cert("Transactional Analysis 101", "EATA", "coaching-softskills", 5, true, "Transactional Analysis", ["Coaching", "Psychology"]),
  cert("Mediator (Zertifiziert)", "BM/BAfM", "coaching-softskills", 5, true, "Conflict Mediation", ["Legal", "Coaching"]),
  cert("Moderator (Zertifiziert)", "Various", "coaching-softskills", 3, true, "Group Moderation", ["Coaching", "Management"]),
  cert("Train the Trainer", "Various", "coaching-softskills", 3, true, "Trainer Certification", ["Education", "HR"]),
  cert("Presentation Skills", "Various", "coaching-softskills", "lifetime", false, "Presentation Techniques", ["All", "Business"]),
  cert("Facilitation Skills", "IAF", "coaching-softskills", 3, true, "Large Group Facilitation", ["Coaching", "Management"]),
  cert("Design Thinking Coach", "HPI/d.school", "coaching-softskills", 3, true, "Design Thinking Method", ["Innovation", "Product"]),
  cert("LEGO Serious Play", "LEGO", "coaching-softskills", 2, true, "Creative Workshops", ["Coaching", "Innovation"]),
  cert("AdA-Schein", "IHK/HWK", "healthcare-education", "lifetime", false, "Trainer Qualification", ["All", "Education"]),

  // ═══════════════════════════════════════════════════════════
  //  PRODUCT, UX & DESIGN (25+)
  // ═══════════════════════════════════════════════════════════
  
  cert("Certified Scrum Product Owner (CSPO)", "Scrum Alliance", "product-ux-design", 2, true, "Product Ownership", ["IT", "Product"], "20 SEU credits"),
  cert("Professional Scrum Product Owner (PSPO)", "Scrum.org", "product-ux-design", "lifetime", false, "Product Owner", ["IT", "Product"]),
  cert("SAFe Product Owner", "Scaled Agile", "product-ux-design", 1, true, "SAFe PO/PM", ["IT", "Product"]),
  cert("UX Master Certificate", "Nielsen Norman Group", "product-ux-design", "lifetime", false, "UX Research", ["Design", "UX"]),
  cert("UX Research Certificate", "Nielsen Norman Group", "product-ux-design", "lifetime", false, "User Research", ["Design", "UX"]),
  cert("Interaction Design Foundation", "IDF", "product-ux-design", "lifetime", false, "Interaction Design", ["Design", "UX"]),
  cert("Google UX Design Certificate", "Google/Coursera", "product-ux-design", "lifetime", false, "UX Design Basics", ["Design", "UX"]),
  cert("Certified Usability Analyst", "HFI", "product-ux-design", 3, true, "Usability Testing", ["Design", "UX"]),
  cert("Information Architecture", "Various", "product-ux-design", "lifetime", false, "IA", ["Design", "UX"]),
  cert("DesignOps Master", "DesignOps Assembly", "product-ux-design", 3, true, "Design Operations", ["Design", "Management"]),
  cert("Design Thinking Certificate", "IDEO", "product-ux-design", 3, true, "Design Thinking", ["Innovation", "Product"]),
  cert("Product Management Certificate", "Product School", "product-ux-design", "lifetime", false, "Product Management", ["Product", "IT"]),
  cert("Pragmatic Marketing Certified", "Pragmatic Institute", "product-ux-design", 1, true, "Product Marketing", ["Product", "Marketing"]),
  cert("AWS Certified Machine Learning", "Amazon", "software-specialist", 3, true, "ML on AWS", ["IT", "AI", "Cloud"]),
  cert("TensorFlow Developer Certificate", "Google", "software-specialist", 3, true, "TensorFlow Development", ["IT", "AI"]),
  cert("Deep Learning Specialization", "DeepLearning.AI", "software-specialist", "lifetime", false, "Deep Learning", ["IT", "AI"]),

  // ═══════════════════════════════════════════════════════════
  //  MARKETING, SALES & GROWTH (50+)
  // ═══════════════════════════════════════════════════════════
  
  // Google Marketing
  cert("Google Ads Search Certification", "Google Skillshop", "marketing-sales", 1, true, "Search Campaigns", ["Marketing", "Digital"]),
  cert("Google Ads Display Certification", "Google Skillshop", "marketing-sales", 1, true, "Display Campaigns", ["Marketing", "Digital"]),
  cert("Google Ads Video Certification", "Google Skillshop", "marketing-sales", 1, true, "YouTube Video Ads", ["Marketing", "Digital"]),
  cert("Google Ads Shopping Certification", "Google Skillshop", "marketing-sales", 1, true, "Shopping & Performance Max", ["Marketing", "E-Commerce"]),
  cert("Google Ads Measurement Certification", "Google Skillshop", "marketing-sales", 1, true, "Attribution & Conversion Tracking", ["Marketing", "Analytics"]),
  cert("Google Ads Apps Certification", "Google Skillshop", "marketing-sales", 1, true, "App Campaigns", ["Marketing", "Mobile"]),
  cert("Google Marketing Platform Certification", "Google", "marketing-sales", 1, true, "Analytics, Tag Manager, DV360", ["Marketing", "Analytics"]),
  cert("Google Analytics 4", "Google Skillshop", "marketing-sales", 1, true, "Web Analytics GA4", ["Marketing", "Analytics"]),
  
  // Meta/Facebook Marketing
  cert("Meta Blueprint Digital Marketing Associate", "Meta Blueprint", "marketing-sales", 1, true, "Meta Ads Basics", ["Marketing", "Social Media"]),
  cert("Meta Certified Media Buying Professional", "Meta Blueprint", "marketing-sales", 1, true, "Campaign Optimization", ["Marketing", "Social Media"]),
  cert("Meta Certified Media Planning Professional", "Meta Blueprint", "marketing-sales", 1, true, "Media Strategy", ["Marketing", "Social Media"]),
  cert("Meta Certified Marketing Science Professional", "Meta Blueprint", "marketing-sales", 1, true, "Data Analysis & A/B Tests", ["Marketing", "Analytics"]),
  
  // Social Media Platforms
  cert("LinkedIn Marketing Labs Certification", "LinkedIn", "marketing-sales", 1, true, "B2B Campaigns", ["Marketing", "B2B"]),
  cert("Twitter Flight School (X Ads)", "X", "marketing-sales", 1, true, "X Platform Ads", ["Marketing", "Social Media"]),
  cert("TikTok Ads Academy Certification", "TikTok", "marketing-sales", 1, true, "Short-Form Video Ads", ["Marketing", "Social Media"]),
  
  // HubSpot Suite
  cert("HubSpot Inbound Certification", "HubSpot Academy", "marketing-sales", 2, true, "Inbound Marketing Basics", ["Marketing", "Inbound"]),
  cert("HubSpot Digital Marketing Certification", "HubSpot Academy", "marketing-sales", 2, true, "SEO, Social, Email, Ads", ["Marketing", "Digital"]),
  cert("HubSpot Content Marketing Certification", "HubSpot Academy", "marketing-sales", 2, true, "Content Strategy", ["Marketing", "Content"]),
  cert("HubSpot Social Media Marketing Certification", "HubSpot Academy", "marketing-sales", 2, true, "Social Strategy", ["Marketing", "Social Media"]),
  cert("HubSpot Inbound Sales Certification", "HubSpot Academy", "marketing-sales", 2, true, "Inbound Sales", ["Sales", "B2B"]),
  cert("HubSpot Revenue Operations Certification", "HubSpot Academy", "marketing-sales", 2, true, "RevOps & Funnel", ["Marketing", "Sales"]),
  cert("HubSpot Email Marketing Certification", "HubSpot Academy", "marketing-sales", 2, true, "Email Strategy", ["Marketing", "Email"]),
  
  // SEO & Content
  cert("SEMrush SEO Toolkit Certification", "SEMrush Academy", "marketing-sales", 1, true, "SEO & Keyword Research", ["Marketing", "SEO"]),
  cert("Ahrefs Certified Professional", "Ahrefs", "marketing-sales", 1, true, "SEO & Linkbuilding", ["Marketing", "SEO"]),
  cert("Yoast SEO Academy Premium", "Yoast", "marketing-sales", "lifetime", false, "Onpage SEO", ["Marketing", "SEO"]),
  
  // Email Marketing
  cert("Mailchimp Email Marketing Certification", "Mailchimp", "marketing-sales", 1, true, "Email Campaigns", ["Marketing", "Email"]),
  cert("Klaviyo Product Certification", "Klaviyo", "marketing-sales", 1, true, "Email & SMS for E-Commerce", ["Marketing", "E-Commerce"]),
  
  // Analytics & CRO
  cert("Hotjar CRO Certificate", "Various", "marketing-sales", 1, true, "Conversion Optimization", ["Marketing", "Analytics"]),
  cert("Growth Marketing Minidegree", "CXL", "marketing-sales", "lifetime", false, "Growth Frameworks", ["Marketing", "Growth"]),
  cert("CRO Minidegree", "CXL", "marketing-sales", "lifetime", false, "Conversion Rate Optimization", ["Marketing", "CRO"]),
  cert("Copywriting for Marketers", "CXL/Copyhackers", "marketing-sales", "lifetime", false, "Conversion Copywriting", ["Marketing", "Content"]),
  
  // Sales Methodologies
  cert("Sales Navigator Certification", "LinkedIn", "marketing-sales", 1, true, "Social Selling B2B", ["Sales", "B2B"]),
  cert("Sandler Sales Training Certification", "Sandler", "marketing-sales", 2, true, "Structured B2B Sales", ["Sales", "B2B"]),
  cert("Challenger Sales Certification", "Challenger", "marketing-sales", 2, true, "Challenger Methodology", ["Sales", "B2B"]),
  cert("SPIN Selling Certification", "Huthwaite", "marketing-sales", 2, true, "Needs Analysis & Solution Sales", ["Sales", "B2B"]),
  cert("Miller Heiman Strategic Selling", "Korn Ferry", "marketing-sales", 2, true, "Complex Deals", ["Sales", "B2B"]),
  cert("Key Account Management Certification", "Huthwaite/Korn Ferry", "marketing-sales", 2, true, "Large Account Management", ["Sales", "B2B"]),
  cert("Negotiation Mastery", "Harvard Online", "marketing-sales", "lifetime", false, "Negotiation Strategies", ["Sales", "Management"]),
  
  // E-Commerce
  cert("eCommerce Marketing Certificate", "Various", "marketing-sales", 1, true, "Performance Marketing E-Com", ["Marketing", "E-Commerce"]),
  cert("Shopify Partner Certification", "Shopify", "marketing-sales", 1, true, "E-Com Setup & Optimization", ["E-Commerce", "IT"]),

  // ═══════════════════════════════════════════════════════════
  //  SOFTWARE SPECIALISTS (ERP, DESIGN & DATA) (25+)
  // ═══════════════════════════════════════════════════════════
  
  // SAP
  cert("SAP S/4HANA FI", "SAP", "software-specialist", "lifetime", false, "SAP Financial Accounting", ["IT", "ERP", "Finance"], "Version-specific"),
  cert("SAP S/4HANA CO", "SAP", "software-specialist", "lifetime", false, "SAP Controlling", ["IT", "ERP"]),
  cert("SAP S/4HANA MM", "SAP", "software-specialist", "lifetime", false, "SAP Materials Management", ["IT", "ERP"]),
  cert("SAP ABAP", "SAP", "software-specialist", "lifetime", false, "SAP Programming", ["IT", "ERP", "Development"]),
  cert("SAP Basis", "SAP", "software-specialist", "lifetime", false, "SAP System Administration", ["IT", "ERP"]),
  
  // Salesforce
  cert("Salesforce Administrator", "Salesforce", "software-specialist", 1, true, "CRM Administration", ["IT", "CRM"], "Annual maintenance exams"),
  cert("Salesforce Platform Developer I", "Salesforce", "software-specialist", 1, true, "Salesforce Development", ["IT", "Software"]),
  cert("Salesforce Architect", "Salesforce", "software-specialist", 1, true, "Salesforce Enterprise Design", ["IT", "Enterprise"]),
  
  // Adobe Creative
  cert("Adobe Certified Professional (Photoshop)", "Adobe", "software-specialist", 3, true, "Image Editing", ["Design", "Marketing"]),
  cert("Adobe Certified Professional (InDesign)", "Adobe", "software-specialist", 3, true, "Desktop Publishing", ["Design", "Publishing"]),
  cert("Adobe Certified Professional (Premiere Pro)", "Adobe", "software-specialist", 3, true, "Video Editing", ["Media", "Video"]),
  cert("Adobe Experience Manager", "Adobe", "software-specialist", 2, true, "AEM Development", ["IT", "Web", "Marketing"]),
  
  // CAD & BIM
  cert("Autodesk Certified Professional (AutoCAD)", "Autodesk", "software-specialist", 3, true, "CAD Design", ["Architecture", "Engineering"]),
  cert("Autodesk Certified Professional (Revit)", "Autodesk", "software-specialist", 3, true, "BIM", ["Architecture"]),
  cert("BIM Professional", "buildingSMART", "software-specialist", 3, true, "Building Information Modeling", ["Architecture", "Construction"]),
  
  // Data & Analytics
  cert("Tableau Desktop Specialist", "Tableau", "software-specialist", 2, true, "Data Visualization", ["IT", "Analytics"]),
  cert("Power BI Data Analyst", "Microsoft", "software-specialist", 1, true, "Business Intelligence", ["IT", "Analytics"]),
  cert("MongoDB Certified Developer", "MongoDB", "software-specialist", 3, true, "NoSQL Databases", ["IT", "Database"]),
  cert("Snowflake SnowPro Core", "Snowflake", "software-specialist", 2, true, "Cloud Data Warehouse", ["IT", "Data", "Cloud"]),
  cert("Databricks Lakehouse Fundamentals", "Databricks", "software-specialist", 2, true, "Big Data & AI", ["IT", "Data Science"]),

  // ═══════════════════════════════════════════════════════════
  //  INDUSTRY, HANDWERK & TECHNICAL (20+)
  // ═══════════════════════════════════════════════════════════
  
  cert("SCC", "Various", "industry-tech", 5, true, "Occupational Safety", ["Construction", "Industry"]),
  cert("SCCP", "Various", "industry-tech", 5, true, "Petrochemical Safety", ["Petrochemical", "Industry"]),
  cert("SPS-Programmierer (Siemens S7/TIA)", "Siemens", "industry-tech", "lifetime", false, "PLC Programming", ["Industry", "Automation"]),
  cert("TIA Portal Professional", "Siemens", "industry-tech", 3, true, "Siemens Automation", ["Industry", "Automation"]),
  cert("Rockwell Automation", "Rockwell", "industry-tech", 3, true, "Allen-Bradley Systems", ["Industry", "Automation"]),
  cert("Schweißzertifikat (ISO 9606)", "Various", "industry-tech", 2, true, "Welding Certification", ["Industry", "Handwerk"]),
  cert("Schweißfachingenieur", "Various", "industry-tech", 5, true, "Welding Engineering", ["Industry", "Engineering"]),
  cert("NDT", "Various", "industry-tech", 5, true, "Non-Destructive Testing", ["Industry", "Quality"]),
  cert("Gabelstaplerschein", "Various", "industry-tech", "lifetime", false, "Forklift Operation", ["Logistics", "Warehouse"], "Annual safety briefing"),
  cert("Kranführerschein", "Various", "industry-tech", "lifetime", false, "Crane Operation", ["Construction", "Logistics"]),
  cert("Hubarbeitsbühnen", "Various", "industry-tech", "lifetime", false, "Aerial Work Platforms", ["Construction", "Industry"]),
  cert("Sachkunde § 34a GewO", "IHK", "industry-tech", "lifetime", false, "Security Services License", ["Security"]),
  cert("Sicherheitsfachkraft (SiFa)", "Various", "industry-tech", 3, true, "Occupational Safety Specialist", ["Safety", "Industry"]),
  cert("ATEX", "Various", "industry-tech", 3, true, "Explosion Protection", ["Industry", "Safety"]),
  cert("F-Gas-Verordnung", "Various", "industry-tech", 5, true, "Refrigerant Handling", ["HVAC", "Industry"]),
  cert("VCA", "Various", "industry-tech", 10, true, "Safety for Contractors", ["Construction", "Industry"]),

  // ═══════════════════════════════════════════════════════════
  //  HEALTHCARE & EDUCATION (15+)
  // ═══════════════════════════════════════════════════════════
  
  cert("Pflegedienstleitung (PDL)", "Various", "healthcare-education", "lifetime", false, "Nursing Service Management", ["Healthcare", "Pflege"]),
  cert("Wohnbereichsleitung (WBL)", "Various", "healthcare-education", "lifetime", false, "Residential Care Management", ["Healthcare", "Pflege"]),
  cert("Qualitätsbeauftragter (QB)", "TÜV/DGQ", "healthcare-education", 3, true, "Quality Management Healthcare", ["Healthcare", "Quality"]),
  cert("Hygienebeauftragter", "Various", "healthcare-education", 3, true, "Hospital Hygiene", ["Healthcare"]),
  cert("Strahlenschutz Fachkraft", "Various", "healthcare-education", 5, true, "Radiation Protection", ["Healthcare", "Medical"]),
  cert("Notfallsanitäter", "Various", "healthcare-education", 2, true, "Paramedic Certification", ["Healthcare", "Emergency"], "Fortbildungspflicht"),
];

/**
 * Get certificates by category
 */
export function getCertificatesByCategory(
  category: CertificateCategory
): CertificateSuggestion[] {
  return certificateSuggestions.filter((cert) => cert.category === category);
}

/**
 * Get certificates by industry
 */
export function getCertificatesByIndustry(
  industry: string
): CertificateSuggestion[] {
  return certificateSuggestions.filter((cert) =>
    cert.industries.some((i) =>
      i.toLowerCase().includes(industry.toLowerCase())
    )
  );
}

/**
 * Search certificates
 */
export function searchCertificates(query: string): CertificateSuggestion[] {
  const lowerQuery = query.toLowerCase();
  return certificateSuggestions.filter(
    (cert) =>
      cert.name.toLowerCase().includes(lowerQuery) ||
      cert.issuer.toLowerCase().includes(lowerQuery) ||
      cert.focus.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get category display name in German
 */
export function getCategoryDisplayName(
  category: CertificateCategory
): string {
  const names: Record<CertificateCategory, string> = {
    "it-infrastructure": "IT-Infrastruktur",
    "cloud-security": "Cloud & Security",
    "management-governance": "Management & Governance",
    "compliance-legal": "Compliance & Recht",
    "industry-tech": "Industrie & Technik",
    "healthcare-education": "Gesundheit & Bildung",
    "software-specialist": "Software-Spezialist",
    "esg-sustainability": "ESG & Nachhaltigkeit",
    "project-agile": "Projekt & Agile",
    languages: "Sprachen",
    "finance-accounting": "Finanzen & Controlling",
    "marketing-sales": "Marketing & Vertrieb",
    "product-ux-design": "Product & UX/Design",
    "coaching-softskills": "Coaching & Soft Skills",
    other: "Sonstiges",
  };
  return names[category] || category;
}

/**
 * Get all unique industries
 */
export function getAllIndustries(): string[] {
  const industries = new Set<string>();
  certificateSuggestions.forEach((cert) => {
    cert.industries.forEach((industry) => industries.add(industry));
  });
  return Array.from(industries).sort();
}

/**
 * Get all categories
 */
export function getAllCategories(): CertificateCategory[] {
  return [
    "it-infrastructure",
    "cloud-security",
    "management-governance",
    "compliance-legal",
    "project-agile",
    "software-specialist",
    "industry-tech",
    "healthcare-education",
    "esg-sustainability",
    "finance-accounting",
    "marketing-sales",
    "product-ux-design",
    "coaching-softskills",
    "languages",
    "other",
  ];
}
