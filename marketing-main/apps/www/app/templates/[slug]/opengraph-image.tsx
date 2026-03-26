import { ImageResponse } from "@vercel/og";
import { API_URL, type GameProduct } from "../data";

export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  let game: GameProduct | undefined;

  try {
    const res = await fetch(`${API_URL}/sanpham-game`, { cache: "no-store" });
    if (res.ok) {
      const games: GameProduct[] = await res.json();
      game = games.find((g) => g.id.toString() === resolvedParams.slug);
    }
  } catch (error) {
    console.error("Failed to fetch game data for OG Image", error);
  }

  if (!game) {
    return new ImageResponse(
      <div
        style={{
          fontSize: 60,
          background: "linear-gradient(90deg, #000 0%, #111 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        Server Not Found
      </div>,
      { ...size },
    );
  }

  const shortContent = game.content
    ? game.content.length > 120
      ? game.content.substring(0, 120) + "..."
      : game.content
    : "Hệ thống vận hành Server Game chuyên nghiệp từ Vietcod.";

  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(game.price);

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 80,
        backgroundColor: "#030303",
        fontWeight: 600,
        color: "white",
      }}
    >
      <h1
        style={{
          fontSize: 72,
          margin: "0 0 35px -2px",
          padding: "0 0 5px 0",
          lineHeight: 1.1,
          textShadow: "0 2px 30px #000",
          letterSpacing: -2,
          backgroundImage: "linear-gradient(90deg, #3CEEAE 0%, #ffffff 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          color: "transparent",
          textAlign: "left",
        }}
      >
        {game.name}
      </h1>
      <p
        style={{
          fontSize: 28,
          margin: "0 0 35px -2px",
          padding: "0 0 5px 0",
          lineHeight: 1.4,
          color: "#A1A1AA",
          textAlign: "left",
          maxWidth: "900px",
        }}
      >
        {shortContent}
      </p>

      <div
        style={{
          position: "absolute",
          bottom: 70,
          left: 80,
          margin: 0,
          fontSize: 24,
          letterSpacing: -1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "calc(100% - 160px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <p style={{ color: "#3CEEAE", margin: 0 }}>Vietcod Technology</p>
          <p style={{ color: "#56534E", margin: 0 }}>|</p>
          <p style={{ color: "white", margin: 0, textTransform: "uppercase" }}>
            {game.category}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <p style={{ color: "white", margin: 0, fontWeight: "bold" }}>
            {formattedPrice}
          </p>
        </div>
      </div>
    </div>,
    { ...size },
  );
}
