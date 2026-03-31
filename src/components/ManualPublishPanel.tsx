import { useState } from "react";
import { Copy, Check, Download, ExternalLink, Instagram, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ManualPublishPanelProps {
  platform: "instagram" | "whatsapp";
  caption?: string;
  message?: string;
  imageUrl?: string;
  whatsappGroupLink?: string;
}

export default function ManualPublishPanel({ platform, caption, message, imageUrl, whatsappGroupLink }: ManualPublishPanelProps) {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const { toast } = useToast();

  const copyText = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    toast({ title: "Copiado!", description: "Texto copiado para a área de transferência." });
    setTimeout(() => setter(false), 2000);
  };

  if (platform === "instagram") {
    return (
      <div className="rounded-2xl border border-border p-5 space-y-4" style={{ background: "hsl(var(--card))" }}>
        <div className="flex items-center gap-2 mb-1">
          <Instagram className="w-5 h-5 text-pink-500" />
          <h3 className="font-display font-semibold text-foreground">📋 Publicação Manual — Instagram</h3>
        </div>

        {caption && (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-medium">Legenda</label>
            <textarea
              readOnly
              value={caption}
              className="w-full p-3 border border-border rounded-xl bg-muted text-sm text-foreground resize-none"
              rows={5}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyText(caption, setCopiedCaption)}
              className="w-full"
            >
              {copiedCaption ? <><Check className="w-3.5 h-3.5 mr-1 text-success" /> Copiado!</> : <><Copy className="w-3.5 h-3.5 mr-1" /> Copiar legenda</>}
            </Button>
          </div>
        )}

        {imageUrl && (
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground font-medium">Imagem</label>
            <img src={imageUrl} alt="Preview" className="w-full max-h-48 object-contain rounded-xl border border-border" />
            <a
              href={imageUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Download className="w-3.5 h-3.5" /> Baixar imagem
            </a>
          </div>
        )}

        <div className="rounded-xl bg-success/5 border border-success/20 p-3">
          <p className="text-xs text-success">
            ✅ Agora é só abrir o Instagram, criar um novo post, colar a legenda e enviar!
          </p>
        </div>
      </div>
    );
  }

  // WhatsApp
  const encodedMsg = message ? encodeURIComponent(message) : "";
  const waLink = whatsappGroupLink || `https://wa.me/?text=${encodedMsg}`;

  return (
    <div className="rounded-2xl border border-border p-5 space-y-4" style={{ background: "hsl(var(--card))" }}>
      <div className="flex items-center gap-2 mb-1">
        <MessageCircle className="w-5 h-5 text-green-500" />
        <h3 className="font-display font-semibold text-foreground">📋 Publicação Manual — WhatsApp</h3>
      </div>

      {message && (
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-medium">Mensagem</label>
          <textarea
            readOnly
            value={message}
            className="w-full p-3 border border-border rounded-xl bg-muted text-sm text-foreground resize-none"
            rows={5}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyText(message, setCopiedMessage)}
            className="w-full"
          >
            {copiedMessage ? <><Check className="w-3.5 h-3.5 mr-1 text-success" /> Copiado!</> : <><Copy className="w-3.5 h-3.5 mr-1" /> Copiar mensagem</>}
          </Button>
        </div>
      )}

      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-colors"
      >
        <ExternalLink className="w-4 h-4" /> 📱 Abrir WhatsApp
      </a>
    </div>
  );
}
