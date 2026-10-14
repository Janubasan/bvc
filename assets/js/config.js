/* ============================================================
   MCMV SEM DÚVIDAS — CONFIGURAÇÃO CENTRAL DO SITE
   ------------------------------------------------------------
   ⚠️ EDITE APENAS ESTE ARQUIVO para publicar o site. Aqui você
   troca: os dados dos 2 corretores, o e-mail de contato,
   os IDs de rastreamento (GA4 / Meta Pixel / GTM) e o webhook
   dos formulários (Zapier / Make / n8n).

   WHATSAPP: apenas números, com DDI + DDD + número.
   Exemplo: 55 (Brasil) + 11 (DDD) + 912344567 → "5511912344567"

   Depois de editar, NÃO é preciso reconstruir nada: este arquivo
   é lido pelo site em tempo real.
   ============================================================ */

window.SITE_CONFIG = {

  // --- Identidade ------------------------------------------------
  nomeSite: "MCMV Sem Dúvidas",
  dominio: "mcmvsemduvidas.com.br",
  emailContato: "contato@mcmvsemduvidas.com.br",   // LGPD: e-mail de contato/exclusão
  cidadesAtuacao: "[CIDADES]",                     // ex.: "Ourinhos, Assis e Santa Cruz do Rio Pardo"

  // --- Corretores ------------------------------------------------
  corretores: [
    {
      id: 1,
      nome: "[CORRETOR 1]",
      creci: "[CRECI 1]",
      whatsapp: "5511900000000",   // ⚠️ SUBSTITUA pelo número real (com DDI+DDD)
      horario: "08h às 14h"
    },
    {
      id: 2,
      nome: "[CORRETOR 2]",
      creci: "[CRECI 2]",
      whatsapp: "5511900000001",   // ⚠️ SUBSTITUA pelo número real (com DDI+DDD)
      horario: "14h às 20h"
    }
  ],

  // --- Teste A/B entre Corretor 1 e Corretor 2 -------------------
  // true = metade dos visitantes vê o Corretor 1 como CTA principal,
  //        metade vê o Corretor 2 (Regra C do plano de automação).
  abTestCorretores: true,

  // --- Integração dos formulários (CRM) ---------------------------
  // Cole aqui a URL do webhook (Zapier / Make / n8n). Envia um POST
  // em JSON a cada lead. Deixe "" para gravar os leads apenas no
  // navegador (localStorage) durante testes.
  webhookUrl: "",

  // --- Rastreamento (deixe "" para desativar) ---------------------
  ga4Id: "",        // ex.: "G-XXXXXXXXXX"
  metaPixelId: "",  // ex.: "1234567890"
  gtmId: ""         // ex.: "GTM-XXXXXXX"
};

/* ------------------------------------------------------------
   MENSAGENS PRÉ-PREENCHIDAS DO WHATSAPP (por página)
   Editáveis aqui — não é preciso reconstruir o site.
   ------------------------------------------------------------ */
window.SITE_MSGS = {
  padrao:        "Olá! Vi o site MCMV Sem Dúvidas e quero entender se posso ter minha casa. Pode me ajudar?",
  home:          "Olá! Vi o site MCMV Sem Dúvidas e quero entender se posso ter minha casa. Pode me ajudar?",
  guia:          "Olá! Baixei o Guia Completo MCMV e quero ajuda para aplicar no meu caso.",
  obrigado:      "Olá! Acabei de baixar o Guia Completo MCMV. Quero dar o próximo passo.",
  documentos:    "Olá! Quero conferir a lista de documentos do Minha Casa Minha Vida para o meu caso.",
  passo:         "Olá! Quero começar o processo do Minha Casa Minha Vida. Qual é o primeiro passo?",
  quem_pode:     "Olá! Quero confirmar se eu posso participar do Minha Casa Minha Vida.",
  renda:         "Olá! Minha dúvida é sobre renda familiar no Minha Casa Minha Vida.",
  fgts:          "Olá! Quero saber se posso usar meu FGTS no Minha Casa Minha Vida.",
  entrada:       "Olá! Quero saber se preciso dar entrada no Minha Casa Minha Vida.",
  parcelas:      "Olá! Quero entender quanto ficaria a minha parcela no Minha Casa Minha Vida.",
  nome_sujo:     "Olá! Estou com dúvida sobre nome negativado e o Minha Casa Minha Vida. Quero saber se consigo.",
  score:         "Olá! Meu score está baixo e quero saber se isso me impede de comprar pelo MCMV.",
  aprovacao:     "Olá! Quero entender como funciona a aprovação do Minha Casa Minha Vida no meu caso.",
  empreendimentos: "Olá! Quero conhecer os empreendimentos disponíveis pelo Minha Casa Minha Vida.",
  sobre:         "Olá! Vi seu perfil no site MCMV Sem Dúvidas e quero conversar.",
  contato:       "Olá! Quero falar sobre o Minha Casa Minha Vida.",
  blog:          "Olá! Li um artigo no site MCMV Sem Dúvidas e quero saber como isso vale para o meu caso."
};
