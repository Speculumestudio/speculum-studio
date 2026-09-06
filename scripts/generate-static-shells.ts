import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { services } from "../src/data/services";

const SITE_URL = "https://speculumstudio.com";
const templatePath = resolve("dist/index.html");
const template = readFileSync(templatePath, "utf8");

interface StaticPage {
  path: string;
  title: string;
  description: string;
  jsonLd?: Record<string, unknown>;
}

const pages: StaticPage[] = [
  {
    path: "/nosso-estudio",
    title: "Nosso Estúdio | Marca, conteúdo e audiovisual | Speculum Studio",
    description: "Conheça a Speculum Studio: construção de marca, conteúdo, retratos, produção audiovisual e orientação estratégica com Fabiano Pereira.",
  },
  {
    path: "/explore",
    title: "Matérias sobre marca, imagem, criação e IA | Speculum Studio",
    description: "Artigos, guias, processos e materiais sobre marca, imagem, criação e uso consciente de inteligência artificial.",
  },
  ...services.map((service): StaticPage => ({
    path: `/servicos/${service.slug}`,
    title: service.seoTitle,
    description: service.description,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.shortName,
      serviceType: service.shortName,
      description: service.description,
      url: `${SITE_URL}/servicos/${service.slug}`,
      provider: { "@type": "ProfessionalService", name: "Speculum Studio", url: SITE_URL },
      areaServed: { "@type": "Country", name: "Brasil" },
    },
  })),
];

const escapeAttribute = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

for (const page of pages) {
  const canonicalUrl = `${SITE_URL}${page.path}`;
  let html = template
    .replace(/<title>.*?<\/title>/, `<title>${escapeAttribute(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeAttribute(page.description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeAttribute(page.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeAttribute(page.description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonicalUrl}" />`);

  if (page.jsonLd) {
    html = html.replace("</head>", `    <script type="application/ld+json">${JSON.stringify(page.jsonLd).replaceAll("<", "\\u003c")}</script>\n  </head>`);
  }

  const outputPath = resolve("dist", page.path.slice(1), "index.html");
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html);
}

console.log(`Static SEO shells written (${pages.length} routes)`);
