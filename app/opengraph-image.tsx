import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Job Letter Builder von Meyer Media";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #2E3440 0%, #434C5E 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 80,
              height: 80,
              background: "linear-gradient(135deg, #5B6DEE, #87CEEB)",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
            }}
          >
            📝
          </div>
          <div style={{ color: "white" }}>
            <h1 style={{ fontSize: 72, margin: 0 }}>Job Letter Builder</h1>
            <p style={{ fontSize: 32, margin: 0, color: "#D8DEE9" }}>
              Professionelle Bewerbungen in Minuten
            </p>
          </div>
        </div>
        <p style={{ color: "#88C0D0", fontSize: 24, marginTop: 40 }}>
          Meyer Media – Open Source & Datenschutz-freundlich
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
