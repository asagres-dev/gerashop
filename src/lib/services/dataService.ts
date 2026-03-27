import { supabase } from "@/integrations/supabase/client";
import { mockOffers, mockScheduledPosts } from "@/lib/mocks";
import { Offer } from "@/components/OffersPage";

// Maps DB row to frontend Offer type
function dbToOffer(row: any): Offer {
  return {
    id: row.id,
    name: row.name,
    platform: row.platform as Offer["platform"],
    category: row.category || "Geral",
    originalPrice: Number(row.original_price),
    promoPrice: Number(row.promotional_price),
    link: row.affiliate_link,
    imageUrl: row.image_url || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=120&h=120&fit=crop",
    expiry: row.expiration_date ? new Date(row.expiration_date).toISOString().split("T")[0] : "2026-12-31",
    clicks: row.clicks || 0,
    commission: Number(row.commission) || 0,
    status: row.status === "ACTIVE" ? "Ativa" : row.status === "EXPIRED" ? "Expirada" : "Agendada",
  };
}

function offerToDb(offer: Partial<Offer>, userId: string) {
  return {
    name: offer.name!,
    platform: offer.platform!,
    category: offer.category || "Geral",
    original_price: offer.originalPrice!,
    promotional_price: offer.promoPrice!,
    discount: offer.originalPrice && offer.promoPrice
      ? Math.round(((offer.originalPrice - offer.promoPrice) / offer.originalPrice) * 100)
      : 0,
    affiliate_link: offer.link!,
    image_url: offer.imageUrl || "",
    expiration_date: offer.expiry ? new Date(offer.expiry).toISOString() : null,
    status: offer.status === "Ativa" ? "ACTIVE" : offer.status === "Expirada" ? "EXPIRED" : "SCHEDULED",
    user_id: userId,
  };
}

class DataService {
  private static instance: DataService;
  private _isReady = false;
  private _checked = false;

  static getInstance() {
    if (!DataService.instance) DataService.instance = new DataService();
    return DataService.instance;
  }

  async checkConnection(): Promise<boolean> {
    if (this._checked) return this._isReady;
    try {
      const { error } = await supabase.from("offers").select("id").limit(1);
      this._isReady = !error;
    } catch {
      this._isReady = false;
    }
    this._checked = true;
    return this._isReady;
  }

  get isReady() { return this._isReady; }

  // ---- OFFERS ----
  async getOffers(userId?: string): Promise<Offer[]> {
    if (!(await this.checkConnection()) || !userId) return mockOffers;
    const { data, error } = await supabase
      .from("offers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data?.length) return mockOffers;
    return data.map(dbToOffer);
  }

  async createOffer(offer: Partial<Offer>, userId: string): Promise<Offer> {
    if (!this._isReady) {
      const newOffer = { ...offer, id: `mock_${Date.now()}` } as Offer;
      return newOffer;
    }
    const { data, error } = await supabase
      .from("offers")
      .insert([offerToDb(offer, userId)] as any)
      .select()
      .single();
    if (error) throw error;
    return dbToOffer(data);
  }

  async deleteOffer(id: string): Promise<void> {
    if (!this._isReady) return;
    const { error } = await supabase.from("offers").delete().eq("id", id);
    if (error) throw error;
  }

  // ---- SCHEDULED POSTS ----
  async getScheduledPosts(userId?: string) {
    if (!(await this.checkConnection()) || !userId) return mockScheduledPosts;
    const { data, error } = await supabase
      .from("scheduled_posts")
      .select("*")
      .order("scheduled_date", { ascending: true });
    if (error || !data?.length) return mockScheduledPosts;
    return data.map((row: any) => ({
      id: row.id,
      offerName: row.offer_name || "",
      contentType: row.content_type || "Feed",
      channel: row.channel,
      date: new Date(row.scheduled_date),
      time: row.scheduled_time || "19:00",
      status: row.status?.toLowerCase() || "scheduled",
      caption: row.caption,
      platform: row.platform || "",
    }));
  }

  async createScheduledPost(post: any, userId: string) {
    if (!this._isReady) return { ...post, id: `mock_${Date.now()}` };
    const { data, error } = await supabase
      .from("scheduled_posts")
      .insert([{
        offer_name: post.offerName,
        content_type: post.contentType,
        channel: post.channel,
        scheduled_date: new Date(post.date).toISOString(),
        scheduled_time: post.time,
        status: "SCHEDULED",
        caption: post.caption,
        platform: post.platform,
        user_id: userId,
      }] as any)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async deleteScheduledPost(id: string) {
    if (!this._isReady) return;
    await supabase.from("scheduled_posts").delete().eq("id", id);
  }

  // ---- CONTENTS ----
  async saveContent(content: any, userId: string) {
    if (!this._isReady) return;
    await supabase.from("contents").insert([{
      offer_id: content.offerId || null,
      type: content.type,
      format: content.format || "TEXT",
      text: content.text,
      hashtags: content.hashtags || [],
      tone_of_voice: content.tone,
      user_id: userId,
    }] as any);
  }

  // ---- USER SETTINGS ----
  async getUserSettings(userId: string) {
    if (!this._isReady) return null;
    const { data } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single();
    return data;
  }

  async updateUserSettings(userId: string, updates: any) {
    if (!this._isReady) return;
    await supabase
      .from("user_settings")
      .update({ ...updates, updated_at: new Date().toISOString() } as any)
      .eq("user_id", userId);
  }
}

export const dataService = DataService.getInstance();
