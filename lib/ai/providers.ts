/**
 * AI provider factory for cover letter generation.
 * Supports OpenAI, Anthropic, and Google (Gemini).
 * API keys are passed per-request — never stored server-side.
 */

import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export type AIProvider = "openai" | "anthropic" | "google" | "ollama" | "perplexity" | "kimi";

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  baseURL?: string;
}

export const PROVIDER_MODELS: Record<AIProvider, { value: string; label: string }[]> = {
  openai: [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4o-mini", label: "GPT-4o Mini" },
    { value: "gpt-4.1", label: "GPT-4.1" },
    { value: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
  ],
  anthropic: [
    { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
    { value: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku" },
  ],
  google: [
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro" },
  ],
  ollama: [
    { value: "llama3.3", label: "Llama 3.3" },
    { value: "llama3.1", label: "Llama 3.1" },
    { value: "gemma2", label: "Gemma 2" },
    { value: "mistral", label: "Mistral" },
    { value: "codellama", label: "Code Llama" },
    { value: "qwen2.5", label: "Qwen 2.5" },
    { value: "phi4", label: "Phi-4" },
    { value: "deepseek-r1", label: "DeepSeek R1" },
  ],
  perplexity: [
    { value: "sonar", label: "Sonar" },
    { value: "sonar-pro", label: "Sonar Pro" },
    { value: "sonar-reasoning", label: "Sonar Reasoning" },
  ],
  kimi: [
    { value: "moonshot-v1-8k", label: "Moonshot v1 8K" },
    { value: "moonshot-v1-32k", label: "Moonshot v1 32K" },
    { value: "moonshot-v1-128k", label: "Moonshot v1 128K" },
  ],
};

export const PROVIDER_LABELS: Record<AIProvider, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  google: "Google Gemini",
  ollama: "Ollama (Lokal)",
  perplexity: "Perplexity AI",
  kimi: "Kimi (Moonshot)",
};

export function createAIModel(config: AIProviderConfig) {
  switch (config.provider) {
    case "openai": {
      const openai = createOpenAI({ apiKey: config.apiKey });
      return openai(config.model);
    }
    case "anthropic": {
      const anthropic = createAnthropic({ apiKey: config.apiKey });
      return anthropic(config.model);
    }
    case "google": {
      const google = createGoogleGenerativeAI({ apiKey: config.apiKey });
      return google(config.model);
    }
    case "ollama": {
      const ollama = createOpenAI({
        baseURL: config.baseURL || "http://localhost:11434/v1",
        apiKey: config.apiKey || "ollama",
      });
      return ollama(config.model);
    }
    case "perplexity": {
      const perplexity = createOpenAI({
        baseURL: "https://api.perplexity.ai",
        apiKey: config.apiKey,
        name: "perplexity",
      });
      return perplexity(config.model);
    }
    case "kimi": {
      const kimi = createOpenAI({
        baseURL: "https://api.moonshot.cn/v1",
        apiKey: config.apiKey,
        name: "kimi",
      });
      return kimi(config.model);
    }
    default:
      throw new Error(`Unknown AI provider: ${config.provider}`);
  }
}
