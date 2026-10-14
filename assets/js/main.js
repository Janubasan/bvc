/* ============================================================
   MCMV SEM DÚVIDAS — Motor do site (tempo real)
   ------------------------------------------------------------
   Leia o conteúdo deste arquivo apenas se quiser entender a
   mecânica. Para configurar corretores, mensagens e rastreamento,
   use o arquivo config.js.
   ============================================================ */
(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var MSGS = window.SITE_MSGS || {};
  var corretores = (CFG.corretores || []);
  var meuStorage = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  /* ---------------- utilitários ---------------- */
  function telefoneEhPlaceholder(tel) { return !tel || /0{6,}/.test(tel); }

  function corretorPorId(id) {
    for (var i = 0; i < corretores.length; i++) { if (String(corretores[i].id) === String(id)) return corretores[i]; }
    return corretores[0];
  }

  function linkWa(corretor, mensagem) {
    return "https://wa.me/" + corretor.whatsapp + "?text=" + encodeURIComponent(mensagem);
  }

  function toast(msg) {
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("show"); });
    setTimeout(function () { el.classList.remove("show"); setTimeout(function () { el.remove(); }, 400); }, 4200);
  }

  function evento(nome, dados) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(Object.assign({ event: nome }, dados || {}));
  }

  function initTelMask() {
    var inputs = document.querySelectorAll('input[name="whatsapp"]');
    inputs.forEach(function (input) {
      input.addEventListener("input", function () {
        var v = input.value.replace(/\D/g, "").slice(0, 11);
        var out = v;
        if (v.length > 2) out = "(" + v.slice(0, 2) + ") " + v.slice(2);
        if (v.length > 7) out = "(" + v.slice(0, 2) + ") " + v.slice(2, 7) + "-" + v.slice(7);
        input.value = out;
      });
    });
  }

  /* ---------------- UTM: captura e persistência ---------------- */
  function capturarUtms() {
    var params = new URLSearchParams(location.search);
    var utms = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"].forEach(function (k) {
      var v = params.get(k);
      if (v) utms[k] = v;
    });
    if (Object.keys(utms).length) meuStorage.set("mcmv_utms", JSON.stringify(utms));
  }
  function lerUtms() {
    try { return JSON.parse(meuStorage.get("mcmv_utms") || "{}"); } catch (e) { return {}; }
  }

  /* ---------------- Teste A/B entre corretores ---------------- */
  function varianteAB() {
    if (!CFG.abTestCorretores) return "a";
    var v = meuStorage.get("mcmv_ab");
    if (v !== "a" && v !== "b") { v = Math.random() < 0.5 ? "a" : "b"; meuStorage.set("mcmv_ab", v); }
    return v;
  }

  function aplicarAB() {
    var v = varianteAB();
    var primario = (v === "a") ? corretores[0] : corretores[1];
    var secundario = (v === "a") ? corretores[1] : corretores[0];
    document.querySelectorAll('[data-ab="primary"]').forEach(function (el) {
      el.setAttribute("data-corretor", primario ? primario.id : 1);
      var nome = el.querySelector(".js-corretor-nome");
      if (nome && primario) nome.textContent = primario.nome;
    });
    document.querySelectorAll('[data-ab="secondary"]').forEach(function (el) {
      el.setAttribute("data-corretor", secundario ? secundario.id : 2);
      var nome = el.querySelector(".js-corretor-nome");
      if (nome && secundario) nome.textContent = secundario.nome;
    });
    return v;
  }

  /* ---------------- Botões de WhatsApp ---------------- */
  function mensagemDe(el) {
    if (el.getAttribute("data-msg-custom")) return el.getAttribute("data-msg-custom");
    var chave = el.getAttribute("data-msg") || "padrao";
    return MSGS[chave] || MSGS.padrao || "Olá! Vim pelo site MCMV Sem Dúvidas.";
  }

  function ligarBotoesWa() {
    document.querySelectorAll("[data-wa]").forEach(function (el) {
      var c = corretorPorId(el.getAttribute("data-corretor"));
      if (!c) return;
      el.setAttribute("href", linkWa(c, mensagemDe(el)));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
      el.addEventListener("click", function () {
        evento("lead_whatsapp", { corretor: c.nome, pagina: location.pathname });
        if (telefoneEhPlaceholder(c.whatsapp)) {
          toast("⚠️ Número de exemplo: configure o WhatsApp real em assets/js/config.js antes de publicar.");
        }
      });
    });
  }

  function preencherNomesCorretores() {
    document.querySelectorAll(".js-corretor-1-nome").forEach(function (el) { if (corretores[0]) el.textContent = corretores[0].nome; });
    document.querySelectorAll(".js-corretor-2-nome").forEach(function (el) { if (corretores[1]) el.textContent = corretores[1].nome; });
    document.querySelectorAll(".js-corretor-1-creci").forEach(function (el) { if (corretores[0]) el.textContent = corretores[0].creci; });
    document.querySelectorAll(".js-corretor-2-creci").forEach(function (el) { if (corretores[1]) el.textContent = corretores[1].creci; });
    document.querySelectorAll(".js-cidades").forEach(function (el) { el.textContent = CFG.cidadesAtuacao || "[CIDADES]"; });
  }

  /* ---------------- Widget flutuante ---------------- */
  function initWidgetFlutuante() {
    var btn = document.querySelector(".wa-float-btn");
    var painel = document.querySelector(".wa-float-panel");
    if (!btn || !painel) return;
    btn.addEventListener("click", function () { painel.classList.toggle("show"); });
    document.addEventListener("click", function (e) {
      if (!painel.contains(e.target) && !btn.contains(e.target)) painel.classList.remove("show");
    });
  }

  /* ---------------- Exit intent ---------------- */
  function initExitIntent() {
    var modal = document.getElementById("modal-exit");
    if (!modal) return;
    var emPaginaDeOferta = /\/(guia|obrigado)/.test(location.pathname);
    var jaVisto = false;
    try { jaVisto = sessionStorage.getItem("mcmv_exit") === "1"; } catch (e) {}
    if (emPaginaDeOferta || jaVisto) return;

    var mostrar = function () {
      try { sessionStorage.setItem("mcmv_exit", "1"); } catch (e) {}
      modal.classList.add("show");
      evento("exit_intent", { pagina: location.pathname });
    };
    var saidaPendente = null;
    document.addEventListener("mouseout", function (e) {
      if (e.clientY > 12 || e.relatedTarget) return;
      clearTimeout(saidaPendente);
      saidaPendente = setTimeout(mostrar, 80);
    });
    // Mobile: dispara após 25s de visita, uma única vez
    setTimeout(function () {
      if (window.innerWidth < 900 && !jaVisto) mostrar();
    }, 25000);

    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest(".modal-fechar")) modal.classList.remove("show");
    });
  }

  /* ---------------- Leads: gravação e envio ---------------- */
  function gravarLead(payload) {
    var leads = [];
    try { leads = JSON.parse(meuStorage.get("mcmv_leads") || "[]"); } catch (e) {}
    leads.push(payload);
    meuStorage.set("mcmv_leads", JSON.stringify(leads));
    if (CFG.webhookUrl) {
      try {
        fetch(CFG.webhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } catch (e) { /* webhook falhou — lead segue salvo no navegador */ }
    }
  }

  function coletarForm(form) {
    var dados = {};
    new FormData(form).forEach(function (v, k) { if (v !== "") dados[k] = v; });
    return dados;
  }

  function validarForm(form) {
    var ok = true;
    var nome = form.querySelector('[name="nome"]');
    var zap = form.querySelector('[name="whatsapp"]');
    var lgpd = form.querySelector('[name="lgpd"]');
    var erro = form.querySelector(".form-erro");
    function mostraErro(msg) {
      if (erro) { erro.textContent = msg; erro.style.display = "block"; }
      else toast(msg);
    }
    if (erro) erro.style.display = "none";
    if (nome && nome.value.trim().length < 3) { mostraErro("Digite seu nome completo."); ok = false; }
    if (zap && zap.value.replace(/\D/g, "").length < 10) { mostraErro("Digite um WhatsApp válido com DDD."); ok = false; }
    if (lgpd && !lgpd.checked) { mostraErro("É necessário aceitar a Política de Privacidade (LGPD)."); ok = false; }
    if (ok) {
      var email = form.querySelector('[name="email"]');
      if (email && email.value && !/^\S+@\S+\.\S+$/.test(email.value)) {
        mostraErro("Digite um e-mail válido."); ok = false;
      }
    }
    return ok;
  }

  function initFormularios() {
    document.querySelectorAll("form.js-lead").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validarForm(form)) return;
        var tipo = form.getAttribute("data-tipo") || "form";
        var dados = coletarForm(form);
        var payload = {
          tipo: tipo,
          origem: location.pathname,
          ab: varianteAB(),
          utms: lerUtms(),
          dados: dados,
          capturado_em: new Date().toISOString()
        };
        gravarLead(payload);
        evento(tipo === "pdf" ? "lead_pdf" : tipo === "quiz" ? "lead_quiz" : "lead_form", { origem: payload.origem });
        evento("lead_form", { tipo: tipo });

        var redirecionar = form.getAttribute("data-redirect");
        if (redirecionar) { window.location.href = redirecionar; return; }

        var sucesso = form.querySelector(".form-sucesso") || form.parentElement.querySelector(".form-sucesso");
        if (sucesso) sucesso.classList.add("show");
        form.querySelectorAll("input, select, textarea, button").forEach(function (el) { el.disabled = true; });

        // Mini diagnóstico: libera botão de WhatsApp com contexto
        var waResultado = form.parentElement.querySelector(".minidiag-wa-resultado");
        if (waResultado) {
          var cat = dados.categoria || "Minha Casa Minha Vida";
          var renda = dados.renda || "não informada";
          var msg = "Olá! Estava lendo sobre " + cat + " no site MCMV Sem Dúvidas e quero saber como isso se aplica ao meu caso. Minha renda familiar: " + renda + ".";
          waResultado.querySelectorAll("[data-wa]").forEach(function (el) {
            el.setAttribute("data-msg-custom", msg);
            var c = corretorPorId(el.getAttribute("data-corretor"));
            el.setAttribute("href", linkWa(c, msg));
          });
          waResultado.classList.add("show");
        }

        // Quiz: mostra o resultado após a captura
        if (tipo === "quiz" && window.MCMVQuiz) window.MCMVQuiz.liberarResultado(dados);
      });
    });
  }

  /* ---------------- Quiz ---------------- */
  function initQuiz() {
    var app = document.getElementById("quiz-app");
    if (!app) return;
    var dadosEl = document.getElementById("quiz-data");
    if (!dadosEl) return;
    var dados;
    try { dados = JSON.parse(dadosEl.textContent); } catch (e) { return; }

    var resultados = dados.resultados; // [{min,max,titulo,classe,copy}]
    var perguntas = dados.perguntas;
    var etapa = 0;              // 0..n-1 perguntas, n = formulário
    var pontos = 0;
    var respostas = [];
    var rendaFaixa = "";

    var barra = app.querySelector(".qp-barra");
    var label = app.querySelector(".qp-label");
    var caixaQ = app.querySelector(".quiz-q");
    var tituloQ = app.querySelector("#quiz-titulo");
    var opcoesQ = app.querySelector(".quiz-options");
    var botaoVoltar = app.querySelector(".quiz-voltar");
    var gate = app.querySelector(".quiz-gate");
    var resultado = app.querySelector(".quiz-resultado");
    var badge = app.querySelector(".quiz-result-badge");
    var resultTitulo = app.querySelector(".quiz-result-titulo");
    var resultCopy = app.querySelector(".quiz-result-copy");
    var resultWa = app.querySelector(".quiz-result-wa");

    function totalEtapas() { return perguntas.length + 1; }

    function atualizarProgresso() {
      var pct = Math.round((etapa / totalEtapas()) * 100);
      if (barra) barra.style.width = pct + "%";
      if (label) label.textContent = (etapa < perguntas.length ? "Pergunta " + (etapa + 1) + " de " + perguntas.length : "Última etapa") + " · " + pct + "%";
    }

    function renderPergunta() {
      var q = perguntas[etapa];
      if (!q) return;
      if (tituloQ) tituloQ.textContent = q.t;
      if (opcoesQ) opcoesQ.innerHTML = "";
      q.opcoes.forEach(function (opt) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "quiz-opt";
        b.textContent = opt.t;
        b.addEventListener("click", function () {
          respostas[etapa] = opt;
          pontos += opt.p;
          if (etapa === 0) rendaFaixa = opt.t; // P1 = faixa de renda
          etapa++;
          proxima();
        });
        opcoesQ.appendChild(b);
      });
      atualizarProgresso();
    }

    function proxima() {
      if (etapa < perguntas.length) {
        renderPergunta();
      } else {
        // fim: mostra formulário de captura
        if (caixaQ) caixaQ.style.display = "none";
        if (botaoVoltar) botaoVoltar.style.display = "none";
        if (gate) gate.style.display = "block";
        atualizarProgresso();
        if (gate) gate.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    function faixaResultado() {
      for (var i = 0; i < resultados.length; i++) {
        if (pontos >= resultados[i].min && pontos <= resultados[i].max) return resultados[i];
      }
      return resultados[resultados.length - 1];
    }

    function mostrarResultado(dadosLead) {
      var r = faixaResultado();
      if (gate) gate.style.display = "none";
      if (resultado) resultado.style.display = "block";
      if (badge) { badge.className = "result-badge " + r.classe; badge.textContent = r.rotulo; }
      if (resultTitulo) resultTitulo.textContent = r.titulo;
      if (resultCopy) resultCopy.textContent = r.copy.replace("{nome}", (dadosLead && dadosLead.nome ? ", " + dadosLead.nome.split(" ")[0] : ""));
      if (resultWa) {
        var nome = (dadosLead && dadosLead.nome) ? dadosLead.nome : "";
        var msg = "Olá! Fiz o diagnóstico no site MCMV Sem Dúvidas. Meu resultado foi: " + r.titulo +
          ". Renda familiar aproximada: " + rendaFaixa + ". Quero entender meu próximo passo." +
          (nome ? " (Sou " + nome + ".)" : "");
        resultWa.querySelectorAll("[data-wa]").forEach(function (el) {
          el.setAttribute("data-msg-custom", msg);
          var c = corretorPorId(el.getAttribute("data-corretor"));
          el.setAttribute("href", linkWa(c, msg));
        });
        resultWa.style.display = "block";
      }
      if (resultado) resultado.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (botaoVoltar) {
      botaoVoltar.addEventListener("click", function () {
        if (etapa === 0) return;
        etapa--;
        var resp = respostas[etapa];
        if (resp) pontos -= resp.p;
        if (gate) gate.style.display = "none";
        if (caixaQ) caixaQ.style.display = "block";
        if (botaoVoltar) botaoVoltar.style.display = "inline-block";
        renderPergunta();
      });
    }

    window.MCMVQuiz = { liberarResultado: mostrarResultado };
    renderPergunta();
  }

  /* ---------------- Hub de dúvidas: busca ---------------- */
  function initBuscaDuvidas() {
    var input = document.getElementById("busca-duvidas");
    if (!input) return;
    var alvos = document.querySelectorAll(".js-buscavel");
    var avisoVazio = document.querySelector(".busca-semResultado");
    input.addEventListener("input", function () {
      var termo = input.value.trim().toLowerCase();
      var visiveis = 0;
      alvos.forEach(function (el) {
        var texto = el.textContent.toLowerCase();
        var mostrar = !termo || texto.indexOf(termo) !== -1;
        el.style.display = mostrar ? "" : "none";
        if (mostrar) visiveis++;
      });
      if (avisoVazio) avisoVazio.style.display = (termo && visiveis === 0) ? "block" : "none";
    });
  }

  /* ---------------- Mini diagnóstico (páginas de dúvida) ---------------- */
  function initMiniDiag() {
    document.querySelectorAll(".minidiag").forEach(function (bloco) {
      var btnSim = bloco.querySelector(".minidiag-sim");
      var btnNao = bloco.querySelector(".minidiag-nao");
      var form = bloco.querySelector(".minidiag-form");
      var alt = bloco.querySelector(".minidiag-alternativa");
      if (btnSim) btnSim.addEventListener("click", function () {
        if (form) form.classList.add("show");
        if (alt) alt.classList.remove("show");
      });
      if (btnNao) btnNao.addEventListener("click", function () {
        if (alt) alt.classList.add("show");
        if (form) form.classList.remove("show");
      });
    });
  }

  /* ---------------- Checklist clicável (documentos) ---------------- */
  function initChecklist() {
    document.querySelectorAll(".checklist-caixa").forEach(function (caixa) {
      caixa.addEventListener("click", function () { caixa.classList.toggle("marcada"); });
      caixa.setAttribute("title", "Clique para marcar");
    });
  }

  /* ---------------- Menu mobile ---------------- */
  function initMenuMobile() {
    var toggle = document.querySelector(".nav-toggle");
    var header = document.querySelector(".header");
    if (!toggle || !header) return;
    toggle.addEventListener("click", function () { header.classList.toggle("nav-aberto"); });
    header.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () { header.classList.remove("nav-aberto"); });
    });
  }

  /* ---------------- Scroll 75% ---------------- */
  function initScroll() {
    var disparado = false;
    window.addEventListener("scroll", function () {
      if (disparado) return;
      var doc = document.documentElement;
      var pct = (window.scrollY + window.innerHeight) / doc.scrollHeight;
      if (pct >= 0.75) { disparado = true; evento("scroll_75", { pagina: location.pathname }); }
    }, { passive: true });
  }

  /* ---------------- Rastreamento (GA4 / Pixel / GTM) ---------------- */
  function initAnalytics() {
    window.dataLayer = window.dataLayer || [];
    if (CFG.gtmId) {
      (function (w, d, s, l, i) {
        w[l] = w[l] || []; w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
        var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l !== "dataLayer" ? "&l=" + l : "";
        j.async = true; j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
        f.parentNode.insertBefore(j, f);
      })(window, document, "script", "dataLayer", CFG.gtmId);
    }
    if (CFG.ga4Id) {
      var s = document.createElement("script");
      s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + CFG.ga4Id;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", CFG.ga4Id);
    }
    if (CFG.metaPixelId) {
      (function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
        if (!f._fbq) f._fbq = n; n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
        t = b.createElement(e); t.async = true; t.src = v; s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      if (window.fbq) window.fbq("init", CFG.metaPixelId);
    }
    evento("page_view", { pagina: location.pathname });
  }

  /* ---------------- Inicialização ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    capturarUtms();
    aplicarAB();
    preencherNomesCorretores();
    ligarBotoesWa();
    initWidgetFlutuante();
    initExitIntent();
    initFormularios();
    initQuiz();
    initBuscaDuvidas();
    initMiniDiag();
    initChecklist();
    initMenuMobile();
    initScroll();
    initTelMask();
    initAnalytics();
  });
})();
