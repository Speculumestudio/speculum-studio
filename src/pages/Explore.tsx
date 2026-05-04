import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostCard, PostCardData } from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const TYPES = ["all", "prompt", "tool", "tutorial", "lesson", "guide", "article"];
const SORTS = [{ v: "recent", l: "Most recent" }, { v: "popular", l: "Most popular" }];

const Explore = () => {
  const [params, setParams] = useSearchParams();
  const [posts, setPosts] = useState<PostCardData[]>([]);
  const [loading, setLoading] = useState(true);

  const q = params.get("q") ?? "";
  const type = params.get("type") ?? "all";
  const sort = params.get("sort") ?? "recent";
  const category = params.get("category") ?? "";

  const update = (k: string, v: string) => {
    const p = new URLSearchParams(params);
    if (v && v !== "all") p.set(k, v); else p.delete(k);
    setParams(p);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      let query = supabase.from("posts")
        .select("id,slug,title,excerpt,cover_image_url,type,category,tags,is_premium,views,likes_count")
        .eq("status", "published");
      if (type !== "all") query = query.eq("type", type as any);
      if (category) query = query.eq("category", category);
      if (q) query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`);
      query = sort === "popular"
        ? query.order("views", { ascending: false })
        : query.order("published_at", { ascending: false, nullsFirst: false });
      const { data } = await query.limit(60);
      setPosts((data ?? []) as PostCardData[]);
      setLoading(false);
    })();
  }, [q, type, sort, category]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="container-editorial pt-14 pb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-primary/80 mb-3">The library</p>
        <h1 className="font-display text-5xl md:text-6xl">Explore everything.</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">Search across prompts, tools, lessons, tutorials and guides. Filter by type, sort by what's resonating.</p>

        <div className="mt-10 glass rounded-2xl p-4 md:p-5 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => update("q", e.target.value)}
              placeholder="Search prompts, tools, ideas…" className="pl-9 bg-background/40 border-border/60 h-11" />
          </div>
          <Select value={type} onValueChange={(v) => update("type", v)}>
            <SelectTrigger className="w-full md:w-44 h-11"><SelectValue /></SelectTrigger>
            <SelectContent>{TYPES.map(t => <SelectItem key={t} value={t}>{t === "all" ? "All types" : t.charAt(0).toUpperCase()+t.slice(1)}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => update("sort", v)}>
            <SelectTrigger className="w-full md:w-44 h-11"><SelectValue /></SelectTrigger>
            <SelectContent>{SORTS.map(s => <SelectItem key={s.v} value={s.v}>{s.l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </section>

      <section className="container-editorial pb-20">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="glass rounded-2xl aspect-[4/5] animate-pulse" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">No posts found. Try adjusting your filters.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map(p => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Explore;
