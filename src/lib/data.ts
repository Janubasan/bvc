// --- MOCK DATA & CONSTANTS FOR MCMV GOIÂNIA/APARECIDA ---

export type Lead = {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  instagram?: string;
  origem: "instagram" | "google_maps" | "olx" | "facebook_grupo" | "indicação" | "financiamento";
  score: number; // 0-100
  faixa: "Faixa 1" | "Faixa 2" | "Faixa 3";
  rendaEstimada: number;
  bairroInteresse: string;
  cidade: "Goiânia" | "Aparecida de Goiânia";
  interesse: string;
  status: "novo" | "qualificado" | "contatado" | "agendado" | "convertido" | "descartado";
  avatar: string;
  createdAt: string;
  intentSignals: string[];
  construtoraAlvo?: string;
};

export type Construtora = {
  id: string;
  nome: string;
  instagram: string;
  seguidores: number;
  cidade: string;
  foco: string;
  avatar: string;
};

export const CONSTRUTORAS_MCMV_GO: Construtora[] = [
  { id: "1", nome: "MRV Engenharia", instagram: "@mrvmrv_goiania", seguidores: 48200, cidade: "Goiânia/Aparecida", foco: "MCMV Faixa 2-3", avatar: "🏗️" },
  { id: "2", nome: "Direcional Engenharia", instagram: "@direcionalgoias", seguidores: 31200, cidade: "Goiânia", foco: "MCMV Alto da Boa Vista", avatar: "🏢" },
  { id: "3", nome: "Dinâmica Engenharia", instagram: "@dinamicaengenharia", seguidores: 18700, cidade: "Aparecida", foco: "Vila Romana / MCMV FAR", avatar: "🏘️" },
  { id: "4", nome: "Vega Incorporações", instagram: "@vegaincorporacoes", seguidores: 15400, cidade: "Aparecida", foco: "MCMV R$258k avg", avatar: "🏠" },
  { id: "5", nome: "Consciente Construtora", instagram: "@conscienteconstrutora", seguidores: 22100, cidade: "Goiânia", foco: "Econômico / MCMV", avatar: "🏡" },
  { id: "6", nome: "ELMO Incorporações", instagram: "@elmoengenharia", seguidores: 9800, cidade: "Goiânia", foco: "Faixa 1-2", avatar: "🧱" },
  { id: "7", nome: "Tropical Urbanismo", instagram: "@tropicalurbanismo", seguidores: 11200, cidade: "Aparecida", foco: "Lotes + MCMV", avatar: "🏙️" },
  { id: "8", nome: "Toctao / Pontal", instagram: "@toctaogo", seguidores: 27800, cidade: "Goiânia", foco: "MCMV + Médio", avatar: "🏛️" },
];

export const BAIRROS_FOCO = [
  { nome: "Alto da Boa Vista", cidade: "Aparecida", estoque: 768, ticket: 185000, demanda: "altíssima" },
  { nome: "Vila Romana", cidade: "Aparecida", estoque: 210, ticket: 195000, demanda: "alta" },
  { nome: "Garavelo", cidade: "Aparecida", estoque: 340, ticket: 210000, demanda: "alta" },
  { nome: "14 Bis", cidade: "Goiânia", estoque: 180, ticket: 235000, demanda: "média" },
  { nome: "Jardim Tiradentes", cidade: "Aparecida", estoque: 420, ticket: 178000, demanda: "altíssima" },
  { nome: "Real Conquista", cidade: "Aparecida", estoque: 150, ticket: 175000, demanda: "média" },
];

export const LEADS_MOCK: Lead[] = [
  { id: "L-001", nome: "Ana Paula Souza", telefone: "62991234567", email: "ana.souza@gmail.com", instagram: "@anapsouza.go", origem: "instagram", score: 92, faixa: "Faixa 2", rendaEstimada: 3800, bairroInteresse: "Alto da Boa Vista", cidade: "Aparecida de Goiânia", interesse: "Apto 2q c/ varanda, FGTS", status: "qualificado", avatar: "AS", createdAt: "2026-10-19T14:00:00Z", intentSignals: ["comentou 'valores?' em post MRV", "buscou 'FGTS entrada MCMV'", "salvou 12 imóveis"], construtoraAlvo: "MRV Engenharia" },
  { id: "L-002", nome: "Carlos Eduardo Lima", telefone: "62992345678", instagram: "@carlosedu.lima", origem: "facebook_grupo", score: 87, faixa: "Faixa 1", rendaEstimada: 2100, bairroInteresse: "Vila Romana", cidade: "Aparecida de Goiânia", interesse: "Apê a Custo Zero - cadastro", status: "novo", avatar: "CL", createdAt: "2026-10-19T10:30:00Z", intentSignals: ["entrou grupo 'MCMV Aparecida 2026'", "perguntou sobre documentação Agehab"], construtoraAlvo: "Dinâmica Engenharia" },
  { id: "L-003", nome: "Juliana Martins", telefone: "62993456789", email: "ju.martins@outlook.com", instagram: "@ju.martins.go", origem: "google_maps", score: 78, faixa: "Faixa 2", rendaEstimada: 4200, bairroInteresse: "Garavelo", cidade: "Aparecida de Goiânia", interesse: "Financiamento Caixa 30 anos", status: "contatado", avatar: "JM", createdAt: "2026-10-18T18:00:00Z", intentSignals: ["avaliou imobiliária 5 estrelas", "buscou 'parcela cabe no bolso'"], construtoraAlvo: "Vega Incorporações" },
  { id: "L-004", nome: "Roberto Silva", telefone: "62994567890", origem: "olx", score: 95, faixa: "Faixa 3", rendaEstimada: 6500, bairroInteresse: "Jardim Tiradentes", cidade: "Goiânia", interesse: "Investidor - 2 unidades", status: "agendado", avatar: "RS", createdAt: "2026-10-18T09:00:00Z", intentSignals: ["simulou financiamento 3x", "comparou MRV x Direcional"], construtoraAlvo: "Direcional Engenharia" },
  { id: "L-005", nome: "Fernanda Oliveira", telefone: "62995678901", email: "fe.oliveira@gmail.com", origem: "financiamento", score: 88, faixa: "Faixa 2", rendaEstimada: 3600, bairroInteresse: "14 Bis", cidade: "Goiânia", interesse: "Usar FGTS + subsídio", status: "qualificado", avatar: "FO", createdAt: "2026-10-17T16:00:00Z", intentSignals: ["baixou simulador Caixa", "FGTS liberado"], construtoraAlvo: "Consciente Construtora" },
  { id: "L-006", nome: "Marcos Vinícius", telefone: "62996789012", instagram: "@marcosv.go", origem: "instagram", score: 71, faixa: "Faixa 1", rendaEstimada: 2400, bairroInteresse: "Real Conquista", cidade: "Aparecida de Goiânia", interesse: "Primeiro imóvel, dúvidas MCMV", status: "novo", avatar: "MV", createdAt: "2026-10-17T11:00:00Z", intentSignals: ["comentou em live 'como me inscrevo?'", "seguiu 4 construtoras"], construtoraAlvo: "ELMO Incorporações" },
  { id: "L-007", nome: "Patrícia Andrade", telefone: "62997890123", email: "patricia.andrade@gmail.com", origem: "instagram", score: 82, faixa: "Faixa 2", rendaEstimada: 4100, bairroInteresse: "Alto da Boa Vista", cidade: "Aparecida de Goiânia", interesse: "Trocar aluguel R$1.200 por parcela", status: "contatado", avatar: "PA", createdAt: "2026-10-16T20:00:00Z", intentSignals: ["comentou 'chega de aluguel'"], construtoraAlvo: "Tropical Urbanismo" },
  { id: "L-008", nome: "Diego Fernandes", telefone: "62998901234", origem: "google_maps", score: 90, faixa: "Faixa 3", rendaEstimada: 7200, bairroInteresse: "Garavelo", cidade: "Aparecida de Goiânia", interesse: "Portabilidade + MCMV", status: "qualificado", avatar: "DF", createdAt: "2026-10-16T08:00:00Z", intentSignals: ["pesquisou 'juros 7,66% Caixa'"], construtoraAlvo: "Toctao / Pontal" },
];

export const MENSAGENS_TEMPLATE = [
  {
    id: "m1",
    nome: "Boas-vindas Faixa 2 - Alto da Boa Vista",
    canal: "WhatsApp",
    gatilho: "Lead novo Instagram",
    texto: "Oi {{nome}}! 👋 Vi seu interesse no {{empreendimento}} em {{bairro}} (a partir de R$185mil, parcela menor que aluguel!). Você já simulou seu FGTS + subsídio? Em 1 min te digo sua Faixa MCMV e quanto fica a parcela. Posso te mandar?",
    taxaResposta: "68%",
    uso: 342,
  },
  {
    id: "m2",
    nome: "Reativação FGTS Liberado",
    canal: "WhatsApp",
    gatilho: "Intent financeiro",
    texto: "{{nome}}, seu FGTS pode virar entrada! 🔑 No {{bairro}} (Aparecida) temos aptos 2q com lazer completo e parcela a partir de R$750 — menos que seu aluguel. Quer simulação gratuita hoje? Caixa aprova em 48h.",
    taxaResposta: "54%",
    uso: 189,
  },
  {
    id: "m3",
    nome: "Prova social + urgência estoque",
    canal: "WhatsApp + Áudio IA",
    gatilho: "Estoque < 100 unidades",
    texto: "Olha {{nome}}, o Alto da Boa Vista já está com 70% vendido e o estoque MCMV caiu 33% em 6 meses em Goiânia 😱. Separei 2 unidades no seu perfil (renda R${{renda}}). Quer visita guiada sábado 10h ou 15h?",
    taxaResposta: "61%",
    uso: 278,
  },
  {
    id: "m4",
    nome: "Agendamento visita",
    canal: "WhatsApp",
    gatilho: "Lead qualificado",
    texto: "Perfeito {{nome}}! ✅ Seu perfil é {{faixa}} (subsídio até R$55mil + juros 4,75%). Tenho horário amanhã 09h ou 16h no plantão {{bairro}} — levo simulação Caixa pronta. Qual prefere?",
    taxaResposta: "73%",
    uso: 412,
  },
];

export const WORKFLOW_NODES_MOCK = [
  { id: "trigger-ig", type: "trigger", label: "Instagram Scraper", desc: "Apify Actor • @mrvmrv_goiania + 7 construtoras • a cada 6h", status: "ativo" },
  { id: "filter", type: "filter", label: "Filtro MCMV", desc: "Renda R$2.000-8.000 + Goiânia/Aparecida + intent moradia", status: "ativo" },
  { id: "enrich", type: "enrich", label: "Enriquecimento IA", desc: "Extrai tel/email da bio • valida via Hunter/Dropcontact • score 0-100", status: "ativo" },
  { id: "agent", type: "agent", label: "Agente Qualificador", desc: "Qwen3-8B local • pergunta renda, FGTS, bairro, urgência • LGPD ok", status: "ativo" },
  { id: "sheets", type: "action", label: "Google Sheets", desc: "Append em 'Leads MCMV GO 2026' • aba Aparecida/Goiania", status: "ativo" },
  { id: "whatsapp", type: "action", label: "WhatsApp Mensagem", desc: "Template personalizado por Faixa • delay humanizado", status: "ativo" },
  { id: "docs", type: "action", label: "Google Docs Relatório", desc: "Gera dossiê diário para corretor • fotos + mapa + script", status: "pausado" },
];

export const KPIS = {
  leadsCaptados: 1847,
  qualificados: 623,
  taxaConversao: 18.4,
  custoPorLead: 3.20,
  estoqueMCMV: 475,
  demandaAlta: "+83.4% vendas MCMV 1ºsem 2026",
};

export const INTENT_KEYWORDS = [
  "minha casa minha vida goiania",
  "mcmv aparecida de goiania inscrição",
  "fgts entrada financiamento caixa",
  "aluguel goiania 1200 parcela mcmv",
  "apartamento 2 quartos aparececida",
  "subsídio mcmv faixa 1 2026",
  "caixa financiamento 30 anos simulador",
  "apartamento custo zero aparecida",
];

export const FONTES_TECNICAS = [
  { nome: "Scout (kiryano)", stars: "756", uso: "Scrape Instagram/TikTok/LinkedIn → email da bio + SMTP verify", licenca: "MIT" },
  { nome: "Instaloader", stars: "12.6k", uso: "CLI Python p/ perfis/posts/comentários públicos", licenca: "MIT" },
  { nome: "OpenOutreach (eracle)", stars: "3.3k", uso: "Agente AI B2B: descreve produto → acha ICPs → emaila", licenca: "Open" },
  { nome: "n8n + Apify Node", stars: "160k+", uso: "Harness visual: Apify Actors → Sheets/Gmail/WhatsApp", licenca: "Fair-code" },
  { nome: "BrightData AI Lead Generator", stars: "—", uso: "Scrape + qualificação OpenAI + Streamlit UI", licenca: "MIT" },
  { nome: "CrewAI LeadGen", stars: "—", uso: "Multi-agente Gemini: identify → qualify → personalize outreach", licenca: "MIT" },
];
