import "server-only";

import { headers } from "next/headers";

export interface ActionAuthorization {
  host: string;
  origin: string;
}

/**
 * Authorize browser-initiated server actions in this account-free application.
 * The same-origin boundary prevents third-party sites from invoking SMTP actions
 * with attacker-controlled parameters.
 */
export async function auth(): Promise<ActionAuthorization> {
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const host = (forwardedHost ?? requestHeaders.get("host"))
    ?.split(",")[0]
    ?.trim();
  const source =
    requestHeaders.get("origin") ?? requestHeaders.get("referer");

  if (!host || !source) {
    throw new Error("Nicht autorisierte Server-Aktion");
  }

  let sourceUrl: URL;
  try {
    sourceUrl = new URL(source);
  } catch {
    throw new Error("Ungültiger Anfrage-Ursprung");
  }

  if (sourceUrl.host !== host) {
    throw new Error("Nicht autorisierter Anfrage-Ursprung");
  }

  const fetchSite = requestHeaders.get("sec-fetch-site");
  if (
    fetchSite &&
    !["same-origin", "same-site", "none"].includes(fetchSite)
  ) {
    throw new Error("Cross-Site-Server-Aktion abgelehnt");
  }

  return { host, origin: sourceUrl.origin };
}
