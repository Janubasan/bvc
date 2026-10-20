import { NextResponse } from "next/server";

// POST /api/apify  -> roda Apify Instagram Scraper de verdade se tiver token, senão mock
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { token, actorId = "apify/instagram-scraper", input = {}, sync = true } = body;

  if (!token) {
    // Mock mode - devolve dados simulados mas com estrutura real Apify
    return NextResponse.json({
      mode: "mock",
      message: "Sem token Apify — retornando mock com estrutura real. Adicione APIFY_TOKEN em .env para rodar de verdade.",
      actorId,
      inputUsed: input,
      docs: {
        runUrl: `https://api.apify.com/v2/actors/${actorId.replace("/", "~")}/runs?token=SEU_TOKEN`,
        syncUrl: `https://api.apify.com/v2/actors/${actorId.replace("/", "~")}/run-sync-get-dataset-items?token=SEU_TOKEN`,
        actorsRecomendados: [
          { id: "apify/instagram-scraper", desc: "Posts por hashtag/directUrls, 100 resultsLimit, searchType hashtag", custo: "$2.30/1k Starter" },
          { id: "apify/instagram-profile-scraper", desc: "Perfis completos por username, skipPosts opcional", custo: "$1.50/1k" },
          { id: "data_minds/instagram-scraper", desc: "Profiles+posts+comments, proxy Apify, details/posts", custo: "PAYG" },
          { id: "apify/instagram-hashtag-scraper", desc: "Hashtag posts dedicados", custo: "$2.60/1k Free" },
        ],
      },
      mockDataset: [
        { username: "mrv_engenha", fullName: "MRV Engenharia GO", followersCount: 48200, biography: "MCMV em Goiânia 📲 62 9 9123-4567 | vendas@mrv.com.br", isPrivate: false, postsCount: 342, profilePicUrl: "" },
        { username: "dinamica_eng", fullName: "Dinâmica Engenharia", followersCount: 18700, biography: "Vila Romana MCMV | WhatsApp 62 99234-5678", isPrivate: false, postsCount: 128, profilePicUrl: "" },
        { type: "post", shortCode: "CwsgvUlLtEn", caption: "Alto da Boa Vista 70% vendido! Comente VALOR 👇", likesCount: 342, commentsCount: 89, ownerUsername: "vegaincorporacoes", timestamp: new Date().toISOString(), comments: [{ text: "valor? 62 99111-2222", ownerUsername: "ana.souza.go" }, { text: "parcelas? meu FGTS liberado!", ownerUsername: "carlos.lima.go" }] },
      ],
      nextSteps: [
        "1. Crie token em https://console.apify.com/account/integrations → API tokens → Copy",
        "2. Configure .env: APIFY_TOKEN=apify_api_xxx + APIFY_ACTOR_ID=apify/instagram-scraper",
        "3. POST para /api/apify com { token, actorId, input: { directUrls: ['https://www.instagram.com/mrvmrv_goiania/'], resultsType: 'posts', resultsLimit: 50 } }",
        "4. O harness BVC chama isso automaticamente a cada 6h",
      ],
    });
  }

  // Real mode - chama Apify API de verdade
  try {
    const encoded = actorId.replace("/", "~");
    const url = sync
      ? `https://api.apify.com/v2/actors/${encoded}/run-sync-get-dataset-items?token=${token}`
      : `https://api.apify.com/v2/actors/${encoded}/runs?token=${token}`;

    const apifyInput = Object.keys(input).length ? input : {
      directUrls: ["https://www.instagram.com/mrvmrv_goiania/"],
      resultsType: "posts",
      resultsLimit: 20,
      searchType: "hashtag",
      searchLimit: 10,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(apifyInput),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ ok: false, mode: "real", actorId, error: `Apify ${res.status}: ${text.slice(0, 800)}` }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({
      ok: true,
      mode: "real",
      actorId,
      apiUrl: url,
      items: Array.isArray(data) ? data.slice(0, 20) : data,
      count: Array.isArray(data) ? data.length : 1,
      tip: "Use run-sync-get-dataset-items para resposta imediata (até 60s). Para jobs longos, use /runs + polling + dataset.",
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, mode: "real", error: e.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Apify Integration • BVC Prospector",
    endpoint: "POST /api/apify",
    body: {
      token: "seu apify_api_xxx",
      actorId: "apify/instagram-scraper | apify/instagram-profile-scraper | data_minds/instagram-scraper",
      input: "{ directUrls: ['https://www.instagram.com/mrvmrv_goiania/'], resultsType: 'posts', resultsLimit: 50 }",
      sync: true,
    },
    env: "APIFY_TOKEN e APIFY_ACTOR_ID em .env",
    docs: "https://apify.com/apify/instagram-scraper/api",
  });
}
