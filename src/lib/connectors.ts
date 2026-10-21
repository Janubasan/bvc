// connectors.ts — Conector OpenAPI auto-configurável para AvantoFind/BVC
// Mantém design intacto — apenas adiciona camada de APIs grátis sem mudar visual.
// Padrão OpenLLM/Universal API Connector: spec é fonte da verdade.
// @ts-ignore - swagger-client sem tipos, mas funciona em runtime
import SwaggerClient from "swagger-client";

export type ConnectorOptions = {
  headers?: Record<string, string>;
  baseUrl?: string;
  timeout?: number;
};

export class AutoConnector {
  name: string;
  specUrl: string;
  options: ConnectorOptions;
  client: any = null;
  operations: { api: string; operationId: string; method: string; path: string; summary?: string }[] = [];
  ready = false;
  error: string | null = null;

  constructor(name: string, specUrl: string, options: ConnectorOptions = {}) {
    this.name = name;
    this.specUrl = specUrl;
    this.options = options;
  }

  async init(): Promise<AutoConnector> {
    try {
      const resolved: any = await SwaggerClient.resolve({ url: this.specUrl, ...(this.options as any) });
      this.client = await SwaggerClient.build({
        spec: resolved.spec,
        requestInterceptor: (req: any) => {
          if (this.options.headers) {
            req.headers = { ...req.headers, ...this.options.headers };
          }
          return req;
        },
      } as any);

      this.operations = Object.entries(this.client.apis || {})
        .flatMap(([apiName, api]: any) =>
          Object.entries(api.operations || {}).map(([opName, op]: any) => ({
            api: apiName,
            operationId: op.operationId || opName,
            method: (op.method || "GET").toUpperCase(),
            path: op.path || "",
            summary: op.summary || "",
          }))
        );
      this.ready = true;
    } catch (e: any) {
      this.error = e?.message || String(e);
      this.ready = false;
    }
    return this;
  }

  async call(operationId: string, params: Record<string, any> = {}): Promise<any> {
    if (!this.client) throw new Error(`Conector "${this.name}" não inicializado.`);
    // procura operation em qualquer api
    for (const apiName of Object.keys(this.client.apis)) {
      const api = this.client.apis[apiName];
      if (api && typeof api[operationId] === "function") {
        const res = await api[operationId](params, { requestInterceptor: (req: any) => req });
        // swagger-client retorna { body, obj, status }
        return res?.body ?? res?.obj ?? res;
      }
    }
    throw new Error(`Operação "${operationId}" não encontrada em "${this.name}". Disponíveis: ${this.operations.map((o) => o.operationId).join(", ")}`);
  }

  listOperations() {
    return this.operations;
  }
}

// Registry — adicione APIs grátis apenas alterando esta lista. Nada muda no layout.
export const CONNECTOR_REGISTRY: { name: string; specUrl: string; options: ConnectorOptions; description: string; free: boolean }[] = [
  {
    name: "brasilapi",
    specUrl: "https://brasilapi.com.br/api-docs/openapi.json",
    options: {},
    description: "CEP, CNPJ, DDD, Feriados, FIPE, PIX — 100% grátis, sem token",
    free: true,
  },
  {
    name: "viacep",
    // ViaCEP não tem OpenAPI oficial estável; usamos chamada direta REST (fallback). Mantemos entrada para documentar.
    specUrl: "https://viacep.com.br/openapi.json",
    options: {},
    description: "ViaCEP (fallback REST) — CEP → endereço, sem token",
    free: true,
  },
  {
    name: "opencnpj",
    specUrl: "https://api.opencnpj.org/openapi.json",
    options: {},
    description: "OpenCNPJ — dados CNPJ Receita, grátis",
    free: true,
  },
];

// Inicializa todos em paralelo, tolerante a falhas (nada quebra o app)
export async function initConnectors(): Promise<Map<string, AutoConnector>> {
  const map = new Map<string, AutoConnector>();
  await Promise.all(
    CONNECTOR_REGISTRY.map(async (entry) => {
      const conn = new AutoConnector(entry.name, entry.specUrl, entry.options);
      await conn.init();
      map.set(entry.name, conn);
      if (conn.ready) console.log(`[connector] ${entry.name} pronto — ${conn.operations.length} operações`);
      else console.warn(`[connector] ${entry.name} em modo fallback — ${conn.error}`);
    })
  );
  return map;
}

// Helpers gratuitos diretos (fallback quando OpenAPI não disponível, sem quebrar)
export async function fetchViaCEP(cep: string) {
  const clean = cep.replace(/\D/g, "").slice(0, 8);
  if (clean.length !== 8) throw new Error("CEP precisa ter 8 dígitos");
  const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
  if (!res.ok) throw new Error(`ViaCEP status ${res.status}`);
  const data = await res.json();
  if (data.erro) throw new Error("CEP não encontrado");
  return data as { cep: string; logradouro: string; bairro: string; localidade: string; uf: string; ddd: string };
}

export async function fetchBrasilAPI_CEP(cep: string) {
  const clean = cep.replace(/\D/g, "").slice(0, 8);
  const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${clean}`);
  if (!res.ok) throw new Error(`BrasilAPI CEP ${res.status}`);
  return res.json();
}

export async function fetchBrasilAPI_CNPJ(cnpj: string) {
  const clean = cnpj.replace(/\D/g, "");
  const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${clean}`);
  if (!res.ok) throw new Error(`BrasilAPI CNPJ ${res.status}`);
  return res.json();
}

export async function fetchBrasilAPI_DDD(ddd: string) {
  const clean = ddd.replace(/\D/g, "");
  const res = await fetch(`https://brasilapi.com.br/api/ddd/v1/${clean}`);
  if (!res.ok) throw new Error(`BrasilAPI DDD ${res.status}`);
  return res.json();
}

// Enriquecimento B2C: tenta enriquecer lead com CEP/DDD/CNPJ via grátis
export async function enrichLeadFree(lead: any) {
  const out: Record<string, any> = {};
  if (lead.cep) {
    try { out.viacep = await fetchViaCEP(lead.cep); } catch {}
    try { out.brasilapiCep = await fetchBrasilAPI_CEP(lead.cep); } catch {}
  }
  if (lead.cnpj) {
    try { out.cnpj = await fetchBrasilAPI_CNPJ(lead.cnpj); } catch {}
  }
  if (lead.ddd) {
    try { out.dddInfo = await fetchBrasilAPI_DDD(lead.ddd); } catch {}
  }
  return out;
}
