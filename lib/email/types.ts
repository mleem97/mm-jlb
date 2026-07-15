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
  content: string;
  contentType: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
