import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <WifiOff className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-3">Du bist offline</h1>
        <p className="text-muted-foreground mb-6">
          Keine Internetverbindung verfügbar. Deine Daten sind sicher lokal gespeichert
          und werden nicht verloren gehen.
        </p>
        <p className="text-sm text-muted-foreground">
          Verbinde dich mit dem Internet, um die volle Funktionalität zu nutzen.
        </p>
      </div>
    </div>
  );
}
