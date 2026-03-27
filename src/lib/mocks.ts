import { Offer } from "@/components/OffersPage";

export const mockOffers: Offer[] = [
  { id: "mock-1", name: "Perfume Essencial Natura EDP", platform: "Natura", category: "Perfumaria", originalPrice: 299.90, promoPrice: 189.90, link: "https://natura.com.br/p/123", imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=120&h=120&fit=crop", expiry: "2026-05-30", clicks: 842, commission: 28.50, status: "Ativa" },
  { id: "mock-2", name: "Echo Dot 5ª Geração", platform: "Amazon", category: "Eletrônicos", originalPrice: 399.00, promoPrice: 249.00, link: "https://amzn.to/abc", imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&h=120&fit=crop", expiry: "2026-04-20", clicks: 1247, commission: 12.45, status: "Ativa" },
  { id: "mock-3", name: "Kit Cuidados Boticário", platform: "Mercado Livre", category: "Beleza", originalPrice: 180.00, promoPrice: 99.90, link: "https://produto.ml.com.br/123", imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=120&h=120&fit=crop", expiry: "2026-04-25", clicks: 523, commission: 9.99, status: "Ativa" },
  { id: "mock-4", name: "Tênis Nike Air Max 270", platform: "Shopee", category: "Moda", originalPrice: 650.00, promoPrice: 379.90, link: "https://shopee.com.br/p/456", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&h=120&fit=crop", expiry: "2026-05-01", clicks: 2104, commission: 37.99, status: "Ativa" },
  { id: "mock-5", name: "Fritadeira Air Fryer 4L", platform: "Amazon", category: "Casa", originalPrice: 450.00, promoPrice: 279.90, link: "https://amzn.to/xyz", imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=120&h=120&fit=crop", expiry: "2026-03-31", clicks: 389, commission: 13.99, status: "Expirada" },
  { id: "mock-6", name: "Perfume Natura Essencial Masculino", platform: "Natura", category: "Perfumaria", originalPrice: 199.90, promoPrice: 139.90, link: "https://natura.com.br/p/456", imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=120&h=120&fit=crop", expiry: "2026-06-15", clicks: 0, commission: 0, status: "Agendada" },
];

export const mockScheduledPosts = [
  { id: "sp-1", offerName: "Perfume Essencial Natura", contentType: "Feed", channel: "Instagram", date: new Date(), time: "19:30", status: "scheduled" as const, platform: "Natura" },
  { id: "sp-2", offerName: "Echo Dot 5ª Geração", contentType: "Story", channel: "Instagram", date: new Date(Date.now() + 86400000), time: "12:00", status: "scheduled" as const, platform: "Amazon" },
  { id: "sp-3", offerName: "Smart TV Samsung 55\"", contentType: "Reels", channel: "TikTok", date: new Date(Date.now() + 2 * 86400000), time: "20:00", status: "draft" as const, platform: "Amazon" },
  { id: "sp-4", offerName: "Kit Cuidados Boticário", contentType: "WhatsApp", channel: "WhatsApp", date: new Date(Date.now() - 86400000), time: "10:00", status: "published" as const, platform: "Mercado Livre" },
];
