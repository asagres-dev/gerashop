export interface AIModel {
  id: string;
  name: string;
  provider: string;
  maxTokens?: number;
  supportsImages?: boolean;
  supportsVision?: boolean;
  costPer1kTokens?: { input: number; output: number };
  isAvailable?: boolean;
}

export interface AIProvider {
  id: string;
  user_id: string;
  type: string;
  name: string;
  api_key?: string;
  api_url?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AITaskConfig {
  id: string;
  user_id: string;
  task: string;
  provider_id: string;
  model_id: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
}

export interface AIGlobalParams {
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
}

export const PROVIDER_TYPES = [
  { id: "openrouter", name: "OpenRouter", description: "200+ modelos via API única", apiUrlRequired: false },
  { id: "openai", name: "OpenAI", description: "GPT-4o, GPT-4, GPT-3.5", apiUrlRequired: false },
  { id: "anthropic", name: "Anthropic", description: "Claude 3.5, Claude 3", apiUrlRequired: false },
  { id: "google", name: "Google AI", description: "Gemini Pro, Gemini Ultra", apiUrlRequired: false },
  { id: "groq", name: "Groq", description: "Llama, Mixtral (ultra-rápido)", apiUrlRequired: false },
  { id: "deepseek", name: "DeepSeek", description: "DeepSeek-V3, DeepSeek Coder", apiUrlRequired: false },
  { id: "mistral", name: "Mistral", description: "Mistral Large, Small", apiUrlRequired: false },
  { id: "together", name: "Together AI", description: "Modelos open-source", apiUrlRequired: false },
  { id: "perplexity", name: "Perplexity", description: "Sonar, Llama (com busca)", apiUrlRequired: false },
  { id: "custom", name: "Custom (OpenAI-compatible)", description: "Qualquer API compatível", apiUrlRequired: true },
] as const;

export const AI_TASKS = [
  { id: "caption", label: "Legendas (Instagram/Feed)", icon: "📝" },
  { id: "script", label: "Roteiros (Reels/TikTok)", icon: "🎬" },
  { id: "whatsapp", label: "Mensagens (WhatsApp)", icon: "💬" },
  { id: "image", label: "Geração de Imagens", icon: "🖼️" },
  { id: "trend", label: "Análise de Tendências", icon: "📊" },
] as const;

export const PROVIDER_API_URLS: Record<string, string> = {
  openrouter: "https://openrouter.ai/api/v1",
  openai: "https://api.openai.com/v1",
  anthropic: "https://api.anthropic.com/v1",
  google: "https://generativelanguage.googleapis.com/v1beta",
  groq: "https://api.groq.com/openai/v1",
  deepseek: "https://api.deepseek.com/v1",
  mistral: "https://api.mistral.ai/v1",
  together: "https://api.together.xyz/v1",
  perplexity: "https://api.perplexity.ai",
};
