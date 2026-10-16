import { services } from "../src/data/services";
// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { fetchPublishedPostsSeo } from "./post-seo-data";

const BASE_URL = "https://speculumstudio.com";

interface SitemapEntry {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly";
  priority?: string;
  lastmod?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/nosso-estudio", changefreq: "monthly", priority: "0.9" },
  { path: "/explore", changefreq: "daily", priority: "0.9" },
  ...services.map((service): SitemapEntry => ({ path: `/servicos/${service.slug}`, changefreq: "monthly", priority: "0.8" })),
];

const xmlEscape = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const main = async () => {
  const posts = await fetchPublishedPostsSeo();
  const entries: SitemapEntry[] = [
    ...staticEntries,
    ...posts.map((post) => ({
      path: `/post/${post.slug}`,
      changefreq: "monthly" as const,
      priority: "0.7",
      lastmod: post.updated_at ?? post.published_at ?? undefined,
    })),
  ];

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...entries.map((e) => [
      "  <url>",
      `    <loc>${xmlEscape(BASE_URL + e.path)}</loc>`,
      e.lastmod ? `    <lastmod>${xmlEscape(e.lastmod)}</lastmod>` : undefined,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : undefined,
      e.priority ? `    <priority>${e.priority}</priority>` : undefined,
      "  </url>",
    ].filter(Boolean).join("\n")),
    `</urlset>`,
  ].join("\n");

  writeFileSync(resolve("public/sitemap.xml"), xml, "utf8");
  console.log(`sitemap.xml written (${entries.length} entries, including ${posts.length} posts)`);
};

main();
