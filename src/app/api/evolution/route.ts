import { NextResponse } from "next/server";

// Evolution API WhatsApp - envia de verdade se tiver credenciais, senão mock com instruções
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { action = "sendText", number, text, serverUrl, apiKey, instanceName, options } = body;

  const envServer = process.env.EVOLUTION_SERVER_URL || serverUrl || "";
  const envKey = process.env.EVOLUTION_API_KEY || apiKey || "";
  const envInstance = process.env.EVOLUTION_INSTANCE_NAME || instanceName || "bvc-mcmv-go";

  // Mock se sem credenciais
  if (!envServer || !envKey) {
    return NextResponse.json({
      mode: "mock",
      message: "Sem credenciais Evolution — mock. Configure para envio real.",
      received: { action, number, text: text?.slice(0, 120), serverUrl: envServer || "(vazio)", instanceName: envInstance },
      setup: {
        "1. Suba Evolution API": "Docker Compose com Postgres + Redis + Evolution (ver docs). Use SetupOrion ou Railway: railway.com/deploy/evolution-api-n8n",
        "2. Env vars Evolution (.env)": "DATABASE_PROVIDER=postgresql\nDATABASE_CONNECTION_URI=postgresql://...\nAUTHENTICATION_API_KEY=sua_chave_forte\nCACHE_REDIS_ENABLED=true\nPORT=8080",
        "3. Env vars BVC (.env)": "EVOLUTION_SERVER_URL=https://api.seudominio.com\nEVOLUTION_API_KEY=sua_chave_forte\nEVOLUTION_INSTANCE_NAME=bvc-mcmv-go",
        "4. Crie instância": "POST /api/evolution { action:'createInstance', serverUrl, apiKey, instanceName } → depois escaneie QR em /manager",
        "5. Conecte QR": "Acesse http://SEU_IP:8080/manager → login com Global API Key → + Instance → nome=bvc-mcmv-go → número 5562... → Connect → QR → WhatsApp → Aparelhos conectados → Escanear",
        "6. Webhook p/ n8n/BVC": "curl -X POST http://SEU_IP:8080/webhook/set/bvc-mcmv-go -H 'apikey: SUA_CHAVE' -d '{\"webhook\":{\"enabled\":true,\"url\":\"https://seu-n8n.com/webhook/whatsapp\",\"events\":[\"MESSAGES_UPSERT\"]}}'",
        "7. Envie": "POST /api/evolution { action:'sendText', number:'5562912345678', text:'Oi {{nome}}! ...' } → URL: POST {serverUrl}/message/sendText/{instanceName} body { number, text } header apikey",
        nodes_n8n: "Settings → Community Nodes → Install @renatoascencio/n8n-nodes-evolution-api → Credentials: Base URL + API Key + Default Instance Name",
      },
      mockSend: {
        instance: envInstance,
        to: number || "5562912345678",
        message: text || "Oi {{nome}}! Vi seu interesse no {{empreendimento}}...",
        delayHumanizado: "2-5 min (adicionado pelo harness)",
        willLogInSheet: true,
      },
      exampleCurl: `curl -X POST ${envServer || "http://SEU_IP:8080"}/message/sendText/${envInstance} \\\n  -H "apikey: ${envKey || "SUA_CHAVE"}" -H "Content-Type: application/json" \\\n  -d '{"number":"5562912345678","text":"Oi Ana! Parcela R$890 no Alto da Boa Vista, bora?"}'`,
    });
  }

  const base = envServer.replace(/\/$/, "");
  const headers: Record<string, string> = { "Content-Type": "application/json", apikey: envKey };

  try {
    if (action === "createInstance") {
      const r = await fetch(`${base}/instance/create`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          instanceName: envInstance,
          token: options?.token,
          qrcode: true,
          number: options?.number,
          integration: "WHATSAPP-BAILEYS",
        }),
      });
      const data = await r.json().catch(async () => ({ text: await r.text() }));
      return NextResponse.json({ ok: r.ok, mode: "real", action, instance: envInstance, response: data, next: "Acesse /manager → Connect → QR Code → escaneie com WhatsApp" });
    }

    if (action === "connect") {
      const r = await fetch(`${base}/instance/connect/${envInstance}`, { headers });
      const data = await r.json().catch(async () => ({ text: await r.text() }));
      return NextResponse.json({ ok: r.ok, mode: "real", action, response: data });
    }

    if (action === "status") {
      const r = await fetch(`${base}/instance/connectionState/${envInstance}`, { headers });
      const data = await r.json().catch(async () => ({ text: await r.text() }));
      return NextResponse.json({ ok: r.ok, mode: "real", action, response: data });
    }

    if (action === "setWebhook") {
      const webhookUrl = options?.webhookUrl || process.env.WEBHOOK_N8N_URL || "";
      const r = await fetch(`${base}/webhook/set/${envInstance}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          webhook: { enabled: true, url: webhookUrl, webhookByEvents: false, webhookBase64: false, events: ["MESSAGES_UPSERT", "MESSAGES_UPDATE", "CONNECTION_UPDATE"] },
        }),
      });
      const data = await r.json().catch(async () => ({ text: await r.text() }));
      return NextResponse.json({ ok: r.ok, mode: "real", action, response: data });
    }

    // default: sendText
    if (!number || !text) return NextResponse.json({ ok: false, error: "number e text obrigatórios. Ex: { number:'5562912345678', text:'Oi...' }" }, { status: 400 });

    const r = await fetch(`${base}/message/sendText/${envInstance}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ number: number.replace(/\D/g, ""), text, delay: options?.delay || 1200, presence: "composing", ...options }),
    });
    const data = await r.json().catch(async () => ({ text: await r.text() }));
    if (!r.ok) return NextResponse.json({ ok: false, mode: "real", status: r.status, response: data }, { status: 502 });
    return NextResponse.json({ ok: true, mode: "real", action: "sendText", instance: envInstance, to: number, response: data, loggedInSheet: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, mode: "real", error: e.message }, { status: 500 });
  }
}

export async function GET() {
  const hasEnv = !!(process.env.EVOLUTION_SERVER_URL && process.env.EVOLUTION_API_KEY);
  return NextResponse.json({
    status: "Evolution API WhatsApp • BVC Prospector",
    hasCredentials: hasEnv,
    instance: process.env.EVOLUTION_INSTANCE_NAME || "bvc-mcmv-go",
    server: process.env.EVOLUTION_SERVER_URL || "(não configurado)",
    endpoints: [
      "POST /api/evolution { action:'createInstance', options:{ number:'5562...' } }",
      "POST /api/evolution { action:'connect' } → QR",
      "POST /api/evolution { action:'status' }",
      "POST /api/evolution { action:'sendText', number:'5562912345678', text:'Oi {{nome}}...' }",
      "POST /api/evolution { action:'setWebhook', options:{ webhookUrl:'https://seu-n8n/webhook/whatsapp' } }",
    ],
    headers: "apikey: AUTHENTICATION_API_KEY",
    docs: "https://github.com/EvolutionAPI/evolution-api + https://doc.evolution-api.com",
  });
}
