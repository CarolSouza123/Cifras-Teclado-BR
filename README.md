# Cifras Latam — Landing Page

Repositório do projeto da landing page de vendas low-ticket.

## Estrutura

- **`_base/`** — matriz original do template. **Não editar diretamente.**
  Serve apenas como referência e ponto de partida para novos produtos.
- **`cifras-latam/`** — cópia de trabalho deste produto. É aqui que tudo acontece:
  - `public/images/` — imagens da página (é só substituir os arquivos aqui)
  - `src/config/content.ts` — textos da página
  - `src/config/theme.ts` — cores
  - `src/config/links.ts` — links de checkout
  - `src/config/tracking.ts` — pixels
  - `src/config/seo.ts` — SEO

## Fluxo de trabalho

1. Trocar as imagens em `cifras-latam/public/images/`
2. Atualizar textos, cores, preços e links nos arquivos de `src/config/`
3. Conferir `PROJECT_SPEC.md`, `CONTENT_SCHEMA.md` e `DESIGN_SYSTEM.md` dentro da pasta do produto
4. Build/validação: `pnpm predeploy`
5. Deploy (somente com autorização): `pnpm cloudflare:deploy`

A base `_base/` permanece intacta para futuros produtos.
