import { dataService } from "./dataService";
import { ofertashopClient } from "@/lib/integrations/ofertashop";

export class AutoSyncService {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isRunning = false;

  start(intervalMinutes: number = 30) {
    if (this.intervalId) return;

    this.intervalId = setInterval(async () => {
      await this.syncAll();
    }, intervalMinutes * 60 * 1000);

    console.log(`🔄 Sincronização automática iniciada (a cada ${intervalMinutes} minutos)`);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("🛑 Sincronização automática parada");
    }
  }

  isActive() {
    return this.intervalId !== null;
  }

  async syncAll() {
    if (this.isRunning) return;
    if (!ofertashopClient.isReady()) return;

    this.isRunning = true;

    try {
      console.log("🔄 Iniciando sincronização automática...");

      // Future: when Ofertashop API is available, sync active offers
      if (ofertashopClient.isReady()) {
        const offers = await ofertashopClient.getOffers({ limit: 50 });
        console.log(`✅ Sincronização concluída: ${offers.length} ofertas verificadas`);
      }
    } catch (error) {
      console.error("Erro na sincronização automática:", error);
    } finally {
      this.isRunning = false;
    }
  }
}

export const autoSyncService = new AutoSyncService();
