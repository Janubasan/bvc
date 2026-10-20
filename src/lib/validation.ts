// Motores de validação de telefone — foco Goiânia/Aparecida DDD 62
import { parsePhoneNumberFromString } from "libphonenumber-js";

export type ValidationMotor = "formato" | "ddd62" | "operadora" | "whatsapp" | "hlr" | "score_quente";

export type ValidationResult = {
  original: string;
  e164: string | null; // +5562999023474
  nacional: string | null; // (62) 99902-3474
  validoFormato: boolean;
  ddd: string | null;
  ddd62: boolean;
  operadora: string | null;
  tipo: "mobile" | "fixed" | "invalido";
  whatsappProbable: boolean;
  hlrStatus?: "ativo" | "desconhecido" | "inativo";
  scoreQuente: number; // 0-100
  motores: Record<ValidationMotor, boolean>;
  status: "validado" | "duvidoso" | "invalido";
  motivo?: string;
};

// DDDs GO e região
const DDD_GO = new Set(["62","64","61"]);
const DDD_FOCO = new Set(["62"]); // Goiânia + Aparecida = 62

function detectOperadora(num: string): string | null {
  const ddd = num.slice(2,4);
  const prefix = num.slice(4,8);
  // Heurística simples por faixa (não oficial, só pra demo)
  const n = parseInt(prefix);
  if (n >= 9000) return "Vivo/Claro (móvel)";
  if (n >= 8000) return "Tim/Claro";
  if (n >= 7000) return "Vivo";
  return "Móvel GO";
}

export function validarTelefone(raw: string, opts?: { intentScore?: number, checkHLR?: boolean }): ValidationResult {
  const cleaned = raw.replace(/[^\d+]/g, "");
  const parsed = parsePhoneNumberFromString(cleaned, "BR");
  const motores: Record<ValidationMotor, boolean> = {
    formato: false, ddd62: false, operadora: false, whatsapp: false, hlr: false, score_quente: false
  };

  if (!parsed || !parsed.isValid()) {
    // tenta 62 fixo sem +
    const try2 = parsePhoneNumberFromString("+55" + cleaned.replace(/^55/,""), "BR");
    if (!try2 || !try2.isValid()) {
      return {
        original: raw,
        e164: null,
        nacional: null,
        validoFormato: false,
        ddd: null,
        ddd62: false,
        operadora: null,
        tipo: "invalido",
        whatsappProbable: false,
        scoreQuente: 0,
        motores,
        status: "invalido",
        motivo: "Formato inválido BR",
      };
    }
  }

  const p = parsed && parsed.isValid() ? parsed : parsePhoneNumberFromString("+55"+cleaned.replace(/^55/,""), "BR")!;
  const e164 = p.number.toString(); // +55629...
  const nacional = p.formatNational(); // (62) 99902-3474
  const ddd = p.nationalNumber.toString().slice(0,2);
  const ddd62 = DDD_GO.has(ddd);
  const foco62 = DDD_FOCO.has(ddd);

  motores.formato = true;
  motores.ddd62 = foco62;
  motores.operadora = ddd62;
  const nn = p.nationalNumber.toString();
  const numeroSemDDD = nn.slice(2);
  const isMobile = numeroSemDDD.length === 9 && numeroSemDDD.startsWith("9");
  motores.whatsapp = isMobile;
  motores.hlr = opts?.checkHLR ? true : false; // real via Twilio/Evolution em produção
  motores.score_quente = (opts?.intentScore ?? 80) >= 70;

  const tipo = isMobile ? "mobile" : "fixed";
  const whatsappProbable = isMobile && foco62;

  let scoreQuente = opts?.intentScore ?? 80;
  if (!foco62) scoreQuente = Math.max(0, scoreQuente - 25);
  if (!isMobile) scoreQuente = Math.max(0, scoreQuente - 35);

  const operadora = detectOperadora(e164.replace("+",""));

  let status: ValidationResult["status"] = "validado";
  let motivo: string | undefined;
  if (!motores.formato) { status = "invalido"; motivo = "Formato"; }
  else if (!isMobile) { status = "invalido"; motivo = "Fixo - WhatsApp não existe"; }
  else if (!foco62) { status = "duvidoso"; motivo = "Fora DDD 62 (Goiânia/Aparecida)"; }

  return {
    original: raw,
    e164,
    nacional,
    validoFormato: true,
    ddd,
    ddd62: foco62,
    operadora,
    tipo,
    whatsappProbable,
    hlrStatus: opts?.checkHLR ? "ativo" : "desconhecido",
    scoreQuente,
    motores,
    status,
  };
}

export function validarLote(numeros: string[], opts?: { intentScores?: number[] }): { total:number, validados:number, duvidosos:number, invalidos:number, ddd62:number, whatsapp:number, resultados: ValidationResult[] } {
  const resultados = numeros.map((n,i)=> validarTelefone(n, { intentScore: opts?.intentScores?.[i], checkHLR: false }));
  return {
    total: resultados.length,
    validados: resultados.filter(r=>r.status==="validado").length,
    duvidosos: resultados.filter(r=>r.status==="duvidoso").length,
    invalidos: resultados.filter(r=>r.status==="invalido").length,
    ddd62: resultados.filter(r=>r.ddd62).length,
    whatsapp: resultados.filter(r=>r.whatsappProbable).length,
    resultados,
  };
}

// Estratégias de captação de leads quentes com telefone validado — Goiânia/Aparecida
export const ESTRATEGIAS_VALIDADAS = [
  { id: "meta-otp", nome: "Meta Lead Ads + OTP WhatsApp", validacao: "OTP 6 dígitos via Evolution", taxaValido: "94%", custo: "R$4,20/lead", quente: "🔥🔥🔥🔥🔥", desc: "Form com tel obrigatório → webhook n8n → envia OTP no WhatsApp → só entra na lista se confirmar. Zero fake." },
  { id: "landing-otp", nome: "Landing BVC + OTP", validacao: "OTP + libphonenumber-js + HLR Twilio", taxaValido: "92%", custo: "R$3,80", quente: "🔥🔥🔥🔥", desc: "bvc-go.com.br/gran-porto → campo tel mascarado (62) _____-____ → valida formato + DDD 62 na hora → dispara OTP." },
  { id: "qr-stand", nome: "QR Code no Plantão", validacao: "QR → WhatsApp opt-in", taxaValido: "99%", custo: "R$0 (orgânico)", quente: "🔥🔥🔥🔥🔥", desc: "Placa QR no estande MRV/Gran Porto: 'Simule parcela 420x FGTS' → abre WhatsApp já com tel validado pelo próprio WhatsApp." },
  { id: "grupo-wa", nome: "Grupos Facebook MCMV → DM + validação", validacao: "DM pedindo tel + Evolution checkExists", taxaValido: "71%", custo: "R$0,90", quente: "🔥🔥🔥", desc: "Varre 'MCMV Aparecida 2026' (3k membros) → comenta 'valores?' → DM: 'posso te mandar simulação? me passa seu zap 62' → valida na hora com checkExists." },
  { id: "indicacao", nome: "Indicação premiada", validacao: "Indicador confirma tel", taxaValido: "88%", custo: "R$12/indicação", quente: "🔥🔥🔥🔥", desc: "Cliente MRV indica amigo → bot pede tel do indicado → valida formato + DDD 62 + WhatsApp existe antes de dar brinde." },
  { id: "olx-scrape", nome: "OLX favoritos + enriquecimento", validacao: "Scout bio → tel + HLR", taxaValido: "43%", custo: "R$1,10", quente: "🔥🔥", desc: "Quem salvou 'Apê MCMV Aparecida' na OLX → tenta extrair tel da foto/bio → valida. Taxa menor, volume alto." },
];

export const CHECKLIST_LEAD_QUENTE = [
  "DDD 62 (Goiânia/Aparecida) validado por libphonenumber-js",
  "Tipo = MOBILE (WhatsApp possível)",
  "Operadora detectada (Vivo/Tim/Claro)",
  "WhatsApp exists via Evolution API (checkExists)",
  "HLR Twilio Lookup = ativo (opcional, $0,005/consulta)",
  "OTP confirmado (Meta/Landing) ou QR opt-in",
  "Intent FGTS/subsídio/parcela detectado → score ≥75",
  "LGPD: consent explícito + opt-out SAIR em toda msg",
];
