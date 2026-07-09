import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const outputPath = path.join(rootDir, "public", "admin", "config.yml");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [rawKey, ...rawValueParts] = trimmed.split("=");
    const key = rawKey.trim();

    if (!key || process.env[key]) continue;

    let value = rawValueParts.join("=").trim();
    value = value.replace(/^["']|["']$/g, "");
    process.env[key] = value;
  }
}

loadEnvFile(path.join(rootDir, ".env"));
loadEnvFile(path.join(rootDir, ".env.local"));

function env(name, fallback = "") {
  return process.env[name]?.trim() || fallback;
}

function yamlString(value) {
  return JSON.stringify(value);
}

const siteUrl = env("SITE_URL", "https://meusite.com").replace(/\/+$/, "");
const owner = env("GITHUB_OWNER", "SEU_USUARIO_OU_ORG");
const repo = env("GITHUB_REPO", "SEU_REPOSITORIO");
const branch = env("BRANCH", "main");
const repoPath = `${owner}/${repo}`;

const config = `backend:
  name: github
  repo: ${yamlString(repoPath)}
  branch: ${yamlString(branch)}

site_url: ${yamlString(siteUrl)}
media_folder: public/images/blog
public_folder: /images/blog

locale: pt

slug:
  encoding: ascii
  clean_accents: true
  sanitize_replacement: "-"

collections:
  - name: blog
    label: Blog
    label_singular: Post
    folder: src/content/blog
    create: true
    delete: true
    slug: "{{slug}}"
    extension: md
    format: frontmatter
    summary: "{{title}} - {{pubDate}}"
    fields:
      - label: Status
        name: status
        widget: select
        default: Publicado
        options:
          - Publicado
          - Rascunho

      - label: Titulo
        name: title
        widget: string
        required: true

      - label: Slug
        name: slug
        widget: string
        required: false
        hint: "Opcional. Se ficar vazio, o nome do arquivo sera usado na URL."

      - label: Data de Publicacao
        name: pubDate
        widget: datetime
        required: true
        date_format: "YYYY-MM-DD"
        time_format: "HH:mm"
        format: "YYYY-MM-DDTHH:mm:ss.SSSZ"

      - label: Data de Atualizacao
        name: updatedDate
        widget: datetime
        required: false
        date_format: "YYYY-MM-DD"
        time_format: "HH:mm"
        format: "YYYY-MM-DDTHH:mm:ss.SSSZ"

      - label: Descricao
        name: description
        widget: text
        required: true

      - label: Imagem de Capa
        name: heroImage
        widget: image
        required: false

      - label: Texto Alternativo da Capa
        name: coverAlt
        widget: string
        required: false

      - label: Autor
        name: author
        widget: string
        required: false
        default: "Equipe"

      - label: Tags
        name: tags
        widget: list
        required: false
        field:
          label: Tag
          name: tag
          widget: string

      - label: Corpo do texto
        name: body
        widget: markdown
        required: true
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, config);

console.log(`Sveltia CMS config generated for ${repoPath} on ${branch}.`);
