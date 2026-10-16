import { build } from "vite";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export async function prerenderHome(template: string) {
  const clientPath = resolve("src/integrations/supabase/client.ts").replaceAll("\\", "/");
  await build({
    plugins: [{
      name: "home-prerender-browser-client-guard",
      enforce: "pre",
      // Build-only: effects do not run in SSR. Never replace the browser auth client.
      load(id) {
        if (id.replaceAll("\\", "/") === clientPath) {
          return "export const supabase = new Proxy({}, { get() { throw new Error('Supabase cannot run during static home rendering'); } });";
        }
      },
    }],
    build: {
      ssr: "scripts/render-home.tsx",
      outDir: "dist-ssr",
      emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: "render-home.mjs" } },
    },
  });
  const { renderHome } = await import(pathToFileURL(resolve("dist-ssr/render-home.mjs")).href);
  const body = renderHome();
  if (!body.includes("<h1") || !body.includes("Marca, imagem e ")) {
    throw new Error("Home prerender did not include the hero");
  }
  // Confirm SSR uses the client build's fingerprinted image URLs.
  for (const match of body.matchAll(/(?:src|href)="(\/assets\/[^"?]+)"/g)) {
    readFileSync(resolve("dist", match[1].slice(1)));
  }
  const placeholder = '<div id="root"></div>';
  if (!template.includes(placeholder)) throw new Error("Home root placeholder missing");
  writeFileSync(resolve("dist/index.html"), template.replace(placeholder,
    () => `<div id="root" data-prerendered="home">${body}</div>`), "utf8");
  console.log("Home prerendered with the same React tree used for hydration");
}
