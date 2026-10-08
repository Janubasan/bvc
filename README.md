# Campo Afiliado

Um guia de campo interativo, em português do Brasil, para construir uma operação de marketing de afiliados baseada em confiança, evidência, mensuração e transparência — não em promessas de renda rápida.

## O que foi construído

- guia editorial responsivo com 9 capítulos;
- rotas personalizadas para quatro estágios de maturidade;
- radar de nicho;
- auditoria de oferta com bloqueadores;
- gerador de pauta de review;
- seletor de estratégia por canal;
- gerador de aviso comercial;
- calculadora de funil e economia unitária;
- checklist persistente de 30 dias;
- construtor de UTMs;
- modelos copiáveis e planilhas CSV;
- biblioteca filtrável com 17 fontes;
- tema claro/escuro, navegação por teclado e estilos de impressão.

Todas as ferramentas rodam localmente no navegador. Não existe backend, coleta de dados ou dependência externa.

## Executar

O projeto é estático. Use qualquer servidor de arquivos:

```bash
npm start
```

Abra `http://localhost:4173`.

Também é possível usar:

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

> Abrir `index.html` diretamente funciona para quase tudo, mas um servidor local reproduz melhor o ambiente de publicação e o download dos templates.

## Validar

```bash
npm test
```

A validação verifica:

- sintaxe do JavaScript;
- IDs duplicados;
- âncoras internas quebradas;
- links externos abertos em nova aba sem `rel="noopener"`;
- arquivos locais referenciados;
- campos sem rótulo acessível;
- botões sem tipo explícito;
- presença dos elementos estruturais básicos.

## Estrutura

```text
.
├── index.html                         # conteúdo e interface
├── styles.css                         # design responsivo, temas e impressão
├── app.js                             # interações e persistência local
├── favicon.svg
├── RESEARCH.md                        # método, síntese e caderno de fontes
├── templates/
│   ├── plano-de-conteudo.csv
│   ├── rastreador-de-links.csv
│   └── diario-de-experimentos.csv
└── scripts/
    └── validate.mjs
```

## Política editorial

A pesquisa separa quatro camadas:

1. **Reddit:** descoberta de padrões, objeções e relatos — tratados como anedota.
2. **X:** sínteses e opiniões de profissionais — tratadas como perspectiva.
3. **GitHub:** observação de como produtos open source implementam links, eventos, funis e analytics.
4. **Fontes oficiais:** base para afirmações normativas sobre busca, publicidade e dados.

Números de renda auto-relatados não foram usados como benchmark. O guia não promete prazo ou resultado e não substitui orientação jurídica, contábil ou regulatória.

Consulte [`RESEARCH.md`](RESEARCH.md) para a matriz completa.

## Publicação

Por não ter etapa de build, a raiz pode ser publicada diretamente no GitHub Pages, Cloudflare Pages, Netlify, Vercel ou qualquer hospedagem estática.
