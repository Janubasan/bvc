(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const storage = {
    get(key, fallback = null) {
      try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : JSON.parse(value);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // The guide remains functional when storage is blocked.
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {
        // No-op when storage is blocked.
      }
    }
  };

  let toastTimer;
  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  function safeNumber(value, min = 0, max = Number.POSITIVE_INFINITY) {
    const parsed = Number.parseFloat(String(value).replace(",", "."));
    if (!Number.isFinite(parsed)) return min;
    return Math.min(max, Math.max(min, parsed));
  }

  function formatNumber(value, maximumFractionDigits = 2) {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: value > 0 && value < 10 ? Math.min(2, maximumFractionDigits) : 0,
      maximumFractionDigits
    }).format(value);
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  // Theme
  const themeToggle = $("#theme-toggle");
  const savedTheme = storage.get("campo-theme");
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  document.documentElement.dataset.theme = initialTheme;

  function syncThemeLabel() {
    if (!themeToggle) return;
    const dark = document.documentElement.dataset.theme === "dark";
    themeToggle.setAttribute("aria-label", dark ? "Ativar tema claro" : "Ativar tema escuro");
    themeToggle.setAttribute("title", dark ? "Ativar tema claro" : "Ativar tema escuro");
  }

  syncThemeLabel();
  themeToggle?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    storage.set("campo-theme", next);
    syncThemeLabel();
  });

  // Reading progress and back-to-top
  const scrollBar = $("#scroll-progress-bar");
  const railFill = $("#rail-progress-fill");
  const railLabel = $("#rail-progress-label");
  const backToTop = $("#back-to-top");

  function updateScrollProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
    if (scrollBar) scrollBar.style.width = `${progress}%`;
    if (railFill) railFill.style.width = `${progress}%`;
    if (railLabel) railLabel.textContent = `${Math.round(progress)}% explorado`;
    backToTop?.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.7);
  }

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Active chapter in the rail
  const railLinks = $$(".chapter-rail a[data-section]");
  const chapterSections = $$(".chapter[data-chapter]");
  if ("IntersectionObserver" in window && railLinks.length && chapterSections.length) {
    const chapterObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      railLinks.forEach((link) => {
        link.classList.toggle("is-active", link.dataset.section === visible.target.id);
      });
    }, { rootMargin: "-18% 0px -62%", threshold: [0.05, 0.2, 0.45] });
    chapterSections.forEach((section) => chapterObserver.observe(section));
  }

  // Personalized route
  const routeData = {
    zero: {
      code: "ROTA 01 / FUNDAÇÃO",
      duration: "PRÓXIMOS 7 DIAS",
      name: "Seu trabalho é encontrar uma boa pergunta.",
      description: "Não abra cinco canais nem escolha dez produtos. Primeiro, encontre um grupo que você entende e uma decisão de compra que consegue tornar mais segura.",
      steps: [
        "Mapeie 30 frases reais do público.",
        "Audite 3 ofertas; escolha no máximo uma.",
        "Publique uma resposta útil sem depender do link."
      ],
      cta: "Começar pela escolha do nicho",
      href: "#nicho"
    },
    creator: {
      code: "ROTA 02 / MONETIZAÇÃO",
      duration: "PRÓXIMOS 7 DIAS",
      name: "Comece pelas decisões que sua audiência já pede ajuda para tomar.",
      description: "Sua vantagem é a linguagem e a confiança já conquistadas. Procure perguntas repetidas, selecione uma oferta coerente e produza evidência antes de inserir links.",
      steps: [
        "Revise comentários, DMs e buscas dos últimos 90 dias.",
        "Escolha uma pergunta de comparação ou decisão.",
        "Construa uma ponte transparente e rastreável."
      ],
      cta: "Auditar uma oferta",
      href: "#oferta"
    },
    traffic: {
      code: "ROTA 03 / DIAGNÓSTICO",
      duration: "PRÓXIMAS 72 HORAS",
      name: "Pare de publicar mais até encontrar onde a passagem quebra.",
      description: "Tráfego sem venda pode ser intenção errada, prova insuficiente, link quebrado, atribuição perdida ou oferta sem fit. Isole a etapa antes de trocar de nicho.",
      steps: [
        "Teste cada link, dispositivo, região e parâmetro.",
        "Separe visitas, cliques na oferta e vendas aprovadas.",
        "Corrija o maior gargalo com um único experimento."
      ],
      cta: "Abrir o laboratório de métricas",
      href: "#metricas"
    },
    scale: {
      code: "ROTA 04 / ESCALA",
      duration: "PRÓXIMOS 14 DIAS",
      name: "Escala é repetir o que já funciona sem diluir a confiança.",
      description: "Documente a combinação público × pergunta × formato × oferta que já converteu. Expanda adjacências e canais somente com tracking, qualidade e capacidade de atualização.",
      steps: [
        "Calcule EPC aprovado e reversão por peça.",
        "Atualize e distribua os 20% de ativos mais fortes.",
        "Crie redundância de canal, oferta e audiência própria."
      ],
      cta: "Revisar funil e tracking",
      href: "#funil"
    }
  };

  function setRoute(routeKey, announce = false) {
    const resolvedKey = routeData[routeKey] ? routeKey : "zero";
    const route = routeData[resolvedKey];
    $$(".route-option").forEach((button) => {
      const active = button.dataset.route === resolvedKey;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    $("#route-code").textContent = route.code;
    $("#route-duration").textContent = route.duration;
    $("#route-name").textContent = route.name;
    $("#route-description").textContent = route.description;
    const list = $("#route-steps");
    list.replaceChildren(...route.steps.map((step, index) => {
      const item = document.createElement("li");
      const number = document.createElement("span");
      number.textContent = String(index + 1);
      item.append(number, document.createTextNode(step));
      return item;
    }));
    const cta = $("#route-cta");
    cta.childNodes[0].nodeValue = `${route.cta} `;
    cta.href = route.href;
    storage.set("campo-route", resolvedKey);
    if (announce) showToast("Rota atualizada.");
  }

  $$(".route-option").forEach((button) => {
    button.addEventListener("click", () => setRoute(button.dataset.route, true));
  });
  setRoute(storage.get("campo-route", "zero"));

  // Niche radar
  const nicheRanges = $$('[data-niche-range]');
  const nicheScore = $("#niche-score");
  const nicheVerdict = $("#niche-verdict");
  const savedNicheScores = storage.get("campo-niche-scores", []);
  if (Array.isArray(savedNicheScores) && savedNicheScores.length === nicheRanges.length) {
    nicheRanges.forEach((range, index) => {
      range.value = String(safeNumber(savedNicheScores[index], 0, 5));
    });
  }

  function updateNicheScore() {
    const values = nicheRanges.map((range) => safeNumber(range.value, 0, 5));
    const total = values.reduce((sum, value) => sum + value, 0);
    nicheRanges.forEach((range) => {
      const output = range.parentElement.querySelector("output");
      if (output) output.textContent = range.value;
    });
    nicheScore.textContent = String(total);

    let label;
    let copy;
    if (total <= 9) {
      label = `${total} PONTOS · PAUSAR`;
      copy = "Há mais hipótese do que evidência. Não compre ferramentas nem tráfego ainda; volte à escuta e procure outro recorte se o acesso continuar baixo.";
    } else if (total <= 16) {
      label = `${total} PONTOS · VALIDAR`;
      copy = "Há sinal, mas ainda existem suposições caras. Converse com o público e teste um conteúdo de decisão antes de montar a operação.";
    } else if (total <= 21) {
      label = `${total} PONTOS · PROMISSOR`;
      copy = "O recorte merece um sprint. Valide a qualidade das ofertas e produza uma evidência própria antes de ampliar a distribuição.";
    } else {
      label = `${total} PONTOS · FORTE`;
      copy = "Boa combinação de acesso, intenção, prova, ofertas e fôlego. Avance — mantendo o nicho como hipótese revisável, não como identidade eterna.";
    }
    nicheVerdict.querySelector("span").textContent = label;
    nicheVerdict.querySelector("p").textContent = copy;
    storage.set("campo-niche-scores", values);
  }

  nicheRanges.forEach((range) => range.addEventListener("input", updateNicheScore));
  updateNicheScore();

  // Positioning sentence
  const positioningFields = [$("#position-audience"), $("#position-result"), $("#position-barrier")];
  const positioningPreview = $("#positioning-preview");
  const savedPositioning = storage.get("campo-positioning", {});
  positioningFields.forEach((field) => {
    if (savedPositioning[field.id]) field.value = savedPositioning[field.id];
  });

  function appendMarked(parent, value, fallback) {
    const mark = document.createElement("mark");
    mark.textContent = value.trim() || fallback;
    parent.append(mark);
  }

  function updatePositioning() {
    const [audience, result, barrier] = positioningFields.map((field) => field.value);
    positioningPreview.replaceChildren(document.createTextNode("Eu ajudo "));
    appendMarked(positioningPreview, audience, "[público]");
    positioningPreview.append(document.createTextNode(" a "));
    appendMarked(positioningPreview, result, "[resultado]");
    positioningPreview.append(document.createTextNode(" sem "));
    appendMarked(positioningPreview, barrier, "[restrição]");
    positioningPreview.append(document.createTextNode(", usando testes e comparações honestas."));
    storage.set("campo-positioning", Object.fromEntries(positioningFields.map((field) => [field.id, field.value])));
  }

  positioningFields.forEach((field) => field.addEventListener("input", updatePositioning));
  updatePositioning();

  // Offer audit
  const positiveChecks = $$('[data-offer-positive]');
  const redChecks = $$('[data-offer-red]');
  const allOfferChecks = [...positiveChecks, ...redChecks];
  const savedAudit = storage.get("campo-offer-audit", {});
  allOfferChecks.forEach((checkbox, index) => {
    checkbox.dataset.auditIndex = String(index);
    checkbox.checked = Boolean(savedAudit[index]);
  });

  function updateOfferAudit() {
    const positives = positiveChecks.filter((checkbox) => checkbox.checked).length;
    const blockers = redChecks.filter((checkbox) => checkbox.checked).length;
    const percent = Math.round((positives / positiveChecks.length) * 100);
    $("#offer-score").textContent = `${percent}%`;
    const label = $("#offer-label");
    const verdict = $("#offer-verdict");
    const verdictLabel = verdict.querySelector("span");
    const verdictCopy = verdict.querySelector("p");

    if (blockers > 0) {
      label.textContent = "BLOQUEADA";
      verdictLabel.textContent = "REJEITAR / INVESTIGAR";
      verdictCopy.textContent = `${blockers} bloqueador${blockers > 1 ? "es" : ""} marcado${blockers > 1 ? "s" : ""}. Não tente compensar risco de confiança com uma comissão maior.`;
    } else if (positives < 6) {
      label.textContent = positives ? "INCOMPLETA" : "NÃO AVALIADA";
      verdictLabel.textContent = "PESQUISAR MAIS";
      verdictCopy.textContent = `Você confirmou ${positives} de ${positiveChecks.length} critérios. Com menos de 6, a pesquisa ainda não sustenta uma recomendação.`;
    } else if (positives < positiveChecks.length) {
      label.textContent = "TESTE PEQUENO";
      verdictLabel.textContent = "PODE VALIDAR";
      verdictCopy.textContent = "Não há bloqueador marcado e a base é razoável. Faça um teste pequeno, documente a experiência e monitore reversões e suporte.";
    } else {
      label.textContent = "BASE FORTE";
      verdictLabel.textContent = "APTA PARA TESTE";
      verdictCopy.textContent = "Todos os critérios foram verificados. Isso não garante conversão; autoriza um teste responsável com tracking e revisão periódica.";
    }

    storage.set("campo-offer-audit", Object.fromEntries(allOfferChecks.map((checkbox, index) => [index, checkbox.checked])));
  }

  allOfferChecks.forEach((checkbox) => checkbox.addEventListener("change", updateOfferAudit));
  updateOfferAudit();

  // Honest brief generator
  function addBriefSection(container, title, content, ordered = false) {
    const heading = document.createElement("h4");
    heading.textContent = title;
    container.append(heading);
    if (Array.isArray(content)) {
      const list = document.createElement(ordered ? "ol" : "ul");
      content.forEach((text) => {
        const item = document.createElement("li");
        item.textContent = text;
        list.append(item);
      });
      container.append(list);
    } else {
      const paragraph = document.createElement("p");
      paragraph.textContent = content;
      container.append(paragraph);
    }
  }

  $("#generate-brief")?.addEventListener("click", () => {
    const product = $("#brief-product").value.trim();
    const audience = $("#brief-audience").value.trim();
    const question = $("#brief-question").value.trim();
    const evidence = $("#brief-evidence").value;
    if (!product || !audience || !question) {
      showToast("Preencha produto, público e dúvida decisiva.");
      return;
    }

    const output = $("#brief-output");
    const text = $("#brief-output-text");
    text.replaceChildren();
    addBriefSection(text, "Título de trabalho", `${product} para ${audience}: ${question.replace(/[?!.]+$/, "")}? Teste, limites e alternativas.`);
    addBriefSection(text, "Veredito que você precisa provar", `Explique em uma frase quando ${product} resolve — e quando não resolve — a dúvida “${question}”. Não escreva o veredito antes do teste.`);
    addBriefSection(text, "Plano de evidência", [
      `Documentar o contexto e executar ${evidence}.`,
      "Definir três critérios que importam especificamente para esse público.",
      "Registrar pelo menos uma falha, limite ou condição de anti-fit.",
      "Comparar com a alternativa mais próxima e com a opção de não comprar."
    ], true);
    addBriefSection(text, "Estrutura", [
      "Aviso comercial visível + resposta curta.",
      "Para quem serve / para quem não serve.",
      "Método, versão, data e limites do teste.",
      "Resultados por critério com evidência própria.",
      "Prós, contras, custo total e alternativa.",
      "Veredito e CTA descritivo, sem urgência falsa."
    ], true);
    addBriefSection(text, "Pergunta de controle", "A peça ainda ajudaria essa pessoa se todos os links fossem removidos? Se não, falta valor editorial.");
    output.hidden = false;
    output.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  // Channel picker
  const channelData = {
    search: {
      fit: "MELHOR PARA · DEMANDA EXISTENTE",
      title: "Responder perguntas que já têm intenção.",
      description: "Busca e YouTube favorecem demonstrações completas, comparativos e tutoriais que continuam encontráveis. Exigem originalidade e atualização.",
      format: "1 review profunda + 2 respostas de apoio",
      metric: "impressões qualificadas → clique no conteúdo",
      mistake: "reescrever especificações sem testar ou comparar",
      rule: "mostre a evidência e responda a decisão antes do CTA"
    },
    short: {
      fit: "MELHOR PARA · DESCOBERTA E DEMONSTRAÇÃO",
      title: "Ganhar atenção com uma prova visível em poucos segundos.",
      description: "Vídeo curto funciona quando o produto ou problema pode ser mostrado. Use o corte para abrir a decisão; leve o contexto completo para uma propriedade sua.",
      format: "problema → demonstração → limite → próximo passo",
      metric: "retenção qualificada → visita ao perfil/página",
      mistake: "otimizar só para viralidade e atrair o público errado",
      rule: "uma ideia por vídeo; disclosure na própria peça"
    },
    reddit: {
      fit: "MELHOR PARA · LINGUAGEM E OBJEÇÕES",
      title: "Contribuir antes de distribuir.",
      description: "Comunidades revelam perguntas e trade-offs que páginas comerciais omitem. Cada espaço tem cultura e regras próprias; resposta útil vem antes do link.",
      format: "resposta completa, contexto pessoal e fonte quando necessário",
      metric: "respostas úteis, conversas e cliques permitidos",
      mistake: "criar pergunta falsa, copiar resposta ou esconder afiliação",
      rule: "se o link sumir, a resposta continua resolvendo algo"
    },
    x: {
      fit: "MELHOR PARA · IDEIAS, REDE E FEEDBACK",
      title: "Ensinar em público e documentar o trabalho.",
      description: "Posts e threads permitem testar enquadramentos rapidamente. Prova, opinião específica e interação relevante valem mais que uma sequência infinita de links.",
      format: "observação → evidência → implicação → pergunta/CTA",
      metric: "respostas do público certo → visitas qualificadas",
      mistake: "transformar cada post em pitch ou usar prova emprestada",
      rule: "publique o aprendizado; deixe a página completar a decisão"
    },
    email: {
      fit: "MELHOR PARA · AUDIÊNCIA CONSENTIDA",
      title: "Acompanhar a decisão sem depender do algoritmo.",
      description: "E-mail é um ativo próprio quando a permissão é real. Segmente por interesse, entregue valor e mantenha identidade, finalidade e descadastro claros.",
      format: "uma pergunta → uma lição → uma recomendação contextual",
      metric: "clique qualificado, resposta e descadastro — não só abertura",
      mistake: "comprar lista, esconder promoção ou bombardear frequência",
      rule: "permissão, relevância e saída simples em toda mensagem"
    }
  };

  function setChannel(key) {
    const channel = channelData[key] || channelData.search;
    $$("[data-channel]").forEach((button, index) => {
      const active = button.dataset.channel === key;
      if (!button.id) button.id = `channel-tab-${index + 1}`;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
      if (active) $("#channel-panel").setAttribute("aria-labelledby", button.id);
    });
    $("#channel-fit").textContent = channel.fit;
    $("#channel-title").textContent = channel.title;
    $("#channel-description").textContent = channel.description;
    $("#channel-format").textContent = channel.format;
    $("#channel-metric").textContent = channel.metric;
    $("#channel-mistake").textContent = channel.mistake;
    $("#channel-rule").textContent = channel.rule;
  }

  const channelTabs = $$("[data-channel]");
  channelTabs.forEach((button) => {
    button.addEventListener("click", () => setChannel(button.dataset.channel));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const current = channelTabs.indexOf(button);
      let next = current;
      if (event.key === "ArrowRight") next = (current + 1) % channelTabs.length;
      if (event.key === "ArrowLeft") next = (current - 1 + channelTabs.length) % channelTabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = channelTabs.length - 1;
      setChannel(channelTabs[next].dataset.channel);
      channelTabs[next].focus();
    });
  });
  setChannel("search");

  // Disclosure generator
  const disclosureTemplates = {
    blog: {
      placement: "Coloque antes do primeiro link de afiliado.",
      text: (name) => `Publicidade / links de afiliado: ${name ? `${name} pode` : "posso"} receber uma comissão se você comprar por alguns links desta página, sem custo adicional para você. Isso não altera os critérios da análise.`
    },
    social: {
      placement: "Use na primeira linha, visível antes de “ver mais”.",
      text: (name) => `#Publicidade — Este conteúdo inclui link de afiliado. ${name ? `${name} pode` : "Posso"} receber comissão se houver compra, sem custo extra para você. A recomendação segue os critérios mostrados no post.`
    },
    video: {
      placement: "Fale e mostre no início; repita próximo ao CTA.",
      text: (name) => `Publicidade: há links de afiliado neste vídeo. Se você comprar por eles, ${name || "eu"} ${name ? "pode receber" : "posso receber"} uma comissão, sem custo extra para você. Vou mostrar também os limites e para quem o produto não serve.`
    },
    email: {
      placement: "Inclua antes da recomendação e mantenha descadastro visível.",
      text: (name) => `Publicidade / afiliados: este e-mail contém links que podem gerar comissão para ${name || "mim"}, sem custo adicional para você. A seleção é editorial e inclui apenas opções pertinentes ao tema desta mensagem.`
    }
  };

  function updateDisclosure() {
    const format = $("#disclosure-format").value;
    const name = $("#disclosure-name").value.trim();
    const template = disclosureTemplates[format];
    $("#disclosure-placement").textContent = template.placement;
    $("#disclosure-text").textContent = template.text(name);
  }

  $("#disclosure-format")?.addEventListener("change", updateDisclosure);
  $("#disclosure-name")?.addEventListener("input", updateDisclosure);

  // Scenario calculator
  const calculatorDefaults = {
    "calc-views": 10000,
    "calc-content-ctr": 3,
    "calc-outbound-ctr": 30,
    "calc-cvr": 2,
    "calc-ticket": 200,
    "calc-commission": 10,
    "calc-reversal": 5
  };
  const calculatorInputs = Object.keys(calculatorDefaults).map((id) => document.getElementById(id));
  const savedCalculator = storage.get("campo-calculator", {});
  calculatorInputs.forEach((input) => {
    if (savedCalculator[input.id] !== undefined) input.value = savedCalculator[input.id];
  });

  function updateCalculator() {
    const views = safeNumber($("#calc-views").value);
    const contentRate = safeNumber($("#calc-content-ctr").value, 0, 100) / 100;
    const outboundRate = safeNumber($("#calc-outbound-ctr").value, 0, 100) / 100;
    const conversionRate = safeNumber($("#calc-cvr").value, 0, 100) / 100;
    const ticket = safeNumber($("#calc-ticket").value);
    const commissionRate = safeNumber($("#calc-commission").value, 0, 100) / 100;
    const reversalRate = safeNumber($("#calc-reversal").value, 0, 100) / 100;

    const bridgeVisits = views * contentRate;
    const offerClicks = bridgeVisits * outboundRate;
    const grossSales = offerClicks * conversionRate;
    const approvedSales = grossSales * (1 - reversalRate);
    const revenue = approvedSales * ticket * commissionRate;
    const epc = offerClicks > 0 ? revenue / offerClicks : 0;
    const rpm = views > 0 ? (revenue / views) * 1000 : 0;

    $("#result-revenue").textContent = formatCurrency(revenue);
    $("#result-bridge").textContent = formatNumber(bridgeVisits);
    $("#result-clicks").textContent = formatNumber(offerClicks);
    $("#result-sales").textContent = formatNumber(grossSales);
    $("#result-approved").textContent = formatNumber(approvedSales);
    $("#result-epc").textContent = formatCurrency(epc);
    $("#result-rpm").textContent = formatCurrency(rpm);
    const doubledConversion = Math.min(1, conversionRate * 2);
    const conversionLift = offerClicks * (doubledConversion - conversionRate) * (1 - reversalRate) * ticket * commissionRate;
    $("#result-sensitivity").textContent = `Levar a conversão da oferta de ${formatNumber(conversionRate * 100, 1)}% para ${formatNumber(doubledConversion * 100, 1)}% adicionaria ${formatCurrency(conversionLift)} neste modelo. Dobrar o tráfego adicionaria ${formatCurrency(revenue)}, mas provavelmente exigiria mais produção ou mídia.`;

    storage.set("campo-calculator", Object.fromEntries(calculatorInputs.map((input) => [input.id, input.value])));
  }

  calculatorInputs.forEach((input) => input.addEventListener("input", updateCalculator));
  $("#reset-calculator")?.addEventListener("click", () => {
    calculatorInputs.forEach((input) => { input.value = calculatorDefaults[input.id]; });
    storage.remove("campo-calculator");
    updateCalculator();
    showToast("Cenário de exemplo restaurado.");
  });
  updateCalculator();

  // 30-day plan progress
  const planTasks = $$('[data-plan-task]');
  const savedPlan = storage.get("campo-plan", {});
  planTasks.forEach((task) => { task.checked = Boolean(savedPlan[task.dataset.planTask]); });

  function updatePlan() {
    const completed = planTasks.filter((task) => task.checked).length;
    const total = planTasks.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    $("#plan-percent").textContent = `${percent}%`;
    const circle = $("#plan-progress-circle");
    const circumference = 2 * Math.PI * 52;
    circle.style.strokeDasharray = String(circumference);
    circle.style.strokeDashoffset = String(circumference * (1 - percent / 100));

    $$(".week-card").forEach((week) => {
      const tasks = $$('[data-plan-task]', week);
      const done = tasks.filter((task) => task.checked).length;
      const label = $("[data-week-progress]", week);
      label.textContent = `${done} / ${tasks.length}`;
    });

    let title = "A fundação começa agora.";
    let copy = "Marque cada entrega concluída. Seu progresso fica salvo somente neste navegador.";
    if (percent > 0 && percent < 25) {
      title = "Foco antes de velocidade.";
      copy = "Feche a tese de público e problema antes de adicionar canais, links ou automações.";
    } else if (percent >= 25 && percent < 50) {
      title = "Agora transforme opinião em prova.";
      copy = "Documente método, limites e evidência. A ponte precisa merecer o clique.";
    } else if (percent >= 50 && percent < 75) {
      title = "Distribua e converse.";
      copy = "Observe a linguagem das respostas. Objeções reais são matéria-prima para a próxima melhoria.";
    } else if (percent >= 75 && percent < 100) {
      title = "Leia o sistema inteiro.";
      copy = "Reconcilie os eventos, atualize o conteúdo e escolha apenas um gargalo para o próximo teste.";
    } else if (percent === 100) {
      title = "Ciclo completo. Comece o próximo mais inteligente.";
      copy = "Registre o que manter, parar e testar. O objetivo agora é consistência com qualidade.";
    }
    $("#plan-status-title").textContent = title;
    $("#plan-status-copy").textContent = copy;
    storage.set("campo-plan", Object.fromEntries(planTasks.map((task) => [task.dataset.planTask, task.checked])));
  }

  planTasks.forEach((task) => task.addEventListener("change", updatePlan));
  $("#reset-plan")?.addEventListener("click", () => {
    if (!window.confirm("Limpar todas as tarefas marcadas neste navegador?")) return;
    planTasks.forEach((task) => { task.checked = false; });
    storage.remove("campo-plan");
    updatePlan();
    showToast("Progresso limpo.");
  });
  updatePlan();

  // UTM builder
  function normalizeUtm(value) {
    return value
      .trim()
      .toLocaleLowerCase("pt-BR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  $("#build-utm")?.addEventListener("click", () => {
    const rawUrl = $("#utm-url").value.trim();
    if (!rawUrl) {
      showToast("Informe a URL de destino.");
      return;
    }

    let url;
    try {
      url = new URL(rawUrl);
      if (!/^https?:$/.test(url.protocol)) throw new Error("Invalid protocol");
    } catch {
      showToast("Use uma URL completa iniciada por http:// ou https://.");
      return;
    }

    const params = {
      utm_source: normalizeUtm($("#utm-source").value),
      utm_medium: normalizeUtm($("#utm-medium").value),
      utm_campaign: normalizeUtm($("#utm-campaign").value),
      utm_content: normalizeUtm($("#utm-content").value)
    };
    if (!params.utm_source || !params.utm_medium || !params.utm_campaign) {
      showToast("Preencha origem, meio e campanha.");
      return;
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    });
    $("#utm-result").textContent = url.toString();
    $("#utm-result-wrap").hidden = false;
  });

  // Source library
  const sources = [
    {
      id: "R1", type: "reddit", date: "abr 2026", label: "Relato de comunidade",
      title: "Tips for beginners starting Affiliate Marketing in 2026",
      note: "Discussão com um padrão recorrente: um nicho, uma oferta, um canal e consistência antes de expandir. Evidência anedótica, não benchmark.",
      url: "https://www.reddit.com/r/AffiliateMarket/comments/1sciqhq/tips_for_beginners_starting_affiliate_marketing/"
    },
    {
      id: "R2", type: "reddit", date: "mar 2026", label: "Relato de comunidade",
      title: "Is affiliate marketing still a reliable full-time income?",
      note: "Respostas enfatizam confiança, ativos próprios e risco de depender de um único algoritmo. Alegações de renda não foram usadas neste guia.",
      url: "https://www.reddit.com/r/Affiliatemarketing/comments/1rowncd/is_affiliate_marketing_still_a_reliable_fulltime/"
    },
    {
      id: "R3", type: "reddit", date: "dez 2025", label: "Discussão técnica",
      title: "Best practices for affiliate marketing in 2025",
      note: "Conversa sobre qualidade de atribuição, conversão, suporte, atualização de feeds e ativos controlados pelo afiliado.",
      url: "https://www.reddit.com/r/eCommerceSEO/comments/1ph21wd/advice_needed_best_practices_for_affiliate/"
    },
    {
      id: "R4", type: "reddit", date: "mai 2026", label: "Discussão prática",
      title: "Problem-solving intent before link dropping",
      note: "Participantes contrastam conteúdo centrado no problema com posts centrados no produto. Mantido como sinal de comunidade.",
      url: "https://www.reddit.com/r/passive_income/comments/1tn1g40/a_complete_stepbystep_breakdown_on_combining/"
    },
    {
      id: "X1", type: "x", date: "set 2026", label: "Especialista em SEO",
      title: "Aleyda Solis: first-hand evidence in the AI search era",
      note: "Defende especialização vertical, guias de compra, comparações, medidas, imagens próprias e explicação dos trade-offs.",
      url: "https://x.com/aleyda/status/2095335230148415622"
    },
    {
      id: "X2", type: "x", date: "jul 2023", label: "Síntese de marketing",
      title: "Alex Hormozi: audience, desire and mutual benefit",
      note: "Síntese útil para parcerias: localizar quem já tem a audiência, entender o que ela quer e criar valor para os dois lados.",
      url: "https://x.com/AlexHormozi/status/1678806496669302784"
    },
    {
      id: "X3", type: "x", date: "jan 2026", label: "Artigo opinativo",
      title: "Affiliate marketing as a system, not a shortcut",
      note: "Post de Claudia sobre relevância da audiência, educação de parceiros, tracking e pensamento de longo prazo. Tratado como opinião, não prova causal.",
      url: "https://x.com/0x_claudia/status/2010076585832108101"
    },
    {
      id: "G1", type: "github", date: "acesso out 2026", label: "Repositório open source",
      title: "dubinc/dub — link attribution platform",
      note: "Arquitetura real para links curtos, atribuição, conversões e programas de afiliados. Útil para entender a separação das camadas de tracking.",
      url: "https://github.com/dubinc/dub"
    },
    {
      id: "G2", type: "github", date: "acesso out 2026", label: "Repositório open source",
      title: "umami-software/umami — privacy-first analytics",
      note: "Analytics de campanhas, comportamento, conversão e receita com opção self-hosted. Referência, não recomendação patrocinada.",
      url: "https://github.com/umami-software/umami"
    },
    {
      id: "G3", type: "github", date: "acesso out 2026", label: "Repositório open source",
      title: "rybbit-io/rybbit — goals, journeys and funnels",
      note: "Implementa eventos customizados, metas, jornadas e funis. Reforça a medição das passagens, não apenas da venda final.",
      url: "https://github.com/rybbit-io/rybbit"
    },
    {
      id: "G4", type: "github", date: "acesso out 2026", label: "Biblioteca open source",
      title: "coreyhaines31/marketingskills — workflows de marketing",
      note: "Biblioteca MIT que decompõe pesquisa, conteúdo, CRO, analytics e testes em processos. Inspiração para ferramentas e checklists deste guia.",
      url: "https://github.com/coreyhaines31/marketingskills"
    },
    {
      id: "O1", type: "official", date: "atual. dez 2025", label: "Google Search Central",
      title: "Write high quality reviews",
      note: "Orienta perspectiva do usuário, experiência demonstrável, medidas, diferenciais, alternativas, prós, contras e evidência para recomendações.",
      url: "https://developers.google.com/search/docs/specialty/ecommerce/write-high-quality-reviews?hl=pt-br"
    },
    {
      id: "O2", type: "official", date: "acesso out 2026", label: "Google Search Central",
      title: "Spam policies — thin affiliation",
      note: "Distingue páginas afiliadas finas, copiadas do vendedor, de páginas que agregam reviews originais, testes, comparações e informação útil.",
      url: "https://developers.google.com/search/docs/essentials/spam-policies?hl=pt-br#thin-affiliate-pages"
    },
    {
      id: "O3", type: "official", date: "mai 2026", label: "CONAR",
      title: "Guia de Marketing e Publicidade por Influenciadores Digitais",
      note: "Edição 2026 aborda transparência, identificação, testemunhais genuínos, setores restritos, IA, proteção de menores e governança — incluindo afiliados.",
      url: "https://www.conar.org.br/noticias/guia-de-marketing-e-publicidade-por-influenciadores-digitais"
    },
    {
      id: "O4", type: "official", date: "lei vigente", label: "Presidência da República",
      title: "Código de Defesa do Consumidor — Lei 8.078/1990",
      note: "O art. 36 exige que publicidade seja fácil e imediatamente identificada; o capítulo também disciplina engano e sustentação da mensagem.",
      url: "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm#art36"
    },
    {
      id: "O5", type: "official", date: "lei vigente", label: "Presidência da República",
      title: "Lei Geral de Proteção de Dados — Lei 13.709/2018",
      note: "Base para finalidade, adequação, necessidade, transparência, segurança e direitos no tratamento de dados pessoais.",
      url: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm"
    },
    {
      id: "O6", type: "official", date: "out 2022", label: "ANPD",
      title: "Guia orientativo: cookies e proteção de dados pessoais",
      note: "Explica cookies necessários e não necessários, consentimento, legítimo interesse e maior controle para cookies de publicidade.",
      url: "https://www.gov.br/anpd/pt-br/centrais-de-conteudo/materiais-educativos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf"
    }
  ];

  const sourceList = $("#source-list");
  function renderSources() {
    if (!sourceList) return;
    sourceList.replaceChildren(...sources.map((source) => {
      const article = document.createElement("article");
      article.className = "source-item";
      article.dataset.type = source.type;
      article.id = `source-${source.id.toLowerCase()}`;

      const code = document.createElement("div");
      code.className = "source-code";
      code.textContent = source.id;
      code.append(document.createElement("span"));

      const body = document.createElement("div");
      body.className = "source-body";
      const meta = document.createElement("span");
      meta.textContent = `${source.label} · ${source.date}`;
      const title = document.createElement("h3");
      title.textContent = source.title;
      const note = document.createElement("p");
      note.textContent = source.note;
      const link = document.createElement("a");
      link.href = source.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Abrir fonte ↗";
      body.append(meta, title, note, link);
      article.append(code, body);
      return article;
    }));
    $("#source-count").textContent = `${sources.length} fontes selecionadas`;
  }

  function filterSources(type) {
    const items = $$(".source-item");
    let visible = 0;
    items.forEach((item) => {
      const show = type === "all" || item.dataset.type === type;
      item.hidden = !show;
      if (show) visible += 1;
    });
    $$("[data-source-filter]").forEach((button) => {
      const active = button.dataset.sourceFilter === type;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    $("#source-count").textContent = `${visible} fonte${visible === 1 ? "" : "s"} selecionada${visible === 1 ? "" : "s"}`;
  }

  renderSources();
  $$("[data-source-filter]").forEach((button) => button.addEventListener("click", () => filterSources(button.dataset.sourceFilter)));
  $$("a[href^='#source-']").forEach((link) => {
    link.addEventListener("click", () => filterSources("all"));
  });

  // Copy controls
  async function copyText(text) {
    if (!text.trim()) throw new Error("Empty text");
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    const copied = document.execCommand("copy");
    area.remove();
    if (!copied) throw new Error("Copy failed");
  }

  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy-target]");
    if (!button) return;
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;
    try {
      await copyText(target.innerText || target.textContent || "");
      const original = button.textContent;
      button.textContent = "Copiado ✓";
      showToast("Copiado para a área de transferência.");
      setTimeout(() => { button.textContent = original; }, 1600);
    } catch {
      showToast("Não foi possível copiar automaticamente.");
    }
  });

  $("#print-guide")?.addEventListener("click", () => window.print());
})();
