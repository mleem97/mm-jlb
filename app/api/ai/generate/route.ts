import { streamText } from "ai";
import { createAIModel } from "@/lib/ai/providers";
import type { AIProvider } from "@/lib/ai/providers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { provider, apiKey, model, baseURL, systemPrompt, userPrompt } = body as {
      provider: AIProvider;
      apiKey: string;
      model: string;
      baseURL?: string;
      systemPrompt: string;
      userPrompt: string;
    };

    if (!provider || !model || !systemPrompt || !userPrompt) {
      return Response.json(
        { error: "Missing required fields: provider, model, systemPrompt, userPrompt" },
        { status: 400 },
      );
    }

    // API key is optional for Ollama (local)
    if (!apiKey && provider !== "ollama") {
      return Response.json(
        { error: "Missing required field: apiKey" },
        { status: 400 },
      );
    }

    const aiModel = createAIModel({ provider, apiKey: apiKey || "", model, baseURL });

    const result = streamText({
      model: aiModel,
      system: systemPrompt,
      prompt: userPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    // Handle common API errors
    if (message.includes("401") || message.includes("Unauthorized") || message.includes("invalid_api_key")) {
      return Response.json({ error: "Ungültiger API-Key. Bitte überprüfe deinen Key." }, { status: 401 });
    }

    if (message.includes("429") || message.includes("rate_limit")) {
      return Response.json(
        { error: "Zu viele Anfragen. Bitte warte einen Moment und versuche es erneut." },
        { status: 429 },
      );
    }

    return Response.json({ error: `Fehler bei der KI-Generierung: ${message}` }, { status: 500 });
  }
}
