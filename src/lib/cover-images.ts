import optimizedCovers from "@/data/optimized-covers.json";

type CoverVariant = { source: string; small: string; large: string };
const covers: Record<string, CoverVariant> = optimizedCovers;

// If an editor changes a cover, use that new image until derivatives are regenerated.
export function getCoverImage(slug: string, source: string, featured = false) {
  const cover = covers[slug];
  if (!cover || cover.source !== source) return { src: source, srcSet: undefined };
  return {
    src: featured ? cover.large : cover.small,
    srcSet: `${cover.small} 480w, ${cover.large} 960w`,
  };
}
