// BVC-OS · Adaptador opcional de LLM (OpenAI-compatible).
// Sem chave configurada, o sistema roda 100% determinístico — nada quebra, nada é inventado.
import { lerTexto } from '../core/util.mjs';
import { join } from 'node:path';
import { PROMPTS_DIR } from '../core/util.mjs';

export function criarLLM() {
  const chave = process.env.BVC_LLM_API_KEY || process.env.OPENAI_API_KEY || '';
  const base = process.env.BVC_LLM_BASE_URL || 'https://api.openai.com/v1';
  const modelo = process.env.BVC_LLM_MODEL || 'gpt-4.1-mini';
  const masterPrompt = lerTexto(join(PROMPTS_DIR, '00-MASTER-PROMPT.md')).slice(0, 12000);

  return {
    disponivel: Boolean(chave),
    modelo,
    base,
    masterPrompt,
    async completar(prompt, { timeoutMs = 120000, temperatura = 0.4 } = {}) {
      if (!chave) throw new Error('Sem chave de LLM configurada (BVC_LLM_API_KEY).');
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), timeoutMs);
      try {
        const resp = await fetch(`${base}/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${chave}` },
          body: JSON.stringify({
            model: modelo,
            temperature: temperatura,
            messages: [
              { role: 'system', content: 'Você é o BVC-OS. Nunca invente números: use [SEM DADO]. Responda em português do Brasil, direto, sem hype.' },
              { role: 'user', content: prompt },
            ],
          }),
          signal: ctrl.signal,
        });
        if (!resp.ok) throw new Error(`LLM ${resp.status}: ${(await resp.text()).slice(0, 300)}`);
        const json = await resp.json();
        const texto = json.choices?.[0]?.message?.content || '';
        if (!texto) throw new Error('LLM devolveu resposta vazia');
        return texto;
      } finally {
        clearTimeout(t);
      }
    },
  };
}
