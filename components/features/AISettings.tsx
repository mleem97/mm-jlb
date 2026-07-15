"use client";

import { useCallback, useEffect, useState } from "react";
import { Key, Settings, Shield, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/i18n/client";
import {
  PROVIDER_MODELS,
  type AIProvider,
} from "@/lib/ai/providers";

const AI_STORAGE_PREFIX = "jlb:ai";

const PROVIDER_OPTIONS: { value: AIProvider; label: string }[] = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google Gemini" },
  { value: "ollama", label: "Ollama (Lokal)" },
  { value: "perplexity", label: "Perplexity AI" },
  { value: "kimi", label: "Kimi (Moonshot)" },
];

export interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
  baseURL: string;
}

function isAIProvider(value: string | null): value is AIProvider {
  return PROVIDER_OPTIONS.some((option) => option.value === value);
}

function getProviderModels(provider: AIProvider) {
  switch (provider) {
    case "openai":
      return PROVIDER_MODELS.openai;
    case "anthropic":
      return PROVIDER_MODELS.anthropic;
    case "google":
      return PROVIDER_MODELS.google;
    case "ollama":
      return PROVIDER_MODELS.ollama;
    case "perplexity":
      return PROVIDER_MODELS.perplexity;
    case "kimi":
      return PROVIDER_MODELS.kimi;
  }
}

function loadAIConfig(): AIConfig {
  if (typeof window === "undefined") {
    return {
      provider: "openai",
      model: "gpt-4o-mini",
      apiKey: "",
      baseURL: "",
    };
  }

  const storedProvider = localStorage.getItem(`${AI_STORAGE_PREFIX}:provider`);
  return {
    provider: isAIProvider(storedProvider) ? storedProvider : "openai",
    model:
      localStorage.getItem(`${AI_STORAGE_PREFIX}:model`) ?? "gpt-4o-mini",
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
  const [config, setConfig] = useState<AIConfig>({
    provider: "openai",
    model: "gpt-4o-mini",
    apiKey: "",
    baseURL: "",
  });

  useEffect(() => {
    setConfig(loadAIConfig());
  }, []);

  const updateConfig = useCallback((updates: Partial<AIConfig>) => {
    setConfig((previous) => {
      const next = { ...previous, ...updates };
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
  const models = getProviderModels(config.provider);

  useEffect(() => {
    const firstModel = models[0];
    if (firstModel && !models.some((model) => model.value === config.model)) {
      updateConfig({ model: firstModel.value });
    }
  }, [config.model, models, updateConfig]);

  const testApiKey = useCallback(async () => {
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
        const data: unknown = await response.json();
        const errorMessage =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : t("keyInvalid");
        toast.error(errorMessage);
      }
    } catch {
      toast.error(t("connectionError"));
    } finally {
      setTestLoading(false);
    }
  }, [config, t]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label={t("close")}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-settings-title"
        className="relative z-50 mx-4 w-full max-w-lg overflow-hidden rounded-xl border border-border bg-background shadow-2xl"
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <Settings className="size-5 text-primary" />
            <h2 id="ai-settings-title" className="text-lg font-semibold">
              {t("settings")}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label={t("close")}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="space-y-5 px-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="ai-provider">{t("provider")}</Label>
            <select
              id="ai-provider"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={config.provider}
              onChange={(event) => {
                const provider = event.target.value;
                if (isAIProvider(provider)) updateConfig({ provider });
              }}
            >
              {PROVIDER_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ai-model">{t("model")}</Label>
            <select
              id="ai-model"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={config.model}
              onChange={(event) => {
                updateConfig({ model: event.target.value });
              }}
            >
              {models.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          {config.provider === "ollama" ? (
            <div className="space-y-2">
              <Label htmlFor="ai-base-url">Base URL</Label>
              <Input
                id="ai-base-url"
                type="url"
                placeholder="http://localhost:11434/v1"
                value={config.baseURL}
                onChange={(event) => {
                  updateConfig({ baseURL: event.target.value });
                }}
              />
              <p className="text-xs text-muted-foreground">
                Stellen Sie sicher, dass Ollama auf Ihrem Rechner läuft.
              </p>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="ai-api-key">{t("apiKey")}</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Key className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="ai-api-key"
                  type="password"
                  placeholder={
                    config.provider === "ollama"
                      ? "Optional, lokal nicht erforderlich"
                      : "API-Schlüssel"
                  }
                  value={config.apiKey}
                  onChange={(event) => {
                    updateConfig({ apiKey: event.target.value });
                  }}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  void testApiKey();
                }}
                disabled={
                  testLoading ||
                  (!config.apiKey && config.provider !== "ollama")
                }
                className="shrink-0"
              >
                {testLoading ? t("testing") : t("testConnection")}
              </Button>
            </div>
          </div>

          <Card className="border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-950/30">
            <div className="flex gap-2 text-xs text-emerald-800 dark:text-emerald-300">
              <Shield className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="mb-1 font-medium">{t("privacyTitle")}</p>
                <p>{t("privacyNotice")}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end border-t bg-muted/30 px-6 py-4">
          <Button onClick={onClose}>{t("done")}</Button>
        </div>
      </div>
    </div>
  );
}
