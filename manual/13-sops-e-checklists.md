# 13 · SOPs, checklists e playbooks

> SOP = procedimento que você executa igual toda vez (e que permite delegar). Copie para o seu
> gerenciador de tarefas. Cada SOP tem **gatilho**, **passos**, **entrega** e **métrica**.

---

## SOP-A · Operação semanal

### A1 — Segunda: Dashboard (20 min)
**Gatilho:** toda segunda de manhã.
1. Abrir `templates/kpi-semanal.csv` e preencher: visitas por canal, cliques `/go/`, receita por
   programa, novos contatos, custo.
2. Rodar `python3 ferramentas/afiliado.py kpi --csv templates/kpi-semanal.csv`.
3. Anotar **1 aprendizado** e **1 prioridade** da semana.
4. Comparar com a semana anterior: EPC subiu ou caiu? Por quê?
**Entrega:** linha preenchida + prioridade da semana. **Métrica:** EPC e RPV semanais.

### A2 — Publicação de peça (gate de qualidade, 15 min por peça)
- [ ] Fatos verificados (preço, spec, taxa, data) com fonte anotada
- [ ] Experiência/dado original presente (foto, teste, medida, número próprio)
- [ ] Disclosure no lugar certo (topo do artigo; verbal + on-screen no vídeo; 1ª linha na legenda)
- [ ] Links em `/go/slug` com `sid` de posição, testados em **aba anônima**
- [ ] `rel="sponsored nofollow"`; nada de link direto de afiliado no corpo
- [ ] Schema (`Product`/`Review`/`FAQPage`) validado
- [ ] Título e meta com intenção comercial; URL curta
- [ ] 3–8 links internos (money page ↔ guias)
- [ ] CTA de captura (isca) presente
- [ ] Data de publicação e "última atualização" visíveis + autor
- [ ] Derivados agendados (1→8): 2 shorts, 1 pin, 1 e-mail, 1 post
**Métrica:** CTR de link da página (≥ 3% alvo).

### A3 — Auditoria de links (mensal, 30 min)
1. Exportar lista de slugs de `templates/mapa-de-links.csv`.
2. Testar cada destino (script: `ferramentas/afiliado.py links --check`).
3. Verificar: link ativo, comissão/programa ainda vigente, preço não desatualizado no texto,
   landing page funcionando no mobile.
4. Corrigir destino em 1 lugar (é a vantagem do `/go/`).
**Métrica:** % de links quebrados (meta: 0).

### A4 — Atualização de money page (trimestral, 60 min por página)
- [ ] Preços e disponibilidade conferidos
- [ ] Novos produtos/concorrentes adicionados
- [ ] Recomendação revista (mudou o vencedor?)
- [ ] FAQ ampliado com dúvidas reais (comentários, DMs, PAA, perguntas feitas à IA)
- [ ] Fotos/screenshots renovados com data
- [ ] "Última atualização" alterada
- [ ] Reenvio no Search Console/IndexNow
**Métrica:** posição e RPV 30 dias após.

### A5 — Reconciliação com a rede (mensal, 45 min)
1. Exportar relatório da rede (cliques, vendas, comissão, status).
2. Cruzar com seu log de cliques por `subid`.
3. Verificar: divergência de cliques > 15%? Vendas pendentes antigas? Reversals?
4. Arquivar PDF do relatório em `financeiro/YYYY-MM/`.
5. Abrir ticket se houver divergência (com print e datas).
**Métrica:** % de comissão aprovada vs pendente; reversal rate (< 10% saudável).

### A6 — Higiene de segurança (mensal, 20 min)
- [ ] 2FA em: domínio, hospedagem, e-mail, plataformas de afiliado, redes sociais, banco
- [ ] Backup do site + export da lista de e-mail (arquivo local criptografado)
- [ ] Senhas únicas (gerenciador) e revisão de acessos de terceiros/apps conectados
- [ ] Domínio com renovação automática e cartão válido

---

## SOP-B · Playbooks sazonais

### B1 — Black Friday (começar 45 dias antes)
| Quando | Ação |
| --- | --- |
| D-45 | Mapear ofertas e histórico de desconto; pedir cupom exclusivo ao gerente |
| D-35 | Publicar "Melhores ofertas de X na Black Friday [ano]" + página de captura |
| D-25 | Produzir comparativos dos produtos que devem entrar em promoção |
| D-15 | Sequência de e-mails agendada (3 avisos + 1 dia + 1 último dia) |
| D-7 | Vídeo "o que vale a pena e o que não vale" + lives agendadas |
| D-1 a D+2 | Cobertura ao vivo: grupo de WhatsApp/Telegram, stories, atualização de preços |
| D+7 | Relatório: EPC por oferta, receita, novos contatos; guardar dados para o ano seguinte |
🔴 Cuidado: desconto falso é publicidade enganosa (CDC/CONAR; Procon monitora). Só anuncie desconto
verificado (histórico de preço via API/feramenta de histórico).

### B2 — Lançamento de produto no seu nicho (reação em 72 h)
1. Publicar "X lançado: o que muda" em 24–48 h (busca explode no lançamento).
2. Comparar com o incumbente ("X vs Y") em 72 h.
3. Vídeo curto com primeira impressão honesta + promessa de review completo.
4. Capturar e-mail ("avise-me quando sair o review completo").
5. Review completo com teste real em 2–4 semanas → money page atualizada.

### B3 — Crise de tráfego (update de algoritmo)
1. Não mexer em nada por 72 h (dados instáveis).
2. Diagnosticar: qual página/perdeu? Qual canal? Concorrente ganhou?
3. Verificar problemas técnicos (indexação, canonical, CWV, conteúdo duplicado).
4. Priorizar as 10 páginas que mais perderam: reforçar E-E-A-T, dado original, autor, atualização.
5. Acelerar canais alternativos (vídeo, Pinterest, lista) — nunca demitir o canal 2 porque o 1 caiu.
6. Documentar em `templates/postmortem.md`.

### B4 — Novo idioma/praça (global)
1. Escolher 1 praça (ex.: ES-MX) e 10 peças vencedoras para localizar.
2. Localizar (não traduzir): moeda, loja, preço, exemplo, norma, feriados.
3. Cadastrar nos programas daquela praça (Amazon MX, Mercado Libre, Involve Asia etc.).
4. Publicar em subdiretório `/es-mx/` com `hreflang`.
5. Distribuir em canal nativo (YouTube ES, TikTok local) com criador nativo se possível.

---

## SOP-C · Playbooks de negociação e relacionamento

### C1 — Pedir aumento de comissão (cap. 05 §5)
**Gatilho:** 30–90 dias de dados + EPC acima da média do programa.
1. Exportar seus números (cliques, CR, EPC, AOV, receita gerada).
2. Listar entregas (peças publicadas, posições, views, contatos na lista).
3. Enviar `templates/email-negociacao-comissao.md` ao **gerente de afiliados**.
4. Pedir na ordem: tier/taxa → cupom exclusivo → acesso antecipado a promo.
5. Oferecer contrapartida com número (exclusividade 90 dias, X peças, Y views).
6. Se não responder em 7 dias: follow-up. Em 14: falar com concorrente e informar.
**Métrica:** aumento de taxa conquistado × receita.

### C2 — Parceria com criador do nicho
1. Listar 20 criadores (5 mil–500 mil seguidores) do mesmo nicho, sem conflito direto.
2. Consumir o conteúdo deles e fazer 1 comentário útil real por semana (antes de pedir).
3. Propor troca concreta: participação em vídeo, review conjunto, guest post, cupom cruzado.
4. Formalizar por escrito (entregáveis, prazo, disclosure de ambos os lados, uso de imagem).
**Métrica:** referrals e EPC do conteúdo conjunto.

### C3 — Responder crítica/comentário negativo
1. Responder em até 24 h, sem apagar (apagar crítica é pior que a crítica).
2. Reconhecer o ponto, corrigir se houve erro, atualizar a peça (com data).
3. Se for erro factual: corrigir e comunicar na newsletter (aumenta confiança e EPC).

---

## SOP-D · Checklist de compliance (rodar trimestralmente)

### D1 — Site
- [ ] Disclosure de afiliado visível antes dos links em **todas** as peças
- [ ] Página `/divulgacao-de-afiliados/` atualizada com lista de programas
- [ ] `/metodologia/` descreve critérios e quem paga o produto testado
- [ ] Política de privacidade + banner de consentimento funcionando (recusa = 1 clique)
- [ ] Frase exigida pela Amazon presente, se usar Amazon
- [ ] Nenhum claim de saúde/renda não comprovado
- [ ] Autor real identificado (nome, foto, contato)

### D2 — Vídeo/social
- [ ] Disclosure verbal + on-screen nos primeiros segundos
- [ ] Ferramenta nativa de "parceria paga" ativada quando aplicável
- [ ] `#publi` / `#ad` na primeira linha da legenda
- [ ] Em lives: disclosure repetido a cada 3–5 minutos
- [ ] Nada de review de produto não testado/não pesquisado
- [ ] Nada de review comprado, falso ou gerado por IA fingindo experiência

### D3 — Fiscal/legal
- [ ] Relatórios mensais arquivados (PDF/CSV) por programa
- [ ] Carnê-Leão (PF) ou DAS + NFS-e (PJ) em dia
- [ ] Rendimentos do exterior declarados/convertidos corretamente
- [ ] Despesas dedutíveis com comprovante (produto de teste, ferramenta, anúncio)
- [ ] Contrato por escrito com freelancers e criadores parceiros (cessão de uso de imagem/autoral)
- [ ] Marca: nada de domínio/perfil com nome de marca de terceiro sem autorização

---

## SOP-E · Rotina de pesquisa (30 min/semana)

1. Refazer 1 consulta à GitHub API por tópico (afiliados, GEO, tracker) e anotar novidade.
2. Checar 1 dataset/modelo novo no Hugging Face (cap. 02).
3. Ler 1 fonte primária: política de programa que você usa (mudou algo?).
4. Perguntar a 2 assistentes de IA "melhor X para Y" e registrar quem é citado (GEO).
5. Anotar em `templates/pesquisa-log.md`: achado → implicação → ação.

**Por que existe:** taxas mudam (Amazon BR em abr/2026), plataformas mudam (TikTok Shop BR em
jul/2026), regras mudam (FTC, CONAR). Quem não faz essa rotina descobre a mudança quando a receita cai.
