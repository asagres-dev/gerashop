import { supabase } from "@/integrations/supabase/client";
import type { AIProvider, AITaskConfig, AIGlobalParams, AIModel } from "./types";

export class AIProviderService {
  private static instance: AIProviderService;

  static getInstance() {
    if (!AIProviderService.instance) {
      AIProviderService.instance = new AIProviderService();
    }
    return AIProviderService.instance;
  }

  async getProviders(userId: string): Promise<AIProvider[]> {
    const { data, error } = await supabase
      .from("ai_providers")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []) as AIProvider[];
  }

  async createProvider(provider: Omit<AIProvider, "id" | "created_at" | "updated_at">): Promise<AIProvider> {
    const { data, error } = await supabase
      .from("ai_providers")
      .insert([provider])
      .select()
      .single();
    if (error) throw error;
    return data as AIProvider;
  }

  async updateProvider(id: string, updates: Partial<AIProvider>): Promise<AIProvider> {
    const { data, error } = await supabase
      .from("ai_providers")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as AIProvider;
  }

  async deleteProvider(id: string): Promise<void> {
    const { error } = await supabase.from("ai_providers").delete().eq("id", id);
    if (error) throw error;
  }

  async getTaskConfigs(userId: string): Promise<AITaskConfig[]> {
    const { data, error } = await supabase
      .from("ai_task_configs")
      .select("*")
      .eq("user_id", userId);
    if (error) throw error;
    return (data || []) as AITaskConfig[];
  }

  async upsertTaskConfig(config: Omit<AITaskConfig, "id">): Promise<AITaskConfig> {
    const { data: existing } = await supabase
      .from("ai_task_configs")
      .select("id")
      .eq("user_id", config.user_id)
      .eq("task", config.task)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from("ai_task_configs")
        .update({ ...config, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return data as AITaskConfig;
    } else {
      const { data, error } = await supabase
        .from("ai_task_configs")
        .insert([config])
        .select()
        .single();
      if (error) throw error;
      return data as AITaskConfig;
    }
  }

  async getGlobalParams(userId: string): Promise<AIGlobalParams> {
    const { data, error } = await supabase
      .from("user_settings")
      .select("ai_global_params")
      .eq("user_id", userId)
      .single();
    if (error) throw error;
    const params = data?.ai_global_params as unknown as AIGlobalParams | null;
    return params || { temperature: 0.7, max_tokens: 2000, top_p: 0.9, frequency_penalty: 0.0 };
  }

  async updateGlobalParams(userId: string, params: AIGlobalParams): Promise<void> {
    const { error } = await supabase
      .from("user_settings")
      .update({ ai_global_params: params as any })
      .eq("user_id", userId);
    if (error) throw error;
  }

  async testProvider(provider: AIProvider): Promise<{ success: boolean; models?: AIModel[]; error?: string }> {
    try {
      const { data, error } = await supabase.functions.invoke("ai-proxy", {
        body: { action: "test", provider },
      });
      if (error) throw error;
      return data;
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  async fetchModels(provider: AIProvider): Promise<AIModel[]> {
    try {
      const { data, error } = await supabase.functions.invoke("ai-proxy", {
        body: { action: "list-models", provider },
      });
      if (error) throw error;
      return data?.models || [];
    } catch {
      return [];
    }
  }

  async generateContent(
    provider: AIProvider,
    modelId: string,
    prompt: string,
    systemPrompt: string,
    params: Partial<AIGlobalParams>
  ): Promise<{ text: string; model: string; usage?: any }> {
    const { data, error } = await supabase.functions.invoke("ai-proxy", {
      body: {
        action: "generate",
        provider,
        modelId,
        prompt,
        systemPrompt,
        params,
      },
    });
    if (error) throw error;
    return data;
  }
}

export const aiProviderService = AIProviderService.getInstance();
