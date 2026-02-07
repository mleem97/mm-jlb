"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

/**
 * Small online/offline indicator badge.
 * Uses navigator.onLine + event listeners to track connectivity.
 */
export function OnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
        isOnline
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      }`}
      role="status"
      aria-live="polite"
      aria-label={isOnline ? "Online" : "Offline"}
    >
      {isOnline ? (
        <>
          <Wifi className="h-3 w-3" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>Offline</span>
        </>
      )}
    </div>
  );
}
