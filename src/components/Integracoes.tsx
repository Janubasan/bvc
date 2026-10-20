"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { CheckCircle2, AlertCircle, ExternalLink, Copy, Play, Settings, Key, Sheet, FileText, MessageSquare, Instagram, Plug, Activity, ShieldCheck } from "lucide-react";

function TestButton({ onClick, label }: { onClick: () => void; label: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const handle = async () => {
    setLoading(true);
    try {
      const res = await onClick();
      setResult(res);
    } catch (e: any) {
      setResult({ error: e.message });
    }
    setLoading(false);
  };
  return (
    <div>
      <Button size="sm" variant="outline" onClick={handle} disabled={loading}>{loading ? "Testando..." : label}</Button>
      {result && (
        <pre className="mt-2 text-[11px] bg-slate-950 text-emerald-300 p-2 rounded-xl overflow-auto max-h-[140px]">{JSON.stringify(result, null, 2).slice(0, 2000)}</pre>
      )}
    </div>
  );
}

export function Integracoes() {
  const [apifyToken, setApifyToken] = useState("");
  const [apifyActor, setApifyActor] = useState("apify/instagram-scraper");
  const [googleEmail, setGoogleEmail] = useState("");
  const [sheetId, setSheetId] = useState("");
  const [evoUrl, setEvoUrl] = useState("");
  const [evoKey, setEvoKey] = useState("");
  const [evoInstance, setEvoInstance] = useState("bvc-mcmv-go");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "Sora" }}><Plug className="h-5 w-5 text-teal-600" /> Conexões Reais — Apify + Google + Evolution</h2>
        <p className="text-sm text-slate-500">Conecte de verdade (API tokens). Sem token, o sistema roda em <b>mock</b> com estrutura real — pronto para produção quando você colar as chaves.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Apify */}
        <Card className="border-teal-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2"><Instagram className="h-4 w-4 text-pink-500" /> Apify — Instagram Scraper Real</CardTitle>
              <Badge variant="secondary">Actor API</Badge>
            </div>
            <p className="text-xs text-slate-500">Roda qualquer Actor: apify/instagram-scraper, apify/instagram-profile-scraper, data_minds/instagram-scraper</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium">APIFY_TOKEN</label>
              <input value={apifyToken} onChange={(e) => setApifyToken(e.target.value)} placeholder="apify_api_xxx..." className="w-full h-9 px-3 rounded-xl border text-sm mt-1" />
              <p className="text-[11px] text-slate-500 mt-1">Pegue em <a href="https://console.apify.com/account/integrations" target="_blank" className="text-teal-600 underline">console.apify.com/account/integrations</a> → Copy</p>
            </div>
            <div>
              <label className="text-xs font-medium">Actor ID</label>
              <select value={apifyActor} onChange={(e) => setApifyActor(e.target.value)} className="w-full h-9 px-2 rounded-xl border text-sm mt-1">
                <option value="apify/instagram-scraper">apify/instagram-scraper (posts/hashtag)</option>
                <option value="apify/instagram-profile-scraper">apify/instagram-profile-scraper (perfis)</option>
                <option value="data_minds/instagram-scraper">data_minds/instagram-scraper (details+posts+comments)</option>
                <option value="apify/instagram-hashtag-scraper">apify/instagram-hashtag-scraper</option>
              </select>
            </div>

            <div className="bg-slate-50 rounded-xl p-2.5 text-xs">
              <div className="font-semibold">Input exemplo (BVC)</div>
              <pre className="mt-1 text-[11px] bg-white border p-2 rounded-lg overflow-auto">{`{
  "directUrls": ["https://www.instagram.com/mrvmrv_goiania/"],
  "resultsType": "posts",
  "resultsLimit": 50,
  "searchType": "hashtag",
  "searchLimit": 10
}`}</pre>
            </div>

            <TestButton
              label="Testar Apify agora →"
              onClick={async () => {
                const r = await fetch("/api/apify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token: apifyToken || undefined, actorId: apifyActor, input: { directUrls: ["https://www.instagram.com/mrvmrv_goiania/"], resultsType: "posts", resultsLimit: 10 } }) });
                return await r.json();
              }}
            />

            <div className="text-xs bg-amber-50 border border-amber-200 rounded-xl p-2">
              <b>Sem token?</b> Retorna mock estruturado + instruções. Com token, faz POST real em <code>https://api.apify.com/v2/actors/.../run-sync-get-dataset-items?token=</code>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(apifyToken)}><Copy className="h-4 w-4 mr-1" /> Copiar token</Button>
              <a href="https://apify.com/apify/instagram-scraper/api" target="_blank"><Button size="sm" variant="outline"><ExternalLink className="h-4 w-4 mr-1" /> Docs Actor</Button></a>
            </div>
          </CardContent>
        </Card>

        {/* Google */}
        <Card className="border-green-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2"><Sheet className="h-4 w-4 text-green-600" /> Google — Sheets + Docs Real</CardTitle>
              <Badge variant="success">Service Account</Badge>
            </div>
            <p className="text-xs text-slate-500">Append em Sheets + create Docs via googleapis (JWT). Compartilhe planilha com service account email.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium">Service Account Email</label>
              <input value={googleEmail} onChange={(e) => setGoogleEmail(e.target.value)} placeholder="bvc-mcmv@seu-projeto.iam.gserviceaccount.com" className="w-full h-9 px-3 rounded-xl border text-sm mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium">Spreadsheet ID</label>
              <input value={sheetId} onChange={(e) => setSheetId(e.target.value)} placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms" className="w-full h-9 px-3 rounded-xl border text-sm mt-1" />
              <p className="text-[11px] text-slate-500 mt-1">Na URL: docs.google.com/spreadsheets/d/<b>ID</b>/edit</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-2.5 text-xs leading-relaxed">
              <div className="font-semibold">Setup 1-clique (Service Account)</div>
              <ol className="list-decimal list-inside mt-1 text-slate-600 space-y-1">
                <li>console.cloud.google.com → novo projeto BVC-MCMV</li>
                <li>APIs & Services → Library → Enable: Sheets, Docs, Drive</li>
                <li>IAM → Service Accounts → Create → Editor → Keys → JSON</li>
                <li>.env: GOOGLE_SHEETS_CLIENT_EMAIL + PRIVATE_KEY + SPREADSHEET_ID</li>
                <li>Compartilhe planilha com o email do service account (Editor)</li>
              </ol>
            </div>

            <TestButton
              label="Testar Sheets Append →"
              onClick={async () => {
                const r = await fetch("/api/google", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "appendSheet", spreadsheetId: sheetId || "mock", range: "Leads!A:H", values: [["Ana Teste", "62999112233", "FR Viva Goiá", "Faixa 2", "88", "instagram", new Date().toISOString(), "novo"]] }) });
                return await r.json();
              }}
            />

            <TestButton
              label="Testar Docs Create →"
              onClick={async () => {
                const r = await fetch("/api/google", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "createDoc", documentTitle: "Dossiê BVC — Ana Teste — Goiá", documentBody: "Perfil Faixa 2, renda R$3.800, FGTS liberado, interesse FR Viva Goiá 2Q R$270k, parcela R$890. Roteiro: Oi Ana, vi seu interesse..." }) });
                return await r.json();
              }}
            />

            <div className="text-xs bg-green-50 border border-green-200 rounded-xl p-2">
              <b>Env vars:</b> GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, GOOGLE_SHEETS_SPREADSHEET_ID. Sem elas, mock educativo.
            </div>
          </CardContent>
        </Card>

        {/* Evolution */}
        <Card className="border-violet-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2"><MessageSquare className="h-4 w-4 text-violet-600" /> Evolution API — WhatsApp Real</CardTitle>
              <Badge variant="secondary">Baileys</Badge>
            </div>
            <p className="text-xs text-slate-500">Self-host via Docker (Postgres+Redis). Envio POST /message/sendText/{"{instance}"} com apikey header.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-xs font-medium">Server URL</label>
              <input value={evoUrl} onChange={(e) => setEvoUrl(e.target.value)} placeholder="https://api.seudominio.com ou http://SEU_IP:8080" className="w-full h-9 px-3 rounded-xl border text-sm mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium">Global API Key</label>
              <input value={evoKey} onChange={(e) => setEvoKey(e.target.value)} placeholder="AUTHENTICATION_API_KEY (do .env Evolution)" className="w-full h-9 px-3 rounded-xl border text-sm mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium">Instance Name</label>
              <input value={evoInstance} onChange={(e) => setEvoInstance(e.target.value)} placeholder="bvc-mcmv-go" className="w-full h-9 px-3 rounded-xl border text-sm mt-1" />
              <p className="text-[11px] text-slate-500 mt-1">1 instância = 1 número WhatsApp. Pode ter “bvc-goiá”, “bvc-aparecida”, etc.</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-2.5 text-xs">
              <div className="font-semibold">Fluxo Evolution (3 passos)</div>
              <ol className="list-decimal list-inside mt-1 text-slate-600">
                <li>Create Instance → POST /instance/create {`{instanceName, qrcode:true}`}</li>
                <li>Connect → GET /instance/connect/{`{instance}` } → QR → escaneie no celular</li>
                <li>Send → POST /message/sendText/{`{instance}`} {'{ number, text, delay }'}</li>
              </ol>
            </div>

            <TestButton
              label="Testar status instance →"
              onClick={async () => {
                const r = await fetch("/api/evolution", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "status", serverUrl: evoUrl || undefined, apiKey: evoKey || undefined, instanceName: evoInstance }) });
                return await r.json();
              }}
            />

            <TestButton
              label="Enviar WhatsApp teste →"
              onClick={async () => {
                const r = await fetch("/api/evolution", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "sendText", serverUrl: evoUrl || undefined, apiKey: evoKey || undefined, instanceName: evoInstance, number: "5562999999999", text: "Oi! Aqui é BVC MCMV Goiá — teste de integração Evolution API ✅" }) });
                return await r.json();
              }}
            />

            <div className="flex gap-2 flex-wrap">
              <a href="https://doc.evolution-api.com" target="_blank"><Button size="sm" variant="outline"><ExternalLink className="h-4 w-4 mr-1" /> Docs Evolution</Button></a>
              <a href="https://railway.com/deploy/evolution-api-n8n--deploy-evolution-api-whatsapp-n8n" target="_blank"><Button size="sm" variant="ghost">Deploy Railway 1-clique</Button></a>
            </div>

            <div className="text-xs bg-violet-50 border border-violet-200 rounded-xl p-2">
              <b>n8n:</b> Settings → Community Nodes → Install <code>n8n-nodes-evolution-api</code> → Credentials Base URL + API Key + Instance. Depois use nó Evolution no workflow.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-900 text-white">
        <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-sm font-bold flex items-center gap-2"><Activity className="h-4 w-4 text-teal-400" /> .env pronto para produção (copie e cole)</div>
            <pre className="mt-2 text-xs bg-slate-800 p-3 rounded-xl overflow-auto">{`APIFY_TOKEN=apify_api_xxx
APIFY_ACTOR_ID=apify/instagram-scraper

GOOGLE_SHEETS_CLIENT_EMAIL=bvc-mcmv@seu-projeto.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMII...\\n-----END PRIVATE KEY-----\\n"
GOOGLE_SHEETS_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms

EVOLUTION_SERVER_URL=https://api.seudominio.com
EVOLUTION_API_KEY=sua_chave_forte_aqui
EVOLUTION_INSTANCE_NAME=bvc-mcmv-go

# Webhook n8n (opcional)
WEBHOOK_N8N_URL=https://seu-n8n.com/webhook/whatsapp`}</pre>
          </div>
          <div className="shrink-0 flex flex-col gap-2">
            <Button variant="accent" onClick={() => navigator.clipboard.writeText(`APIFY_TOKEN=apify_api_xxx\nGOOGLE_SHEETS_CLIENT_EMAIL=bvc-mcmv@...\nEVOLUTION_SERVER_URL=https://api.seudominio.com`)}><Copy className="h-4 w-4 mr-2" /> Copiar template .env</Button>
            <div className="text-xs text-slate-400 text-center">Mocks funcionam sem .env — produção exige chaves</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /> LGPD & Limites das APIs</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-3 text-xs leading-relaxed">
          <div className="p-3 border rounded-xl bg-white"><b>Apify:</b> use proxies residenciais + delay 1-15s, respeite ToS Instagram. Só dados públicos. Free $5/mês, depois $49 + $1.50/1k results.</div>
          <div className="p-3 border rounded-xl bg-white"><b>Google:</b> Service Account precisa ser compartilhado na planilha (Editor). Scopes: spreadsheets + documents + drive.file. Cota 100 req/100s.</div>
          <div className="p-3 border rounded-xl bg-teal-50 border-teal-200"><b>Evolution:</b> precisa VPS + Redis/Postgres. Número pode ser banido se spam — use delay humanizado + opt-out “SAIR” + aprovação humana.</div>
        </CardContent>
      </Card>
    </div>
  );
}
