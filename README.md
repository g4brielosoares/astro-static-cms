# Astro + Sveltia CMS

Template Astro estatico com blog em Content Collections e painel administrativo em `/admin/`.

O Sveltia CMS salva posts como Markdown em `src/content/blog`. Cada alteracao feita pelo painel gera commit no GitHub; o push na branch configurada dispara o workflow existente, que roda o build estatico e publica `dist/` no servidor.

Esta versao usa login por token manual do GitHub. Nao ha OAuth App, PHP, servidor, worker ou funcao serverless envolvidos.

## Estrutura

- `src/content/blog`: posts em Markdown/MDX.
- `public/admin`: painel Sveltia CMS carregado por CDN.
- `public/images/blog`: uploads de imagens do CMS.
- `scripts/generate-cms-config.mjs`: gera `public/admin/config.yml` usando `.env`.
- `.github/workflows/ci-cd-static-pipeline.yml`: build e deploy por SSH/SCP.

## Token do GitHub

Crie um fine-grained personal access token no GitHub:

```txt
GitHub -> Settings -> Developer settings -> Personal access tokens -> Fine-grained tokens -> Generate new token
```

Configuracao recomendada:

```txt
Token name:
CMS do Blog

Expiration:
90 dias, 180 dias ou uma data combinada com o cliente

Resource owner:
usuario ou organizacao dona do repositorio

Repository access:
Only selected repositories

Selected repository:
astro-static-cms

Repository permissions:
Contents: Read and write
Metadata: Read
```

Copie o token imediatamente. O GitHub nao mostra o token novamente depois.

No painel:

```txt
https://seu-dominio.com/admin/
```

Use a opcao de entrar com token e cole o token gerado. O token fica salvo no navegador do usuario, entao trate-o como senha.

## Frontmatter dos posts

```yaml
title: "Titulo do post"
slug: "titulo-do-post"
status: "Publicado"
pubDate: "2026-01-01T00:00:00.000Z"
updatedDate: "2026-01-02T00:00:00.000Z"
description: "Resumo usado em SEO e listagens."
heroImage: "/images/blog/capa.png"
coverAlt: "Descricao da imagem"
author: "Equipe"
tags:
  - Astro
  - Sveltia CMS
```

`slug` e `updatedDate` sao opcionais. Posts com `status: "Rascunho"` nao aparecem no site.

## Comandos

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
```

`npm run dev` e `npm run build` geram automaticamente `public/admin/config.yml`.

## Variaveis

Copie `.env.example` para `.env` no ambiente local ou mantenha `~/.env` no servidor, como o workflow ja faz.

```env
SITE_URL=https://meusite.com
GITHUB_OWNER=usuario-ou-org
GITHUB_REPO=nome-do-repo
BRANCH=main
```

Essas variaveis nao sao secretas. Elas servem apenas para gerar o `config.yml` do painel com o repositorio e branch corretos.
