/**
 * Formats a Date as a relative time string in German.
 * E.g., "vor 3 Sek.", "vor 2 Min.", "vor 1 Std."
 */
export function formatRelativeTime(date: Date | null | undefined): string {
  if (!date) return "";

  const now = Date.now();
  const then = date instanceof Date ? date.getTime() : new Date(date).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return "gerade eben";

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 5) return "gerade eben";
  if (seconds < 60) return `vor ${seconds} Sek.`;
  if (minutes < 60) return `vor ${minutes} Min.`;
  if (hours < 24) return `vor ${hours} Std.`;
  return `vor ${days} Tag${days !== 1 ? "en" : ""}`;
}
