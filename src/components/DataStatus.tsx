import { Cloud } from "lucide-react";

export default function DataStatus() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs">
      <Cloud className="w-3 h-3" />
      <span>Dados na nuvem</span>
    </div>
  );
}
