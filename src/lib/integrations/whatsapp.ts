// WhatsApp Business API Integration - PREPARED BUT DISABLED
// Requires: Twilio account + WhatsApp Business verified number

export interface WhatsAppConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  isEnabled: boolean;
}

export const DEFAULT_WHATSAPP_CONFIG: WhatsAppConfig = {
  accountSid: "",
  authToken: "",
  phoneNumber: "",
  isEnabled: false,
};

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  status?: string;
  sentAt?: Date;
  error?: string;
}

export class WhatsAppClient {
  private config: WhatsAppConfig;

  constructor(config?: WhatsAppConfig) {
    this.config = config || DEFAULT_WHATSAPP_CONFIG;
  }

  isReady(): boolean {
    return this.config.isEnabled && !!this.config.accountSid && !!this.config.authToken && !!this.config.phoneNumber;
  }

  getConfig() {
    return this.config;
  }

  async activate(config: Partial<WhatsAppConfig>) {
    this.config = { ...this.config, ...config, isEnabled: true };
    return this.config;
  }

  deactivate() {
    this.config.isEnabled = false;
    return this.config;
  }

  // Future: Send text message
  async sendTextMessage(_to: string, _message: string): Promise<WhatsAppSendResult> {
    if (!this.isReady()) throw new Error("WhatsApp Business não configurado");
    return { success: false, error: "Integração em preparação" };
  }

  // Future: Send media message
  async sendMediaMessage(_to: string, _mediaUrl: string, _caption?: string): Promise<WhatsAppSendResult> {
    if (!this.isReady()) throw new Error("WhatsApp Business não configurado");
    return { success: false, error: "Integração em preparação" };
  }

  // Future: Send to group
  async sendToGroup(_groupId: string, _message: string): Promise<WhatsAppSendResult> {
    if (!this.isReady()) throw new Error("WhatsApp Business não configurado");
    return { success: false, error: "Integração em preparação" };
  }
}

export const whatsappClient = new WhatsAppClient();
