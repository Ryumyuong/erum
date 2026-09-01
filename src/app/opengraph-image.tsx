import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "BOXDLE — Custom Packaging Manufacturer";
export const contentType = "image/png";

// Square (not 1200x630): messengers such as KakaoTalk / Telegram render a small
// right-aligned thumbnail card for square logo-style images instead of a large
// banner. Pairs with twitter card "summary" in layout.tsx.
export const size = { width: 600, height: 600 };

export default async function Image() {
  const logo = await readFile(
    path.join(process.cwd(), "public/logo/iiroom-en.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={420} height={172} />
      </div>
    ),
    size,
  );
}
