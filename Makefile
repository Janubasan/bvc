# BVC — atalhos de operação
# Uso: make ajuda

.PHONY: ajuda projeto iniciar status gates semana unidade prompt auditoria limpar

SLUG ?= atendimento-clinicas
SPEC ?= templates/spec.exemplo.yaml
COMANDO ?= /semana

ajuda:
	@echo "BVC — atalhos (use SLUG=<seu-slug> para apontar o projeto)"
	@echo ""
	@echo "  make projeto           gera projetos/<slug>/ a partir de $(SPEC)"
	@echo "  make iniciar           cria/atualiza o estado do negócio"
	@echo "  make status            resumo do estado (etapa, portas, métricas)"
	@echo "  make gates             audita as portas G0-G6"
	@echo "  make unidade           unidade econômica (ticket, CAC, LTV, margem, runway)"
	@echo "  make prompt COMANDO=\"/semana\"   monta o prompt final para colar no modelo"
	@echo "  make semana            roda o ciclo: gates + unidade + prompt /semana"
	@echo "  make auditoria         confere links e dados do repositório"
	@echo "  make limpar            remove __pycache__ e logs locais"

projeto:
	python3 scripts/novo_micro_saas.py --spec $(SPEC)
	python3 scripts/master_orchestrator.py init --slug $(SLUG)

iniciar:
	python3 scripts/master_orchestrator.py init --slug $(SLUG)

status:
	python3 scripts/master_orchestrator.py status --slug $(SLUG)

gates:
	python3 scripts/master_orchestrator.py gates --slug $(SLUG)

unidade:
	python3 scripts/calcular_unidade.py --slug $(SLUG)

prompt:
	python3 scripts/master_orchestrator.py next --slug $(SLUG) --comando "$(COMANDO)"

semana:
	python3 scripts/master_orchestrator.py gates --slug $(SLUG)
	python3 scripts/calcular_unidade.py --slug $(SLUG)
	python3 scripts/master_orchestrator.py next --slug $(SLUG) --comando "/semana" > /tmp/bvc-semana.txt
	@echo ""
	@echo "Prompt da semana salvo em /tmp/bvc-semana.txt — copie e cole no seu modelo."

auditoria:
	python3 scripts/verificar_links.py --limite 5
	python3 scripts/gerar_biblia_github.py

limpar:
	find . -name "__pycache__" -type d -prune -exec rm -rf {} +
	rm -rf projetos/*/logs/*.md 2>/dev/null || true
	@echo "limpo."
