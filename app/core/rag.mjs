// BVC-OS · L3 — RAG local sobre a bíblia (docs/, prompts/, templates/, dados/)
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { DOCS_DIR, PROMPTS_DIR, TEMPLATES_DIR, RAIZ, lerTexto } from './util.mjs';

const FONTES = [DOCS_DIR, PROMPTS_DIR, TEMPLATES_DIR, join(RAIZ, 'dados')];
const EXT_OK = new Set(['.md', '.tmpl', '.json', '.csv', '.py']);

function arquivos(dir, saida = []) {
  if (!existsSync(dir)) return saida;
  for (const nome of readdirSync(dir)) {
    const p = join(dir, nome);
    const st = statSync(p);
    if (st.isDirectory()) { if (!['node_modules', '.git', 'projetos', '__pycache__'].includes(nome)) arquivos(p, saida); }
    else if (EXT_OK.has(extname(nome)) && st.size < 400_000) saida.push(p);
  }
  return saida;
}

const cache = { lista: null, quando: 0 };
function indice() {
  const agora = Date.now();
  if (cache.lista && agora - cache.quando < 30_000) return cache.lista;
  cache.lista = arquivos(join(RAIZ, 'docs')).concat(arquivos(PROMPTS_DIR), arquivos(TEMPLATES_DIR), arquivos(join(RAIZ, 'dados')))
    .map((caminho) => ({ caminho, texto: lerTexto(caminho) }));
  cache.quando = agora;
  return cache.lista;
}

const STOP = new Set(['a','o','as','os','de','da','do','das','dos','e','em','um','uma','para','por','com','que','no','na','se','ao','como','mais','the','of','to','and','is']);

function termos(q) {
  return String(q).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/).filter((t) => t.length > 2 && !STOP.has(t));
}

/** Busca simples TF: devolve os trechos mais relevantes com fonte (o que o agente "lê" antes de responder). */
export function buscar(consulta, limite = 4) {
  const t = termos(consulta);
  if (!t.length) return [];
  const pontos = [];
  for (const { caminho, texto } of indice()) {
    const baixo = texto.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
    let score = 0;
    for (const termo of t) {
      const ocorrencias = baixo.split(termo).length - 1;
      if (ocorrencias) score += Math.min(ocorrencias, 8);
    }
    if (!score) continue;
    const linhas = texto.split('\n');
    const idx = linhas.findIndex((l) => termos(l).some((x) => t.includes(x)));
    const trecho = linhas.slice(Math.max(0, idx - 1), idx + 6).join('\n').trim();
    pontos.push({ fonte: caminho.replace(RAIZ + '/', ''), score, trecho: trecho.slice(0, 700) });
  }
  return pontos.sort((a, b) => b.score - a.score).slice(0, limite);
}

export function contextoRAG(consulta, limite = 3) {
  return buscar(consulta, limite).map((p) => `[${p.fonte}] ${p.trecho}`).join('\n\n---\n\n');
}
