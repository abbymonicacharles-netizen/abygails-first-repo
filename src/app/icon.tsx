import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a1a",
          fontSize: 14,
          fontWeight: 600,
          color: "#f7f3ed",
          letterSpacing: 1,
        }}
      >
        AC
      </div>
    ),
    { ...size }
  );
}
