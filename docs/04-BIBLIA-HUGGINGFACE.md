# 04 — Bíblia do Hugging Face

> O Hugging Face é o "GitHub dos modelos de IA". Aqui está o mapa do que usar, quanto custa rodar e — o mais importante — **qual micro-SaaS cada modelo viabiliza**.
> Dados verificados na API do Hub em **2026-10-02** (likes, downloads, licença). Planilha completa: [`../dados/hf-modelos.csv`](../dados/hf-modelos.csv).

---

## 1. As 5 partes do Hub (e para que serve cada uma)

| Parte | URL | Para que serve no seu negócio |
|---|---|---|
| **Models** | `huggingface.co/models` | O motor do produto: chat, visão, voz, imagem, embeddings |
| **Datasets** | `huggingface.co/datasets` | Base para fine-tune, RAG, avaliação e treino de nicho |
| **Spaces** | `huggingface.co/spaces` | Apps prontos (demos) — valide uma ideia sem escrever código |
| **Inference Endpoints / Providers** | `huggingface.co/pricing` | Rode o modelo como API gerenciada, sem gerenciar GPU |
| **Jobs / ZeroGPU** | `huggingface.co/docs` | Treinar e rodar GPU sob demanda (bom para picos de uso) |

**Regra prática:** Space para validar → Endpoint/GPU alugada para cobrar → modelo local (llama.cpp/Ollama) para dados sensíveis ou margem maior.

---

## 2. Os modelos que importam agora (verificados)

### 2.1 Texto, raciocínio e agentes

| Modelo | Likes | Downloads | Licença | Para que serve |
|---|---:|---:|---|---|
| [deepseek-ai/DeepSeek-R1](https://huggingface.co/deepseek-ai/DeepSeek-R1) | 14.314 | ~0,97 M | MIT | Raciocínio de alta qualidade; versões destiladas rodam em 1 GPU |
| [deepseek-ai/DeepSeek-V4-Pro](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro) | 5.616 | ~0,42 M | MIT | Frontier aberto (2026) para análises complexas |
| [zai-org/GLM-5.2](https://huggingface.co/zai-org/GLM-5.2) | 5.143 | ~0,71 M | MIT | Alternativa forte para agentes e back-office |
| [openai/gpt-oss-120b](https://huggingface.co/openai/gpt-oss-120b) | 5.343 | 4,49 M | Apache-2.0 | Copiloto vertical self-hosted (MoE, 1 GPU 80 GB) |
| [openai/gpt-oss-20b](https://huggingface.co/openai/gpt-oss-20b) | 5.117 | 6,66 M | Apache-2.0 | Melhor custo/benefício para produto on-premise |
| [Qwen/Qwen3.8-27B](https://huggingface.co/Qwen/Qwen3.8-27B) | 16.797 | 6,93 M | Apache-2.0 | Multimodal único (texto+imagem) com o maior engajamento de 2026 |
| [Qwen/Qwen3-8B](https://huggingface.co/Qwen/Qwen3-8B) | 2.068 | 11,02 M | Apache-2.0 | Cavalo de batalha para chatbot/RAG |
| [Qwen/Qwen3-0.6B](https://huggingface.co/Qwen/Qwen3-0.6B) | 1.719 | 29,57 M | Apache-2.0 | Campeão de downloads: classificação, roteamento, extração em lote |
| [Qwen/Qwen3.5-9B](https://huggingface.co/Qwen/Qwen3.5-9B) | 2.087 | 9,18 M | Apache-2.0 | Assistente multimodal compacto (fev/2026) |
| [google/gemma-4-31B-it](https://huggingface.co/google/gemma-4-31B-it) | 3.998 | 9,88 M | Apache-2.0 | Multimodal de boa janela de contexto |
| [google/gemma-4-26B-A4B-it](https://huggingface.co/google/gemma-4-26B-A4B-it) | 1.582 | 13,09 M | Apache-2.0 | MoE enxuto: 26B parâmetros, 4B ativos |
| [unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF](https://huggingface.co/unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF) | 1.100 | 8,65 M | Apache-2.0 | Agente de código em GPU de 24 GB (quantizado) |

**Como escolher:** se o cliente exige dados no servidor dele → `gpt-oss-20b` ou Qwen3 (8B/14B/30B-A3B). Se pode usar API → modelos frontier pagos + fallback aberto.

### 2.2 Multimodal e visão (documentos, prints, PDFs)

| Modelo | Likes | Downloads | Licença | Para que serve |
|---|---:|---:|---|---|
| [Qwen/Qwen3-VL-8B-Instruct](https://huggingface.co/Qwen/Qwen3-VL-8B-Instruct) | 1.162 | 15,79 M | Apache-2.0 | OCR inteligente, leitura de tabelas, prints e diagramas |
| [Qwen/Qwen3.5-4B](https://huggingface.co/Qwen/Qwen3.5-4B) | 996 | 7,60 M | Apache-2.0 | VLM pequeno para rodar barato em volume |

**Micro-SaaS que isso viabiliza:** leitura de notas fiscais, contratos, laudos, extratos, currículos, planilhas fotografadas → dados estruturados. É um dos nichos com maior disposição a pagar no Brasil.

### 2.3 Imagem

| Modelo | Likes | Downloads | Licença | Para que serve |
|---|---:|---:|---|---|
| [black-forest-labs/FLUX.1-dev](https://huggingface.co/black-forest-labs/FLUX.1-dev) | 15.301 | 0,71 M | other (não comercial) | Qualidade premium; **checar licença para uso comercial** |
| [stable-diffusion-v1-5/stable-diffusion-v1-5](https://huggingface.co/stable-diffusion-v1-5/stable-diffusion-v1-5) | 1.298 | 1,63 M | CreativeML OpenRAIL-M | Volume barato + ecossistema de LoRAs |
| [stabilityai/stable-diffusion-xl-base-1.0](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0) | 8.265 | 4,19 M | OpenRAIL++ | Qualidade/velocidade equilibradas |
| [stabilityai/sdxl-turbo](https://huggingface.co/stabilityai/sdxl-turbo) | 2.635 | 1,01 M | other | Geração em poucos passos (barata) |
| [unsloth/Z-Image-Turbo-GGUF](https://huggingface.co/unsloth/Z-Image-Turbo-GGUF) | 272 | 0,63 M | Apache-2.0 | Turbo quantizado, roda em GPU pequena (base: Tongyi-MAI/Z-Image-Turbo) |
| [microsoft/TRELLIS](https://huggingface.co/spaces/microsoft/TRELLIS) | — | — | MIT | 3D a partir de imagem (nicho de e-commerce/games) |

### 2.4 Vídeo

| Modelo | Likes | Downloads | Licença | Para que serve |
|---|---:|---:|---|---|
| [MiniMaxAI/MiniMax-H3](https://huggingface.co/MiniMaxAI/MiniMax-H3) | 5.839 | 3,57 M | other | Vídeo **com áudio sincronizado** (UGC, ads, dublagem) |
| [Lightricks/LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5) | 5.982 | 1,58 M | other | Vídeo rápido para social/ads (família LTX é otimizada para velocidade) |
| [FastVideo/FastVideo-FastH3-4-step-Preview](https://huggingface.co/FastVideo/FastVideo-FastH3-4-step-Preview-v1-VSA-DataFree) | 318 | 1,02 M | other | Vídeo em 4 passos — custo mínimo por peça |
| [Comfy-Org/MiniMax-H3](https://huggingface.co/Comfy-Org/MiniMax-H3) | 2.098 | 22,81 M | other | Versão single-file para ComfyUI (produção em estúdio) |

### 2.5 Áudio: transcrição, diarização e voz

| Modelo | Likes | Downloads | Licença | Para que serve |
|---|---:|---:|---|---|
| [openai/whisper-large-v3-turbo](https://huggingface.co/openai/whisper-large-v3-turbo) | 3.410 | 6,40 M | MIT | Transcrição padrão (99 idiomas) — atas, legendas, podcasts |
| [argmaxinc/whisperkit-coreml](https://huggingface.co/argmaxinc/whisperkit-coreml) | 234 | 10,83 M | MIT | Transcrição on-device em Mac/iPhone (sem custo de API) |
| [pyannote/speaker-diarization-3.1](https://huggingface.co/pyannote/speaker-diarization-3.1) | 4.067 | 7,23 M | MIT | "Quem falou o quê" — combina com Whisper para atas |
| [hexgrad/Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) | 7.102 | 11,43 M | Apache-2.0 | TTS de 82M parâmetros: narração ultra barata |
| [ResembleAI/chatterbox](https://huggingface.co/ResembleAI/chatterbox) | 1.821 | 1,69 M | MIT | Clonagem de voz multilingue (PT incluído) |
| [Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice](https://huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-CustomVoice) | 2.022 | 2,41 M | Apache-2.0 | Voz personalizada por cliente |
| [coqui/XTTS-v2](https://huggingface.co/coqui/XTTS-v2) | 3.845 | 6,68 M | other | Clonagem legada estável (verifique a licença CPML) |
| [k2-fsa/OmniVoice](https://huggingface.co/k2-fsa/OmniVoice) | 1.465 | 1,43 M | (ver Hub) | TTS zero-shot multilíngue (mais de 600 idiomas listados) |

### 2.6 Embeddings, busca e reranking (o "RAG" que não alucina)

| Modelo | Likes | Downloads | Licença | Para que serve |
|---|---:|---:|---|---|
| [sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) | 6.163 | **240,96 M** | Apache-2.0 | O modelo mais baixado do Hub: busca semântica barata |
| [BAAI/bge-m3](https://huggingface.co/BAAI/bge-m3) | 3.789 | 35,07 M | MIT | Multilingue (PT-BR) denso+esparso+multi-vetor |
| [Qwen/Qwen3-Embedding-0.6B](https://huggingface.co/Qwen/Qwen3-Embedding-0.6B) | 1.257 | 9,69 M | Apache-2.0 | Embeddings multilíngues de alta qualidade |
| [BAAI/bge-small-en-v1.5](https://huggingface.co/BAAI/bge-small-en-v1.5) | 597 | 63,08 M | MIT | Versão minúscula para latência baixa |
| [cross-encoder/ms-marco-MiniLM-L6-v2](https://huggingface.co/cross-encoder/ms-marco-MiniLM-L6-v2) | 354 | 85,44 M | Apache-2.0 | Reranker leve (2º estágio da busca) |
| [sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2) | 1.417 | 50,23 M | Apache-2.0 | Similaridade multilíngue (50+ idiomas) |

### 2.7 Nichos que quase ninguém explora (oportunidade)

| Modelo | Likes | Downloads | Para que serve |
|---|---:|---:|---|
| [amazon/chronos-2](https://huggingface.co/amazon/chronos-2) | 503 | 22,87 M | Previsão de séries temporais: demanda, estoque, fluxo de caixa |
| [google/electra-base-discriminator](https://huggingface.co/google/electra-base-discriminator) | 189 | 46,14 M | Classificação de texto barata (triagem, moderação, etiquetas) |
| [google-t5/t5-small](https://huggingface.co/google-t5/t5-small) | 646 | 24,47 M | Tradução/resumo levíssimos, rodam até em CPU |
| [openai/clip-vit-base-patch32](https://huggingface.co/openai/clip-vit-base-patch32) | 1.576 | 21,21 M | Busca imagem↔texto (catálogos, moderação visual) |
| [timm/mobilenetv3_small_100.lamb_in1k](https://huggingface.co/timm/mobilenetv3_small_100.lamb_in1k) | 124 | 21,61 M | Visão computacional minúscula (contagem, inspeção simples) |

---

## 3. Spaces úteis (valide antes de construir)

| Space | Likes | O que você aprende/valida |
|---|---:|---|
| [enzostvs/deepsite](https://huggingface.co/spaces/enzostvs/deepsite) | 16.610 | Gerador de sites por prompt — o mais curtido do Hub |
| [black-forest-labs/FLUX.1-dev](https://huggingface.co/spaces/black-forest-labs/FLUX.1-dev) | 9.567 | Qualidade de imagem de ponta (referência de UX) |
| [Kwai-Kolors/Kolors-Virtual-Try-On](https://huggingface.co/spaces/Kwai-Kolors/Kolors-Virtual-Try-On) | 10.198 | Provador virtual: base de SaaS para moda/e-commerce |
| [jbilcke-hf/ai-comic-factory](https://huggingface.co/spaces/jbilcke-hf/ai-comic-factory) | 11.291 | Pipeline criativo completo (roteiro→imagem→página) |
| [mrfakename/Z-Image-Turbo](https://huggingface.co/spaces/mrfakename/Z-Image-Turbo) | 3.887 | Imagem rápida e aberta em ZeroGPU |
| [KlingTeam/LivePortrait](https://huggingface.co/spaces/KlingTeam/LivePortrait) | 3.803 | Animação de retrato (avatares falantes) |
| [InstantX/InstantID](https://huggingface.co/spaces/InstantX/InstantID) | 3.648 | Consistência de identidade em imagens (marca/avatar) |
| [facebook/MusicGen](https://huggingface.co/spaces/facebook/MusicGen) | 5.100 | Trilhas e efeitos sonoros gerados |
| [open-llm-leaderboard/open_llm_leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard) | 14.127 | Comparar modelos antes de escolher (evita achismo) |

---

## 4. Quanto custa rodar (GPU alugada, 2026)

| GPU | Faixa por hora (mercado) | Serve para | Onde é mais barato |
|---|---|---|---|
| RTX 4090 24 GB | US$ 0,08 – 0,69 | Imagem, ASR, LLM 7-14B quantizado | Vast.ai / RunPod |
| L40S 48 GB | ~US$ 0,10 – 0,70 | LLM até 30B, vídeo leve | Vast.ai / RunPod |
| A100 80 GB | US$ 0,68 – 5,03 | Fine-tune médio, inferência de 70B | Vast.ai / CoreWeave |
| H100 80 GB | US$ 1,49 – 6,98 | Treino sério, alta vazão | Vast.ai / RunPod / GCP spot |
| B200 | US$ 3,99 – 16,11 | Treino pesado; melhor custo por resultado | DataCrunch/Lambda |

Fontes: [CloudZero (set/2026)](https://www.cloudzero.com/blog/cloud-gpu-pricing-comparison/), [PromptQuorum (ago/2026)](https://www.promptquorum.com/local-llms/cloud-gpu-rental-comparison-2026), [AltStreet (jul/2026)](https://altstreet.investments/tools/gpu/gpu-pricing-comparison).

### Como calcular o custo por tarefa (fórmula honesta)

```
CUSTO POR TAREFA = (preço_GPU_por_hora ÷ 3600) × segundos_de_processamento × fator_de_eficiência
```

Exemplos com hipóteses explícitas (troque pelos seus números):

| Tarefa | Hipótese | Conta | Custo estimado |
|---|---|---|---|
| Transcrever 1h de áudio | Whisper turbo em RTX 4090 a US$ 0,40/h, ~10 min de GPU | 0,40 × (600/3600) | **≈ US$ 0,07** |
| Gerar 1 imagem | SDXL-turbo, 3 s em L40S a US$ 0,40/h | 0,40 × (3/3600) | **≈ US$ 0,0003** |
| Chat de 1M tokens | Modelo 20B em H100 a US$ 2,50/h, ~120k tokens/min | 2,50 × (1000000/120000)/60 | **≈ US$ 0,35** |
| Fine-tune LoRA 8B | 6h em A100 a US$ 1,19/h | 1,19 × 6 | **≈ US$ 7** |

**Traduzindo para preço:** se transcrever custa ≈ US$ 0,07/hora de áudio, vender a R$ 1,50/hora de áudio em volume é margem de ~90% mesmo com retrabalho e picos.

---

## 5. Como treinar (fine-tune) barato e quando vale a pena

**Só faça fine-tune se:** o modelo aberto genérico erra em algo previsível (formato, jargão do setor, tom) e você tem ≥ 300 exemplos rotulados.

| Etapa | Ferramenta | Custo típico |
|---|---|---|
| Preparar dados | `huggingface/trl`, `unslothai/unsloth` | tempo |
| Treinar LoRA/QLoRA (8-30B) | `unsloth`, `LlamaFactory`, `axolotl` | US$ 5 – 50 por rodada |
| Avaliar | `promptfoo`, `langfuse` | tempo |
| Servir | `vllm` (vazão) ou `llama.cpp`/`Ollama` (local) | US$ 0 – 300/mês |
| Quantizar para GPU pequena | GGUF (llama.cpp), AWQ/FP8 | tempo |

**Atalho:** comece com *prompt + RAG* (busca nos documentos do cliente). Fine-tune é otimização, não fundação.

---

## 6. Datasets úteis (e como achar o seu)

| Dataset | Downloads | Para que serve |
|---|---:|---|
| [m-a-p/FineFineWeb](https://huggingface.co/datasets/m-a-p/FineFineWeb) | 4,42 M | Corpus web por domínio (14+ setores, 100+ bilhões de tokens) — base para especializar modelos por vertical |

**Como minerar datasets de nicho (método):**
1. Filtre por idioma `language:pt` + task (`text-classification`, `summarization`, `asr`, `image-to-text`).
2. Procure dados brasileiros: jurídico, saúde, agronegócio, fiscal, imobiliário, educacional.
3. Combine com os repositórios de OCR (doc 03) para construir seu próprio dataset de documentos do setor.
4. Gere datasets proprietários: **cada cliente processado vira dado rotulado** (com consentimento e contrato — doc 10).

---

## 7. Do modelo ao produto: 10 micro-SaaS que você monta só com este documento

| # | Produto | Modelo(s) HF | Preço sugerido |
|---|---|---|---|
| 1 | Ata de reunião automática (transcrição + diarização + resumo) | whisper-large-v3-turbo + pyannote + LLM | R$ 97 – 397/mês |
| 2 | Leitor de documentos (NF, contrato, laudo) → planilha/ERP | Qwen3-VL-8B | R$ 297 – 997/mês |
| 3 | Narração de conteúdo em escala (voz própria da marca) | Kokoro-82M / Chatterbox | R$ 197 – 697/mês |
| 4 | Fábrica de criativos para redes sociais | Z-Image-Turbo + LTX-2.5/MiniMax-H3 | R$ 497 – 1.997/mês |
| 5 | Provador virtual / catálogo fotográfico com IA | Kolors-Virtual-Try-On + InstantID | R$ 497 – 1.997/mês |
| 6 | Atendimento interno sobre documentos da empresa (RAG) | bge-m3 + gpt-oss-20b/Qwen3 | R$ 697 – 2.497/mês |
| 7 | Previsão de demanda/estoque para pequeno varejo | chronos-2 | R$ 397 – 1.497/mês |
| 8 | Triagem e classificação de chamados em massa | Qwen3-0.6B / ELECTRA | R$ 297 – 997/mês |
| 9 | Legendas e dublagem para criadores | whisper + TTS + FFmpeg | R$ 147 – 597/mês |
| 10 | Busca semântica em acervo próprio (jurídico, editorial) | all-MiniLM / bge-m3 + reranker | R$ 497 – 2.497/mês |

---

## 8. Boas práticas de produção (o que separa demo de negócio)

1. **Sempre cache.** Resposta idêntica não deve custar duas vezes (use `litellm` com cache ou cache próprio no Postgres/Redis).
2. **Sempre tenha fallback.** Se o modelo principal cair, troque para um segundo provedor (`litellm` faz isso).
3. **Limite por cliente.** Cotas por plano evitam que um usuário consuma sua margem (OpenMeter/Lago para medir).
4. **Fila, não síncrono.** Processamento pesado (vídeo, treino) vai para fila com progresso visível (Trigger.dev/Temporal).
5. **Quantize antes de escalar.** GGUF/AWQ/FP8 reduzem custo por inferência em 2-4×.
6. **Meça custo por cliente** (Langfuse) — se não mede, o churn chega disfarçado de sucesso.
7. **LGPD e direitos autorais:** dados pessoais só com base legal; imagens/voz só com consentimento; modelos com licença não comercial não vão para produção paga.
8. **Transparência com o usuário:** diga quando o conteúdo é gerado por IA (evita problema regulatório e constrói confiança).

---

## 9. Comandos rápidos (copie e rode)

```bash
# rodar um LLM local (depois de instalar o Ollama)
ollama run gpt-oss:20b

# transcrever com Whisper em Python
pip install -U openai-whisper faster-whisper
# (uso no código) WhisperModel("large-v3-turbo", compute_type="int8")

# subir um servidor de inferência de alta vazão
pip install vllm && vllm serve Qwen/Qwen3-8B --port 8000

# baixar um modelo/dataset direto do Hub
pip install -U "huggingface_hub[cli]"
huggingface-cli download openai/whisper-large-v3-turbo
huggingface-cli download m-a-p/FineFineWeb --repo-type dataset
```

➡️ Próximo: [`05-AGENTES-E-AUTOMACAO.md`](05-AGENTES-E-AUTOMACAO.md)
