// BVC-OS · núcleo utilitário (sem dependências externas)
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const APP_DIR = dirname(dirname(fileURLToPath(import.meta.url)));      // .../app
export const RAIZ = resolve(APP_DIR, '..');                                    // raiz do repo bvc
export const DATA_DIR = process.env.BVC_DATA_DIR || join(RAIZ, 'projetos');
export const TEMPLATES_DIR = join(RAIZ, 'templates');
export const DOCS_DIR = join(RAIZ, 'docs');
export const PROMPTS_DIR = join(RAIZ, 'prompts');

export function garantirDir(p) { mkdirSync(p, { recursive: true }); return p; }

export function lerJSON(caminho, padrao = null) {
  try { return JSON.parse(readFileSync(caminho, 'utf8')); } catch { return padrao; }
}

export function salvarJSON(caminho, obj) {
  garantirDir(dirname(caminho));
  writeFileSync(caminho, JSON.stringify(obj, null, 2), 'utf8');
  return caminho;
}

export function lerTexto(caminho, padrao = '') {
  try { return readFileSync(caminho, 'utf8'); } catch { return padrao; }
}

export function salvarTexto(caminho, texto) {
  garantirDir(dirname(caminho));
  writeFileSync(caminho, texto, 'utf8');
  return caminho;
}

export function slugify(txt = '') {
  return txt.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'meu-saas';
}

/** Parser simples de YAML "chave: valor" (o mesmo formato do spec da BVC). */
export function parseSpec(texto) {
  const out = {};
  for (const linha of String(texto).split('\n')) {
    const s = linha.trim();
    if (!s || s.startsWith('#') || !s.includes(':')) continue;
    const i = s.indexOf(':');
    out[s.slice(0, i).trim()] = s.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

/** Renderiza template {{variavel}} com fallback [SEM DADO]. */
export function renderTemplate(texto, ctx) {
  return String(texto).replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, k) => {
    const v = ctx[k];
    return v === undefined || v === null || v === '' ? '[SEM DADO]' : String(v);
  });
}

export function agora() { return new Date().toISOString(); }
export function hoje() { return agora().slice(0, 10); }

export function num(v, padrao = null) {
  if (v === null || v === undefined || v === '') return padrao;
  const n = Number(String(v).replace(/R\$\s*/g, '').replace(/\./g, '').replace(',', '.').trim());
  return Number.isFinite(n) ? n : padrao;
}

export function brl(v) {
  if (v === null || v === undefined || Number.isNaN(v)) return '[SEM DADO]';
  return 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function pct(v, casas = 1) {
  if (v === null || v === undefined || Number.isNaN(v)) return '[SEM DADO]';
  return v.toFixed(casas).replace('.', ',') + '%';
}

export function listarProjetos() {
  if (!existsSync(DATA_DIR)) return [];
  return readdirSync(DATA_DIR)
    .filter((nome) => {
      const p = join(DATA_DIR, nome);
      return statSync(p).isDirectory() && existsSync(join(p, 'estado.json'));
    })
    .map((slug) => {
      const e = lerJSON(join(DATA_DIR, slug, 'estado.json'), {});
      return { slug, nome: e.nome || slug, percurso: e.percurso_atual, etapa: e.etapa, atualizado: e.ultima_atualizacao };
    });
}

export function caminhos(slug) {
  const base = join(DATA_DIR, slug);
  return {
    base,
    estado: join(base, 'estado.json'),
    spec: join(base, 'spec.json'),
    handoffs: join(base, 'handoffs'),
    logs: join(base, 'logs'),
    artefatos: join(base, 'artefatos'),
  };
}

export const rel = (p) => relative(RAIZ, p);
