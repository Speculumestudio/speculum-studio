import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { ServiceContent } from "../src/components/ServiceContent";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { services } from "../src/data/services";
import { fetchPublishedPostsSeo } from "./post-seo-data";
import { prerenderHome } from "./prerender-home";

const SITE_URL = "https://speculumstudio.com";
const templatePath = resolve("dist/index.html");
const template = readFileSync(templatePath, "utf8");

interface StaticPage {
  path: string;
  title: string;
  description: string;
  jsonLd?: Record<string, unknown>;
  image?: string | null;
  noIndex?: boolean;
  bodyHtml?: string;
}

const staticPages: StaticPage[] = [
  {
    path: "/links",
    title: "Links | Speculum Studio",
    description: "Canais e caminhos para conhecer a Speculum Studio.",
    image: "/covers/cover-estudio.webp",
    noIndex: true,
  },
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
    bodyHtml: renderToString(createElement(StaticRouter, { location: `/servicos/${service.slug}` }, createElement(ServiceContent, { service }))),
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

const main = async () => {
const posts = await fetchPublishedPostsSeo();
const pages: StaticPage[] = [
  ...staticPages,
  ...posts.map((post): StaticPage => ({
    path: `/post/${post.slug}`,
    title: `${post.title} | Speculum Studio`,
    description: post.excerpt ?? `${post.title} no Speculum Studio.`,
    image: post.cover_image_url,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": post.type === "lesson" ? "Course" : "Article",
      headline: post.title,
      description: post.excerpt ?? undefined,
      image: post.cover_image_url ?? undefined,
      datePublished: post.published_at ?? undefined,
      dateModified: post.updated_at ?? post.published_at ?? undefined,
      mainEntityOfPage: `${SITE_URL}/post/${post.slug}`,
      author: { "@type": "Organization", name: "Speculum Studio", url: SITE_URL },
      keywords: post.tags?.join(", ") || undefined,
    },
  })),
];

for (const page of pages) {
  const canonicalUrl = `${SITE_URL}${page.path}`;
  const robots = page.noIndex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
  let html = template
    .replace(/<title>.*?<\/title>/, `<title>${escapeAttribute(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeAttribute(page.description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonicalUrl}" />`)
    .replace(/<meta name="robots" content="[^"]*" \/>/, '<meta name="robots" content="' + robots + '" />')
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeAttribute(page.title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeAttribute(page.description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonicalUrl}" />`);

  if (page.image) {
    const imageUrl = new URL(page.image, SITE_URL).toString();
    html = html.replace("</head>", `    <meta property="og:image" content="${escapeAttribute(imageUrl)}" />\n    <meta name="twitter:image" content="${escapeAttribute(imageUrl)}" />\n  </head>`);
  }

  if (page.jsonLd) {
    html = html.replace("</head>", `    <script type="application/ld+json">${JSON.stringify(page.jsonLd).replaceAll("<", "\\u003c")}</script>\n  </head>`);
  }

  if (page.bodyHtml) {
    if (!html.includes('<div id="root"></div>')) throw new Error(`Missing root placeholder: ${page.path}`);
    html = html.replace('<div id="root"></div>', () => `<div id="root">${page.bodyHtml}</div>`);
  }

  const outputPath = resolve("dist", page.path.slice(1), "index.html");
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html);
}

console.log(`Static SEO shells written (${pages.length} routes, including ${posts.length} posts)`);
// Client-only and unknown routes must not inherit the home prerender.
writeFileSync(resolve("dist/app-shell.html"), template, "utf8");
await prerenderHome(template);
};

main();
