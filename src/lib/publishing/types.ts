export type PublishMethod = "api" | "browser" | "manual";
export type PublishPlatform = "instagram" | "whatsapp";

export interface PublishResult {
  success: boolean;
  platform: PublishPlatform;
  method: PublishMethod;
  message?: string;
  postUrl?: string;
  error?: string;
  requiresUserAction?: boolean;
  data?: {
    caption?: string;
    message?: string;
    imageUrl?: string;
    whatsappLink?: string;
    groupLink?: string | null;
  };
}

export interface PublishContent {
  caption?: string;
  message?: string;
  imageUrl?: string;
  groupId?: string;
  phoneNumber?: string;
  scheduleTime?: string;
}

export interface PublishingStrategy {
  id: string;
  name: string;
  description: string;
  cost: "free" | "paid";
  platform: PublishPlatform;
  method: PublishMethod;
  riskLevel: "none" | "low" | "medium";
  requiresConfiguration: boolean;
  dailyLimit: string;
}

export const INSTAGRAM_STRATEGIES: PublishingStrategy[] = [
  {
    id: "instagram-api",
    name: "🥇 API Oficial (Meta)",
    description: "Automação total via Meta Graph API. Requer conta Business e app aprovado.",
    cost: "paid",
    platform: "instagram",
    method: "api",
    riskLevel: "low",
    requiresConfiguration: true,
    dailyLimit: "Ilimitado",
  },
  {
    id: "instagram-browser",
    name: "🥈 Automação Navegador",
    description: "Publica automaticamente via navegador. Use com moderação.",
    cost: "free",
    platform: "instagram",
    method: "browser",
    riskLevel: "medium",
    requiresConfiguration: true,
    dailyLimit: "~50 posts/dia",
  },
  {
    id: "instagram-manual",
    name: "🥉 Modo Manual",
    description: "Gera conteúdo pronto para copiar e colar. 100% seguro.",
    cost: "free",
    platform: "instagram",
    method: "manual",
    riskLevel: "none",
    requiresConfiguration: false,
    dailyLimit: "Ilimitado (manual)",
  },
];

export const WHATSAPP_STRATEGIES: PublishingStrategy[] = [
  {
    id: "whatsapp-api",
    name: "🥇 WhatsApp Business API",
    description: "Envio automático oficial via Twilio/360dialog. Requer conta Business.",
    cost: "paid",
    platform: "whatsapp",
    method: "api",
    riskLevel: "low",
    requiresConfiguration: true,
    dailyLimit: "Ilimitado",
  },
  {
    id: "whatsapp-browser",
    name: "🥈 WhatsApp Web",
    description: "Envio automático via WhatsApp Web. Funciona com grupos.",
    cost: "free",
    platform: "whatsapp",
    method: "browser",
    riskLevel: "medium",
    requiresConfiguration: true,
    dailyLimit: "~30 msgs/dia",
  },
  {
    id: "whatsapp-manual",
    name: "🥉 Modo Manual",
    description: "Gera link pré-preenchido para envio manual. Sem risco.",
    cost: "free",
    platform: "whatsapp",
    method: "manual",
    riskLevel: "none",
    requiresConfiguration: false,
    dailyLimit: "Ilimitado (manual)",
  },
];

export interface UserPublishingConfig {
  instagramStrategy: string;
  whatsappStrategy: string;
  syncFrequency: number; // minutes, 0 = disabled
}

export const DEFAULT_PUBLISHING_CONFIG: UserPublishingConfig = {
  instagramStrategy: "instagram-manual",
  whatsappStrategy: "whatsapp-manual",
  syncFrequency: 30,
};
