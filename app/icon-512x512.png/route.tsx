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
          background: "linear-gradient(135deg, #2E3440 0%, #434C5E 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            width: 320,
            height: 320,
            background: "linear-gradient(135deg, #5B6DEE, #87CEEB)",
            borderRadius: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 180,
          }}
        >
          📝
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
