"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Key,
  Loader2,
  Mail,
  Send,
  Server,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { useApplicationStore } from "@/store/applicationStore";
import { useTranslations } from "@/i18n/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  generateEmailContent,
  EMAIL_TEMPLATE_LABELS,
  SMTP_PRESETS,
  type EmailTemplate,
} from "@/lib/email/templates";
import {
  sendApplicationEmail,
  testSmtpConnection,
  type SmtpConfig,
} from "@/app/actions/sendEmail";

const SMTP_STORAGE_KEY = "jlb:smtp:config";

function loadSmtpConfig(): SmtpConfig {
  if (typeof window === "undefined") {
    return { host: "", port: 587, user: "", pass: "", secure: false };
  }
  try {
    const stored = localStorage.getItem(SMTP_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* empty */ }
  return { host: "", port: 587, user: "", pass: "", secure: false };
}

function saveSmtpConfig(config: SmtpConfig) {
  localStorage.setItem(SMTP_STORAGE_KEY, JSON.stringify(config));
}

export function EmailComposer() {
  const t = useTranslations("email");
  const { personalData, jobPosting, addTrackerEntry } = useApplicationStore();

  // SMTP Config
  const [smtp, setSmtp] = useState<SmtpConfig>(() => loadSmtpConfig());
  const [showSmtpConfig, setShowSmtpConfig] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionVerified, setConnectionVerified] = useState(false);

  // Email content
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Apply template on mount
  useEffect(() => {
    if (!subject && !body) {
      const data = {
        firstName: personalData.firstName || "Max",
        lastName: personalData.lastName || "Mustermann",
        jobTitle: jobPosting?.jobTitle || "die ausgeschriebene Stelle",
        companyName: jobPosting?.companyName || "Ihr Unternehmen",
        contactPerson: jobPosting?.contactPerson,
      };
      const content = generateEmailContent("formal", data);
      setSubject(content.subject);
      setBody(content.body);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const applyTemplate = useCallback(
    (template: EmailTemplate) => {
      const data = {
        firstName: personalData.firstName || "Max",
        lastName: personalData.lastName || "Mustermann",
        jobTitle: jobPosting?.jobTitle || "die ausgeschriebene Stelle",
        companyName: jobPosting?.companyName || "Ihr Unternehmen",
        contactPerson: jobPosting?.contactPerson,
      };
      const content = generateEmailContent(template, data);
      setSubject(content.subject);
      setBody(content.body);
      toast.success(t("templateApplied", { name: EMAIL_TEMPLATE_LABELS[template] }));
    },
    [personalData, jobPosting],
  );

  const updateSmtp = useCallback((updates: Partial<SmtpConfig>) => {
    setSmtp((prev) => {
      const next = { ...prev, ...updates };
      saveSmtpConfig(next);
      setConnectionVerified(false);
      return next;
    });
  }, []);

  const handleTestConnection = useCallback(async () => {
    if (!smtp.host || !smtp.user || !smtp.pass) {
      toast.error(t("fillAllFields"));
      return;
    }
    setTestingConnection(true);
    try {
      const result = await testSmtpConnection(smtp);
      if (result.success) {
        setConnectionVerified(true);
        toast.success(t("connectionOk"));
      } else {
        toast.error(`${t("connectionFailed")}: ${result.error}`);
      }
    } catch {
      toast.error(t("testFailed"));
    } finally {
      setTestingConnection(false);
    }
  }, [smtp]);

  const handleSend = useCallback(async () => {
    if (!smtp.host || !smtp.user || !smtp.pass) {
      toast.error(t("configureFirst"));
      setShowSmtpConfig(true);
      return;
    }
    if (!to) {
      toast.error(t("enterRecipient"));
      return;
    }
    if (!subject) {
      toast.error(t("enterSubject"));
      return;
    }

    setIsSending(true);
    try {
      // Generate PDF attachment
      let pdfBase64 = "";
      try {
        const { exportAsPdf } = await import("@/lib/export/pdfExport");
        const state = useApplicationStore.getState();
        const blob = await exportAsPdf(state);
        const arrayBuffer = await blob.arrayBuffer();
        pdfBase64 = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
        );
      } catch {
        toast.error(t("pdfError"));
        setIsSending(false);
        return;
      }

      const safeName = [personalData.firstName, personalData.lastName]
        .filter(Boolean)
        .join("_")
        .replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, "_");
      const fileName = `Bewerbung_${safeName}.pdf`;

      const result = await sendApplicationEmail(
        smtp,
        { to, subject, body },
        [{ filename: fileName, content: pdfBase64, contentType: "application/pdf" }],
      );

      if (result.success) {
        // Add tracker entry
        addTrackerEntry({
          id: crypto.randomUUID(),
          companyName: jobPosting?.companyName || "Unbekannt",
          jobTitle: jobPosting?.jobTitle || "Unbekannt",
          appliedAt: new Date().toISOString(),
          status: "gesendet",
          exportFormat: "pdf",
        });

        toast.success(t("sent"), {
          description: `Message-ID: ${result.messageId}`,
        });
      } else {
        toast.error(`${t("sendFailed")}: ${result.error}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`${t("sendError")}: ${message}`);
    } finally {
      setIsSending(false);
    }
  }, [smtp, to, subject, body, personalData, jobPosting, addTrackerEntry]);

  return (
    <div className="space-y-4">
      {/* SMTP Config Toggle */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowSmtpConfig(!showSmtpConfig)}
          className="gap-1.5"
        >
          <Server className="h-4 w-4" />
          {t("configureSmtp")}
        </Button>
        {connectionVerified ? (
          <Badge variant="secondary" className="gap-1 text-emerald-600">
            <CheckCircle2 className="h-3 w-3" />
            {t("connected")}
          </Badge>
        ) : null}
      </div>

      {/* SMTP Config Panel */}
      {showSmtpConfig ? (
        <Card className="p-4 space-y-3">
          {/* Presets */}
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">{t("quickSelect")}</Label>
            <div className="flex flex-wrap gap-1.5">
              {SMTP_PRESETS.map((preset) => (
                <Button
                  key={preset.label}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() =>
                    updateSmtp({
                      host: preset.host,
                      port: preset.port,
                      secure: preset.secure,
                    })
                  }
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-[1fr_100px] gap-3">
            <div className="space-y-1">
              <Label className="text-xs">{t("smtpServer")}</Label>
              <Input
                placeholder="smtp.gmail.com"
                value={smtp.host}
                onChange={(e) => updateSmtp({ host: e.target.value })}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{t("smtpPort")}</Label>
              <Input
                type="number"
                placeholder="587"
                value={smtp.port}
                onChange={(e) => updateSmtp({ port: Number(e.target.value) })}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
              <Label className="text-xs">{t("smtpUser")}</Label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="deine@email.de"
                value={smtp.user}
                onChange={(e) => updateSmtp({ user: e.target.value })}
                className="h-9 text-sm pl-8"
              />
            </div>
          </div>

          <div className="space-y-1">
              <Label className="text-xs">{t("smtpPassword")}</Label>
            <div className="relative">
              <Key className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="••••••••"
                value={smtp.pass}
                onChange={(e) => updateSmtp({ pass: e.target.value })}
                className="h-9 text-sm pl-8"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="smtpSecure"
              checked={smtp.secure}
              onChange={(e) => updateSmtp({ secure: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="smtpSecure" className="text-xs cursor-pointer">
              {t("useSsl")}
            </Label>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleTestConnection}
            disabled={testingConnection || !smtp.host || !smtp.user || !smtp.pass}
            className="gap-1.5"
          >
            {testingConnection ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Server className="h-3.5 w-3.5" />
            )}
            {testingConnection ? t("testing") : t("testConnection")}
          </Button>

          {/* Privacy Notice */}
          <div className="flex gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-2.5">
            <Shield className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>{t("smtpPrivacy")}</span>
          </div>
        </Card>
      ) : null}

      {/* Email Compose */}
      <div className="space-y-3">
        {/* Templates */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{t("template")}:</span>
          {(Object.keys(EMAIL_TEMPLATE_LABELS) as EmailTemplate[]).map((key) => (
            <Button
              key={key}
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => applyTemplate(key)}
            >
              {EMAIL_TEMPLATE_LABELS[key]}
            </Button>
          ))}
        </div>

        <div className="space-y-1">
          <Label className="text-sm">{t("to")}</Label>
          <Input
            type="email"
            placeholder="bewerbung@firma.de"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-sm">{t("subject")}</Label>
          <Input
            placeholder="Bewerbung als..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label className="text-sm">{t("body")}</Label>
          <Textarea
            placeholder="Sehr geehrte Damen und Herren..."
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          {t("attachPdf")}
        </p>
      </div>

      {/* Send Button */}
      <Button
        onClick={handleSend}
        disabled={isSending || !to || !subject}
        className="w-full gap-2"
      >
        {isSending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("sending")}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            {t("send")}
          </>
        )}
      </Button>
    </div>
  );
}
