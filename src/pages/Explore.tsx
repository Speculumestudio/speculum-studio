import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { PostCard, PostCardData } from "@/components/PostCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  all: "Todos os tipos", prompt: "Prompts", tool: "Ferramentas",
  tutorial: "Tutoriais", lesson: "Aulas", guide: "Guias", article: "Artigos",
  studio: "Bastidores do estúdio",
};
const TYPES = ["all", "studio", "prompt", "tool", "tutorial", "lesson", "guide", "article"];
const SORTS = [{ v: "recent", l: "Mais recentes" }, { v: "popular", l: "Mais populares" }];

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
      if (type !== "all" && type !== "studio") query = query.eq("type", type as any);
      if (type === "studio") query = query.eq("category", "Nosso Studio");
      if (category && type !== "studio") query = query.eq("category", category);
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
      <Seo
        title={`Matérias${type !== "all" ? `: ${TYPE_LABELS[type]}` : ""} | Speculum Studio`}
        description="Artigos, tutoriais, prompts, ferramentas, aulas e guias. Encontre uma matéria por assunto ou filtre pelo tipo de conteúdo."
        path={`/explore${type !== "all" ? `?type=${type}` : ""}`}
      />
      <Navbar />
      <section className="container-editorial pt-14 pb-10">
        <p className="text-xs uppercase tracking-[0.22em] text-primary/80 mb-3">Marca, imagem e criação</p>
        <h1 className="font-display text-5xl md:text-6xl">Matérias</h1>
        <p className="mt-4 text-muted-foreground max-w-2xl">Artigos, tutoriais, prompts e outros materiais para ampliar seu repertório. Busque um assunto ou escolha o tipo de conteúdo.</p>

        <div className="mt-10 glass rounded-2xl p-4 md:p-5 grid gap-3 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => update("q", e.target.value)}
              aria-label="Buscar matérias"
              placeholder="Buscar um assunto…" className="pl-9 bg-background/40 border-border/60 h-11" />
          </div>
          <Select value={type} onValueChange={(v) => update("type", v)}>
            <SelectTrigger aria-label="Tipo de conteúdo" className="w-full md:w-52 h-11"><SelectValue /></SelectTrigger>
            <SelectContent>{TYPES.map(t => <SelectItem key={t} value={t}>{TYPE_LABELS[t]}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => update("sort", v)}>
            <SelectTrigger aria-label="Ordenar matérias" className="w-full md:w-44 h-11"><SelectValue /></SelectTrigger>
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
          <div className="text-center py-24 text-muted-foreground">Nenhum resultado encontrado. Ajuste seus filtros.</div>
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
