export interface PublishedPostSeo {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  type: string;
  category: string | null;
  tags: string[] | null;
  published_at: string | null;
  updated_at: string | null;
}

// Keep this aligned with the browser client. The Vercel project still carries
// an obsolete VITE_SUPABASE_URL value from an older app, so trusting that
// environment variable would silently remove posts from the production sitemap.
const SUPABASE_URL = "https://mhxwcdxepodoxnofoiya.supabase.co";
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  ?? process.env.VITE_SUPABASE_ANON_KEY
  ?? "sb_publishable_mCNED27_mo9TNmiRI025Mw_8PAI65K8";

/**
 * Public metadata only. The query uses the same publishable key as the browser
 * client and intentionally excludes article bodies and private fields.
 */
export async function fetchPublishedPostsSeo(): Promise<PublishedPostSeo[]> {
  const params = new URLSearchParams({
    select: "slug,title,excerpt,cover_image_url,type,category,tags,published_at,updated_at",
    status: "eq.published",
    order: "published_at.desc",
    limit: "200",
  });

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/posts?${params.toString()}`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (!response.ok) throw new Error(`Supabase returned ${response.status}`);
    const posts = await response.json() as PublishedPostSeo[];
    return Array.isArray(posts) ? posts : [];
  } catch (error) {
    console.warn("Could not load published posts for SEO generation. Static pages will still be generated.", error);
    return [];
  }
}
