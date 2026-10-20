// Listas modelo pré-validadas — MRV Goiânia/Aparecida DDD 62
// Todos números abaixo são SINTÉTICOS de DEMO (formato válido BR, mas não são pessoas reais)
// Produção: import seu CSV → validador → export validados

export type ListaModelo = {
  id: string;
  nome: string;
  predio: string;
  cidade: string;
  total: number;
  validados: number;
  ddd62: number;
  whatsapp: number;
  taxaValido: string;
  estrategia: string;
  arquivo: string;
  preview: { nome:string, telefone:string, e164:string, score:number, intent:string }[];
  download: string; // /api/validate?lista=...
};

function genDemoPhones(predio: string, baseSeed: number, qtd: number) {
  // Gera números sintéticos válidos DDD 62 — APENAS DEMO
  const nomes = ["Ana Paula","Carlos","Juliana","Roberto","Fernanda","Marcos","Patrícia","Diego","Larissa","Thiago","Vanessa","Rafael","Camila","Lucas","Mariana","Bruno","Sandra","Felipe","Aline","Gustavo"];
  const intents = ["FGTS liberado","simulou 420x","perguntou subsídio R$55k","quer entrega 2027","comparou Gran Porto x Gran Safira","buscou parcela R$680","comentou 'valores?' MRV","quer usar FGTS entrada"];
  return Array.from({length: qtd}, (_,i)=>{
    const idx = (baseSeed + i) % nomes.length;
    // número sintético 62 9xxxx-xxxx que passa no libphonenumber
    const n = 910000000 + ((baseSeed*997 + i*1237) % 89999999);
    const tel = `62 9${String(n).padStart(8,"0").slice(0,4)}-${String(n).padStart(8,"0").slice(4,8)}`;
    const e164 = `+55${tel.replace(/\D/g,"")}`;
    return { nome: `${nomes[idx]} ${["Souza","Lima","Santos","Oliveira","Silva","Costa","Pereira","Andrade"][i%8]}`, telefone: tel, e164, score: 78 + (i%18), intent: intents[i%8] };
  });
}

export const LISTAS_MODELO: ListaModelo[] = [
  {
    id: "gran-porto-quentes",
    nome: "GRAN PORTO — 38 quentes validados (entrega Set/2027)",
    predio: "GRAN PORTO",
    cidade: "Goiânia",
    total: 42,
    validados: 38,
    ddd62: 38,
    whatsapp: 38,
    taxaValido: "90%",
    estrategia: "Meta OTP + Landing OTP",
    arquivo: "gran-porto-validados-62.csv",
    preview: genDemoPhones("Gran Porto", 1, 5),
    download: "/api/validate?lista=gran-porto-quentes",
  },
  {
    id: "aparecida-pack",
    nome: "APARECIDA Pack — Gran Safira + Gran Essence + Gran Parma (56 validados)",
    predio: "3 prédios Aparecida",
    cidade: "Aparecida de Goiânia",
    total: 68,
    validados: 56,
    ddd62: 56,
    whatsapp: 55,
    taxaValido: "82%",
    estrategia: "Grupo FB MCMV Aparecida 2026 + QR plantão",
    arquivo: "aparecida-3predios-validados-62.csv",
    preview: genDemoPhones("Aparecida", 101, 5),
    download: "/api/validate?lista=aparecida-pack",
  },
  {
    id: "goiania-pack",
    nome: "GOIÂNIA Pack — Terrazo + Priville + Aurora + Vert (34 validados)",
    predio: "4 prédios Goiânia",
    cidade: "Goiânia",
    total: 44,
    validados: 34,
    ddd62: 34,
    whatsapp: 34,
    taxaValido: "77%",
    estrategia: "OLX + Indicação premiada",
    arquivo: "goiania-4predios-validados-62.csv",
    preview: genDemoPhones("Goiânia", 201, 5),
    download: "/api/validate?lista=goiania-pack",
  },
  {
    id: "todos-8-validados",
    nome: "MASTER — Todos 8 prédios (128 validados) — LGPD opt-in",
    predio: "Todos 8 MRV",
    cidade: "Goiânia + Aparecida",
    total: 154,
    validados: 128,
    ddd62: 128,
    whatsapp: 126,
    taxaValido: "83%",
    estrategia: "Todas estratégias combinadas",
    arquivo: "mrv-8predios-128-validados-62.csv",
    preview: genDemoPhones("Master", 301, 5),
    download: "/api/validate?lista=todos-8-validados",
  },
];

export function getListaRows(listaId: string) {
  const m = LISTAS_MODELO.find(l=>l.id===listaId);
  if (!m) return null;
  // re-gera para download
  const seed = listaId === "gran-porto-quentes" ? 1 : listaId === "aparecida-pack" ? 101 : listaId === "goiania-pack" ? 201 : 301;
  const qtd = m.validados;
  return genDemoPhones(m.predio, seed, qtd).map(r=> ({
    Nome: r.nome,
    Telefone_Nacional: r.telefone,
    Telefone_E164: r.e164,
    Predio_MRV: m.predio,
    Cidade: m.cidade,
    Score_Quente: r.score,
    Intent: r.intent,
    DDD62: "SIM",
    WhatsApp: "SIM",
    Validado: "SIM — 4 motores",
    LGPD_OptIn: "DEMO — troque por base real com OTP",
  }));
}
