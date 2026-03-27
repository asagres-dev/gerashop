export interface OfertashopConfig {
  apiUrl: string;
  apiKey: string;
  webhookSecret: string;
  isEnabled: boolean;
  lastSync: string | null;
}

export const DEFAULT_OFERTASHOP_CONFIG: OfertashopConfig = {
  apiUrl: "",
  apiKey: "",
  webhookSecret: "",
  isEnabled: false,
  lastSync: null,
};

export class OfertashopClient {
  private config: OfertashopConfig;

  constructor(config?: OfertashopConfig) {
    this.config = config || DEFAULT_OFERTASHOP_CONFIG;
  }

  isReady(): boolean {
    return this.config.isEnabled && !!this.config.apiUrl && !!this.config.apiKey;
  }

  getConfig() { return this.config; }

  async activate(config: Partial<OfertashopConfig>) {
    this.config = { ...this.config, ...config, isEnabled: true };
    return this.config;
  }

  deactivate() {
    this.config.isEnabled = false;
    return this.config;
  }

  async syncOffers(): Promise<any[]> {
    if (!this.isReady()) throw new Error("API do Ofertashop não configurada");
    // Future implementation - when API is available
    // const response = await fetch(`${this.config.apiUrl}/offers`, {
    //   headers: { Authorization: `Bearer ${this.config.apiKey}` },
    // });
    // return response.json();
    return [];
  }
}

export const ofertashopClient = new OfertashopClient();
