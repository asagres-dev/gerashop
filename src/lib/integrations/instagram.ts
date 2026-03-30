// Instagram Graph API Integration - PREPARED BUT DISABLED
// Requires: Instagram Business/Creator account + Facebook Page

export interface InstagramConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  accessToken: string;
  instagramBusinessId: string;
  isEnabled: boolean;
  expiresAt: string | null;
}

export const DEFAULT_INSTAGRAM_CONFIG: InstagramConfig = {
  clientId: "",
  clientSecret: "",
  redirectUri: "",
  accessToken: "",
  instagramBusinessId: "",
  isEnabled: false,
  expiresAt: null,
};

export interface InstagramPublishResult {
  success: boolean;
  mediaId?: string;
  permalink?: string;
  publishedAt?: Date;
  error?: string;
}

export class InstagramClient {
  private config: InstagramConfig;

  constructor(config?: InstagramConfig) {
    this.config = config || DEFAULT_INSTAGRAM_CONFIG;
  }

  isReady(): boolean {
    return this.config.isEnabled && !!this.config.accessToken && !!this.config.instagramBusinessId;
  }

  getConfig() {
    return this.config;
  }

  async activate(config: Partial<InstagramConfig>) {
    this.config = { ...this.config, ...config, isEnabled: true };
    return this.config;
  }

  deactivate() {
    this.config.isEnabled = false;
    return this.config;
  }

  // Future: Publish feed post
  async publishFeed(_imageUrl: string, _caption: string): Promise<InstagramPublishResult> {
    if (!this.isReady()) throw new Error("Instagram não configurado");
    // Will use Instagram Graph API when available
    return { success: false, error: "Integração em preparação" };
  }

  // Future: Publish reels
  async publishReel(_videoUrl: string, _caption: string): Promise<InstagramPublishResult> {
    if (!this.isReady()) throw new Error("Instagram não configurado");
    return { success: false, error: "Integração em preparação" };
  }

  // Future: Publish story
  async publishStory(_imageUrl: string): Promise<InstagramPublishResult> {
    if (!this.isReady()) throw new Error("Instagram não configurado");
    return { success: false, error: "Integração em preparação" };
  }
}

export const instagramClient = new InstagramClient();
