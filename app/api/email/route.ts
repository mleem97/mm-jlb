import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

import nodemailer from "nodemailer";
import { z } from "zod";

import type {
  EmailAttachment,
  EmailData,
  SendEmailResult,
  SmtpConfig,
} from "@/lib/email/types";

export const runtime = "nodejs";

const ALLOWED_SMTP_PORTS = new Set([25, 465, 587, 2525]);
const MAX_REQUEST_BYTES = 16 * 1024 * 1024;
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;

const smtpSchema = z.object({
  host: z.string().trim().min(1).max(253),
  port: z.number().int().refine((port) => ALLOWED_SMTP_PORTS.has(port), {
    message: "Nicht unterstützter SMTP-Port",
  }),
  user: z.string().trim().email().max(320),
  pass: z.string().min(1).max(1024),
  secure: z.boolean(),
});

const emailSchema = z.object({
  to: z.string().trim().email().max(320),
  subject: z.string().trim().min(1).max(500),
  body: z.string().max(100_000),
});

const attachmentSchema = z.object({
  filename: z.string().trim().min(1).max(180),
  content: z
    .string()
    .max(Math.ceil((MAX_ATTACHMENT_BYTES * 4) / 3) + 4)
    .regex(/^[A-Za-z0-9+/]*={0,2}$/, "Ungültige Base64-Daten"),
  contentType: z.literal("application/pdf"),
});

const requestSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("test"),
    smtp: smtpSchema,
  }),
  z.object({
    action: z.literal("send"),
    smtp: smtpSchema,
    email: emailSchema,
    attachments: z.array(attachmentSchema).max(3),
  }),
]);

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function jsonResponse(body: SendEmailResult, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function getClientId(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(request: Request) {
  const now = Date.now();
  const clientId = getClientId(request);
  const current = rateLimitStore.get(clientId);

  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt <= now) rateLimitStore.delete(key);
  }

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(clientId, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

function hasTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = (forwardedHost ?? request.headers.get("host"))?.split(",")[0]?.trim();

  if (!origin || !host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function isPrivateIpv4(address: string) {
  const octets = address.split(".").map(Number);
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet))) return true;

  const [a, b] = octets;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51) ||
    (a === 203 && b === 0) ||
    a >= 224
  );
}

function isPrivateIpv6(address: string) {
  const normalized = address.toLowerCase().split("%")[0] ?? address.toLowerCase();

  if (normalized === "::" || normalized === "::1") return true;
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
  if (/^fe[89ab]/.test(normalized)) return true;
  if (normalized.startsWith("ff")) return true;
  if (normalized.startsWith("2001:db8")) return true;
  if (normalized.startsWith("2001:2:")) return true;
  if (normalized.startsWith("2001:10:")) return true;
  if (normalized.startsWith("2001:20:")) return true;

  const mappedIpv4 = normalized.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/)?.[1];
  return mappedIpv4 ? isPrivateIpv4(mappedIpv4) : false;
}

function isPrivateAddress(address: string) {
  const family = isIP(address);
  if (family === 4) return isPrivateIpv4(address);
  if (family === 6) return isPrivateIpv6(address);
  return true;
}

async function resolvePublicSmtpHost(host: string) {
  const normalizedHost = host.trim().replace(/\.$/, "").toLowerCase();

  if (
    normalizedHost === "localhost" ||
    normalizedHost.endsWith(".localhost") ||
    normalizedHost.endsWith(".local") ||
    normalizedHost.endsWith(".internal")
  ) {
    throw new Error("Private SMTP-Ziele sind nicht erlaubt");
  }

  const addresses = isIP(normalizedHost)
    ? [{ address: normalizedHost }]
    : await lookup(normalizedHost, { all: true, verbatim: true });

  if (addresses.length === 0 || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new Error("Private SMTP-Ziele sind nicht erlaubt");
  }

  return {
    hostname: normalizedHost,
    address: addresses[0]!.address,
  };
}

async function createTransport(smtp: SmtpConfig) {
  const resolvedHost = await resolvePublicSmtpHost(smtp.host);

  return nodemailer.createTransport({
    host: resolvedHost.address,
    port: smtp.port,
    secure: smtp.secure,
    requireTLS: !smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    tls: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
      servername: resolvedHost.hostname,
    },
  });
}

function decodeAttachments(attachments: EmailAttachment[]) {
  let totalBytes = 0;

  return attachments.map((attachment) => {
    const content = Buffer.from(attachment.content, "base64");
    totalBytes += content.byteLength;

    if (totalBytes > MAX_ATTACHMENT_BYTES) {
      throw new Error("Anhänge sind zu groß");
    }

    return {
      filename: attachment.filename.replace(/[\\/\0]/g, "_"),
      content,
      contentType: attachment.contentType,
    };
  });
}

async function testConnection(smtp: SmtpConfig): Promise<SendEmailResult> {
  const transporter = await createTransport(smtp);

  try {
    await transporter.verify();
    return { success: true };
  } finally {
    transporter.close();
  }
}

async function sendEmail(
  smtp: SmtpConfig,
  email: EmailData,
  attachments: EmailAttachment[],
): Promise<SendEmailResult> {
  const transporter = await createTransport(smtp);

  try {
    await transporter.verify();
    const info = await transporter.sendMail({
      from: `"${smtp.user}" <${smtp.user}>`,
      to: email.to,
      subject: email.subject,
      text: email.body,
      attachments: decodeAttachments(attachments),
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } finally {
    transporter.close();
  }
}

export async function POST(request: Request) {
  if (!hasTrustedOrigin(request)) {
    return jsonResponse({ success: false, error: "Ungültiger Anfrageursprung" }, 403);
  }

  if (isRateLimited(request)) {
    return jsonResponse({ success: false, error: "Zu viele Anfragen" }, 429);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return jsonResponse({ success: false, error: "Anfrage ist zu groß" }, 413);
  }

  try {
    const payload = requestSchema.parse(await request.json());
    const result =
      payload.action === "test"
        ? await testConnection(payload.smtp)
        : await sendEmail(payload.smtp, payload.email, payload.attachments);

    return jsonResponse(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonResponse({ success: false, error: "Ungültige E-Mail-Konfiguration" }, 400);
    }

    console.error("E-Mail-API fehlgeschlagen", error instanceof Error ? error.message : error);
    return jsonResponse({ success: false, error: "E-Mail-Anfrage fehlgeschlagen" }, 502);
  }
}
