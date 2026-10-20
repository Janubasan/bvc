// Integrations registry - Apify, Google, Evolution API
export type IntegrationStatus = "desconectado" | "conectado" | "erro" | "testando";

export type ApifyConfig = {
  token: string;
  actorId: string; // ex: apify/instagram-scraper, apify/instagram-profile-scraper, data_minds/instagram-scraper
  proxyGroups?: string[];
  resultsLimit: number;
  status: IntegrationStatus;
  lastRun?: string;
  datasets?: number;
};

export type GoogleConfig = {
  clientEmail: string;
  privateKey: string; // Service Account
  spreadsheetId: string;
  driveFolderId?: string;
  docsTemplateId?: string;
  status: IntegrationStatus;
  oauthClientId?: string; // alternativa OAuth 2.0
  oauthAccessToken?: string;
};

export type EvolutionConfig = {
  serverUrl: string; // https://api.seudominio.com
  apiKey: string; // AUTHENTICATION_API_KEY global
  instanceName: string;
  instanceToken?: string;
  number?: string; // 5562912345678
  webhookUrl?: string;
  status: IntegrationStatus;
  qrCode?: string;
};

export const DEFAULT_APIFY: ApifyConfig = {
  token: "",
  actorId: "apify/instagram-scraper",
  resultsLimit: 50,
  status: "desconectado",
};

export const DEFAULT_GOOGLE: GoogleConfig = {
  clientEmail: "",
  privateKey: "",
  spreadsheetId: "",
  status: "desconectado",
};

export const DEFAULT_EVOLUTION: EvolutionConfig = {
  serverUrl: "",
  apiKey: "",
  instanceName: "bvc-mcmv-go",
  status: "desconectado",
};

// Helpers URL Builders
export function buildApifyRunUrl(actorId: string, token: string, sync = true) {
  const encoded = actorId.replace("/", "~");
  if (sync) return `https://api.apify.com/v2/actors/${encoded}/run-sync-get-dataset-items?token=${token}`;
  return `https://api.apify.com/v2/actors/${encoded}/runs?token=${token}`;
}

export function buildGoogleSheetsAppendUrl(spreadsheetId: string) {
  return `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`;
}

export function buildEvolutionSendUrl(serverUrl: string, instanceName: string) {
  const base = serverUrl.replace(/\/$/, "");
  return `${base}/message/sendText/${instanceName}`;
}

export function buildEvolutionQrUrl(serverUrl: string, instanceName: string) {
  const base = serverUrl.replace(/\/$/, "");
  return `${base}/instance/connect/${instanceName}`;
}
