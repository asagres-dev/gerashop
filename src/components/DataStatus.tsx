import { Cloud, CloudOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { dataService } from "@/lib/services/dataService";
import { useAuth } from "@/contexts/AuthContext";

export default function DataStatus() {
  const { user } = useAuth();
  const [status, setStatus] = useState<"checking" | "connected" | "demo">("checking");

  useEffect(() => {
    dataService.checkConnection().then((ready) => {
      setStatus(ready && user ? "connected" : "demo");
    });
  }, [user]);

  if (status === "checking") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Verificando conexão...</span>
      </div>
    );
  }

  if (status === "connected") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs">
        <Cloud className="w-3 h-3" />
        <span>Dados na nuvem</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/10 text-warning text-xs">
      <CloudOff className="w-3 h-3" />
      <span>Modo demo — dados locais</span>
    </div>
  );
}
