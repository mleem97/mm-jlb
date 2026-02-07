import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#2E3440",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            width: 128,
            height: 128,
            background: "linear-gradient(135deg, #5B6DEE, #87CEEB)",
            borderRadius: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 64,
          }}
        >
          📝
        </div>
      </div>
    ),
    { width: 192, height: 192 }
  );
}
