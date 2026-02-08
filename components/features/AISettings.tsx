"use client";

import { useCallback, useEffect, useState } from "react";
import { Key, Settings, Shield, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useTranslations } from "@/i18n/client";
import {
  PROVIDER_MODELS,
  PROVIDER_LABELS,
  type AIProvider,
} from "@/lib/ai/providers";

const AI_STORAGE_PREFIX = "jlb:ai";

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
  baseURL: string;
}

function loadAIConfig(): AIConfig {
  if (typeof window === "undefined") {
    return { provider: "openai", model: "gpt-4o-mini", apiKey: "", baseURL: "" };
  }
  return {
    provider: (localStorage.getItem(`${AI_STORAGE_PREFIX}:provider`) as AIProvider) ?? "openai",
    model: localStorage.getItem(`${AI_STORAGE_PREFIX}:model`) ?? "gpt-4o-mini",
    apiKey: localStorage.getItem(`${AI_STORAGE_PREFIX}:apiKey`) ?? "",
    baseURL: localStorage.getItem(`${AI_STORAGE_PREFIX}:baseURL`) ?? "",
  };
}

function saveAIConfig(config: AIConfig) {
  localStorage.setItem(`${AI_STORAGE_PREFIX}:provider`, config.provider);
  localStorage.setItem(`${AI_STORAGE_PREFIX}:model`, config.model);
  localStorage.setItem(`${AI_STORAGE_PREFIX}:apiKey`, config.apiKey);
  localStorage.setItem(`${AI_STORAGE_PREFIX}:baseURL`, config.baseURL);
}

export function useAIConfig() {
  const [config, setConfig] = useState<AIConfig>({ provider: "openai", model: "gpt-4o-mini", apiKey: "", baseURL: "" });

  // Read from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setConfig(loadAIConfig());
  }, []);

  const updateConfig = useCallback((updates: Partial<AIConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };
      saveAIConfig(next);
      return next;
    });
  }, []);

  return { config, updateConfig };
}

interface AISettingsProps {
  open: boolean;
  onClose: () => void;
}

export function AISettings({ open, onClose }: AISettingsProps) {
  const t = useTranslations("ai");
  const { config, updateConfig } = useAIConfig();
  const [testLoading, setTestLoading] = useState(false);

  // Sync model when provider changes
  useEffect(() => {
    const models = PROVIDER_MODELS[config.provider];
    if (models.length > 0 && !models.some((m) => m.value === config.model)) {
      updateConfig({ model: models[0].value });
    }
  }, [config.provider, config.model, updateConfig]);

  const handleTestKey = useCallback(async () => {
    if (!config.apiKey && config.provider !== "ollama") {
      toast.error(t("enterKeyFirst"));
      return;
    }

    setTestLoading(true);
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: config.provider,
          apiKey: config.apiKey,
          model: config.model,
          baseURL: config.baseURL,
          systemPrompt: "Antworte nur mit: OK",
          userPrompt: "Test",
        }),
      });

      if (response.ok) {
        toast.success(t("keyWorks"));
      } else {
        const data = await response.json();
        toast.error(data.error ?? t("keyInvalid"));
      }
    } catch {
      toast.error(t("connectionError"));
    } finally {
      setTestLoading(false);
    }
  }, [config]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg mx-4 bg-background rounded-xl shadow-2xl border border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">{t("settings")}</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-5">
          {/* Provider */}
          <div className="space-y-2">
            <Label>{t("provider")}</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={config.provider}
              onChange={(e) => updateConfig({ provider: e.target.value as AIProvider })}
            >
              {(Object.keys(PROVIDER_LABELS) as AIProvider[]).map((key) => (
                <option key={key} value={key}>
                  {PROVIDER_LABELS[key]}
                </option>
              ))}
            </select>
          </div>

          {/* Model */}
          <div className="space-y-2">
            <Label>{t("model")}</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={config.model}
              onChange={(e) => updateConfig({ model: e.target.value })}
            >
              {PROVIDER_MODELS[config.provider].map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Base URL (Ollama) */}
          {config.provider === "ollama" && (
            <div className="space-y-2">
              <Label>Base URL</Label>
              <Input
                type="text"
                placeholder="http://localhost:11434/v1"
                value={config.baseURL}
                onChange={(e) => updateConfig({ baseURL: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Stellen Sie sicher, dass Ollama auf Ihrem Rechner läuft.
              </p>
            </div>
          )}

          {/* API Key */}
          <div className="space-y-2">
            <Label>{t("apiKey")}</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder={config.provider === "ollama" ? "Optional — lokal nicht erforderlich" : "sk-... / api-key-..."}
                  value={config.apiKey}
                  onChange={(e) => updateConfig({ apiKey: e.target.value })}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestKey}
                disabled={testLoading || (!config.apiKey && config.provider !== "ollama")}
                className="shrink-0"
              >
                {testLoading ? t("testing") : t("testConnection")}
              </Button>
            </div>
          </div>

          {/* Privacy Notice */}
          <Card className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
            <div className="flex gap-2 text-xs text-emerald-800 dark:text-emerald-300">
              <Shield className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">{t("privacyTitle")}</p>
                <p>
                  {t("privacyNotice")}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t bg-muted/30">
          <Button onClick={onClose}>{t("done")}</Button>
        </div>
      </div>
    </div>
  );
}
