"use client";

import type {
  EmailAttachment,
  EmailData,
  SendEmailResult,
  SmtpConfig,
} from "@/lib/email/types";

export type {
  EmailAttachment,
  EmailData,
  SendEmailResult,
  SmtpConfig,
} from "@/lib/email/types";

type EmailApiRequest =
  | { action: "test"; smtp: SmtpConfig }
  | {
      action: "send";
      smtp: SmtpConfig;
      email: EmailData;
      attachments: EmailAttachment[];
    };

async function callEmailApi(payload: EmailApiRequest): Promise<SendEmailResult> {
  try {
    const response = await fetch("/api/email", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = (await response.json().catch(() => null)) as SendEmailResult | null;

    if (!response.ok) {
      return {
        success: false,
        error: result?.error ?? "E-Mail-Anfrage fehlgeschlagen",
      };
    }

    return result ?? { success: false, error: "Ungültige Serverantwort" };
  } catch {
    return {
      success: false,
      error: "Der E-Mail-Dienst ist nicht erreichbar",
    };
  }
}

export function testSmtpConnection(smtp: SmtpConfig): Promise<SendEmailResult> {
  return callEmailApi({ action: "test", smtp });
}

export function sendApplicationEmail(
  smtp: SmtpConfig,
  email: EmailData,
  attachments: EmailAttachment[],
): Promise<SendEmailResult> {
  return callEmailApi({ action: "send", smtp, email, attachments });
}
