export interface OfertashopConfig {
  apiUrl: string;
  apiKey: string;
  webhookSecret: string;
  isEnabled: boolean;
  lastSync: string | null;
  syncFrequency: number; // minutes, 0 = disabled
}

export const DEFAULT_OFERTASHOP_CONFIG: OfertashopConfig = {
  apiUrl: "",
  apiKey: "",
  webhookSecret: "",
  isEnabled: false,
  lastSync: null,
  syncFrequency: 30,
};

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  offersCount?: number;
}

export interface OfertashopOffer {
  external_id: string;
  name: string;
  platform: string;
  category?: string;
  original_price: number;
  promotional_price: number;
  discount_percentage?: number;
  affiliate_link: string;
  image_url?: string;
  description?: string;
  tags?: string[];
  stock?: number;
  expiration_date?: string;
}

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

  async testConnection(): Promise<ConnectionTestResult> {
    if (!this.config.apiUrl || !this.config.apiKey) {
      return { success: false, message: "URL da API e Chave são obrigatórias." };
    }
    try {
      const response = await fetch(`${this.config.apiUrl}/health`, {
        headers: { "X-API-Key": this.config.apiKey },
        signal: AbortSignal.timeout(10000),
      });
      if (response.ok) {
        return { success: true, message: "Conexão estabelecida com sucesso!" };
      }
      if (response.status === 401 || response.status === 403) {
        return { success: false, message: "Credenciais inválidas. Verifique sua API Key." };
      }
      return { success: false, message: `Erro HTTP ${response.status}` };
    } catch (err: any) {
      if (err.name === "TimeoutError" || err.name === "AbortError") {
        return { success: false, message: "Timeout — servidor não respondeu em 10s." };
      }
      return { success: false, message: `Erro de conexão: ${err.message}` };
    }
  }

  async getOffers(params?: { page?: number; limit?: number; category?: string }): Promise<OfertashopOffer[]> {
    if (!this.isReady()) throw new Error("API do Ofertashop não configurada");
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    if (params?.category) query.append("category", params.category);

    const response = await fetch(`${this.config.apiUrl}/offers?${query}`, {
      headers: { "X-API-Key": this.config.apiKey },
    });
    if (!response.ok) throw new Error(`Erro ao buscar ofertas: HTTP ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  }

  async getUpdatedOffers(since: Date): Promise<OfertashopOffer[]> {
    if (!this.isReady()) throw new Error("API do Ofertashop não configurada");
    const response = await fetch(`${this.config.apiUrl}/offers/updated?since=${since.toISOString()}`, {
      headers: { "X-API-Key": this.config.apiKey },
    });
    if (!response.ok) throw new Error(`Erro ao buscar atualizações: HTTP ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  }
}

export const ofertashopClient = new OfertashopClient();
