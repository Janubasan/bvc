// Config central do usuário - telefone real para disparos teste
export const USER_CONFIG = {
  zap: "5562999023474" as string, // +55 62 99902-3474 - seu WhatsApp teste
  zapFormatted: "+55 62 99902-3474",
  zapE164: "+5562999023474",
  nome: "Corretor MCMV",
  cidade: "Aparecida de Goiânia",
  // Evolution instance padrão
  evolutionInstance: process.env.NEXT_PUBLIC_EVOLUTION_INSTANCE || "bvc-mcmv-go",
} as const;

// Helper para formatar telefone para Evolution (sem +)
export const toEvolutionNumber = (phone: string) => phone.replace(/\D/g, "");
export const USER_ZAP_EVOLUTION = toEvolutionNumber(USER_CONFIG.zap); // 5562999023474
