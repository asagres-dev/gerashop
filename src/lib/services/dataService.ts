import { supabase } from "@/integrations/supabase/client";
import { Offer } from "@/components/OffersPage";
import { OfertashopOffer } from "@/lib/integrations/ofertashop";

const db = supabase as any;

function dbToOffer(row: any): Offer {
  return {
    id: row.id,
    name: row.name,
    platform: row.platform as Offer["platform"],
    category: row.category || "Geral",
    originalPrice: Number(row.original_price),
    promoPrice: Number(row.promotional_price),
    link: row.affiliate_link,
    imageUrl: row.image_url || "",
    expiry: row.expiration_date ? new Date(row.expiration_date).toISOString().split("T")[0] : "",
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

export interface OfferFilters {
  platform?: string;
  status?: string;
  search?: string;
}

class DataService {
  private static instance: DataService;

  static getInstance() {
    if (!DataService.instance) DataService.instance = new DataService();
    return DataService.instance;
  }

  // ============ OFERTAS ============
  async getOffers(userId?: string, filters?: OfferFilters): Promise<Offer[]> {
    if (!userId) return [];
    let query = db.from("offers").select("*").order("created_at", { ascending: false });
    if (filters?.platform) query = query.eq("platform", filters.platform);
    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.search) query = query.ilike("name", `%${filters.search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(dbToOffer);
  }

  async getOfferById(id: string): Promise<Offer | null> {
    const { data, error } = await db.from("offers").select("*").eq("id", id).single();
    if (error) return null;
    return dbToOffer(data);
  }

  async createOffer(offer: Partial<Offer>, userId: string): Promise<Offer> {
    const { data, error } = await db.from("offers").insert([offerToDb(offer, userId)]).select().single();
    if (error) throw error;
    return dbToOffer(data);
  }

  async updateOffer(id: string, updates: Record<string, any>): Promise<Offer> {
    const { data, error } = await db.from("offers").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) throw error;
    return dbToOffer(data);
  }

  async deleteOffer(id: string): Promise<void> {
    const { error } = await db.from("offers").delete().eq("id", id);
    if (error) throw error;
  }

  // ============ CONTEÚDOS ============
  async getContentsByOffer(offerId: string) {
    const { data, error } = await db.from("contents").select("*").eq("offer_id", offerId).order("version", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async saveContent(content: any, userId: string) {
    const { data, error } = await db.from("contents").insert([{
      offer_id: content.offerId || content.offer_id || null,
      type: content.type,
      format: content.format || "TEXT",
      text: content.text,
      hashtags: content.hashtags || [],
      tone_of_voice: content.tone || content.tone_of_voice,
      cta: content.cta || null,
      user_id: userId,
    }]).select().single();
    if (error) throw error;
    return data;
  }

  // ============ AGENDAMENTOS ============
  async getScheduledPosts(userId?: string) {
    if (!userId) return [];
    const { data, error } = await db.from("scheduled_posts").select("*").order("scheduled_date", { ascending: true });
    if (error) throw error;
    return (data || []).map((row: any) => ({
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
    const { data, error } = await db.from("scheduled_posts").insert([{
      offer_name: post.offerName,
      content_type: post.contentType,
      channel: post.channel,
      scheduled_date: new Date(post.date).toISOString(),
      scheduled_time: post.time,
      status: "SCHEDULED",
      caption: post.caption,
      platform: post.platform,
      user_id: userId,
    }]).select().single();
    if (error) throw error;
    return data;
  }

  async updateScheduledPost(id: string, updates: Record<string, any>) {
    const { data, error } = await db.from("scheduled_posts").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }

  async deleteScheduledPost(id: string) {
    const { error } = await db.from("scheduled_posts").delete().eq("id", id);
    if (error) throw error;
  }

  // ============ SYNC MANUAL ============
  async syncOfferManually(id: string, externalData: OfertashopOffer): Promise<Offer> {
    return this.updateOffer(id, {
      promotional_price: externalData.promotional_price,
      original_price: externalData.original_price,
      stock: externalData.stock,
      name: externalData.name,
      category: externalData.category,
      affiliate_link: externalData.affiliate_link,
      image_url: externalData.image_url,
      expiration_date: externalData.expiration_date ? new Date(externalData.expiration_date).toISOString() : null,
      last_sync: new Date().toISOString(),
    });
  }

  async bulkCreateOrUpdateOffers(offers: OfertashopOffer[], userId?: string): Promise<void> {
    if (!offers || offers.length === 0) return;
    
    // We try to find the active user ID if not provided. In background jobs, there might not be a current session.
    // Ensure we handle data properly. Since it's bulk, it requires the user_id for the RLS/DB mapping if needed.
    let activeUserId = userId;
    if (!activeUserId) {
       const { data } = await supabase.auth.getUser();
       activeUserId = data?.user?.id;
    }

    const rows = offers.map(offer => ({
      external_id: offer.external_id,
      name: offer.name,
      platform: offer.platform,
      category: offer.category || "Geral",
      original_price: offer.original_price,
      promotional_price: offer.promotional_price,
      discount: offer.discount_percentage || (offer.original_price && offer.promotional_price
        ? Math.round(((offer.original_price - offer.promotional_price) / offer.original_price) * 100)
        : 0),
      affiliate_link: offer.affiliate_link,
      image_url: offer.image_url || "",
      expiration_date: offer.expiration_date ? new Date(offer.expiration_date).toISOString() : null,
      stock: offer.stock,
      status: "ACTIVE",
      user_id: activeUserId,
      last_sync: new Date().toISOString()
    }));

    const { error } = await db.from("offers").upsert(rows, { onConflict: "external_id" });
    if (error) {
      console.error("Erro no bulk import de ofertas:", error);
    }
  }

  // ============ CONFIGURAÇÕES ============
  async getUserSettings(userId: string) {
    const { data } = await db.from("user_settings").select("*").eq("user_id", userId).single();
    return data;
  }

  async updateUserSettings(userId: string, updates: any) {
    await db.from("user_settings").update({ ...updates, updated_at: new Date().toISOString() }).eq("user_id", userId);
  }

  // ============ ANALYTICS ============
  async getAnalytics(userId: string, startDate?: string, endDate?: string) {
    let query = db.from("analytics").select("*").eq("user_id", userId);
    if (startDate) query = query.gte("date", startDate);
    if (endDate) query = query.lte("date", endDate);
    const { data, error } = await query.order("date", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  // ============ IMAGE UPLOAD ============
  async uploadOfferImage(userId: string, file: File, offerId: string): Promise<string> {
    const fileExt = file.name.split(".").pop() || "jpg";
    const filePath = `${userId}/${offerId}_${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from("offer-images").upload(filePath, file, { cacheControl: "3600", upsert: true });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from("offer-images").getPublicUrl(filePath);
    return publicUrl;
  }

  async importImageFromUrl(userId: string, imageUrl: string, offerId: string): Promise<string> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const fileExt = imageUrl.split(".").pop()?.split("?")[0] || "jpg";
    const file = new File([blob], `${offerId}.${fileExt}`, { type: blob.type });
    return this.uploadOfferImage(userId, file, offerId);
  }
}

export const dataService = DataService.getInstance();
