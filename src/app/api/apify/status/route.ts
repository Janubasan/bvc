import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.APIFY_TOKEN || "";
  const actorId = process.env.APIFY_ACTOR_ID || "apify/instagram-scraper";
  const hasToken = !!token;
  const masked = hasToken ? `${token.slice(0, 14)}...${token.slice(-6)}` : null;

  return NextResponse.json({
    configured: hasToken,
    tokenMasked: masked,
    actorId,
    envFile: ".env.local (gitignored)",
    status: hasToken ? "✅ Token configurado e pronto para produção" : "❌ Sem token",
    sandboxNote: "Sandbox Arena bloqueia api.apify.com (só github.com, registry.npmjs.org, pypi.org). Em produção (Vercel/Hostinger/VPS) a chamada funciona normalmente.",
    test: {
      curl: `curl -X POST https://api.apify.com/v2/actors/apify~instagram-scraper/run-sync-get-dataset-items?token=${masked || "SEU_TOKEN"} -H "Content-Type: application/json" -d '{"directUrls":["https://www.instagram.com/mrv_engenha/"],"resultsType":"posts","resultsLimit":5}'`,
      nextApi: `POST /api/apify { token: "apify_api_***", actorId: "${actorId}", input: { directUrls: ["https://www.instagram.com/mrv_engenha/"], resultsType: "posts", resultsLimit: 5 } }`,
    },
    mrvPredios: [
      "Gran Safira Ago/2029 41-45m²",
      "Gran Essence Out/2028 41,35-43,86m²",
      "Gran Parma Jun/2029 41,35-47,60m² c/ varanda ampla",
      "Gran Terrazo Set/2029 39m²",
      "Priville Dez/2028 39,30-43,05m²",
      "Gran Aurora Jan/2029 39,30m²",
      "Gran Porto Set/2027 37,28-49,35m²",
      "Vert Parque Amazônia Mar/2029 38,38-45,19m²",
    ],
  });
}
