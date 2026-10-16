import { describe, expect, it } from "vitest";
import optimizedCovers from "@/data/optimized-covers.json";
import { getCoverImage } from "./cover-images";

describe("published cover derivatives", () => {
  it("keeps an editor's replacement cover instead of serving stale artwork", () => {
    const slug = Object.keys(optimizedCovers)[0];
    expect(getCoverImage(slug, "/new-cover.jpg")).toEqual({ src: "/new-cover.jpg", srcSet: undefined });
  });
  it("keeps new articles working before their cover is optimized", () => {
    expect(getCoverImage("new-article", "/new-cover.jpg")).toEqual({ src: "/new-cover.jpg", srcSet: undefined });
  });
  it("serves responsive variants only for the matching published cover", () => {
    const slug = Object.keys(optimizedCovers)[0];
    const cover = optimizedCovers[slug];
    expect(getCoverImage(slug, cover.source).src).toBe(cover.small);
    expect(getCoverImage(slug, cover.source, true).src).toBe(cover.large);
    expect(getCoverImage(slug, cover.source).srcSet).toContain("960w");
  });
});
