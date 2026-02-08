/**
 * Email templates for sending job applications.
 */

export interface EmailTemplateData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  companyName: string;
  contactPerson?: string;
}

export type EmailTemplate = "formal" | "modern";

const templates: Record<EmailTemplate, (data: EmailTemplateData) => { subject: string; body: string }> = {
  formal: (data) => ({
    subject: `Bewerbung als ${data.jobTitle} – ${data.firstName} ${data.lastName}`,
    body: `Sehr geehrte${data.contactPerson ? ` ${data.contactPerson}` : " Damen und Herren"},

anbei sende ich Ihnen meine vollständigen Bewerbungsunterlagen für die ausgeschriebene Stelle als ${data.jobTitle}.

Ich freue mich auf Ihre Rückmeldung und stehe für Rückfragen gerne zur Verfügung.

Mit freundlichen Grüßen
${data.firstName} ${data.lastName}`,
  }),
  modern: (data) => ({
    subject: `Bewerbung: ${data.jobTitle} bei ${data.companyName} – ${data.firstName} ${data.lastName}`,
    body: `Guten Tag${data.contactPerson ? ` ${data.contactPerson}` : ""},

im Anhang finden Sie meine Bewerbungsunterlagen für die Position als ${data.jobTitle} bei ${data.companyName}.

Für ein persönliches Gespräch stehe ich Ihnen gerne zur Verfügung.

Beste Grüße
${data.firstName} ${data.lastName}`,
  }),
};

export function generateEmailContent(
  template: EmailTemplate,
  data: EmailTemplateData,
): { subject: string; body: string } {
  return templates[template](data);
}

export const EMAIL_TEMPLATE_LABELS: Record<EmailTemplate, string> = {
  formal: "Formell",
  modern: "Modern",
};

/**
 * Common SMTP presets for popular email providers.
 */
export const SMTP_PRESETS = [
  { label: "Gmail", host: "smtp.gmail.com", port: 587, secure: false },
  { label: "Outlook / Hotmail", host: "smtp.office365.com", port: 587, secure: false },
  { label: "GMX", host: "mail.gmx.net", port: 587, secure: false },
  { label: "Web.de", host: "smtp.web.de", port: 587, secure: false },
  { label: "iCloud", host: "smtp.mail.me.com", port: 587, secure: false },
  { label: "Yahoo", host: "smtp.mail.yahoo.com", port: 465, secure: true },
] as const;
