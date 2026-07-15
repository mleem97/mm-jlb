"use server";

import nodemailer from "nodemailer";

import { auth } from "@/lib/server/auth";

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  secure: boolean;
}

export interface EmailData {
  to: string;
  subject: string;
  body: string;
}

export interface EmailAttachment {
  filename: string;
  content: string; // base64 encoded
  contentType: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function testSmtpConnection(
  smtp: SmtpConfig,
): Promise<SendEmailResult> {
  await auth();

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass },
      connectionTimeout: 10000,
      disableFileAccess: true,
      disableUrlAccess: true,
    });

    await transporter.verify();
    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Verbindung fehlgeschlagen";
    return { success: false, error: message };
  }
}

export async function sendApplicationEmail(
  smtp: SmtpConfig,
  email: EmailData,
  attachments: EmailAttachment[],
): Promise<SendEmailResult> {
  await auth();

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass },
      connectionTimeout: 15000,
      disableFileAccess: true,
      disableUrlAccess: true,
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"${smtp.user}" <${smtp.user}>`,
      to: email.to,
      subject: email.subject,
      text: email.body,
      attachments: attachments.map((attachment) => ({
        filename: attachment.filename,
        content: Buffer.from(attachment.content, "base64"),
        contentType: attachment.contentType,
      })),
      disableFileAccess: true,
      disableUrlAccess: true,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "E-Mail konnte nicht gesendet werden";
    return { success: false, error: message };
  }
}
