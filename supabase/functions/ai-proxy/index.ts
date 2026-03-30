import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProviderConfig {
  type: string;
  api_key?: string;
  api_url?: string;
}

function getBaseUrl(provider: ProviderConfig): string {
  if (provider.api_url) return provider.api_url;
  const urls: Record<string, string> = {
    openrouter: "https://openrouter.ai/api/v1",
    openai: "https://api.openai.com/v1",
    groq: "https://api.groq.com/openai/v1",
    deepseek: "https://api.deepseek.com/v1",
    mistral: "https://api.mistral.ai/v1",
    together: "https://api.together.xyz/v1",
    perplexity: "https://api.perplexity.ai",
  };
  return urls[provider.type] || "";
}

function isOpenAICompatible(type: string): boolean {
  return ["openrouter", "openai", "groq", "deepseek", "mistral", "together", "perplexity", "custom"].includes(type);
}

async function listModels(provider: ProviderConfig) {
  const baseUrl = getBaseUrl(provider);
  if (!baseUrl || !provider.api_key) {
    return { models: [] };
  }

  if (provider.type === "anthropic") {
    return {
      models: [
        { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4", provider: "Anthropic", maxTokens: 200000 },
        { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", provider: "Anthropic", maxTokens: 200000 },
        { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", provider: "Anthropic", maxTokens: 200000 },
        { id: "claude-3-opus-20240229", name: "Claude 3 Opus", provider: "Anthropic", maxTokens: 200000 },
      ],
    };
  }

  if (provider.type === "google") {
    return {
      models: [
        { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google", maxTokens: 1000000 },
        { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "Google", maxTokens: 1000000 },
        { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "Google", maxTokens: 1000000 },
      ],
    };
  }

  // OpenAI-compatible providers
  try {
    const resp = await fetch(`${baseUrl}/models`, {
      headers: { Authorization: `Bearer ${provider.api_key}` },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    const models = (data.data || []).map((m: any) => ({
      id: m.id,
      name: m.name || m.id,
      provider: provider.type,
      maxTokens: m.context_length || m.max_tokens || undefined,
      costPer1kTokens: m.pricing
        ? { input: parseFloat(m.pricing.prompt || "0"), output: parseFloat(m.pricing.completion || "0") }
        : undefined,
    }));
    return { models };
  } catch (e: any) {
    console.error("Error fetching models:", e.message);
    return { models: [] };
  }
}

async function testProvider(provider: ProviderConfig) {
  if (!provider.api_key) {
    return { success: false, error: "API Key não configurada" };
  }

  try {
    const result = await listModels(provider);
    if (result.models.length > 0) {
      return { success: true, models: result.models };
    }

    // Fallback: try a simple completion
    if (isOpenAICompatible(provider.type)) {
      const baseUrl = getBaseUrl(provider);
      const resp = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${provider.api_key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: "Hi" }],
          max_tokens: 5,
        }),
      });
      if (resp.ok) return { success: true, models: [] };
      return { success: false, error: `HTTP ${resp.status}` };
    }

    return { success: true, models: result.models };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

async function generate(
  provider: ProviderConfig,
  modelId: string,
  prompt: string,
  systemPrompt: string,
  params: { temperature?: number; max_tokens?: number; top_p?: number; frequency_penalty?: number }
) {
  if (!provider.api_key) throw new Error("API Key não configurada");

  // Anthropic uses a different API format
  if (provider.type === "anthropic") {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": provider.api_key,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelId,
        max_tokens: params.max_tokens || 2000,
        system: systemPrompt,
        messages: [{ role: "user", content: prompt }],
        temperature: params.temperature ?? 0.7,
        top_p: params.top_p ?? 0.9,
      }),
    });
    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Anthropic error [${resp.status}]: ${err}`);
    }
    const data = await resp.json();
    return {
      text: data.content?.[0]?.text || "",
      model: modelId,
      usage: data.usage,
    };
  }

  // Google Gemini native API
  if (provider.type === "google") {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${provider.api_key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            temperature: params.temperature ?? 0.7,
            maxOutputTokens: params.max_tokens || 2000,
            topP: params.top_p ?? 0.9,
          },
        }),
      }
    );
    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Google AI error [${resp.status}]: ${err}`);
    }
    const data = await resp.json();
    return {
      text: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
      model: modelId,
      usage: data.usageMetadata,
    };
  }

  // OpenAI-compatible providers
  const baseUrl = getBaseUrl(provider);
  if (!baseUrl) throw new Error("URL da API não configurada");

  const resp = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${provider.api_key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelId,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: params.temperature ?? 0.7,
      max_tokens: params.max_tokens || 2000,
      top_p: params.top_p ?? 0.9,
      frequency_penalty: params.frequency_penalty ?? 0,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`AI error [${resp.status}]: ${err}`);
  }

  const data = await resp.json();
  return {
    text: data.choices?.[0]?.message?.content || "",
    model: modelId,
    usage: data.usage,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { action, provider, modelId, prompt, systemPrompt, params } = body;

    let result: any;

    switch (action) {
      case "test":
        result = await testProvider(provider);
        break;
      case "list-models":
        result = await listModels(provider);
        break;
      case "generate":
        result = await generate(provider, modelId, prompt, systemPrompt || "", params || {});
        break;
      default:
        throw new Error(`Ação desconhecida: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("ai-proxy error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
