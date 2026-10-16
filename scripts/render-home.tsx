import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { StaticRouter } from "react-router-dom/server";
import type { ReactNode } from "react";
import App from "../src/App";

// eslint-disable-next-line react-refresh/only-export-components -- Build-only SSR entry.
const HomeRouter = ({ children }: { children?: ReactNode }) => (
  <StaticRouter location="/">{children}</StaticRouter>
);

export function renderHome() {
  return renderToString(<HelmetProvider><App Router={HomeRouter} /></HelmetProvider>);
}
